from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
EXPORT_ROOT = ROOT / "exports"


def timestamp() -> str:
    return datetime.now(UTC).isoformat()


def run_stage(
    name: str,
    args: list[str],
    *,
    continue_on_error: bool,
    attempts: int = 1,
    retry_delay_seconds: int = 0,
    timeout_seconds: int | None = None,
) -> dict[str, Any]:
    started_at = timestamp()
    command = [sys.executable, *args]
    attempt_summaries: list[dict[str, Any]] = []
    result: subprocess.CompletedProcess[str] | None = None
    for attempt in range(1, max(1, attempts) + 1):
        try:
            result = subprocess.run(
                command,
                cwd=ROOT,
                text=True,
                capture_output=True,
                timeout=timeout_seconds,
            )
        except subprocess.TimeoutExpired as exc:
            result = subprocess.CompletedProcess(
                command,
                returncode=124,
                stdout=exc.stdout or "",
                stderr=f"{name} timed out after {timeout_seconds}s",
            )
        attempt_summaries.append(
            {
                "attempt": attempt,
                "ok": result.returncode == 0,
                "returncode": result.returncode,
                "finished_at": timestamp(),
            }
        )
        if result.returncode == 0:
            break
        if attempt < attempts and retry_delay_seconds > 0:
            time.sleep(retry_delay_seconds)

    if result is None:
        raise RuntimeError(f"{name} did not run")

    output = result.stdout.strip()
    error = result.stderr.strip()
    parsed: Any = None
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
    if len(attempt_summaries) > 1:
        stage["attempts"] = attempt_summaries
    if error:
        stage["stderr"] = error[-4000:]
    if result.returncode != 0 and not continue_on_error:
        print(json.dumps({"ok": False, "failed_stage": stage, "stages": [stage]}, indent=2), file=sys.stderr)
        raise SystemExit(result.returncode)
    return stage


def cleanup_exports() -> dict[str, Any]:
    if not EXPORT_ROOT.exists():
        return {"ok": True, "removed": False, "path": str(EXPORT_ROOT)}
    shutil.rmtree(EXPORT_ROOT)
    return {"ok": True, "removed": True, "path": str(EXPORT_ROOT)}


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run production job discovery once.")
    parser.add_argument("--accepted-limit", type=int, default=50)
    parser.add_argument("--review-limit", type=int, default=50)
    parser.add_argument("--enrich-accepted-limit", type=int, default=25)
    parser.add_argument("--enrich-review-limit", type=int, default=50)
    parser.add_argument("--enrich-total-limit", type=int, default=1)
    parser.add_argument("--enrich-pause-ms", type=int, default=1200)
    parser.add_argument("--review-refine-limit", type=int, default=50)
    parser.add_argument("--review-refine-model", default="nvidia/llama-3.3-nemotron-super-49b-v1")
    parser.add_argument("--review-refine-sleep-ms", type=int, default=8000)
    parser.add_argument("--prepare-accepted-limit", type=int, default=50)
    parser.add_argument("--prepare-pause-ms", type=int, default=2500)
    parser.add_argument("--include-linkedin", action="store_true")
    parser.add_argument("--continue-on-source-error", action="store_true", default=True)
    parser.add_argument("--no-continue-on-source-error", dest="continue_on_source_error", action="store_false")
    return parser


def main() -> None:
    args = make_parser().parse_args()
    started_at = timestamp()
    stages: list[dict[str, Any]] = []

    stages.append(
        run_stage(
            "yc",
            ["scripts/run_yc_once.py"],
            continue_on_error=args.continue_on_source_error,
            attempts=2,
            retry_delay_seconds=20,
            timeout_seconds=240,
        )
    )
    stages.append(
        run_stage(
            "wellfound",
            ["scripts/run_wellfound_once.py"],
            continue_on_error=args.continue_on_source_error,
            attempts=1,
            retry_delay_seconds=20,
            timeout_seconds=420,
        )
    )
    if args.include_linkedin:
        stages.append(
            run_stage(
                "linkedin",
                ["scripts/run_linkedin_once.py"],
                continue_on_error=args.continue_on_source_error,
                attempts=1,
                retry_delay_seconds=20,
                timeout_seconds=420,
            )
        )
    stages.append(
        run_stage(
            "sync_scraped_db",
            ["scripts/sync_scraped_jobs_to_db.py"],
            continue_on_error=False,
            attempts=5,
            retry_delay_seconds=30,
            timeout_seconds=120,
        )
    )
    shortlist_args = ["scripts/build_job_hunt_shortlist.py"]
    linkedin_stage = next((stage for stage in stages if stage["name"] == "linkedin"), None)
    if linkedin_stage and linkedin_stage["ok"]:
        shortlist_args.extend(["--linkedin", "exports/linkedin/latest.json"])
    stages.append(run_stage("shortlist", shortlist_args, continue_on_error=False))
    stages.append(
        run_stage(
            "enrich",
            [
                "scripts/enrich_job_hunt_details.py",
                "--accepted-limit",
                str(args.enrich_accepted_limit),
                "--review-limit",
                str(args.enrich_review_limit),
                "--total-limit",
                str(args.enrich_total_limit),
                "--pause-ms",
                str(args.enrich_pause_ms),
            ],
            continue_on_error=False,
            timeout_seconds=360,
        )
    )
    stages.append(
        run_stage(
            "review_refine_120b",
            [
                "scripts/refine_review_exports_with_llm.py",
                "--limit",
                str(args.review_refine_limit),
                "--model",
                args.review_refine_model,
                "--sleep-ms",
                str(args.review_refine_sleep_ms),
            ],
            continue_on_error=False,
            timeout_seconds=900,
        )
    )
    stages.append(
        run_stage(
            "prepare_applications",
            [
                "scripts/prepare_applications.py",
                "--accepted-limit",
                str(args.prepare_accepted_limit),
                "--pause-ms",
                str(args.prepare_pause_ms),
            ],
            continue_on_error=False,
            timeout_seconds=900,
        )
    )
    stages.append(
        run_stage(
            "sync_db",
            ["scripts/sync_job_exports_to_db.py"],
            continue_on_error=False,
            attempts=5,
            retry_delay_seconds=30,
            timeout_seconds=120,
        )
    )
    stages.append({"name": "cleanup_exports", "summary": cleanup_exports(), "ok": True, "returncode": 0})

    source_names = {"yc", "wellfound", "linkedin"}
    required_source_names = {"yc", "wellfound"}
    required_source_stages = [stage for stage in stages if stage["name"] in required_source_names]
    ok = any(stage["ok"] for stage in required_source_stages) and all(stage["ok"] for stage in stages if stage["name"] not in source_names)
    print(json.dumps({"ok": ok, "started_at": started_at, "finished_at": timestamp(), "stages": stages}, indent=2))
    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
