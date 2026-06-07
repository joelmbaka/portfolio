from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Protocol

import httpx

from app.core.config import settings
from app.jobs.criteria import KEYWORD_EXCLUDE, KEYWORD_INCLUDE, criteria_prompt


ROLE_DEFINING_EXCLUDE = {
    "swift",
    "kotlin",
    "android",
    "android engineer",
    "android developer",
    "compose multiplatform",
    "flutter",
    "dart",
    "ios",
    "ios engineer",
    "ios developer",
    "vue",
    "svelte",
    "jquery",
    "angular",
    "kubernetes",
}

HARD_EXCLUDE = set(KEYWORD_EXCLUDE) - ROLE_DEFINING_EXCLUDE

BACKEND_SIGNALS = {
    "backend",
    "back-end",
    "back end",
    "api",
    "microservices",
    "distributed systems",
}

FRONTEND_SIGNALS = {
    "frontend",
    "front-end",
    "front end",
    "web app",
    "web application",
    "ui",
}

SUPPORTED_FRONTEND_SIGNALS = {
    "react",
    "react.js",
    "reactjs",
    "next.js",
    "nextjs",
}

UNSUPPORTED_FRONTEND_SIGNALS = {
    "vue",
    "vue.js",
    "vuejs",
    "svelte",
    "angular",
    "jquery",
}

SUPPORTED_BACKEND_SIGNALS = {
    "python",
    "fastapi",
    "django",
    "flask",
    "node.js",
    "nodejs",
    "node js",
    "express.js",
    "expressjs",
    "nestjs",
    "nest.js",
    "typescript backend",
    "javascript backend",
    "node.js / typescript",
    "nodejs/typescript",
    "node + typescript",
}

GO_BACKEND_SIGNALS = {
    "backend: go",
    "backend (go",
    "backend is written in go",
    "backend written in go",
    "backend services in go",
    "backend systems leveraging go",
    "go backend",
    "go lang",
    "golang",
}

UNSUPPORTED_BACKEND_SIGNALS = {
    "go",
    "go lang",
    "golang",
    "elixir",
    "phoenix",
    "kotlin",
    "spring boot",
    "jvm",
    "ruby on rails",
    "rails",
    "c#",
    ".net",
    "c++",
    "rust",
    "java",
}

BACKEND_STACK_PHRASES = {
    "backend:",
    "backend is written in",
    "backend written in",
    "on the backend",
    "backend services",
    "backend stack",
    "our backend",
    "the backend",
    "server is written in",
    "server written in",
    "server-side",
    "our stack",
    "technology stack",
}

SOFT_REQUIREMENT_SIGNALS = {
    "nice to have",
    "bonus",
    "bonus points",
    "plus",
    "preferred",
    "familiarity",
}

REMOTE_SIGNALS = {
    "remote",
    "hires remotely",
    "remote only",
    "remote work policy",
    "onsite or remote",
    "on-site or remote",
    "wfh",
    "work from home",
    "distributed team",
    "fully remote",
}

STRICT_ONSITE_SIGNALS = {
    "in office",
    "in-office",
    "office only",
    "nyc office",
    "sits in the same room",
    "works from our london office 4+ days/week",
    "from our london office 4+ days/week",
    "4+ days/week",
    "onsite 3 days/week",
    "on-site 3 days/week",
    "in person at least 3x a week",
    "in-person at least 3x a week",
    "in person 3x a week",
    "in-person 3x a week",
    "in person team",
    "in-person team",
    "hybrid (onsite 3 days/week)",
    "excited about working in-person",
    "working in-person",
    "based full-time on-site",
    "based full time on-site",
    "full-time on-site",
    "full time on-site",
    "full-time onsite",
    "full time onsite",
}

GENERIC_ONSITE_SIGNALS = {
    "onsite",
    "on-site",
}

INTERNSHIP_SIGNALS = {
    "internship",
    "intern",
    "school year",
    "student",
    "werkstudent",
    "working student",
}

COFOUNDER_SIGNALS = {
    "cofounder",
    "co-founder",
    "co founder",
    "founder (technical)",
    "technical founder",
}

