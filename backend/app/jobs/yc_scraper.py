from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse

from playwright.async_api import Page, async_playwright

from app.core.config import settings

YC_BASE_URL = "https://www.ycombinator.com"
ROLE_URLS = {
    "software_engineer": "https://www.ycombinator.com/jobs/role/software-engineer",
}

JOB_URL_RE = re.compile(r"/companies/(?P<company_slug>[^/]+)/jobs/(?P<job_id>[^/?#]+)")
POSTED_AGE_RE = re.compile(r"\((?P<age>[^)]*ago)\)", re.I)


@dataclass
class YCJob:
    source_role: str
    job_id: str
    job_url: str
    title: str | None = None
    company: str | None = None
    company_slug: str | None = None
    company_url: str | None = None
    batch: str | None = None
    tagline: str | None = None
    employment_type: str | None = None
    department: str | None = None
    category: str | None = None
    compensation: str | None = None
    location: str | None = None
    posted_age: str | None = None
    posted_age_days: float | None = None
    posted_at_estimated: str | None = None
    posted_age_confidence: str | None = None
    text: str | None = None
    matched_selectors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        row = asdict(self)
        row["source"] = "yc"
        return row


def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"


def parse_company_line(line: str) -> tuple[str | None, str | None, str | None]:
    match = re.match(r"^(?P<company>.+?)\s+\((?P<batch>[WS]\d{2})\)•(?P<tagline>.*)$", line)
    if not match:
        return line or None, None, None
    return match.group("company").strip(), match.group("batch").strip(), match.group("tagline").strip() or None


def posted_age_to_days(value: str | None) -> float | None:
    if not value:
        return None
    lowered = value.lower()
    if "about" in lowered:
        lowered = lowered.replace("about", "").strip()
    match = re.search(r"(?P<num>\d+(?:\.\d+)?)\s*(?P<unit>minute|hour|day|week|month|mo|year|yr)s?\s+ago", lowered)
    if not match:
        return None
    amount = float(match.group("num"))
    unit = match.group("unit")
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
    return (scraped_at - timedelta(days=days)).date().isoformat()


def age_confidence(value: str | None) -> str:
    return "estimated_relative" if posted_age_to_days(value) is not None else "missing"


def parse_card(text: str) -> dict[str, str | None]:
    lines = [line.strip() for line in text.splitlines() if line.strip() and line.strip() != "•"]
    company, batch, tagline = parse_company_line(lines[0] if lines else "")
    posted_age = None
    if lines:
        age_match = POSTED_AGE_RE.search(lines[0])
        if age_match:
            posted_age = age_match.group("age")
            tagline = POSTED_AGE_RE.sub("", tagline or "").strip() or tagline
    compensation = lines[5] if len(lines) > 5 else None
    location = lines[6] if len(lines) > 6 else None
    if compensation and not re.search(r"[$€£₹]|\\bK\\b|\\bM\\b|INR|GBP|USD", compensation):
        location = compensation
        compensation = None
    return {
        "company": company,
        "batch": batch,
        "tagline": tagline,
        "employment_type": lines[2] if len(lines) > 2 else None,
        "department": lines[3] if len(lines) > 3 else None,
        "category": lines[4] if len(lines) > 4 else None,
        "compensation": compensation,
        "location": location,
        "posted_age": posted_age,
    }


async def extract_visible_jobs(page: Page, source_role: str) -> list[YCJob]:
    scraped_at = datetime.now(UTC)
    rows = await page.evaluate(
        """
        () => Array.from(document.querySelectorAll('a[href*="/companies/"][href*="/jobs/"]')).map((anchor) => {
          let card = anchor;
          for (let depth = 0; depth < 8 && card; depth += 1) {
            const text = (card.innerText || card.textContent || '').trim();
            if (text.length > 120) break;
            card = card.parentElement;
          }
          return {
            href: anchor.href || anchor.getAttribute('href'),
            anchorText: (anchor.innerText || anchor.textContent || '').trim(),
            text: (card?.innerText || card?.textContent || '').trim(),
          };
        })
        """
    )
    jobs: list[YCJob] = []
    for row in rows:
        href = str(row.get("href") or "")
        match = JOB_URL_RE.search(href)
        if not match:
            continue
        text = str(row.get("text") or "")
        fields = parse_card(text)
        posted_age = fields["posted_age"]
        company_slug = match.group("company_slug")
        jobs.append(
            YCJob(
                source_role=source_role,
                job_id=match.group("job_id"),
                job_url=normalize_url(href),
                title=str(row.get("anchorText") or "").strip() or None,
                company=fields["company"],
                company_slug=company_slug,
                company_url=f"{YC_BASE_URL}/companies/{company_slug}",
                batch=fields["batch"],
                tagline=fields["tagline"],
                employment_type=fields["employment_type"],
                department=fields["department"],
                category=fields["category"],
                compensation=fields["compensation"],
                location=fields["location"],
                posted_age=posted_age,
                posted_age_days=posted_age_to_days(posted_age),
                posted_at_estimated=estimated_posted_at(posted_age, scraped_at),
                posted_age_confidence=age_confidence(posted_age),
                text=text,
                matched_selectors=['a[href*="/companies/"][href*="/jobs/"]'],
            )
        )
    return jobs


async def scrape_role_page(
    page: Page,
    source_role: str,
    url: str,
    *,
    max_stale_scrolls: int | None = None,
    scroll_pause_ms: int | None = None,
) -> list[YCJob]:
    max_stale_scrolls = max_stale_scrolls if max_stale_scrolls is not None else settings.yc_max_stale_scrolls
    scroll_pause_ms = scroll_pause_ms if scroll_pause_ms is not None else settings.yc_scroll_pause_ms

    await page.goto(url, wait_until="domcontentloaded", timeout=60_000)
    await page.wait_for_selector('a[href*="/companies/"][href*="/jobs/"]', timeout=20_000)

    jobs_by_id: dict[str, YCJob] = {}
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
        await page.mouse.wheel(0, 2600)
        await page.wait_for_timeout(scroll_pause_ms)

    return list(jobs_by_id.values())


async def scrape_yc_roles(
    role_urls: dict[str, str] | None = None,
    *,
    max_stale_scrolls: int | None = None,
    scroll_pause_ms: int | None = None,
) -> list[YCJob]:
    role_urls = role_urls or ROLE_URLS
    Path(settings.yc_export_dir).mkdir(parents=True, exist_ok=True)

    all_jobs: dict[str, YCJob] = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path=settings.yc_browser_executable)
        page = await browser.new_page(viewport={"width": 1440, "height": 1000})
        for source_role, url in role_urls.items():
            role_jobs = await scrape_role_page(
                page,
                source_role,
                url,
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
        await browser.close()
    return list(all_jobs.values())
