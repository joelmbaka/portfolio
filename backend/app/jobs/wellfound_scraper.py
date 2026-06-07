from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime, timedelta
from pathlib import Path
from urllib.parse import urljoin, urlparse

from playwright.async_api import Page, TimeoutError as PlaywrightTimeoutError, async_playwright

from app.core.config import settings

WELLFOUND_BASE_URL = "https://wellfound.com"
ROLE_URLS = {
    "ai_engineer": "https://wellfound.com/role/r/ai-engineer",
    "artificial_intelligence_engineer": "https://wellfound.com/role/r/artificial-intelligence-engineer",
    "backend_engineer": "https://wellfound.com/role/r/backend-engineer",
    "frontend_engineer": "https://wellfound.com/role/r/frontend-engineer",
    "full_stack_engineer": "https://wellfound.com/role/r/full-stack-engineer",
    "machine_learning_engineer": "https://wellfound.com/role/r/machine-learning-engineer",
    "mobile_engineer": "https://wellfound.com/role/r/mobile-engineer",
    "software_architect": "https://wellfound.com/role/r/software-architect",
    "software_engineer": "https://wellfound.com/role/r/software-engineer",
}

JOB_URL_RE = re.compile(r"/jobs/(?P<job_id>\d+)(?:-|/)?(?P<slug>[^?#]*)?")
COMPANY_URL_RE = re.compile(r"/company/(?P<company_slug>[^/?#]+)")
POSTED_AGE_RE = re.compile(
    r"\b(?:(?P<relative>today|yesterday)|(?P<num>\d+(?:\.\d+)?)\s*(?P<unit>minute|hour|day|week|month|mo|yr|year)s?\s+ago)\b",
    re.I,
)
WELLFOUND_CHALLENGE_TERMS = (
    "verification required",
    "we detected unusual activity",
    "rapid taps or clicks",
    "automated (bot) activity",
    "use of developer or inspection tools",
    "checking if the site connection is secure",
    "cloudflare",
)


@dataclass
class WellfoundJob:
    source_role: str
    job_id: str
    job_url: str
    title: str | None = None
    company_slug: str | None = None
    company_url: str | None = None
    location: str | None = None
    compensation: str | None = None
    posted_age: str | None = None
    posted_age_days: float | None = None
    posted_at_estimated: str | None = None
    posted_age_confidence: str | None = None
    text: str | None = None
    matched_selectors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        row = asdict(self)
        row["source"] = self.source_role
        return row


def normalize_wellfound_url(url: str) -> str:
    absolute = urljoin(WELLFOUND_BASE_URL, url)
    parsed = urlparse(absolute)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"


def posted_age_to_days(value: str | None) -> float | None:
    if not value:
        return None
    lowered = value.lower().strip()
    if lowered == "today":
        return 0
    if lowered == "yesterday":
        return 1
    match = POSTED_AGE_RE.search(value)
    if not match:
        return None
    if match.group("relative"):
        return 0 if match.group("relative").lower() == "today" else 1
    amount = float(match.group("num"))
    unit = match.group("unit").lower()
    if unit.startswith("minute"):
        return amount / 1440
    if unit.startswith("hour"):
        return amount / 24
    if unit.startswith("day"):
        return amount
    if unit.startswith("week"):
        return amount * 7
    if unit in {"mo", "month"} or unit.startswith("month"):
        return amount * 31
    if unit in {"yr", "year"} or unit.startswith("year"):
        return amount * 365
    return None


def estimated_posted_at(value: str | None, scraped_at: datetime) -> str | None:
    days = posted_age_to_days(value)
    if days is None:
        return None
    estimated = scraped_at - timedelta(days=days)
    return estimated.date().isoformat()


def age_confidence(value: str | None) -> str:
    if not value:
        return "missing"
    lowered = value.lower().strip()
    if lowered in {"today", "yesterday"}:
        return "estimated_day"
    if posted_age_to_days(value) is not None:
        return "estimated_relative"
    return "unknown"


def looks_like_job_title(line: str) -> bool:
    lowered = line.lower()
    return any(
        term in lowered
        for term in (
            "engineer",
            "developer",
            "architect",
            "scientist",
            "designer",
            "analyst",
            "product manager",
        )
    )