DEFERRED_PAY_SIGNALS = {
    "equity only",
    "equity-only",
    "unpaid",
    "deferred pay",
    "deferred salary",
    "sweat equity",
    "pay when profitable",
    "paid when profitable",
    "when profitable",
    "commission only",
    "commission-only",
    "revenue share",
    "profit share",
}

MIN_USD_ANNUAL_CASH = 40_000
MIN_MONTHLY_CASH = 3_500
MAX_POSTED_AGE_DAYS = 45
MAX_PROMISING_THIN_DETAIL_AGE_DAYS = 14
MIN_PROMISING_THIN_DETAIL_USD_MAX = 100_000
MIN_PROMISING_THIN_WELLFOUND_JOB_ID = 4_000_000

NON_ENGINEERING_TITLE_EXCLUDES = {
    "solutions engineer",
    "solution engineer",
    "sales engineer",
    "success engineer",
    "customer success",
    "technical success",
    "success architect",
    "technical success architect",
    "product marketing",
    "product marketing lead",
    "design engineer",
}

THIN_DETAIL_BAD_TITLE_TERMS = {
    "data engineer",
    "data scientist",
    "database",
    "devops",
    "gtm",
    "infrastructure",
    "instructor",
    "machine learning engineer",
    "marketing",
    "qa ",
    "quality assurance",
    "rust",
    "sdet",
    "solutions",
    "solution architect",
}

THIN_DETAIL_RELEVANT_TITLE_TERMS = {
    "ai",
    "agent",
    "backend",
    "front-end",
    "frontend",
    "full stack",
    "full-stack",
    "fullstack",
    "founding engineer",
    "mobile",
    "react native",
    "software engineer",
}

THIN_DETAIL_GLOBAL_REMOTE_TERMS = {
    "australia",
    "brazil",
    "canada",
    "europe",
    "everywhere",
    "global",
    "latin america",
    "latam",
    "remote only • everywhere",
    "united kingdom",
    " uk",
}

UNSUPPORTED_BACKEND_TITLE_PHRASES = {
    "ruby on rails engineer",
    "rails engineer",
    "golang engineer",
    "go engineer",
    "elixir engineer",
    "phoenix engineer",
    "kotlin engineer",
    "java engineer",
    "spring boot engineer",
}


class JobLike(Protocol):
    source: str
    job_url: str
    title: str | None
    company_slug: str | None
    location: str | None
    compensation: str | None
    posted_age: str | None
    posted_age_days: float | None
    text: str | None


@dataclass(frozen=True)
class Classification:
    status: str
    category: str | None
    fit_score: float
    reason: str
    matched_criteria: list[str]
    rejected_criteria: list[str]


def _candidate_text(candidate: JobLike) -> str:
    parts = [
        candidate.title or "",
        candidate.company_slug or "",
        candidate.location or "",
        candidate.compensation or "",
        getattr(candidate, "posted_age", None) or "",
        candidate.text or "",
    ]
    return "\n".join(parts).lower()


def trim_page_noise(text: str) -> str:
    for marker in ("\nsimilar jobs\n", "\nfooter\n", "\nfor candidates\n", "\nbrowse by:"):
        if marker in text:
            text = text.split(marker, 1)[0]
    return text


def contains_term(text: str, term: str) -> bool:
    escaped = re.escape(term.lower())
    if re.search(rf"(?<![a-z0-9]){escaped}(?![a-z0-9])", text):
        return True
    return False


def has_unsupported_go_backend(text: str) -> bool:
    has_backend = any(contains_term(text, term) for term in BACKEND_SIGNALS)
    has_go_backend = any(contains_term(text, term) for term in GO_BACKEND_SIGNALS)
    has_supported_backend = any(contains_term(text, term) for term in SUPPORTED_BACKEND_SIGNALS)
    return has_backend and has_go_backend and not has_supported_backend


def has_unsupported_backend_title(title: str) -> bool:
    return any(contains_term(title, term) for term in UNSUPPORTED_BACKEND_TITLE_PHRASES)


