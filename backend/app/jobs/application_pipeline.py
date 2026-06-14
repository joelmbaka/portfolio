from __future__ import annotations

import json
import asyncio
import re
from datetime import UTC, datetime, timedelta
from typing import Any

from app.core.config import settings
from app.core.nim import post_nim_chat_completion
from app.jobs.classifier import Classification, heuristic_classify
from app.jobs.criteria import criteria_prompt
from app.jobs.detail_enricher import row_to_candidate


PERSONA = (
    "Joel is a senior software engineer focused on React Native, Expo, React, Next.js, "
    "TypeScript/JavaScript, Python backends, and practical AI/LLM product integrations. "
    "He prefers web/mobile/product engineering roles and avoids native-only iOS/Android, "
    "MLOps, data-science-only, and infrastructure-only work."
)

FOLLOW_UP_GRACE_BUSINESS_DAYS = 3
APPLICATION_AI_TIMEOUT_SECONDS = 30


def utc_now() -> datetime:
    return datetime.now(UTC)


def add_business_days(start: datetime, days: int) -> datetime:
    current = start
    added = 0
    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5:
            added += 1
    return current


def compact_text(value: object, limit: int = 5000) -> str:
    return " ".join(str(value or "").split())[:limit]


def company_name(row: dict[str, Any]) -> str:
    name = str(row.get("employer_name") or row.get("company") or "your team")
    name = re.sub(r"^Www\s+", "", name, flags=re.IGNORECASE)
    name = re.sub(r"\s+Com$", ".com", name, flags=re.IGNORECASE)
    name = re.sub(r"\s+\d+$", "", name).strip()
    return name or "your team"


def clean_employer_summary(row: dict[str, Any], limit: int = 260) -> str:
    company = company_name(row)
    tagline = compact_text(row.get("tagline"), limit)
    if tagline:
        return tagline
    summary = compact_text(row.get("employer_summary"), limit + 300)
    escaped_company = re.escape(company)
    replacements = [
        (r"^About\s+Companies\s+Library\s+Partners\s+Resources\s+Startup Jobs\s+Log in\s+Apply\s*", ""),
        (r"^Companies\s+Library\s+Partners\s+Resources\s+Startup Jobs\s+Log in\s+Apply\s*", ""),
        (r"^Home\s+›\s+Companies\s+›\s*", ""),
        (rf"^{escaped_company}\s+{escaped_company}\s+", ""),
        (rf"^{escaped_company}\s+careers\s+", ""),
        (r"^[a-z0-9.-]+\s+careers\s+", ""),
        (r"^careers\s+", ""),
        (r"\bActively Hiring\b", ""),
        (r"\bJobs\s+View all jobs\b[\s\S]*$", ""),
        (r"\bView all jobs\b[\s\S]*$", ""),
        (r"\b(WINTER|SPRING|SUMMER|FALL)\s+\d{4}\b", ""),
        (r"\bACTIVE\b", ""),
        (r"\b\d+-\d+ Employees\b", ""),
        (r"\bCompany Jobs\s+\d+\b", ""),
        (r"\bNews\b\s+https?://\S+", ""),
    ]
    for pattern, replacement in replacements:
        summary = re.sub(pattern, replacement, summary, flags=re.IGNORECASE)
    return compact_text(summary, limit)


def job_analysis_text(row: dict[str, Any]) -> str:
    return "\n".join(
        str(part)
        for part in [
            row.get("detail_body_excerpt"),
            row.get("detail_description"),
            row.get("text"),
        ]
        if part
    )


def application_id(row: dict[str, Any]) -> str:
    return f"{row.get('source')}:{row.get('job_id')}"


def normalize_fit_score(value: object, fallback: float = 0.0) -> float:
    try:
        score = float(value)
    except (TypeError, ValueError):
        score = fallback
    if score > 1:
        score = score / 10 if score <= 10 else score / 100
    return max(0.0, min(1.0, score))


def normalized_duplicate_part(value: object) -> str:
    return re.sub(r"[^a-z0-9]+", " ", str(value or "").lower()).strip()


def duplicate_key(row: dict[str, Any]) -> tuple[str, str, str]:
    company = row.get("employer_name") or row.get("company") or ""
    title = normalized_duplicate_part(row.get("title"))
    title = title.replace("full stack", "fullstack").replace("front end", "frontend")
    title = title.replace("back end", "backend")
    return (
        normalized_duplicate_part(company),
        title,
        normalized_duplicate_part(row.get("compensation")),
    )


