from __future__ import annotations

import re
from dataclasses import asdict, dataclass, field
from pathlib import Path
from urllib.parse import urlencode, urlparse

from playwright.async_api import Browser, Page, TimeoutError as PlaywrightTimeoutError, async_playwright

from app.core.config import settings

LINKEDIN_BASE_URL = "https://www.linkedin.com"
SEARCH_QUERIES = {
    "ai_engineer": "AI Engineer",
    "backend_engineer": "Backend Engineer",
    "frontend_react": "Frontend React",
    "full_stack_react": "Full Stack React",
    "generative_ai_engineer": "Generative AI Engineer",
    "llm_engineer": "LLM Engineer",
    "nextjs_developer": "Next.js Developer",
    "react_developer": "React Developer",
    "react_native": "React Native",
    "typescript_developer": "TypeScript Developer",
}

JOB_ID_RE = re.compile(r"/jobs/view/(?:[^/?#]*-)?(?P<job_id>\d+)")
POSTED_AGE_RE = re.compile(
    r"\b(?P<num>\d+(?:\.\d+)?)\s*(?P<unit>minute|hour|day|week|month|mo|yr|year)s?\s+ago\b",
    re.I,
)


@dataclass
class LinkedInJob:
    source_query: str
    job_id: str
    job_url: str
    title: str | None = None
    company: str | None = None
    location: str | None = None
    posted_age: str | None = None
    posted_age_days: float | None = None
    text: str | None = None
    matched_selectors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        row = asdict(self)
        row["source"] = "linkedin"
        return row


def linkedin_search_url(query: str, *, oldest_days: int) -> str:
    # f_TPR is seconds back; f_WT=2 means remote.
    seconds = max(1, oldest_days) * 24 * 60 * 60
    params = {
        "keywords": query,
        "f_TPR": f"r{seconds}",
        "f_WT": "2",
    }
    return f"{LINKEDIN_BASE_URL}/jobs/search/?{urlencode(params)}"


def normalize_linkedin_job_url(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}"


def posted_age_to_days(value: str | None) -> float | None:
    if not value:
        return None
    match = POSTED_AGE_RE.search(value)
    if not match:
        return None
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


def parse_card_fields(text: str, fallback_title: str | None = None) -> dict[str, str | None]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    deduped: list[str] = []
    for line in lines:
        if not deduped or deduped[-1] != line:
            deduped.append(line)
    posted = None
    for line in deduped:
        match = POSTED_AGE_RE.search(line)
        if match:
            posted = match.group(0)
            break
    title = fallback_title or (deduped[0] if deduped else None)
    company = None
    location = None
    if len(deduped) >= 3 and deduped[0] == deduped[1]:
        company = deduped[2]
        location = deduped[3] if len(deduped) > 3 else None
    elif len(deduped) >= 2:
        company = deduped[1]
        location = deduped[2] if len(deduped) > 2 else None
    return {
        "title": title,
        "company": company,
        "location": location,
        "posted_age": posted,
    }


async def wait_for_linkedin_results(page: Page) -> None:
    try:
        await page.wait_for_selector('a[href*="/jobs/view/"]', timeout=20_000)
    except PlaywrightTimeoutError:
        body_text = await page.locator("body").inner_text(timeout=5_000)
        if "Sign in" in body_text and "Join now" in body_text:
            raise RuntimeError("LinkedIn did not expose job results. Sign in in the CDP Chrome window, then rerun.")
        raise


