from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.jobs.exporter import atomic_write_text


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Write a compact markdown report from the enriched job shortlist.")
    parser.add_argument("--input", default="exports/job_hunt/enriched/latest.json")
    parser.add_argument("--out", default="exports/job_hunt/apply_first.md")
    parser.add_argument("--limit", type=int, default=30)
    parser.add_argument("--max-per-company", type=int, default=5)
    return parser


def main() -> None:
    args = make_parser().parse_args()
    all_rows = json.loads(Path(args.input).read_text(encoding="utf-8"))
    rows = []
    seen_roles: set[tuple[str, str]] = set()
    company_counts: dict[str, int] = {}
    for row in all_rows:
        company = str(row.get("company") or "Unknown company")
        title = str(row.get("title") or "Untitled")
        role_key = (company.lower(), title.lower())
        if role_key in seen_roles:
            continue
        if company_counts.get(company, 0) >= args.max_per_company:
            continue
        rows.append(row)
        seen_roles.add(role_key)
        company_counts[company] = company_counts.get(company, 0) + 1
        if len(rows) >= max(0, args.limit):
            break
    lines = ["# Apply First", ""]
    for index, row in enumerate(rows, start=1):
        title = row.get("title") or "Untitled"
        company = row.get("company") or "Unknown company"
        location = row.get("location") or "Unknown location"
        category = row.get("category") or "uncategorized"
        rank = row.get("rank_score")
        url = row.get("job_url")
        reason = row.get("reason")
        matched = ", ".join(str(item) for item in row.get("matched_criteria") or [])
        lines.append(f"## {index}. {title}")
        lines.append(f"- Company: {company}")
        lines.append(f"- Location: {location}")
        lines.append(f"- Source: {row.get('source')} / {row.get('source_detail')}")
        lines.append(f"- Category: {category}")
        lines.append(f"- Rank: {rank}")
        lines.append(f"- Apply: {url}")
        if matched:
            lines.append(f"- Matches: {matched}")
        if reason:
            lines.append(f"- Reason: {reason}")
        lines.append("")
    atomic_write_text(Path(args.out), "\n".join(lines))
    print(json.dumps({"ok": True, "count": len(rows), "out": args.out}, indent=2))


if __name__ == "__main__":
    main()