def has_strict_unsupported_backend(text: str) -> bool:
    for line in text.splitlines():
        if not any(phrase in line for phrase in BACKEND_STACK_PHRASES):
            continue
        if any(contains_term(line, term) for term in UNSUPPORTED_BACKEND_SIGNALS):
            if any(contains_term(line, term) for term in SUPPORTED_BACKEND_SIGNALS):
                continue
            return True
    if any(contains_term(text, term) for term in SUPPORTED_BACKEND_SIGNALS):
        for line in text.splitlines():
            if any(
                phrase in line
                for phrase in (
                    "experience designing and developing",
                    "required qualifications",
                    "what we're looking for",
                    "what we are looking for",
                )
            ) and any(contains_term(line, term) for term in GO_BACKEND_SIGNALS):
                return True
        return False
    has_backend = any(contains_term(text, term) for term in BACKEND_SIGNALS)
    has_skills_go = bool(re.search(r"(?<![a-z0-9])go\\s*[,\\n]", text))
    if has_backend and has_skills_go:
        return True
    return has_unsupported_go_backend(text)


def has_strict_unsupported_frontend(text: str, title: str) -> bool:
    title_has_unsupported = any(contains_term(title, term) for term in UNSUPPORTED_FRONTEND_SIGNALS)
    if title_has_unsupported:
        return True
    backend_role_with_supported_stack = (
        any(contains_term(title, term) for term in BACKEND_SIGNALS)
        and any(contains_term(text, term) for term in SUPPORTED_BACKEND_SIGNALS)
    )

    skills_section_match = re.search(r"\nskills\n(?P<section>.*?)(?:\napply|\nabout the role|\nabout the job)", text, re.S)
    if skills_section_match:
        skills_section = skills_section_match.group("section")
        has_unsupported_skill = any(contains_term(skills_section, term) for term in UNSUPPORTED_FRONTEND_SIGNALS)
        has_supported_skill = any(contains_term(skills_section, term) for term in SUPPORTED_FRONTEND_SIGNALS)
        if has_unsupported_skill and not has_supported_skill and not backend_role_with_supported_stack:
            return True

    for line in text.splitlines():
        if "skills" not in line and "frontend" not in line and "front-end" not in line and "front end" not in line:
            continue
        if not any(contains_term(line, term) for term in UNSUPPORTED_FRONTEND_SIGNALS):
            continue
        if any(contains_term(line, term) for term in SOFT_REQUIREMENT_SIGNALS):
            continue
        if not any(contains_term(line, term) for term in SUPPORTED_FRONTEND_SIGNALS):
            return True

    has_frontend = any(contains_term(text, term) for term in FRONTEND_SIGNALS)
    has_supported_frontend = any(contains_term(text, term) for term in SUPPORTED_FRONTEND_SIGNALS)
    has_unsupported_frontend = any(contains_term(text, term) for term in UNSUPPORTED_FRONTEND_SIGNALS)
    if backend_role_with_supported_stack:
        return False
    if has_frontend and has_unsupported_frontend and not has_supported_frontend:
        return True
    if not has_frontend or has_supported_frontend:
        return False

    for line in text.splitlines():
        if not any(contains_term(line, term) for term in UNSUPPORTED_FRONTEND_SIGNALS):
            continue
        if any(contains_term(line, term) for term in SOFT_REQUIREMENT_SIGNALS):
            continue
        if any(contains_term(line, term) for term in FRONTEND_SIGNALS):
            return True
    return False


def has_non_engineering_title(title: str) -> bool:
    return any(contains_term(title, term) for term in NON_ENGINEERING_TITLE_EXCLUDES)


def has_internship_signal(text: str, title: str) -> bool:
    header = "\n".join(text.splitlines()[:35])
    combined = f"{title}\n{header}"
    return any(contains_term(combined, term) for term in INTERNSHIP_SIGNALS)


def has_cofounder_signal(text: str, title: str) -> bool:
    header = "\n".join(text.splitlines()[:35])
    combined = f"{title}\n{header}"
    if any(contains_term(title, term) for term in COFOUNDER_SIGNALS):
        return True
    return bool(
        re.search(
            r"\b(?:join|hiring|looking for|seeking|wanted|role|position)\b.{0,60}\bco[- ]?founder\b"
            r"|\bco[- ]?founder\b.{0,60}\b(?:role|position|wanted|needed|equity-only|equity only)\b",
            combined,
        )
    )


