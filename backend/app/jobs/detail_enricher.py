from __future__ import annotations

from dataclasses import asdict
from urllib.parse import urlparse

from playwright.async_api import Page, async_playwright

from app.core.config import settings
from app.jobs.classifier import heuristic_classify
from app.jobs.job_hunt import JobCandidate, final_score


DESCRIPTION_SELECTORS = {
    "linkedin": (
        ".show-more-less-html__markup, "
        ".description__text, "
        ".jobs-description__content, "
        "[class*='description']"
    ),
    "wellfound": "[class*='styles_description'], [class*='description'], section",
    "yc": "main, article, section, [class*='prose']",
}

MIN_USABLE_WELLFOUND_DETAIL_CHARS = 700
BLOCKED_DETAIL_STATUS = "blocked_detail"


def clean_url(url: str | None) -> str | None:
    if not url:
        return None
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return None
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")


WEAK_EXTERNAL_HOSTS = {
    "news.ycombinator.com",
    "startupschool.org",
    "youtube.com",
    "youtu.be",
    "twitter.com",
    "x.com",
    "trustarc.com",
    "onetrust.com",
    "cookiebot.com",
    "builtin.com",
    "builtinnyc.com",
    "instagram.com",
    "facebook.com",
    "tiktok.com",
    "crunchbase.com",
    "medium.com",
}


def clean_website(url: str | None) -> str | None:
    cleaned = clean_url(url)
    if not cleaned:
        return None
    host = urlparse(cleaned).hostname or ""
    host = host.removeprefix("www.")
    if any(host.endswith(weak) for weak in WEAK_EXTERNAL_HOSTS):
        return None
    return cleaned


def is_challenge_text(value: object) -> bool:
    text = str(value or "").lower()
    return any(
        term in text
        for term in (
            "geo.captcha-delivery.com",
            "datadome",
            "checking if the site connection is secure",
            "verification required",
            "we detected unusual activity",
        )
    )


def is_usable_wellfound_detail(row: dict[str, object], details: dict[str, object]) -> bool:
    if str(row.get("source") or "").lower() != "wellfound":
        return True

    description = str(details.get("description") or "")
    body_excerpt = str(details.get("body_excerpt") or "")
    if is_challenge_text(description) or is_challenge_text(body_excerpt):
        return False

    text = "\n".join(part for part in (description, body_excerpt) if part).strip()
    if len(text) < MIN_USABLE_WELLFOUND_DETAIL_CHARS:
        return False

    employer = summarize_employer(row, details).get("employer_name")
    if not str(employer or "").strip():
        return False

    lowered = text.lower()
    return "about the role" in lowered or "about the job" in lowered or "what you'll do" in lowered


def blocked_detail_row(row: dict[str, object], exc: Exception, index: int | None = None) -> dict[str, object]:
    enriched = dict(row)
    enriched.update(
        {
            "enriched_ok": False,
            "enriched_error": f"{type(exc).__name__}: {exc}",
            "status": BLOCKED_DETAIL_STATUS,
            "category": None,
            "fit_score": None,
            "rank_score": 0,
            "reason": "Blocked: Wellfound detail page could not be extracted with enough company and job-description detail.",
            "matched_criteria": [],
            "rejected_criteria": ["detail extraction blocked"],
        }
    )
    if index is not None:
        enriched["enriched_index"] = index
    return enriched


def title_from_slug(slug: str | None) -> str | None:
    if not slug:
        return None
    return " ".join(part.capitalize() for part in slug.split("-") if part)


def company_url_from_job(row: dict[str, object]) -> str | None:
    source = str(row.get("source") or "")
    job_url = str(row.get("job_url") or "")
    parsed = urlparse(job_url)
    parts = [part for part in parsed.path.split("/") if part]
    if source == "yc" and len(parts) >= 2 and parts[0] == "companies":
        return f"https://www.ycombinator.com/companies/{parts[1]}"
    if source == "wellfound":
        company_url = str(row.get("company_url") or "")
        if company_url:
            return clean_url(company_url)
    return None


def company_name_from_url(url: str | None) -> str | None:
    if not url:
        return None
    parsed = urlparse(url)
    parts = [part for part in parsed.path.split("/") if part]
    if not parts:
        return None
    if parts[0] in {"companies", "company"} and len(parts) > 1:
        return title_from_slug(parts[1])
    return title_from_slug(parts[-1])


