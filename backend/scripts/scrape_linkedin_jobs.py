from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.jobs.exporter import write_csv, write_json
from app.jobs.linkedin_scraper import SEARCH_QUERIES, scrape_linkedin_searches


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scrape LinkedIn job search pages to JSON or CSV.")
    parser.add_argument("--out", default="exports/linkedin_jobs.json")
    parser.add_argument("--format", choices=("json", "csv"), default="json")
    parser.add_argument("--cdp-url", default=None)
    parser.add_argument("--oldest-days", type=int, default=None)
    parser.add_argument("--max-stale-scrolls", type=int, default=None)
    parser.add_argument("--scroll-pause-ms", type=int, default=None)
    parser.add_argument(
        "--query",
        action="append",
        choices=sorted(SEARCH_QUERIES),
        help="Search key to scrape. Repeatable. Defaults to all LinkedIn searches.",
    )
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    selected = {key: SEARCH_QUERIES[key] for key in (args.query or SEARCH_QUERIES.keys())}
    jobs = await scrape_linkedin_searches(
        selected,
        cdp_url=args.cdp_url,
        oldest_days=args.oldest_days,
        max_stale_scrolls=args.max_stale_scrolls,
        scroll_pause_ms=args.scroll_pause_ms,
    )
    rows = [job.to_dict() for job in jobs]
    out_path = Path(args.out)
    if args.format == "csv":
        write_csv(out_path, rows)
    else:
        write_json(out_path, rows)
    print(json.dumps({"count": len(rows), "out": str(out_path), "queries": sorted(selected)}, indent=2))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"{type(exc).__name__}: {exc}"}, indent=2), file=sys.stderr)
        raise SystemExit(2)