def has_cash_amount(text: str) -> bool:
    return bool(
        re.search(r"[$€£₹₦]\s*\d", text)
        or re.search(r"\b\d+(?:\.\d+)?\s*[kK]\s*(?:-|–|to)", text)
        or re.search(r"\b\d+(?:\.\d+)?\s*(?:USD|INR|GBP|EUR|NGN)\b", text, re.I)
    )


def parse_money_amounts(text: str) -> list[tuple[str, float, str]]:
    amounts: list[tuple[str, float, str]] = []
    money_re = re.compile(
        r"(?P<currency>[$€£₹₦])\s*(?P<amount>\d+(?:,\d{3})*(?:\.\d+)?)\s*(?P<suffix>[kKmM]?)"
        r"|(?P<num>\d+(?:,\d{3})*(?:\.\d+)?)\s*(?P<num_suffix>[kKmM])?\s*(?P<code>USD|INR|GBP|EUR|NGN)",
        re.I,
    )
    for match in money_re.finditer(text):
        if match.group("currency"):
            currency = match.group("currency")
            amount = float(match.group("amount").replace(",", ""))
            suffix = (match.group("suffix") or "").lower()
        else:
            currency = (match.group("code") or "").upper()
            amount = float(match.group("num").replace(",", ""))
            suffix = (match.group("num_suffix") or "").lower()
        if suffix == "k":
            amount *= 1_000
        elif suffix == "m":
            amount *= 1_000_000
        amounts.append((currency, amount, match.group(0).lower()))
    return amounts


def has_low_cash_compensation(text: str, compensation: str) -> bool:
    sample = f"{compensation}\n" + "\n".join(text.splitlines()[:45])
    if not sample.strip():
        return False
    if any(term in sample.lower() for term in ("/ monthly", "monthly", "per month")):
        monthly_amounts = [amount for _, amount, _ in parse_money_amounts(sample)]
        return bool(monthly_amounts) and max(monthly_amounts) < MIN_MONTHLY_CASH
    usd_like_amounts = [
        amount
        for currency, amount, raw in parse_money_amounts(sample)
        if currency in {"$", "USD"} and "%" not in raw
    ]
    if usd_like_amounts:
        return max(usd_like_amounts) < MIN_USD_ANNUAL_CASH
    return False


def max_usd_cash(compensation: str) -> float:
    amounts = parse_money_amounts(compensation)
    usd_like = [amount for currency, amount, _ in amounts if currency in {"$", "USD"}]
    return max(usd_like) if usd_like else 0.0


def has_bad_cash_compensation(text: str, title: str, compensation: str) -> bool:
    header = "\n".join(text.splitlines()[:50])
    combined = f"{title}\n{compensation}\n{header}".lower()
    if any(contains_term(combined, term) for term in DEFERRED_PAY_SIGNALS):
        return True
    if not compensation.strip() and not has_cash_amount("\n".join(text.splitlines()[:20])):
        return True
    has_equity_percent = bool(re.search(r"\b\d+(?:\.\d+)?%\b", combined))
    if has_equity_percent and not has_cash_amount(combined):
        return True
    return has_low_cash_compensation(combined, compensation)


def has_stale_posting(candidate: JobLike, text: str) -> bool:
    posted_age_days = getattr(candidate, "posted_age_days", None)
    if posted_age_days is not None:
        return posted_age_days > MAX_POSTED_AGE_DAYS
    header = "\n".join(text.splitlines()[:60])
    match = re.search(r"\b([2-9]|\d{2,})\s+months?\s+ago\b", header)
    return bool(match)


def has_insufficient_detail(candidate: JobLike, text: str) -> bool:
    source = (getattr(candidate, "source", "") or "").lower()
    if source != "wellfound":
        return False
    if len(text) >= 900:
        return False
    return "about the job" not in text and "about the role" not in text


