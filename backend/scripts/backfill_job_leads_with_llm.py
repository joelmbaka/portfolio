from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from sqlalchemy import select

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings
from app.core.database import session_scope
from app.core.nim import post_nim_chat_completion
from app.jobs.classifier import Classification, heuristic_classify
from app.jobs.criteria import criteria_prompt
from app.jobs.job_hunt import JobCandidate, final_score
from app.jobs.models import JobLead


def compact_text(value: object, limit: int = 8000) -> str:
    return " ".join(str(value or "").split())[:limit]


def raw_text(row: JobLead) -> str:
    raw = row.raw or {}
    return "\n".join(
        str(part)
        for part in (
            raw.get("detail_body_excerpt"),
            raw.get("detail_description"),
            raw.get("text"),
            raw.get("employer_summary"),
        )
        if part
    )


def candidate_from_row(row: JobLead) -> JobCandidate:
    raw = row.raw or {}
    return JobCandidate(
        source=str(raw.get("source") or row.source),
        source_detail=str(raw.get("source_detail") or ""),
        job_id=str(raw.get("job_id") or row.job_id),
        job_url=str(raw.get("job_url") or row.job_url or ""),
        title=str(raw.get("title") or row.title or "") or None,
        company=str(raw.get("company") or raw.get("employer_name") or row.company or row.employer_name or "") or None,
        location=str(raw.get("location") or row.location or "") or None,
        compensation=str(raw.get("compensation") or row.compensation or "") or None,
        posted_age=str(raw.get("posted_age") or "") or None,
        posted_age_days=float(raw["posted_age_days"]) if raw.get("posted_age_days") is not None else None,
        posted_at_estimated=str(raw.get("posted_at_estimated") or "") or None,
        posted_age_confidence=str(raw.get("posted_age_confidence") or "") or None,
        text=raw_text(row) or None,
    )