def mark_duplicate_application(row: dict[str, Any]) -> dict[str, Any]:
    rejected = list(row.get("ai_rejected_criteria") or [])
    rejected.append("duplicate role")
    return {
        **row,
        "application_status": "rejected_by_ai",
        "ai_status": "rejected",
        "ai_fit_score": 0.1,
        "ai_reason": "Rejected as a duplicate company/title/compensation role already in the queue.",
        "ai_rejected_criteria": rejected,
        "cover_letter": None,
        "follow_up_email": None,
        "follow_up_status": None,
    }


def fallback_cover_letter(row: dict[str, Any]) -> str:
    company = company_name(row)
    signals = ", ".join(
        str(item)
        for item in [
            *(row.get("ai_matched_criteria") or []),
            *(row.get("matched_criteria") or []),
        ][:3]
    )
    employer_summary = clean_employer_summary(row)
    recognition = (
        f"I came across {company} and liked the work you are doing: {compact_text(employer_summary, 260)}."
        if employer_summary
        else f"I came across {company} and liked the practical product work your team is building."
    )
    impact = (
        f"The role stood out because it connects with {signals}, which is exactly the kind of execution early teams need when turning product momentum into shipped software."
        if signals
        else "The role stood out because it seems close to the kind of practical product execution early teams need when turning product momentum into shipped software."
    )
    return "\n".join(
        [
            f"Hi {company} team,",
            "",
            recognition,
            impact,
            "",
            "I am a Software Engineer focused on React Native, Next.js, TypeScript, Python, and AI-powered product development. I help founders and early-stage teams turn rough ideas into polished mobile and web applications, from MVP architecture to App Store/Play Store launch, backend systems, payments, analytics, and deployment.",
            "",
            f"I have built and shipped products including JournPad, RentPayor, Macsim Cargo, AI Stylist, and CliviQue HMIS. For {company}, I would be useful where you need someone who can understand the product, move quickly, and own delivery across mobile, web, backend APIs, and AI workflows.",
            "",
            "Portfolio: https://joelmbaka.com",
            "I would be happy to talk if you are looking for someone who can move quickly and own delivery from idea to production.",
            "",
            "Best,",
            "Joel",
        ]
    )


def fallback_followup_email(row: dict[str, Any]) -> str:
    company = row.get("employer_name") or row.get("company") or "your team"
    title = row.get("title") or "the role"
    angle = row.get("follow_up_angle") or "I can contribute strong product engineering execution across web, mobile, backend, and AI workflows."
    return (
        f"Subject: Following up on {title}\n\n"
        f"Hi {company} team,\n\n"
        f"I recently applied for {title} and wanted to briefly follow up. {angle}\n\n"
        "I would be glad to share more context on relevant portfolio work and how I can help the team ship faster.\n\n"
        "Best,\nJoel"
    )


