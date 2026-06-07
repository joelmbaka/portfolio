from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from sqlalchemy import nulls_last, select
from sqlalchemy.dialects.postgresql import insert

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings
from app.core.database import session_scope
from app.jobs.application_pipeline import prepare_application_record
from app.jobs.detail_enricher import BLOCKED_DETAIL_STATUS, enrich_rows
from app.jobs.classifier import heuristic_classify
from app.jobs.job_hunt import JobCandidate, final_score
from app.jobs.models import JobLead, ScrapedJob


def parse_dt(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def row_from_scraped(job: ScrapedJob) -> dict[str, Any]:
    raw = dict(job.raw or {})
    return {
        **raw,
        "source": job.source,
        "source_detail": job.source_detail,
        "source_role": job.source_detail,
        "job_id": job.job_id,
        "title": job.title,
        "company": job.company,
        "company_slug": raw.get("company_slug") or job.company,
        "location": job.location,
        "compensation": job.compensation,
        "job_url": job.job_url,
        "company_url": job.company_url,
        "posted_age": job.posted_age,
        "posted_age_days": job.posted_age_days,
        "posted_at_estimated": job.posted_at_estimated,
        "posted_age_confidence": job.posted_age_confidence,
    }


def candidate_from_scraped(job: ScrapedJob) -> JobCandidate:
    return JobCandidate(
        source=job.source,
        source_detail=job.source_detail,
        job_id=job.job_id,
        job_url=job.job_url or "",
        title=job.title,
        company=job.company,
        location=job.location,
        compensation=job.compensation,
        posted_age=job.posted_age,
        posted_age_days=job.posted_age_days,
        posted_at_estimated=job.posted_at_estimated,
        posted_age_confidence=job.posted_age_confidence,
        text=str((job.raw or {}).get("text") or ""),
    )


def pre_enrichment_priority(job: ScrapedJob) -> tuple[int, float, float, float, int]:
    candidate = candidate_from_scraped(job)
    classification = heuristic_classify(candidate)
    status_rank = {"accepted": 0, "needs_review": 1, "rejected": 2}.get(classification.status, 3)
    age = job.posted_age_days if job.posted_age_days is not None else 999999.0
    cash_bonus = 1.0 if job.compensation else 0.0
    return (
        status_rank,
        -final_score(candidate, classification),
        age,
        -cash_bonus,
        job.id,
    )


def values_for_lead(row: dict[str, Any]) -> dict[str, Any]:
    source = str(row.get("source") or "unknown")
    job_id = str(row.get("job_id") or row.get("job_url") or row.get("title") or "")
    if not job_id:
        raise ValueError("processed row has no job id")
    return {
        "source": source,
        "job_id": job_id,
        "application_id": row.get("application_id") or f"{source}:{job_id}",
        "status": row.get("status"),
        "application_status": row.get("application_status"),
        "title": row.get("title"),
        "company": row.get("company") or row.get("employer_name"),
        "location": row.get("location"),
        "compensation": row.get("compensation"),
        "job_url": row.get("job_url"),
        "apply_url": row.get("apply_url"),
        "employer_name": row.get("employer_name") or row.get("company"),
        "employer_type": row.get("employer_type"),
        "ai_fit_score": row.get("ai_fit_score") or row.get("rank_score") or row.get("fit_score"),
        "cover_letter": row.get("cover_letter"),
        "follow_up_email": row.get("follow_up_email"),
        "follow_up_status": row.get("follow_up_status"),
        "applied_at": parse_dt(row.get("applied_at")),
        "follow_up_due_at": parse_dt(row.get("follow_up_due_at")),
        "follow_up_sent_at": parse_dt(row.get("follow_up_sent_at")),
        "expires_at": parse_dt(row.get("expires_at")),
        "raw": row,
    }


def upsert_lead(row: dict[str, Any]) -> None:
    value = values_for_lead(row)
    with session_scope() as session:
        stmt = insert(JobLead).values(**value)
        excluded = stmt.excluded
        update_values = {key: getattr(excluded, key) for key in value if key not in {"source", "job_id"}}
        stmt = stmt.on_conflict_do_update(
            constraint="uq_job_leads_source_job_id",
            set_=update_values,
        )
        session.execute(stmt)


def pick_next_job(source: str | None = None) -> ScrapedJob | None:
    with session_scope() as session:
        query = select(ScrapedJob).where(ScrapedJob.processed_at.is_(None))
        if source:
            query = query.where(ScrapedJob.source == source)
        query = query.order_by(
            nulls_last(ScrapedJob.posted_age_days.asc()),
            ScrapedJob.last_seen_at.desc(),
            ScrapedJob.id.asc(),
        ).limit(200)
        jobs = list(session.scalars(query))
        if not jobs:
            return None
        job = sorted(jobs, key=pre_enrichment_priority)[0]
        session.expunge(job)
        return job


def mark_processed(job: ScrapedJob, processed_row: dict[str, Any]) -> None:
    now = datetime.now(UTC)
    with session_scope() as session:
        stored = session.scalar(select(ScrapedJob).where(ScrapedJob.source == job.source, ScrapedJob.job_id == job.job_id))
        if not stored:
            return
        raw = dict(stored.raw or {})
        raw.update(
            {
                "processed_at": now.isoformat(),
                "processed_status": processed_row.get("status"),
                "processed_application_status": processed_row.get("application_status"),
                "processed_reason": processed_row.get("ai_reason") or processed_row.get("reason"),
            }
        )
        stored.raw = raw
        stored.processed_at = now


def mark_blocked_detail(job: ScrapedJob, blocked_row: dict[str, Any]) -> None:
    now = datetime.now(UTC)
    with session_scope() as session:
        stored = session.scalar(select(ScrapedJob).where(ScrapedJob.source == job.source, ScrapedJob.job_id == job.job_id))
        if not stored:
            return
        raw = dict(stored.raw or {})
        raw.update(
            {
                "processed_at": now.isoformat(),
                "processed_status": BLOCKED_DETAIL_STATUS,
                "processed_application_status": BLOCKED_DETAIL_STATUS,
                "processed_reason": blocked_row.get("reason"),
                "processed_error": blocked_row.get("enriched_error"),
            }
        )
        stored.raw = raw
        stored.processed_at = now


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Enrich exactly one unprocessed scraped job into the CRM.")
    parser.add_argument("--source", choices=["yc", "wellfound"], default=None)
    parser.add_argument("--cdp-url", default=None)
    parser.add_argument("--pause-ms", type=int, default=1200)
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    started_at = datetime.now(UTC)
    job = pick_next_job(args.source)
    if not job:
        print(json.dumps({"ok": True, "processed": 0, "reason": "no unprocessed scraped jobs"}, indent=2))
        return

    base_row = row_from_scraped(job)
    cdp_url = args.cdp_url or settings.wellfound_cdp_url or settings.linkedin_cdp_url
    enriched = (await enrich_rows([base_row], cdp_url=cdp_url, pause_ms=args.pause_ms))[0]
    if enriched.get("status") == BLOCKED_DETAIL_STATUS:
        mark_blocked_detail(job, enriched)
        print(
            json.dumps(
                {
                    "ok": True,
                    "processed": 0,
                    "blocked": 1,
                    "started_at": started_at.isoformat(),
                    "finished_at": datetime.now(UTC).isoformat(),
                    "source": job.source,
                    "job_id": job.job_id,
                    "title": enriched.get("title"),
                    "reason": enriched.get("reason"),
                    "error": enriched.get("enriched_error"),
                },
                indent=2,
            )
        )
        return
    if enriched.get("status") == "accepted":
        processed = await prepare_application_record(enriched)
    else:
        processed = {
            **enriched,
            "application_id": f"{enriched.get('source')}:{enriched.get('job_id')}",
            "application_status": "needs_review" if enriched.get("status") == "needs_review" else "rejected_by_ai",
            "ai_status": enriched.get("status"),
            "ai_fit_score": enriched.get("fit_score"),
            "ai_reason": enriched.get("reason"),
            "ai_matched_criteria": enriched.get("matched_criteria") or [],
            "ai_rejected_criteria": enriched.get("rejected_criteria") or [],
            "cover_letter": None,
            "follow_up_email": None,
            "follow_up_status": None,
            "prepared_at": datetime.now(UTC).isoformat(),
        }
    processed["scraped_job_id"] = job.id
    processed["processed_from_scraped_at"] = datetime.now(UTC).isoformat()
    upsert_lead(processed)
    mark_processed(job, processed)

    print(
        json.dumps(
            {
                "ok": True,
                "processed": 1,
                "started_at": started_at.isoformat(),
                "finished_at": datetime.now(UTC).isoformat(),
                "source": job.source,
                "job_id": job.job_id,
                "title": processed.get("title"),
                "company": processed.get("employer_name") or processed.get("company"),
                "status": processed.get("status"),
                "application_status": processed.get("application_status"),
                "fit_score": processed.get("ai_fit_score") or processed.get("fit_score"),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"{type(exc).__name__}: {exc}"}, indent=2), file=sys.stderr)
        raise SystemExit(2)