def infer_company_type(source: str, text: str) -> str:
    lowered = text.lower()
    if source == "yc":
        return "yc_startup"
    if "y combinator" in lowered or "yc" in lowered:
        return "startup"
    if any(term in lowered for term in ("agency", "consulting", "staffing", "recruiting")):
        return "agency_or_staffing"
    if any(term in lowered for term in ("nonprofit", "foundation", "charity")):
        return "nonprofit"
    if any(term in lowered for term in ("series a", "series b", "seed", "venture-backed", "startup")):
        return "startup"
    if any(term in lowered for term in ("enterprise", "platform", "saas", "api", "software")):
        return "software_company"
    return "unknown"


def infer_startup_stage(source: str, text: str) -> str:
    lowered = text.lower()
    if source == "yc":
        return "yc_backed"
    if "pre-seed" in lowered:
        return "pre_seed"
    if "seed" in lowered:
        return "seed"
    if "series a" in lowered:
        return "series_a"
    if "series b" in lowered or "series c" in lowered or "growth" in lowered:
        return "growth"
    if "early stage" in lowered:
        return "early_stage"
    return "unknown"


def employer_priority(company_type: str, startup_stage: str, text: str) -> float:
    lowered = text.lower()
    score = 0.45
    if company_type == "yc_startup":
        score += 0.3
    elif company_type in {"startup", "software_company"}:
        score += 0.18
    elif company_type == "agency_or_staffing":
        score -= 0.18
    if startup_stage in {"yc_backed", "seed", "series_a", "early_stage"}:
        score += 0.12
    if any(term in lowered for term in ("ai", "llm", "agent", "developer", "api", "saas", "workflow", "automation")):
        score += 0.1
    if any(term in lowered for term in ("staffing", "recruiting", "consulting")):
        score -= 0.1
    return round(max(0, min(1, score)), 4)


def summarize_employer(row: dict[str, object], details: dict[str, object]) -> dict[str, object]:
    source = str(row.get("source") or "")
    employer_url = company_url_from_job(row) or clean_url(str(details.get("employer_url") or ""))
    company = str(row.get("company") or details.get("employer_name") or "").strip() or None
    company = company or company_name_from_url(employer_url)
    detail_text = "\n".join(
        str(part)
        for part in [
            details.get("employer_profile_text"),
            details.get("employer_text"),
            details.get("description"),
            details.get("body_excerpt"),
            row.get("text"),
        ]
        if part
    )
    company_type = infer_company_type(source, detail_text)
    startup_stage = infer_startup_stage(source, detail_text)
    priority = employer_priority(company_type, startup_stage, detail_text)
    tagline = str(details.get("employer_tagline") or "").strip() or None
    summary_source = tagline or detail_text
    summary = " ".join(summary_source.split())[:260] if summary_source else None
    product_signal_terms = [
        term
        for term in ("ai", "llm", "agent", "saas", "api", "workflow", "automation", "developer tools", "healthcare", "fintech")
        if term in detail_text.lower()
    ]
    follow_up_angle = None
    if company:
        if product_signal_terms:
            follow_up_angle = f"Lead with {', '.join(product_signal_terms[:3])} product experience and ship-speed."
        elif company_type in {"yc_startup", "startup"}:
            follow_up_angle = "Lead with startup execution, ownership, and product engineering range."
        else:
            follow_up_angle = "Lead with relevant web/mobile/backend delivery and measurable product outcomes."
    return {
        "employer_name": company,
        "employer_url": employer_url,
        "employer_website": clean_website(str(details.get("employer_profile_website") or details.get("employer_website") or "")),
        "employer_linkedin": clean_url(str(details.get("employer_linkedin") or "")),
        "employer_summary": summary,
        "employer_type": company_type,
        "startup_stage": startup_stage,
        "employer_priority_score": priority,
        "product_signal_terms": product_signal_terms[:8],
        "follow_up_angle": follow_up_angle,
    }


