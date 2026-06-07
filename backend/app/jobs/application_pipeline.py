from __future__ import annotations

import json
import asyncio
import re
from datetime import UTC, datetime, timedelta
from typing import Any

import httpx

from app.core.config import settings
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
    company = row.get("employer_name") or row.get("company") or "your team"
    title = row.get("title") or "this role"
    signals = ", ".join(str(item) for item in (row.get("matched_criteria") or [])[:5])
    employer_summary = row.get("employer_summary") or ""
    return (
        f"Hi {company} team,\n\n"
        f"I am interested in the {title} role. My background is strongest in React Native, "
        f"React/Next.js, TypeScript, Python-backed product systems, and practical AI integrations. "
        f"The role stood out because it aligns with {signals or 'product engineering ownership'}.\n\n"
        f"I would bring hands-on execution across mobile, web, backend APIs, and AI-powered workflows. "
        f"{'I also like the company focus: ' + compact_text(employer_summary, 220) if employer_summary else ''}\n\n"
        "Best,\nJoel"
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


async def post_groq_with_retries(payload: dict[str, Any], *, max_retries: int = 4) -> httpx.Response:
    retryable_statuses = {408, 409, 425, 429, 500, 502, 503, 504}
    async with httpx.AsyncClient(timeout=45) as client:
        for attempt in range(max_retries + 1):
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json=payload,
            )
            if response.status_code not in retryable_statuses or attempt == max_retries:
                response.raise_for_status()
                return response
            retry_after = response.headers.get("retry-after")
            try:
                delay = float(retry_after) if retry_after else 0
            except ValueError:
                delay = 0
            if delay <= 0:
                delay = min(60, 2 ** attempt * 6)
            await asyncio.sleep(delay)
    raise RuntimeError("Groq request failed without returning a response")


async def ai_application_analysis(row: dict[str, Any]) -> tuple[Classification, str, str, bool, str | None]:
    analysis_text = job_analysis_text(row)
    candidate = row_to_candidate(row, analysis_text)
    fallback = heuristic_classify(candidate)
    fallback_cover = fallback_cover_letter(row)
    fallback_followup = fallback_followup_email(row)
    if fallback.status == "rejected":
        return fallback, fallback_cover, fallback_followup, False, "Rejected before AI by deterministic criteria."
    if not settings.job_llm_enabled or not settings.groq_api_key:
        return fallback, fallback_cover, fallback_followup, False, "GROQ_API_KEY not configured"

    payload = {
        "model": settings.groq_model,
        "temperature": 0.2,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Analyze a job for Joel and return strict JSON only. Keys: status, category, fit_score, "
                    "reason, matched_criteria, rejected_criteria, cover_letter, follow_up_email. "
                    "status must be accepted, rejected, or needs_review. Be concise and truthful."
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
                    "CV version is always named One."
                ),
            },
        ],
    }
    try:
        response = await post_groq_with_retries(payload)
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
