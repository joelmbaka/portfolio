from __future__ import annotations

import asyncio
import json
import sys
from datetime import UTC, datetime
from pathlib import Path

from sqlalchemy import select

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings
from app.core.database import session_scope
from app.jobs.exporter import write_csv, write_json
from app.jobs.models import ScrapedJob
from app.jobs.suppression import SUPPRESSED_JOB_KEYS
from app.jobs.wellfound_scraper import ROLE_URLS, scrape_wellfound_roles


def timestamp_slug() -> str:
    return datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")


def read_previous_job_ids(source: str, path: Path) -> set[str]:
    try:
        with session_scope() as session:
            return {
                str(job_id)
                for job_id in session.scalars(
                    select(ScrapedJob.job_id).where(ScrapedJob.source == source)
                )
                if job_id
            }
    except Exception:
        pass
    if not path.exists():
        return set()
    try:
        rows = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return set()
    if not isinstance(rows, list):
        return set()
    return {str(row.get("job_id")) for row in rows if isinstance(row, dict) and row.get("job_id")}


async def main() -> None:
    started_at = datetime.now(UTC)
    stamp = timestamp_slug()
    export_dir = Path(settings.wellfound_export_dir)
    latest_json = export_dir / "latest.json"
    previous_job_ids = read_previous_job_ids("wellfound", latest_json)

    jobs = await scrape_wellfound_roles(ROLE_URLS)
    rows = [job.to_dict() for job in jobs if ("wellfound", job.job_id) not in SUPPRESSED_JOB_KEYS]
    current_job_ids = {str(row["job_id"]) for row in rows if row.get("job_id")}
    new_job_ids = current_job_ids - previous_job_ids

    json_path = export_dir / f"wellfound_jobs_{stamp}.json"
    csv_path = export_dir / f"wellfound_jobs_{stamp}.csv"
    latest_csv = export_dir / "latest.csv"

    write_json(json_path, rows)
    write_csv(csv_path, rows)
    write_json(latest_json, rows)
    write_csv(latest_csv, rows)

    finished_at = datetime.now(UTC)
    print(
        json.dumps(
            {
                "ok": True,
                "started_at": started_at.isoformat(),
                "finished_at": finished_at.isoformat(),
                "count": len(rows),
                "previous_count": len(previous_job_ids),
                "new_count": len(new_job_ids),
                "new_job_ids": sorted(new_job_ids),
                "roles": sorted(ROLE_URLS),
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