async def classify_with_llm(candidate: JobCandidate, *, model: str) -> Classification:
    fallback = heuristic_classify(candidate)
    if fallback.status == "rejected":
        return fallback
    if not settings.nvidia_nim_api_key:
        raise RuntimeError("NVIDIA_NIM_API_KEY is not configured")

    payload = {
        "model": model,
        "temperature": 0,
        "max_tokens": 700,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You classify whether a job is a fit for Joel. Return strict JSON only with "
                    "status, category, fit_score, reason, matched_criteria, rejected_criteria. "
                    "status must be accepted, rejected, or needs_review. category must be web, "
                    "mobile, ai, backend, or null. Be strict about exclusion criteria."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Joel is a vision-led founder and senior engineer looking for quick cash roles. "
                    "Good fit: React/Next.js/TypeScript/JavaScript, React Native/Expo, Python or JS/Node "
                    "backend, and practical GenAI/LLM product application work. Bad fit: US-only residency, "
                    "no visa sponsorship where US residency is required, MLOps-heavy/data-pipeline/model-platform "
                    "roles, native-only mobile, Vue/Svelte/Angular-only frontend, strict onsite, cofounder/equity-only, "
                    "missing cash, low cash, internships, and sales/solutions/design-only roles.\n\n"
                    f"{criteria_prompt()}\n\n"
                    "Job candidate:\n"
                    f"Source: {candidate.source}\n"
                    f"Title: {candidate.title}\n"
                    f"Company: {candidate.company}\n"
                    f"Location: {candidate.location}\n"
                    f"Compensation: {candidate.compensation}\n"
                    f"Posted age: {candidate.posted_age}\n"
                    f"URL: {candidate.job_url}\n"
                    f"Stored description/text:\n{compact_text(candidate.text, 9000)}\n\n"
                    f"Deterministic fallback: {fallback.status}; {fallback.reason}; "
                    f"matched={fallback.matched_criteria}; rejected={fallback.rejected_criteria}."
                ),
            },
        ],
    }
    response = await post_nim_chat_completion(payload, model=model, timeout=90, max_retries=5)
    content = response.json()["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    try:
        fit_score = float(parsed.get("fit_score", fallback.fit_score))
    except (TypeError, ValueError):
        fit_score = fallback.fit_score
    if fit_score > 1:
        fit_score = fit_score / 10 if fit_score <= 10 else fit_score / 100
    status = str(parsed.get("status") or fallback.status)
    if status not in {"accepted", "rejected", "needs_review"}:
        status = fallback.status
    return Classification(
        status=status,
        category=parsed.get("category") or fallback.category,
        fit_score=max(0.0, min(1.0, fit_score)),
        reason=str(parsed.get("reason") or fallback.reason),
        matched_criteria=list(parsed.get("matched_criteria") or fallback.matched_criteria),
        rejected_criteria=list(parsed.get("rejected_criteria") or fallback.rejected_criteria),
    )


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Backfill DB job leads with NVIDIA NIM classification.")
    parser.add_argument("--apply", action="store_true", help="Persist changes. Without this, dry-run only.")
    parser.add_argument("--limit", type=int, default=20)
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--model", default=settings.nvidia_nim_model)
    parser.add_argument(
        "--statuses",
        default="accepted,needs_review,rejected",
        help="Comma-separated JobLead.status values to include.",
    )
    parser.add_argument(
        "--include-applications",
        action="store_true",
        help="Also classify rows with application_status set. By default they are left alone.",
    )
    parser.add_argument(
        "--only-unbackfilled",
        action="store_true",
        help="Only include rows that do not already have this llm_backfill_model in raw.",
    )
    parser.add_argument("--sleep-ms", type=int, default=400)
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    statuses = [item.strip() for item in args.statuses.split(",") if item.strip()]
    with session_scope() as session:
        query = select(JobLead).where(JobLead.status.in_(statuses)).order_by(JobLead.updated_at.desc(), JobLead.id)
        if not args.include_applications:
            query = query.where(JobLead.application_status.is_(None))
        if args.only_unbackfilled:
            query = query.where(JobLead.raw["llm_backfill_model"].as_string().is_distinct_from(args.model))
        rows = session.scalars(query.offset(max(0, args.offset)).limit(max(0, args.limit))).all()

    results: list[dict[str, Any]] = []
    for index, row in enumerate(rows, start=1):
        candidate = candidate_from_row(row)
        before = {
            "status": row.status,
            "reason": (row.raw or {}).get("reason") or (row.raw or {}).get("ai_reason"),
        }
        try:
            classification = await classify_with_llm(candidate, model=args.model)
            rank_score = final_score(candidate, classification)
            result = {
                "ok": True,
                "source": row.source,
                "job_id": row.job_id,
                "title": row.title,
                "before": before,
                "after": {
                    "status": classification.status,
                    "category": classification.category,
                    "fit_score": classification.fit_score,
                    "rank_score": rank_score,
                    "reason": classification.reason,
                    "matched_criteria": classification.matched_criteria,
                    "rejected_criteria": classification.rejected_criteria,
                },
            }
            if args.apply:
                with session_scope() as session:
                    lead = session.scalar(select(JobLead).where(JobLead.source == row.source, JobLead.job_id == row.job_id))
                    if lead:
                        raw = dict(lead.raw or {})
                        raw.update(
                            {
                                "status": classification.status,
                                "category": classification.category,
                                "fit_score": classification.fit_score,
                                "rank_score": rank_score,
                                "reason": classification.reason,
                                "matched_criteria": classification.matched_criteria,
                                "rejected_criteria": classification.rejected_criteria,
                                "llm_backfilled_at": datetime.now(UTC).isoformat(),
                                "llm_backfill_model": args.model,
                                "llm_backfill_previous_status": before["status"],
                                "llm_backfill_previous_reason": before["reason"],
                            }
                        )
                        lead.status = classification.status
                        lead.ai_fit_score = rank_score
                        lead.raw = raw
            results.append(result)
        except Exception as exc:
            results.append(
                {
                    "ok": False,
                    "source": row.source,
                    "job_id": row.job_id,
                    "title": row.title,
                    "before": before,
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )
        if args.sleep_ms > 0 and index < len(rows):
            await asyncio.sleep(args.sleep_ms / 1000)

    changed = [
        item
        for item in results
        if item.get("ok") and item.get("before", {}).get("status") != item.get("after", {}).get("status")
    ]
    print(
        json.dumps(
            {
                "ok": True,
                "dry_run": not args.apply,
                "model": args.model,
                "count": len(results),
                "changed_count": len(changed),
                "results": results,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    asyncio.run(main())
