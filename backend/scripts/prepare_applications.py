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

from app.jobs.application_pipeline import duplicate_key, mark_duplicate_application, prepare_application_record
from app.jobs.exporter import write_csv, write_json
from app.jobs.job_hunt import read_export


def timestamp_slug() -> str:
    return datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Analyze enriched jobs and prepare CRM application records.")
    parser.add_argument("--accepted", default="exports/job_hunt/enriched/latest.json")
    parser.add_argument("--review", default="exports/job_hunt/enriched/latest_needs_review.json")
    parser.add_argument("--out-dir", default="exports/applications")
    parser.add_argument("--accepted-offset", type=int, default=0)
    parser.add_argument("--accepted-limit", type=int, default=50)
    parser.add_argument("--review-offset", type=int, default=0)
    parser.add_argument("--review-limit", type=int, default=20)
    parser.add_argument("--pause-ms", type=int, default=2500, help="Pause between AI analyses to avoid rate limits.")
    parser.add_argument("--include-review", action="store_true")
    parser.add_argument("--mark-applied", action="store_true", help="Mark fitting jobs as applied. Use only after actually applying.")
    parser.add_argument(
        "--mark-followup-sent",
        action="store_true",
        help="Mark follow-up as sent. Use only after actually sending.",
    )
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    stamp = timestamp_slug()
    accepted_rows = read_export(Path(args.accepted))
    review_rows = read_export(Path(args.review)) if args.include_review else []
    accepted = accepted_rows[max(0, args.accepted_offset) : max(0, args.accepted_offset) + max(0, args.accepted_limit)]
    review = review_rows[max(0, args.review_offset) : max(0, args.review_offset) + max(0, args.review_limit)]
    input_rows = accepted + review
    now = datetime.now(UTC)
    records = []
    for index, row in enumerate(input_rows):
        records.append(
            await prepare_application_record(
                row,
                mark_applied=args.mark_applied,
                mark_followup_sent=args.mark_followup_sent,
                now=now,
            )
        )
        print(f"prepare_applications: processed {index + 1}/{len(input_rows)}", file=sys.stderr, flush=True)
        if args.pause_ms > 0 and index < len(input_rows) - 1:
            await asyncio.sleep(args.pause_ms / 1000)

    seen_ready: set[tuple[str, str, str]] = set()
    deduped_records = []
    for row in records:
        if row["application_status"] not in {"ready_to_apply", "applied", "followup_sent"}:
            deduped_records.append(row)
            continue
        key = duplicate_key(row)
        if all(key) and key in seen_ready:
            deduped_records.append(mark_duplicate_application(row))
            continue
        if all(key):
            seen_ready.add(key)
        deduped_records.append(row)
    records = deduped_records

    records.sort(
        key=lambda row: (
            0 if row["application_status"] in {"ready_to_apply", "applied", "followup_sent"} else 1,
            -float(row.get("ai_fit_score") or 0),
            -float(row.get("employer_priority_score") or 0),
            str(row.get("title") or ""),
        )
    )

    out_dir = Path(args.out_dir)
    json_path = out_dir / f"applications_{stamp}.json"
    csv_path = out_dir / f"applications_{stamp}.csv"
    latest_json = out_dir / "latest.json"
    latest_csv = out_dir / "latest.csv"
    write_json(json_path, records)
    write_csv(csv_path, records)
    write_json(latest_json, records)
    write_csv(latest_csv, records)

    print(
        json.dumps(
            {
                "ok": True,
                "input_count": len(input_rows),
                "accepted_offset": args.accepted_offset,
                "review_offset": args.review_offset,
                "ready_to_apply": sum(1 for row in records if row["application_status"] == "ready_to_apply"),
                "applied": sum(1 for row in records if row["application_status"] == "applied"),
                "followup_sent": sum(1 for row in records if row["application_status"] == "followup_sent"),
                "needs_review": sum(1 for row in records if row["application_status"] == "needs_review"),
                "rejected_by_ai": sum(1 for row in records if row["application_status"] == "rejected_by_ai"),
                "ai_used": sum(1 for row in records if row.get("ai_used")),
                "ai_missing_or_failed": sum(1 for row in records if not row.get("ai_used")),
                "json": str(json_path),
                "csv": str(csv_path),
                "latest_json": str(latest_json),
                "latest_csv": str(latest_csv),
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