def extract_job_block(text: str, title: str | None) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not title:
        return "\n".join(lines)
    title_lines = [line.strip() for line in title.splitlines() if line.strip()]
    normalized_title = (title_lines[0] if title_lines else title).strip().lower()
    start = next((idx for idx, line in enumerate(lines) if line.strip().lower() == normalized_title), None)
    if start is None:
        start = next(
            (
                idx
                for idx, line in enumerate(lines)
                if normalized_title in line.strip().lower() or line.strip().lower() in normalized_title
            ),
            None,
        )
    if start is None:
        return "\n".join(lines)
    end = len(lines)
    for idx in range(start + 1, len(lines)):
        line = lines[idx]
        if line.strip().lower() == normalized_title:
            continue
        if looks_like_job_title(line) and idx > start + 2:
            end = idx
            break
    block = lines[start:end]
    for idx, line in enumerate(block):
        if line.lower() == "apply":
            return "\n".join(block[: idx + 1])
    return "\n".join(block[:8])


def extract_compact_fields(text: str) -> dict[str, str | None]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    compact = " ".join(lines)
    posted_match = POSTED_AGE_RE.search(compact)
    money_match = re.search(r"[$€£]\s?\d[\dkK,.]*(?:\s*[–-]\s*[$€£]?\s?\d[\dkK,.]*)?", compact)
    location = None
    for line in lines:
        lowered = line.lower()
        if "engineer" in lowered or "developer" in lowered or "analyst" in lowered:
            continue
        if any(term in lowered for term in ("remote •", "remote only •", "in office •", "hybrid •", "onsite or remote •", "united states", "europe", "kenya")):
            location = line
            break
    return {
        "posted_age": posted_match.group(0) if posted_match else None,
        "compensation": money_match.group(0) if money_match else None,
        "location": location,
    }


async def wait_for_results_or_challenge(page: Page) -> None:
    try:
        await page.wait_for_selector('a[href*="/jobs/"]', timeout=20_000)
        return
    except PlaywrightTimeoutError:
        body_text = await page.locator("body").inner_text(timeout=5_000)
        lowered = body_text.lower()
        if any(term in lowered for term in WELLFOUND_CHALLENGE_TERMS):
            if settings.wellfound_headless:
                raise RuntimeError(
                    "Wellfound verification required. Re-run headed, solve it in the opened "
                    "browser, then rerun with the same WELLFOUND_USER_DATA_DIR."
                )
            await page.wait_for_selector(
                'a[href*="/jobs/"]',
                timeout=max(1, settings.wellfound_challenge_wait_seconds) * 1000,
            )
            return
        if "wellfound" in lowered and "retry" in lowered:
            raise RuntimeError(
                "Wellfound showed a retry/verification page without job results. Open the "
                "Wellfound browser, complete the verification, then rerun."
            )
        raise


async def extract_visible_jobs(page: Page, source_role: str) -> list[WellfoundJob]:
    scraped_at = datetime.now(UTC)
    rows = await page.evaluate(
        """
        () => {
          const anchors = Array.from(document.querySelectorAll('a[href*="/jobs/"]'));
          const out = [];
          for (const anchor of anchors) {
            let node = anchor;
            for (let depth = 0; depth < 7 && node; depth += 1) {
              const text = (node.innerText || node.textContent || '').trim();
              if (text.length > 80) break;
              node = node.parentElement;
            }
            const card = node || anchor;
            const links = Array.from(card.querySelectorAll('a[href]')).map((a) => ({
              href: a.getAttribute('href'),
              text: (a.innerText || a.textContent || '').trim(),
            }));
            out.push({
              href: anchor.getAttribute('href'),
              anchorText: (anchor.innerText || anchor.textContent || '').trim(),
              text: (card.innerText || card.textContent || '').trim(),
              links,
            });
          }
          return out;
        }
        """
    )
    jobs: list[WellfoundJob] = []
    for row in rows:
        href = str(row.get("href") or "")
        match = JOB_URL_RE.search(href)
        if not match:
            continue
        anchor_text = str(row.get("anchorText") or "").strip()
        full_text = str(row.get("text") or "")
        text = extract_job_block(full_text, anchor_text)
        fields = extract_compact_fields(text)
        company_url = None
        company_slug = None
        for link in row.get("links") or []:
            company_match = COMPANY_URL_RE.search(str(link.get("href") or ""))
            if company_match:
                company_slug = company_match.group("company_slug")
                company_url = normalize_wellfound_url(str(link.get("href")))
                break
        jobs.append(
            WellfoundJob(
                source_role=source_role,
                job_id=match.group("job_id"),
                job_url=normalize_wellfound_url(href),
                title=anchor_text or None,
                company_slug=company_slug,
                company_url=company_url,
                location=fields["location"],
                compensation=fields["compensation"],
                posted_age=fields["posted_age"],
                posted_age_days=posted_age_to_days(fields["posted_age"]),
                posted_at_estimated=estimated_posted_at(fields["posted_age"], scraped_at),
                posted_age_confidence=age_confidence(fields["posted_age"]),
                text=text,
                matched_selectors=['a[href*="/jobs/"]'],
            )
        )
    return jobs


