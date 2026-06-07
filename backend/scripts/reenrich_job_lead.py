from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import select

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings
from app.core.database import session_scope
from app.jobs.application_pipeline import prepare_application_record
from app.jobs.detail_enricher import BLOCKED_DETAIL_STATUS, enrich_rows
from app.jobs.models import JobLead


def parse_dt(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def preserve_lifecycle(previous: dict[str, Any], updated: dict[str, Any]) -> dict[str, Any]:
    previous_status = str(previous.get("application_status") or "")
    updated_status = str(updated.get("application_status") or "")
    if previous_status not in {"applied", "followup_sent", "expired"}:
        return updated
    if updated_status not in {"ready_to_apply", "applied", "followup_sent"}:
        return updated

    preserved = dict(updated)
    for key in (
        "application_status",
        "applied_at",
        "follow_up_due_at",
        "follow_up_status",
        "follow_up_sent_at",
        "expires_at",
        "expired_at",
    ):
        if previous.get(key) is not None:
            preserved[key] = previous.get(key)
    return preserved


def apply_to_model(lead: JobLead, row: dict[str, Any]) -> None:
    lead.application_id = row.get("application_id") or f"{lead.source}:{lead.job_id}"
    lead.status = row.get("status")
    lead.application_status = row.get("application_status")
    lead.title = row.get("title")
    lead.company = row.get("company") or row.get("employer_name")
    lead.location = row.get("location")
    lead.compensation = row.get("compensation")
    lead.job_url = row.get("job_url")
    lead.apply_url = row.get("apply_url")
    lead.employer_name = row.get("employer_name") or row.get("company")
    lead.employer_type = row.get("employer_type")
    lead.ai_fit_score = row.get("ai_fit_score") or row.get("rank_score") or row.get("fit_score")
    lead.cover_letter = row.get("cover_letter")
    lead.follow_up_email = row.get("follow_up_email")
    lead.follow_up_status = row.get("follow_up_status")
    lead.applied_at = parse_dt(row.get("applied_at"))
    lead.follow_up_due_at = parse_dt(row.get("follow_up_due_at"))
    lead.follow_up_sent_at = parse_dt(row.get("follow_up_sent_at"))
    lead.expires_at = parse_dt(row.get("expires_at"))
    lead.raw = row


def mark_lead_blocked(lead: JobLead, row: dict[str, Any]) -> None:
    lead.status = BLOCKED_DETAIL_STATUS
    lead.application_status = BLOCKED_DETAIL_STATUS
    lead.ai_fit_score = None
    lead.raw = {
        **dict(lead.raw or {}),
        **row,
        "application_status": BLOCKED_DETAIL_STATUS,
        "ai_status": BLOCKED_DETAIL_STATUS,
        "ai_reason": row.get("reason"),
    }


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Re-enrich one job lead from the DB.")
    parser.add_argument("--source", required=True)
    parser.add_argument("--job-id", required=True)
    parser.add_argument("--cdp-url", default=None)
    parser.add_argument("--pause-ms", type=int, default=1200)
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    started_at = datetime.now().astimezone()
    with session_scope() as session:
        lead = session.scalar(
            select(JobLead).where(JobLead.source == args.source, JobLead.job_id == args.job_id)
        )
        if not lead:
            print(json.dumps({"ok": False, "error": "job lead not found"}, indent=2), file=sys.stderr)
            raise SystemExit(1)
        previous = dict(lead.raw or {})

    cdp_url = args.cdp_url or settings.wellfound_cdp_url or settings.linkedin_cdp_url
    enriched_rows = await enrich_rows([previous], cdp_url=cdp_url, pause_ms=args.pause_ms)
    enriched = enriched_rows[0]
    if enriched.get("status") == BLOCKED_DETAIL_STATUS:
        with session_scope() as session:
            lead = session.scalar(
                select(JobLead).where(JobLead.source == args.source, JobLead.job_id == args.job_id)
            )
            if not lead:
                print(json.dumps({"ok": False, "error": "job lead disappeared"}, indent=2), file=sys.stderr)
                raise SystemExit(1)
            mark_lead_blocked(lead, enriched)
        print(
            json.dumps(
                {
                    "ok": True,
                    "blocked": 1,
                    "started_at": started_at.isoformat(),
                    "finished_at": datetime.now().astimezone().isoformat(),
                    "source": args.source,
                    "job_id": args.job_id,
                    "reason": enriched.get("reason"),
                    "error": enriched.get("enriched_error"),
                },
                indent=2,
            )
        )
        return
    prepared = await prepare_application_record(enriched)
    updated = preserve_lifecycle(previous, prepared)
    updated["reenriched_at"] = datetime.now().astimezone().isoformat()
    updated["reenriched_from_status"] = previous.get("application_status") or previous.get("status")

    with session_scope() as session:
        lead = session.scalar(
            select(JobLead).where(JobLead.source == args.source, JobLead.job_id == args.job_id)
        )
        if not lead:
            print(json.dumps({"ok": False, "error": "job lead disappeared"}, indent=2), file=sys.stderr)
            raise SystemExit(1)
        apply_to_model(lead, updated)

    finished_at = datetime.now().astimezone()
    print(
        json.dumps(
            {
                "ok": True,
                "started_at": started_at.isoformat(),
                "finished_at": finished_at.isoformat(),
                "application": updated,
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
