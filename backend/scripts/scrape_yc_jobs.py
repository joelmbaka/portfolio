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
from app.jobs.yc_scraper import ROLE_URLS, scrape_yc_roles


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Scrape YC startup job role pages to JSON or CSV.")
    parser.add_argument("--out", default="exports/yc_jobs.json")
    parser.add_argument("--format", choices=("json", "csv"), default="json")
    parser.add_argument("--max-stale-scrolls", type=int, default=None)
    parser.add_argument("--scroll-pause-ms", type=int, default=None)
    parser.add_argument(
        "--role",
        action="append",
        choices=sorted(ROLE_URLS),
        help="Role key to scrape. Repeatable. Defaults to all YC role pages.",
    )
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    selected = {key: ROLE_URLS[key] for key in (args.role or ROLE_URLS.keys())}
    jobs = await scrape_yc_roles(
        selected,
        max_stale_scrolls=args.max_stale_scrolls,
        scroll_pause_ms=args.scroll_pause_ms,
    )
    rows = [job.to_dict() for job in jobs]
    out_path = Path(args.out)
    if args.format == "csv":
        write_csv(out_path, rows)
    else:
        write_json(out_path, rows)
    print(json.dumps({"count": len(rows), "out": str(out_path), "roles": sorted(selected)}, indent=2))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as exc:
        print(json.dumps({"ok": False, "error": f"{type(exc).__name__}: {exc}"}, indent=2), file=sys.stderr)
        raise SystemExit(2)