async def extract_page_details(page: Page, source: str) -> dict[str, object]:
    selector = DESCRIPTION_SELECTORS.get(source, "main, article, body")
    return await page.evaluate(
        """
        ({ selector }) => {
          const textOf = (el) => (el?.innerText || el?.textContent || '').trim();
          const blocks = Array.from(document.querySelectorAll(selector))
            .map(textOf)
            .filter(Boolean)
            .sort((a, b) => b.length - a.length);
          const bodyText = textOf(document.body);
          const buttons = Array.from(document.querySelectorAll('button,a')).map((el) => ({
            text: textOf(el),
            href: el.href || el.getAttribute('href') || null,
          }));
          const applyButtons = buttons.filter((item) =>
            /apply|easy apply/i.test(item.text || '') || /apply/i.test(item.href || '')
          );
          const externalApply = applyButtons.find((item) =>
            item.href && !item.href.includes('linkedin.com/login') && !item.href.includes('wellfound.com/login')
          );
          const links = buttons.filter((item) => item.href);
          const companyLink = links.find((item) =>
            item.href && (/\\/companies\\//.test(item.href) || /\\/company\\//.test(item.href))
          );
          const websiteLink = links.find((item) =>
            item.href &&
            !item.href.includes('linkedin.com') &&
            !item.href.includes('wellfound.com') &&
            !item.href.includes('ycombinator.com') &&
            !item.href.includes('startupschool.org') &&
            !item.href.includes('account.ycombinator.com') &&
            !item.href.includes('mailto:') &&
            !item.href.includes('javascript:')
          );
          const employerBlocks = Array.from(document.querySelectorAll(
            '[class*="company"], [class*="startup"], [class*="profile"], aside, section'
          ))
            .map(textOf)
            .filter(Boolean)
            .sort((a, b) => b.length - a.length);
          return {
            page_title: document.title,
            h1: textOf(document.querySelector('h1')) || null,
            description: blocks[0] || bodyText.slice(0, 6000),
            body_excerpt: bodyText.slice(0, 3000),
            has_apply_button: applyButtons.length > 0,
            apply_url: externalApply?.href || null,
            employer_name: companyLink?.text || null,
            employer_url: companyLink?.href || null,
            employer_website: websiteLink?.href || null,
            employer_tagline: employerBlocks[0]?.split('\\n').slice(0, 4).join(' ') || null,
            employer_text: employerBlocks[0] || null,
          };
        }
        """,
        {"selector": selector},
    )


async def extract_employer_profile_details(page: Page) -> dict[str, object]:
    return await page.evaluate(
        """
        () => {
          const textOf = (el) => (el?.innerText || el?.textContent || '').trim();
          const bodyText = textOf(document.body);
          const links = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
            text: textOf(a),
            href: a.href || a.getAttribute('href') || null,
          })).filter((item) => item.href);
          const internalHosts = ['wellfound.com', 'ycombinator.com', 'account.ycombinator.com'];
          const weakHosts = [
            'news.ycombinator.com',
            'startupschool.org',
            'youtube.com',
            'youtu.be',
            'twitter.com',
            'x.com',
            'trustarc.com',
            'onetrust.com',
            'cookiebot.com',
            'builtin.com',
            'builtinnyc.com',
            'instagram.com',
            'facebook.com',
            'tiktok.com',
            'crunchbase.com',
            'medium.com',
          ];
          const externalLinks = links.filter((item) => {
            try {
              const host = new URL(item.href).hostname.replace(/^www\\./, '');
              return !internalHosts.some((internal) => host.endsWith(internal));
            } catch {
              return false;
            }
          });
          const website = externalLinks.find((item) => {
            try {
              const host = new URL(item.href).hostname.replace(/^www\\./, '');
              return !weakHosts.some((weak) => host.endsWith(weak)) && !host.includes('linkedin.com');
            } catch {
              return false;
            }
          });
          const linkedin = externalLinks.find((item) => item.href.includes('linkedin.com/company/'));
          const blocks = Array.from(document.querySelectorAll('main, article, section, aside, [class*="company"], [class*="profile"], [class*="description"]'))
            .map(textOf)
            .filter(Boolean)
            .sort((a, b) => b.length - a.length);
          return {
            employer_profile_title: document.title,
            employer_profile_website: website?.href || null,
            employer_linkedin: linkedin?.href || null,
            employer_profile_text: blocks[0] || bodyText.slice(0, 5000),
          };
        }
        """
    )


def row_to_candidate(row: dict[str, object], enriched_text: str | None) -> JobCandidate:
    text = "\n".join(
        part
        for part in [
            str(row.get("text") or ""),
            str(enriched_text or ""),
        ]
        if part
    )
    return JobCandidate(
        source=str(row["source"]),
        source_detail=str(row.get("source_detail") or ""),
        job_id=str(row["job_id"]),
        job_url=str(row["job_url"]),
        title=str(row["title"]) if row.get("title") else None,
        company=str(row["company"]) if row.get("company") else None,
        location=str(row["location"]) if row.get("location") else None,
        compensation=str(row["compensation"]) if row.get("compensation") else None,
        posted_age=str(row["posted_age"]) if row.get("posted_age") else None,
        posted_age_days=float(row["posted_age_days"]) if row.get("posted_age_days") is not None else None,
        posted_at_estimated=str(row["posted_at_estimated"]) if row.get("posted_at_estimated") else None,
        posted_age_confidence=str(row["posted_age_confidence"]) if row.get("posted_age_confidence") else None,
        text=text,
    )