def exhausted_by_age(jobs: dict[str, WellfoundJob], oldest_days: int) -> bool:
    ages = [job.posted_age_days for job in jobs.values() if job.posted_age_days is not None]
    return bool(ages) and max(ages) >= oldest_days


async def scrape_role_page(
    page: Page,
    source_role: str,
    url: str,
    *,
    oldest_days: int | None = None,
    max_stale_scrolls: int | None = None,
    scroll_pause_ms: int | None = None,
) -> list[WellfoundJob]:
    oldest_days = oldest_days if oldest_days is not None else settings.wellfound_oldest_days
    max_stale_scrolls = (
        max_stale_scrolls if max_stale_scrolls is not None else settings.wellfound_max_stale_scrolls
    )
    scroll_pause_ms = scroll_pause_ms if scroll_pause_ms is not None else settings.wellfound_scroll_pause_ms

    await page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    await wait_for_results_or_challenge(page)

    jobs_by_id: dict[str, WellfoundJob] = {}
    stale_scrolls = 0
    previous_count = 0
    while True:
        for job in await extract_visible_jobs(page, source_role):
            jobs_by_id[job.job_id] = job

        current_count = len(jobs_by_id)
        if current_count == previous_count:
            stale_scrolls += 1
        else:
            stale_scrolls = 0
        previous_count = current_count

        if stale_scrolls >= max_stale_scrolls:
            break
        if exhausted_by_age(jobs_by_id, oldest_days):
            break

        await page.mouse.wheel(0, 2400)
        await page.wait_for_timeout(scroll_pause_ms)

    return list(jobs_by_id.values())


async def scrape_wellfound_roles(
    role_urls: dict[str, str] | None = None,
    *,
    headless: bool | None = None,
    user_data_dir: str | None = None,
    browser_executable: str | None = None,
    cdp_url: str | None = None,
    oldest_days: int | None = None,
    max_stale_scrolls: int | None = None,
    scroll_pause_ms: int | None = None,
) -> list[WellfoundJob]:
    role_urls = role_urls or ROLE_URLS
    data_dir = Path(user_data_dir or settings.wellfound_user_data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    cdp_url = cdp_url or settings.wellfound_cdp_url

    all_jobs: dict[str, WellfoundJob] = {}
    async with async_playwright() as p:
        browser = None
        if cdp_url:
            browser = await p.chromium.connect_over_cdp(cdp_url)
            context = browser.contexts[0] if browser.contexts else await browser.new_context()
        else:
            context = await p.chromium.launch_persistent_context(
                user_data_dir=str(data_dir),
                headless=settings.wellfound_headless if headless is None else headless,
                executable_path=browser_executable or settings.wellfound_browser_executable,
                viewport={"width": 1440, "height": 1000},
            )
        page = await context.new_page()
        for source_role, url in role_urls.items():
            role_jobs = await scrape_role_page(
                page,
                source_role,
                url,
                oldest_days=oldest_days,
                max_stale_scrolls=max_stale_scrolls,
                scroll_pause_ms=scroll_pause_ms,
            )
            for job in role_jobs:
                existing = all_jobs.get(job.job_id)
                if existing is None:
                    all_jobs[job.job_id] = job
                elif source_role not in existing.source_role.split(","):
                    existing.source_role = f"{existing.source_role},{source_role}"
        await page.close()
        if browser is not None:
            await browser.close()
        else:
            await context.close()
    return list(all_jobs.values())
