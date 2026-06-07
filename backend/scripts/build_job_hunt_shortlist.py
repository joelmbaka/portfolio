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

from app.jobs.exporter import write_csv, write_json
from app.jobs.job_hunt import classify_candidates, load_candidates


def timestamp_slug() -> str:
    return datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Build a ranked job-hunt shortlist from scraped job exports.")
    parser.add_argument("--wellfound", default="exports/wellfound/latest.json")
    parser.add_argument("--yc", default="exports/yc/latest.json")
    parser.add_argument("--linkedin", default=None, help="Optional LinkedIn export path. Off by default.")
    parser.add_argument("--out-dir", default="exports/job_hunt")
    parser.add_argument("--llm", action="store_true", help="Use Groq classification when GROQ_API_KEY is configured.")
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    started_at = datetime.now(UTC)
    stamp = timestamp_slug()
    candidates = load_candidates(
        Path(args.wellfound),
        yc_path=Path(args.yc) if args.yc else None,
        linkedin_path=Path(args.linkedin) if args.linkedin else None,
    )
    rows = await classify_candidates(candidates, use_llm=args.llm)

    accepted = [row for row in rows if row["status"] == "accepted"]
    needs_review = [row for row in rows if row["status"] == "needs_review"]
    rejected = [row for row in rows if row["status"] == "rejected"]

    out_dir = Path(args.out_dir)
    latest_json = out_dir / "latest.json"
    latest_csv = out_dir / "latest.csv"
    json_path = out_dir / f"job_hunt_shortlist_{stamp}.json"
    csv_path = out_dir / f"job_hunt_shortlist_{stamp}.csv"
    review_json = out_dir / f"job_hunt_review_{stamp}.json"
    review_csv = out_dir / f"job_hunt_review_{stamp}.csv"

    shortlist = accepted
    write_json(json_path, shortlist)
    write_csv(csv_path, shortlist)
    write_json(latest_json, shortlist)
    write_csv(latest_csv, shortlist)
    write_json(review_json, needs_review)
    write_csv(review_csv, needs_review)
    write_json(out_dir / "latest_needs_review.json", needs_review)
    write_csv(out_dir / "latest_needs_review.csv", needs_review)
    write_json(out_dir / "latest_rejected.json", rejected)

    finished_at = datetime.now(UTC)
    print(
        json.dumps(
            {
                "ok": True,
                "started_at": started_at.isoformat(),
                "finished_at": finished_at.isoformat(),
                "raw_count": len(candidates),
                "shortlist_count": len(shortlist),
                "accepted_count": len(accepted),
                "needs_review_count": len(needs_review),
                "rejected_count": len(rejected),
                "json": str(json_path),
                "csv": str(csv_path),
                "latest_json": str(latest_json),
                "latest_csv": str(latest_csv),
                "review_json": str(review_json),
                "review_csv": str(review_csv),
                "latest_needs_review_json": str(out_dir / "latest_needs_review.json"),
                "latest_needs_review_csv": str(out_dir / "latest_needs_review.csv"),
                "latest_rejected_json": str(out_dir / "latest_rejected.json"),
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