def is_promising_thin_wellfound_detail(candidate: JobLike, title: str, location: str, compensation: str) -> bool:
    source = (getattr(candidate, "source", "") or "").lower()
    if source != "wellfound":
        return False
    posted_age_days = getattr(candidate, "posted_age_days", None)
    if posted_age_days is not None and posted_age_days > MAX_PROMISING_THIN_DETAIL_AGE_DAYS:
        return False
    if posted_age_days is None:
        try:
            job_id = int(str(getattr(candidate, "job_id", "") or "0"))
        except ValueError:
            job_id = 0
        if job_id < MIN_PROMISING_THIN_WELLFOUND_JOB_ID:
            return False
    if max_usd_cash(compensation) < MIN_PROMISING_THIN_DETAIL_USD_MAX:
        return False
    if any(contains_term(title, term) for term in THIN_DETAIL_BAD_TITLE_TERMS):
        return False
    if not any(contains_term(title, term) for term in THIN_DETAIL_RELEVANT_TITLE_TERMS):
        return False
    if has_us_only_remote_signal("", location) or has_strict_onsite_location("", location):
        return False
    if any(term in location for term in THIN_DETAIL_GLOBAL_REMOTE_TERMS):
        return True
    if "remote" in location:
        return True
    return not location.strip()


def has_strict_onsite_location(text: str, location: str) -> bool:
    combined = f"{location}\n{text}".lower()
    if "onsite or remote" in combined or "on-site or remote" in combined:
        return False
    if any(contains_term(combined, term) for term in REMOTE_SIGNALS):
        return False
    if any(contains_term(combined, term) for term in STRICT_ONSITE_SIGNALS):
        return True
    if any(contains_term(combined, term) for term in GENERIC_ONSITE_SIGNALS):
        return True
    return False


def has_us_only_remote_signal(text: str, location: str) -> bool:
    combined = f"{location}\n{text}".lower()
    us_only_patterns = (
        r"\bhires remotely in\s+united states\b",
        r"\bremote only\s*[•,-]?\s*united states\b",
        r"\bremote\s*\(?\s*united states\s*\)?",
        r"\bremote\s*\(\s*us\s*\)",
        r"\bremote\s*\(\s*u\.s\.\s*\)",
        r"\bremote\s*\(\s*usa\s*\)",
        r"\bremote[, ]+us\b",
        r"\bremote[, ]+u\.s\.\b",
        r"\bremote[, ]+usa\b",
        r"\bcandidates? must permanently reside in the us\b",
        r"\bcandidates? must permanently reside in the u\.s\.\b",
        r"\bmust permanently reside in the us\b",
        r"\bmust permanently reside in the u\.s\.\b",
        r"\bmust reside in the us\b",
        r"\bmust reside in the u\.s\.\b",
        r"\bmust be based in the us\b",
        r"\bmust be based in the u\.s\.\b",
        r"\bus citizen/visa only\b",
        r"\bus citizens?/visa only\b",
        r"\bus-only\b",
        r"\bu\.s\.-only\b",
    )
    return any(re.search(pattern, combined) for pattern in us_only_patterns)


def has_us_only_no_visa_signal(text: str, location: str) -> bool:
    combined = f"{location}\n{text}".lower()
    has_us_only = has_us_only_remote_signal(text, location)
    no_visa = bool(
        re.search(
            r"visa\s+sponsorship\s*:?\s*not\s+available"
            r"|sponsorship\s+not\s+available"
            r"|does\s+not\s+sponsor\s+visas"
            r"|we\s+do\s+not\s+sponsor\s+visas"
            r"|no\s+visa\s+sponsorship"
            r"|not\s+able\s+to\s+sponsor",
            combined,
        )
    )
    return has_us_only and no_visa


