from __future__ import annotations

import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.database import session_scope
from app.jobs.models import ScrapedJob
from app.jobs.suppression import SUPPRESSED_JOB_KEYS


EXPORTS = [
    ("wellfound", Path("exports/wellfound/latest.json")),
    ("yc", Path("exports/yc/latest.json")),
    ("linkedin", Path("exports/linkedin/latest.json")),
]


def read_rows(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows = json.loads(path.read_text(encoding="utf-8") or "[]")
    return [row for row in rows if isinstance(row, dict)]


def source_for(row: dict[str, Any], fallback: str) -> str:
    return fallback


def source_detail_for(row: dict[str, Any]) -> str | None:
    return str(
        row.get("source_role") or row.get("source_query") or row.get("source_detail") or row.get("source") or ""
    ) or None


def values_for(row: dict[str, Any], fallback_source: str, now: datetime) -> dict[str, Any] | None:
    source = source_for(row, fallback_source)
    job_id = str(row.get("job_id") or "")
    if not job_id or (source, job_id) in SUPPRESSED_JOB_KEYS:
        return None
    company = row.get("company") or row.get("company_slug") or row.get("employer_name")
    return {
        "source": source,
        "source_detail": source_detail_for(row),
        "job_id": job_id,
        "title": row.get("title"),
        "company": company,
        "location": row.get("location"),
        "compensation": row.get("compensation"),
        "job_url": row.get("job_url"),
        "company_url": row.get("company_url"),
        "posted_age": row.get("posted_age"),
        "posted_age_days": row.get("posted_age_days"),
        "posted_at_estimated": row.get("posted_at_estimated"),
        "posted_age_confidence": row.get("posted_age_confidence"),
        "raw": {**row, "inventory_synced_at": now.isoformat()},
        "last_seen_at": now,
    }


def main() -> None:
    now = datetime.now(UTC)
    by_key: dict[tuple[str, str], dict[str, Any]] = {}
    input_counts: dict[str, int] = {}
    for fallback_source, path in EXPORTS:
        rows = read_rows(path)
        input_counts[fallback_source] = len(rows)
        for row in rows:
            values = values_for(row, fallback_source, now)
            if values is None:
                continue
            by_key[(values["source"], values["job_id"])] = values

    values = list(by_key.values())
    inserted = 0
    updated = 0
    with session_scope() as session:
        existing_keys = {
            (str(source), str(job_id))
            for source, job_id in session.execute(select(ScrapedJob.source, ScrapedJob.job_id))
        }
        for index, value in enumerate(values, start=1):
            if (value["source"], value["job_id"]) in existing_keys:
                updated += 1
            else:
                inserted += 1
            stmt = insert(ScrapedJob).values(**value)
            excluded = stmt.excluded
            stmt = stmt.on_conflict_do_update(
                constraint="uq_scraped_jobs_source_job_id",
                set_={
                    "source_detail": excluded.source_detail,
                    "title": excluded.title,
                    "company": excluded.company,
                    "location": excluded.location,
                    "compensation": excluded.compensation,
                    "job_url": excluded.job_url,
                    "company_url": excluded.company_url,
                    "posted_age": excluded.posted_age,
                    "posted_age_days": excluded.posted_age_days,
                    "posted_at_estimated": excluded.posted_at_estimated,
                    "posted_age_confidence": excluded.posted_age_confidence,
                    "raw": excluded.raw,
                    "last_seen_at": excluded.last_seen_at,
                    "updated_at": func.now(),
                },
            )
            session.execute(stmt)
            if index % 100 == 0:
                session.commit()
                print(f"sync_scraped_jobs_to_db: upserted {index}/{len(values)}", file=sys.stderr, flush=True)
        total = session.scalar(select(func.count()).select_from(ScrapedJob))

    print(
        json.dumps(
            {
                "ok": True,
                "input_counts": input_counts,
                "upserted": len(values),
                "inserted": inserted,
                "updated": updated,
                "total": total,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