async def extract_visible_jobs(page: Page, source_query: str) -> list[LinkedInJob]:
    rows = await page.evaluate(
        """
        () => Array.from(
          document.querySelectorAll('.job-search-card a[href*="/jobs/view/"], .base-search-card a[href*="/jobs/view/"]')
        ).map((anchor) => {
          let card = anchor.closest('.job-search-card, .base-search-card');
          if (!card) {
            card = anchor;
            for (let depth = 0; depth < 8 && card; depth += 1) {
              const text = (card.innerText || card.textContent || '').trim();
              if (text.length > 80) break;
              card = card.parentElement;
            }
          }
          return {
            href: anchor.href || anchor.getAttribute('href'),
            anchorText: (anchor.innerText || anchor.textContent || '').trim(),
            text: (card.innerText || card.textContent || '').trim(),
          };
        })
        """
    )
    jobs: list[LinkedInJob] = []
    for row in rows:
        href = str(row.get("href") or "")
        match = JOB_ID_RE.search(href)
        if not match:
            continue
        text = str(row.get("text") or "")
        fields = parse_card_fields(text, str(row.get("anchorText") or "").strip() or None)
        jobs.append(
            LinkedInJob(
                source_query=source_query,
                job_id=match.group("job_id"),
                job_url=normalize_linkedin_job_url(href),
                title=fields["title"],
                company=fields["company"],
                location=fields["location"],
                posted_age=fields["posted_age"],
                posted_age_days=posted_age_to_days(fields["posted_age"]),
                text=text,
                matched_selectors=['a[href*="/jobs/view/"]'],
            )
        )
    return jobs


async def scrape_search_page(
    page: Page,
    source_query: str,
    query: str,
    *,
    oldest_days: int | None = None,
    max_stale_scrolls: int | None = None,
    scroll_pause_ms: int | None = None,
) -> list[LinkedInJob]:
    oldest_days = oldest_days if oldest_days is not None else settings.linkedin_oldest_days
    max_stale_scrolls = (
        max_stale_scrolls if max_stale_scrolls is not None else settings.linkedin_max_stale_scrolls
    )
    scroll_pause_ms = scroll_pause_ms if scroll_pause_ms is not None else settings.linkedin_scroll_pause_ms

    await page.goto(linkedin_search_url(query, oldest_days=oldest_days), wait_until="domcontentloaded", timeout=60_000)
    await wait_for_linkedin_results(page)

    jobs_by_id: dict[str, LinkedInJob] = {}
    stale_scrolls = 0
    previous_count = 0
    while True:
        for job in await extract_visible_jobs(page, source_query):
            jobs_by_id[job.job_id] = job

        current_count = len(jobs_by_id)
        if current_count == previous_count:
            stale_scrolls += 1
        else:
            stale_scrolls = 0
        previous_count = current_count
        if stale_scrolls >= max_stale_scrolls:
            break

        show_more = page.locator("button:has-text('See more jobs'), button:has-text('Show more jobs')")
        if await show_more.count():
            try:
                await show_more.first.click(timeout=2_000)
            except Exception:
                await page.mouse.wheel(0, 2600)
        else:
            await page.mouse.wheel(0, 2600)
        await page.wait_for_timeout(scroll_pause_ms)

    return list(jobs_by_id.values())


async def scrape_linkedin_searches(
    search_queries: dict[str, str] | None = None,
    *,
    cdp_url: str | None = None,
    oldest_days: int | None = None,
    max_stale_scrolls: int | None = None,
    scroll_pause_ms: int | None = None,
) -> list[LinkedInJob]:
    search_queries = search_queries or SEARCH_QUERIES
    cdp_url = cdp_url or settings.linkedin_cdp_url or settings.wellfound_cdp_url
    if not cdp_url:
        raise RuntimeError("Set LINKEDIN_CDP_URL or WELLFOUND_CDP_URL to a running Chrome DevTools endpoint.")

    Path(settings.linkedin_export_dir).mkdir(parents=True, exist_ok=True)
    all_jobs: dict[str, LinkedInJob] = {}
    async with async_playwright() as p:
        browser: Browser = await p.chromium.connect_over_cdp(cdp_url)
        context = browser.contexts[0] if browser.contexts else await browser.new_context()
        page = await context.new_page()
        for source_query, query in search_queries.items():
            query_jobs = await scrape_search_page(
                page,
                source_query,
                query,
                oldest_days=oldest_days,
                max_stale_scrolls=max_stale_scrolls,
                scroll_pause_ms=scroll_pause_ms,
            )
            for job in query_jobs:
                existing = all_jobs.get(job.job_id)
                if existing is None:
                    all_jobs[job.job_id] = job
                elif source_query not in existing.source_query.split(","):
                    existing.source_query = f"{existing.source_query},{source_query}"
        await page.close()
        await browser.close()
    return list(all_jobs.values())