def heuristic_classify(candidate: JobLike) -> Classification:
    text = trim_page_noise(_candidate_text(candidate))
    title = (candidate.title or "").lower()
    location = (candidate.location or "").lower()
    compensation = (candidate.compensation or "").lower()
    matched: list[str] = []
    categories: list[str] = []
    for category, terms in KEYWORD_INCLUDE.items():
        hits = [term for term in terms if contains_term(text, term)]
        if hits:
            categories.append(category)
            matched.extend(hits[:4])

    rejected = [term for term in HARD_EXCLUDE if contains_term(text, term)]
    if has_unsupported_backend_title(title):
        rejected.append("unsupported backend title")
    if has_strict_unsupported_backend(text):
        rejected.append("unsupported backend without python/node/js backend")
    if has_strict_unsupported_frontend(text, title):
        rejected.append("strict non-react frontend")
    if has_non_engineering_title(title):
        rejected.append("non-product engineering title")
    if has_strict_onsite_location(text, location):
        rejected.append("strict onsite")
    if has_us_only_remote_signal(text, location):
        rejected.append("us-only remote")
    if has_us_only_no_visa_signal(text, location):
        rejected.append("us-only/no visa sponsorship")
    if has_internship_signal(text, title):
        rejected.append("internship")
    if has_cofounder_signal(text, title):
        rejected.append("cofounder")
    if has_bad_cash_compensation(text, title, compensation):
        rejected.append("bad cash compensation")
    if has_stale_posting(candidate, text):
        rejected.append("stale posting")
    if not rejected and has_insufficient_detail(candidate, text):
        rejected.append("insufficient job detail")
    native_mobile_allowed = "react native" in title or "expo" in title
    role_defining_rejected = []
    for term in ROLE_DEFINING_EXCLUDE:
        title_hit = contains_term(title, term)
        text_hit_without_fit = not categories and contains_term(text, term)
        protected_react_native = native_mobile_allowed and term in {"android", "ios", "swift", "kotlin"}
        if (title_hit or text_hit_without_fit) and not protected_react_native:
            role_defining_rejected.append(term)
    rejected.extend(role_defining_rejected)

    if rejected == ["insufficient job detail"] and is_promising_thin_wellfound_detail(
        candidate,
        title,
        location,
        compensation,
    ):
        return Classification(
            status="needs_review",
            category=categories[0] if categories else None,
            fit_score=0.52 if categories else 0.42,
            reason="Needs review: promising Wellfound card, but detail page was blocked or too thin.",
            matched_criteria=matched,
            rejected_criteria=["insufficient job detail"],
        )
    if rejected:
        return Classification(
            status="rejected",
            category=categories[0] if categories else None,
            fit_score=0.15,
            reason="Rejected by explicit exclusion terms: " + ", ".join(rejected[:6]),
            matched_criteria=matched,
            rejected_criteria=rejected,
        )
    if categories:
        score = min(0.9, 0.45 + 0.15 * len(categories) + 0.03 * len(matched))
        return Classification(
            status="accepted",
            category=categories[0],
            fit_score=score,
            reason="Accepted by keyword match for " + ", ".join(categories),
            matched_criteria=matched,
            rejected_criteria=[],
        )
    return Classification(
        status="needs_review",
        category=None,
        fit_score=0.35,
        reason="No strong include or exclude signal found.",
        matched_criteria=[],
        rejected_criteria=[],
    )


async def llm_classify(candidate: JobLike) -> Classification:
    fallback = heuristic_classify(candidate)
    if fallback.status == "rejected":
        return fallback
    if not settings.job_llm_enabled or not settings.groq_api_key:
        return fallback

    payload = {
        "model": settings.groq_model,
        "temperature": 0,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You classify whether a job is a fit for Joel. Return strict JSON only with "
                    "status, category, fit_score, reason, matched_criteria, rejected_criteria. "
                    "status must be accepted, rejected, or needs_review. category must be web, "
                    "mobile, ai, backend, or null."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"{criteria_prompt()}\n\n"
                    "Job candidate:\n"
                    f"Title: {candidate.title}\n"
                    f"Company: {candidate.company_slug}\n"
                    f"Location: {candidate.location}\n"
                    f"Compensation: {candidate.compensation}\n"
                    f"Description: {candidate.text}\n"
                    f"URL: {candidate.job_url}\n"
                ),
            },
        ],
    }
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json=payload,
            )
            response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        return Classification(
            status=str(parsed.get("status") or fallback.status),
            category=parsed.get("category"),
            fit_score=float(parsed.get("fit_score") or fallback.fit_score),
            reason=str(parsed.get("reason") or fallback.reason),
            matched_criteria=list(parsed.get("matched_criteria") or fallback.matched_criteria),
            rejected_criteria=list(parsed.get("rejected_criteria") or fallback.rejected_criteria),
        )
    except Exception as exc:
        return Classification(
            status=fallback.status,
            category=fallback.category,
            fit_score=fallback.fit_score,
            reason=f"{fallback.reason} LLM classification failed: {type(exc).__name__}",
            matched_criteria=fallback.matched_criteria,
            rejected_criteria=fallback.rejected_criteria,
        )


def classified_at_now() -> datetime:
    return datetime.now(UTC)
