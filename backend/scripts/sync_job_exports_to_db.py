from __future__ import annotations

import json
import argparse
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select, func, tuple_

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.database import session_scope
from app.jobs.models import JobLead
from app.jobs.suppression import SUPPRESSED_JOB_KEYS


PROCESSED_EXPORTS = [
    ("accepted", Path("exports/job_hunt/enriched/latest.json")),
    ("review", Path("exports/job_hunt/enriched/latest_needs_review.json")),
    ("rejected", Path("exports/job_hunt/enriched/latest_rejected.json")),
    ("applications", Path("exports/applications/latest.json")),
]

RAW_EXPORTS = [
    ("raw_accepted", Path("exports/job_hunt/latest.json")),
    ("raw_review", Path("exports/job_hunt/latest_needs_review.json")),
    ("raw_rejected", Path("exports/job_hunt/latest_rejected.json")),
]


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Sync processed job discovery exports into the CRM database.")
    parser.add_argument(
        "--include-raw",
        action="store_true",
        help="Also persist raw shortlist/rejection exports. Off by default to keep CRM focused.",
    )
    return parser


def parse_dt(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def read_rows(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows = json.loads(path.read_text(encoding="utf-8") or "[]")
    return [row for row in rows if isinstance(row, dict)]


def source_for(row: dict[str, Any]) -> str:
    return str(row.get("source") or row.get("source_role") or "unknown")


def values_for(row: dict[str, Any], bucket: str) -> dict[str, Any]:
    source = source_for(row)
    job_id = str(row.get("job_id") or row.get("job_url") or row.get("title") or "")
    if not job_id:
        raise ValueError("row has no job_id/job_url/title")
    raw = {**row, "sync_bucket": bucket}
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
        "raw": raw,
    }


def priority(bucket: str) -> int:
    return {
        "raw_rejected": 10,
        "raw_review": 20,
        "raw_accepted": 30,
        "rejected": 60,
        "review": 70,
        "accepted": 80,
        "applications": 100,
    }[bucket]


PRESERVED_APPLICATION_STATUSES = {
    "ready_to_apply",
    "applied",
    "followup_sent",
    "expired",
    "rejected_by_ai",
}


def preserve_existing_lifecycle(value: dict[str, Any], existing: JobLead | None) -> dict[str, Any]:
    if not existing or value["raw"].get("sync_bucket") == "applications":
        return value
    if existing.application_status not in PRESERVED_APPLICATION_STATUSES:
        return value

    preserved = dict(value)
    existing_raw = dict(existing.raw or {})
    incoming_raw = dict(value.get("raw") or {})
    incoming_raw.update(
        {
            "sync_preserved_existing_application": True,
            "sync_attempted_status": value.get("status"),
            "sync_attempted_application_status": value.get("application_status"),
        }
    )
    for key in (
        "application_id",
        "status",
        "application_status",
        "title",
        "company",
        "location",
        "compensation",
        "job_url",
        "apply_url",
        "employer_name",
        "employer_type",
        "ai_fit_score",
        "cover_letter",
        "follow_up_email",
        "follow_up_status",
        "applied_at",
        "follow_up_due_at",
        "follow_up_sent_at",
        "expires_at",
    ):
        preserved[key] = getattr(existing, key)
    for key in (
        "ai_status",
        "ai_reason",
        "ai_fit_score",
        "ai_matched_criteria",
        "ai_rejected_criteria",
        "manual_audited_at",
        "manual_audit_source",
    ):
        if key in existing_raw:
            incoming_raw[key] = existing_raw[key]
    for key, existing_value in existing_raw.items():
        if key not in incoming_raw or existing_value is not None:
            incoming_raw[key] = existing_value
    preserved["raw"] = incoming_raw
    return preserved


def main() -> None:
    args = make_parser().parse_args()
    by_key: dict[tuple[str, str], tuple[int, dict[str, Any]]] = {}
    exports = PROCESSED_EXPORTS + (RAW_EXPORTS if args.include_raw else [])
    for bucket, path in exports:
        for row in read_rows(path):
            try:
                values = values_for(row, bucket)
            except ValueError:
                continue
            key = (values["source"], values["job_id"])
            if key in SUPPRESSED_JOB_KEYS:
                continue
            rank = priority(bucket)
            if key not in by_key or rank >= by_key[key][0]:
                by_key[key] = (rank, values)

    values = [item[1] for item in by_key.values()]
    with session_scope() as session:
        keys = [(value["source"], value["job_id"]) for value in values]
        existing_by_key: dict[tuple[str, str], JobLead] = {}
        if keys:
            existing_rows = session.scalars(
                select(JobLead).where(tuple_(JobLead.source, JobLead.job_id).in_(keys))
            )
            existing_by_key = {(row.source, row.job_id): row for row in existing_rows}
        for index, value in enumerate(values, start=1):
            existing = existing_by_key.get((value["source"], value["job_id"]))
            value = preserve_existing_lifecycle(value, existing)
            stmt = insert(JobLead).values(**value)
            excluded = stmt.excluded
            update_values = {key: getattr(excluded, key) for key in value if key not in {"source", "job_id"}}
            stmt = stmt.on_conflict_do_update(
                constraint="uq_job_leads_source_job_id",
                set_=update_values,
            )
            session.execute(stmt)
            if index % 50 == 0:
                session.commit()
                print(f"sync_job_exports_to_db: upserted {index}/{len(values)}", file=sys.stderr, flush=True)
        total = session.scalar(select(func.count()).select_from(JobLead))
    print(json.dumps({"ok": True, "upserted": len(values), "total": total}, indent=2))


if __name__ == "__main__":
    main()