def classify_enriched_row(row: dict[str, object], details: dict[str, object]) -> dict[str, object]:
    description = str(details.get("description") or "")
    analysis_text = "\n".join(
        str(part)
        for part in [
            details.get("body_excerpt"),
            description,
        ]
        if part
    )
    candidate = row_to_candidate(row, analysis_text)
    classification = heuristic_classify(candidate)
    enriched = dict(row)
    enriched.update(
        {
            "text": candidate.text,
            "detail_page_title": details.get("page_title"),
            "detail_h1": details.get("h1"),
            "detail_description": description,
            "detail_body_excerpt": details.get("body_excerpt"),
            "has_apply_button": details.get("has_apply_button"),
            "apply_url": details.get("apply_url"),
            "status": classification.status,
            "category": classification.category,
            "fit_score": classification.fit_score,
            "rank_score": final_score(candidate, classification),
            "reason": classification.reason,
            "matched_criteria": classification.matched_criteria,
            "rejected_criteria": classification.rejected_criteria,
            **summarize_employer(row, details),
        }
    )
    return enriched


async def enrich_rows(
    rows: list[dict[str, object]],
    *,
    cdp_url: str | None = None,
    pause_ms: int = 1200,
) -> list[dict[str, object]]:
    cdp_url = cdp_url or settings.linkedin_cdp_url or settings.wellfound_cdp_url
    if not cdp_url:
        raise RuntimeError("Set LINKEDIN_CDP_URL or WELLFOUND_CDP_URL to a running Chrome DevTools endpoint.")

    enriched_rows: list[dict[str, object]] = []
    employer_cache: dict[str, dict[str, object]] = {}
    async with async_playwright() as p:
        launched_browser = False
        try:
            browser = await p.chromium.connect_over_cdp(cdp_url, timeout=20_000)
            context = browser.contexts[0] if browser.contexts else await browser.new_context()
        except Exception:
            browser = await p.chromium.launch(
                headless=True,
                executable_path=settings.yc_browser_executable or settings.wellfound_browser_executable,
            )
            context = await browser.new_context()
            launched_browser = True
        page = await context.new_page()
        for index, row in enumerate(rows, start=1):
            url = str(row.get("job_url") or "")
            source = str(row.get("source") or "")
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=25_000)
                await page.wait_for_timeout(pause_ms)
                details = await extract_page_details(page, source)
                if not is_usable_wellfound_detail(row, details):
                    raise RuntimeError("Wellfound detail extraction incomplete")
                employer_summary = summarize_employer(row, details)
                employer_url = str(employer_summary.get("employer_url") or "")
                if employer_url:
                    if employer_url not in employer_cache:
                        try:
                            await page.goto(employer_url, wait_until="domcontentloaded", timeout=25_000)
                            await page.wait_for_timeout(pause_ms)
                            employer_cache[employer_url] = await extract_employer_profile_details(page)
                        except Exception as employer_exc:
                            employer_cache[employer_url] = {
                                "employer_profile_error": f"{type(employer_exc).__name__}: {employer_exc}"
                            }
                    details.update(employer_cache[employer_url])
                enriched = classify_enriched_row(row, details)
                enriched["enriched_ok"] = True
                enriched["enriched_error"] = None
            except Exception as exc:
                if source == "wellfound":
                    enriched = blocked_detail_row(row, exc)
                    enriched["enriched_index"] = index
                    enriched_rows.append(enriched)
                    continue
                candidate = row_to_candidate(row, None)
                classification = heuristic_classify(candidate)
                enriched = dict(row)
                enriched["enriched_ok"] = False
                enriched["enriched_error"] = f"{type(exc).__name__}: {exc}"
                enriched["status"] = classification.status
                enriched["category"] = classification.category
                enriched["fit_score"] = classification.fit_score
                enriched["rank_score"] = final_score(candidate, classification)
                enriched["reason"] = f"{classification.reason} Detail enrichment failed."
                enriched["matched_criteria"] = classification.matched_criteria
                enriched["rejected_criteria"] = classification.rejected_criteria or ["detail enrichment failed"]
            enriched["enriched_index"] = index
            enriched_rows.append(enriched)
        await page.close()
        if launched_browser:
            await context.close()
        await browser.close()

    enriched_rows.sort(
        key=lambda row: (
            0 if row["status"] == "accepted" else 1 if row["status"] == "needs_review" else 2,
            -float(row["rank_score"]),
            float(row["posted_age_days"]) if row["posted_age_days"] is not None else 9999,
            str(row["title"] or ""),
        )
    )
    return enriched_rows


def split_status(rows: list[dict[str, object]]) -> tuple[list[dict[str, object]], list[dict[str, object]], list[dict[str, object]]]:
    accepted = [row for row in rows if row["status"] == "accepted"]
    needs_review = [row for row in rows if row["status"] == "needs_review"]
    rejected = [row for row in rows if row["status"] == "rejected"]
    return accepted, needs_review, rejected
