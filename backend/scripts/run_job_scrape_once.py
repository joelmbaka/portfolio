from __future__ import annotations

import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]


def timestamp() -> str:
    return datetime.now(UTC).isoformat()


def run_stage(name: str, args: list[str], *, continue_on_error: bool, timeout_seconds: int | None = None) -> dict[str, Any]:
    started_at = timestamp()
    command = [sys.executable, *args]
    try:
        result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True, timeout=timeout_seconds)
    except subprocess.TimeoutExpired as exc:
        result = subprocess.CompletedProcess(
            command,
            returncode=124,
            stdout=exc.stdout or "",
            stderr=f"{name} timed out after {timeout_seconds}s",
        )
    parsed: Any = None
    output = result.stdout.strip()
    if output:
        try:
            parsed = json.loads(output)
        except json.JSONDecodeError:
            parsed = output[-4000:]
    stage = {
        "name": name,
        "ok": result.returncode == 0,
        "returncode": result.returncode,
        "started_at": started_at,
        "finished_at": timestamp(),
        "summary": parsed,
    }
    if result.stderr.strip():
        stage["stderr"] = result.stderr.strip()[-4000:]
    if result.returncode != 0 and not continue_on_error:
        print(json.dumps({"ok": False, "failed_stage": stage}, indent=2), file=sys.stderr)
        raise SystemExit(result.returncode)
    return stage


def main() -> None:
    started_at = timestamp()
    stages = [
        run_stage("yc", ["scripts/run_yc_once.py"], continue_on_error=True, timeout_seconds=240),
        run_stage("wellfound", ["scripts/run_wellfound_once.py"], continue_on_error=True, timeout_seconds=240),
    ]
    if not any(stage["ok"] for stage in stages):
        print(json.dumps({"ok": False, "started_at": started_at, "finished_at": timestamp(), "stages": stages}, indent=2))
        raise SystemExit(1)
    stages.append(
        run_stage("sync_scraped_jobs", ["scripts/sync_scraped_jobs_to_db.py"], continue_on_error=False, timeout_seconds=240)
    )
    source_counts = {
        stage["name"]: (stage.get("summary") or {}).get("count")
        for stage in stages
        if stage["name"] in {"yc", "wellfound"} and isinstance(stage.get("summary"), dict)
    }
    sync_summary = stages[-1].get("summary") if isinstance(stages[-1].get("summary"), dict) else {}
    print(
        json.dumps(
            {
                "ok": all(stage["ok"] for stage in stages if stage["name"] == "sync_scraped_jobs")
                and any(stage["ok"] for stage in stages if stage["name"] in {"yc", "wellfound"}),
                "started_at": started_at,
                "finished_at": timestamp(),
                "source_counts": source_counts,
                "scraped_count": sum(int(count or 0) for count in source_counts.values()),
                "inventory_upserted": sync_summary.get("upserted"),
                "inventory_inserted": sync_summary.get("inserted"),
                "inventory_updated": sync_summary.get("updated"),
                "inventory_total": sync_summary.get("total"),
                "stages": stages,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
