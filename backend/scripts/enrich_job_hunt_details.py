from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import UTC, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.jobs.detail_enricher import enrich_rows, split_status
from app.jobs.exporter import write_csv, write_json
from app.jobs.job_hunt import read_export
from app.core.database import session_scope
from app.jobs.models import JobLead
from sqlalchemy import or_, select


def timestamp_slug() -> str:
    return datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Open job detail pages and enrich the job-hunt shortlist.")
    parser.add_argument("--accepted", default="exports/job_hunt/latest.json")
    parser.add_argument("--needs-review", default="exports/job_hunt/latest_needs_review.json")
    parser.add_argument("--out-dir", default="exports/job_hunt/enriched")
    parser.add_argument("--accepted-limit", type=int, default=25)
    parser.add_argument("--review-limit", type=int, default=50)
    parser.add_argument("--total-limit", type=int, default=None)
    parser.add_argument("--include-existing-db", action="store_true")
    parser.add_argument("--cdp-url", default=None)
    parser.add_argument("--pause-ms", type=int, default=1200)
    return parser


SKIPPED_EXISTING_APPLICATION_STATUSES = {
    "ready_to_apply",
    "applied",
    "followup_sent",
    "expired",
    "rejected_by_ai",
}


def existing_job_keys() -> set[tuple[str, str]]:
    try:
        with session_scope() as session:
            return {
                (str(source), str(job_id))
                for source, job_id in session.execute(
                    select(JobLead.source, JobLead.job_id).where(
                        or_(
                            JobLead.application_status.in_(SKIPPED_EXISTING_APPLICATION_STATUSES),
                            JobLead.status == "rejected",
                        )
                    )
                )
            }
    except Exception:
        return set()


async def main() -> None:
    args = make_parser().parse_args()
    started_at = datetime.now(UTC)
    stamp = timestamp_slug()
    accepted_rows = read_export(Path(args.accepted))[: max(0, args.accepted_limit)]
    review_rows = read_export(Path(args.needs_review))[: max(0, args.review_limit)]
    input_rows = accepted_rows + review_rows
    candidate_count = len(input_rows)
    skipped_existing_count = 0
    if not args.include_existing_db:
        existing = existing_job_keys()
        before = len(input_rows)
        input_rows = [
            row
            for row in input_rows
            if (str(row.get("source")), str(row.get("job_id"))) not in existing
        ]
        skipped_existing_count = before - len(input_rows)
    eligible_count = len(input_rows)
    if args.total_limit is not None:
        input_rows = input_rows[: max(0, args.total_limit)]

    rows = await enrich_rows(input_rows, cdp_url=args.cdp_url, pause_ms=args.pause_ms)
    accepted, needs_review, rejected = split_status(rows)

    out_dir = Path(args.out_dir)
    all_json = out_dir / f"enriched_job_hunt_{stamp}.json"
    all_csv = out_dir / f"enriched_job_hunt_{stamp}.csv"
    accepted_json = out_dir / "latest.json"
    accepted_csv = out_dir / "latest.csv"
    review_json = out_dir / "latest_needs_review.json"
    review_csv = out_dir / "latest_needs_review.csv"
    rejected_json = out_dir / "latest_rejected.json"

    write_json(all_json, rows)
    write_csv(all_csv, rows)
    write_json(accepted_json, accepted)
    write_csv(accepted_csv, accepted)
    write_json(review_json, needs_review)
    write_csv(review_csv, needs_review)
    write_json(rejected_json, rejected)

    finished_at = datetime.now(UTC)
    print(
        json.dumps(
            {
                "ok": True,
                "started_at": started_at.isoformat(),
                "finished_at": finished_at.isoformat(),
                "candidate_count": candidate_count,
                "eligible_count": eligible_count,
                "input_count": len(input_rows),
                "skipped_existing_count": skipped_existing_count,
                "accepted_count": len(accepted),
                "needs_review_count": len(needs_review),
                "rejected_count": len(rejected),
                "failed_enrichments": sum(1 for row in rows if not row.get("enriched_ok")),
                "json": str(all_json),
                "csv": str(all_csv),
                "latest_json": str(accepted_json),
                "latest_csv": str(accepted_csv),
                "latest_needs_review_json": str(review_json),
                "latest_needs_review_csv": str(review_csv),
                "latest_rejected_json": str(rejected_json),
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