async def ai_application_analysis(row: dict[str, Any]) -> tuple[Classification, str, str, bool, str | None]:
    analysis_text = job_analysis_text(row)
    candidate = row_to_candidate(row, analysis_text)
    fallback = heuristic_classify(candidate)
    fallback_cover = fallback_cover_letter(row)
    fallback_followup = fallback_followup_email(row)
    if fallback.status == "rejected":
        return fallback, fallback_cover, fallback_followup, False, "Rejected before AI by deterministic criteria."
    if not settings.job_llm_enabled or not settings.nvidia_nim_api_key:
        return fallback, fallback_cover, fallback_followup, False, "NVIDIA_NIM_API_KEY not configured"

    payload = {
        "temperature": 0.2,
        "max_tokens": 1600,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Analyze a job for Joel and return strict JSON only. Keys: status, category, fit_score, "
                    "reason, matched_criteria, rejected_criteria, cover_letter, follow_up_email. "
                    "status must be accepted, rejected, or needs_review. Be concise and truthful. "
                    "For cover_letter only: lead with the company, its product, users, mission, or impact before introducing Joel. "
                    "Avoid generic praise and use concrete details from the employer summary and job description. "
                    "Then explain why Joel fits: React Native, Next.js, TypeScript, Python, AI product development, full product ownership, App Store/Play Store launch, backend systems, payments, analytics, and deployment. "
                    "Mention proof briefly: JournPad, RentPayor, Macsim Cargo, AI Stylist, and CliviQue HMIS. "
                    "End with Portfolio: https://joelmbaka.com and a soft invitation to talk. "
                    "Do not mention a CV, resume, or attachment."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Persona:\n{PERSONA}\n\n{criteria_prompt()}\n\n"
                    f"Job title: {row.get('title')}\n"
                    f"Company: {row.get('employer_name') or row.get('company')}\n"
                    f"Employer type: {row.get('employer_type')}\n"
                    f"Startup stage: {row.get('startup_stage')}\n"
                    f"Employer summary: {compact_text(row.get('employer_summary'), 900)}\n"
                    f"Job description: {compact_text(analysis_text, 5500)}\n"
                    f"URL: {row.get('job_url')}\n"
                    "Cover letter should be under 220 words and should not mention a CV, resume, or attachment."
                ),
            },
        ],
    }
    try:
        response = await post_nim_chat_completion(payload, timeout=45, max_retries=4)
        content = response.json()["choices"][0]["message"]["content"]
        parsed = json.loads(content)
        fit_score = normalize_fit_score(parsed.get("fit_score"), fallback.fit_score)
        classification = Classification(
            status=str(parsed.get("status") or fallback.status),
            category=parsed.get("category") or fallback.category,
            fit_score=fit_score,
            reason=str(parsed.get("reason") or fallback.reason),
            matched_criteria=list(parsed.get("matched_criteria") or fallback.matched_criteria),
            rejected_criteria=list(parsed.get("rejected_criteria") or fallback.rejected_criteria),
        )
        return (
            classification,
            str(parsed.get("cover_letter") or fallback_cover),
            str(parsed.get("follow_up_email") or fallback_followup),
            True,
            None,
        )
    except Exception as exc:
        return fallback, fallback_cover, fallback_followup, False, f"{type(exc).__name__}: {exc}"


async def prepare_application_record(
    row: dict[str, Any],
    *,
    mark_applied: bool = False,
    mark_followup_sent: bool = False,
    now: datetime | None = None,
) -> dict[str, Any]:
    now = now or utc_now()
    try:
        classification, cover_letter, followup_email, ai_used, ai_error = await asyncio.wait_for(
            ai_application_analysis(row),
            timeout=APPLICATION_AI_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        analysis_text = job_analysis_text(row)
        candidate = row_to_candidate(row, analysis_text)
        classification = heuristic_classify(candidate)
        cover_letter = fallback_cover_letter(row)
        followup_email = fallback_followup_email(row)
        ai_used = False
        ai_error = f"TimeoutError: application AI exceeded {APPLICATION_AI_TIMEOUT_SECONDS}s"
    fits = classification.status == "accepted"
    applied_at = now if mark_applied and fits else None
    follow_up_due_at = add_business_days(applied_at, FOLLOW_UP_GRACE_BUSINESS_DAYS) if applied_at else None
    follow_up_sent_at = now if mark_followup_sent and applied_at else None
    expires_at = applied_at + timedelta(days=30) if applied_at else None
    status = "rejected_by_ai"
    if fits:
        status = "applied" if applied_at else "ready_to_apply"
        if follow_up_sent_at:
            status = "followup_sent"
        if expires_at and now > expires_at:
            status = "expired"
    elif classification.status == "needs_review":
        status = "needs_review"

    return {
        **row,
        "status": classification.status,
        "application_id": application_id(row),
        "application_status": status,
        "ai_used": ai_used,
        "ai_error": ai_error,
        "ai_status": classification.status,
        "ai_category": classification.category,
        "ai_fit_score": classification.fit_score,
        "ai_reason": classification.reason,
        "ai_matched_criteria": classification.matched_criteria,
        "ai_rejected_criteria": classification.rejected_criteria,
        "cv_version": "One",
        "cover_letter": cover_letter if fits else None,
        "follow_up_email": followup_email if fits else None,
        "applied_at": applied_at.isoformat() if applied_at else None,
        "follow_up_due_at": follow_up_due_at.isoformat() if follow_up_due_at else None,
        "follow_up_status": "sent" if follow_up_sent_at else "drafted" if fits else None,
        "follow_up_sent_at": follow_up_sent_at.isoformat() if follow_up_sent_at else None,
        "expires_at": expires_at.isoformat() if expires_at else None,
        "prepared_at": now.isoformat(),
    }
