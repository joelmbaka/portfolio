from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import httpx

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.config import settings
from app.jobs.classifier import Classification, heuristic_classify
from app.jobs.criteria import criteria_prompt
from app.jobs.exporter import write_csv, write_json
from app.jobs.job_hunt import JobCandidate, final_score, read_export


def compact_text(value: object, limit: int = 9000) -> str:
    return " ".join(str(value or "").split())[:limit]


def candidate_from_row(row: dict[str, Any]) -> JobCandidate:
    text = "\n".join(
        str(part)
        for part in (
            row.get("detail_body_excerpt"),
            row.get("detail_description"),
            row.get("text"),
            row.get("employer_summary"),
        )
        if part
    )
    return JobCandidate(
        source=str(row.get("source") or ""),
        source_detail=str(row.get("source_detail") or row.get("source_role") or ""),
        job_id=str(row.get("job_id") or ""),
        job_url=str(row.get("job_url") or ""),
        title=str(row.get("title") or "") or None,
        company=str(row.get("company") or row.get("employer_name") or "") or None,
        location=str(row.get("location") or "") or None,
        compensation=str(row.get("compensation") or "") or None,
        posted_age=str(row.get("posted_age") or "") or None,
        posted_age_days=float(row["posted_age_days"]) if row.get("posted_age_days") is not None else None,
        posted_at_estimated=str(row.get("posted_at_estimated") or "") or None,
        posted_age_confidence=str(row.get("posted_age_confidence") or "") or None,
        text=text or None,
    )


async def classify_review(candidate: JobCandidate, *, model: str) -> Classification:
    fallback = heuristic_classify(candidate)
    if fallback.status == "rejected":
        return fallback
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is not configured")
    payload = {
        "model": model,
        "temperature": 0,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are the second-pass reviewer for Joel's job hunt. Return strict JSON only with "
                    "status, category, fit_score, reason, matched_criteria, rejected_criteria. "
                    "status must be accepted, rejected, or needs_review. Be strict: if the stored text is too thin "
                    "to verify stack/location/visa, keep needs_review unless there is an explicit exclusion signal."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Joel wants quick cash engineering roles. Good fit: React/Next.js/TypeScript/JavaScript, "
                    "React Native/Expo, Python or JS/Node backend, and practical GenAI/LLM product application work. "
                    "Bad fit: US-only residency, no visa sponsorship where US residency is required, MLOps-heavy/data-pipeline/"
                    "model-platform roles, native-only mobile, Flutter/Dart, Vue/Svelte/Angular-only frontend, strict onsite, "
                    "cofounder/equity-only, missing cash, low cash, internships, and sales/solutions/design-only roles.\n\n"
                    f"{criteria_prompt()}\n\n"
                    "Review-row candidate:\n"
                    f"Source: {candidate.source}\n"
                    f"Title: {candidate.title}\n"
                    f"Company: {candidate.company}\n"
                    f"Location: {candidate.location}\n"
                    f"Compensation: {candidate.compensation}\n"
                    f"Posted age: {candidate.posted_age}\n"
                    f"URL: {candidate.job_url}\n"
                    f"Stored text:\n{compact_text(candidate.text)}\n\n"
                    f"Base classifier said: {fallback.status}; {fallback.reason}; "
                    f"matched={fallback.matched_criteria}; rejected={fallback.rejected_criteria}."
                ),
            },
        ],
    }
    retryable_statuses = {408, 409, 425, 429, 500, 502, 503, 504}
    async with httpx.AsyncClient(timeout=90) as client:
        for attempt in range(6):
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json=payload,
            )
            if response.status_code not in retryable_statuses:
                response.raise_for_status()
                break
            if attempt == 5:
                response.raise_for_status()
            retry_after = response.headers.get("retry-after")
            try:
                delay = float(retry_after) if retry_after else 0
            except ValueError:
                delay = 0
            if delay <= 0:
                delay = min(90, 8 * (2**attempt))
            await asyncio.sleep(delay)
    content = response.json()["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    try:
        fit_score = float(parsed.get("fit_score", fallback.fit_score))
    except (TypeError, ValueError):
        fit_score = fallback.fit_score
    if fit_score > 1:
        fit_score = fit_score / 10 if fit_score <= 10 else fit_score / 100
    status = str(parsed.get("status") or fallback.status)
    if status not in {"accepted", "rejected", "needs_review"}:
        status = fallback.status
    return Classification(
        status=status,
        category=parsed.get("category") or fallback.category,
        fit_score=max(0.0, min(1.0, fit_score)),
        reason=str(parsed.get("reason") or fallback.reason),
        matched_criteria=list(parsed.get("matched_criteria") or fallback.matched_criteria),
        rejected_criteria=list(parsed.get("rejected_criteria") or fallback.rejected_criteria),
    )


def sort_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(
        rows,
        key=lambda row: (
            0 if row.get("status") == "accepted" else 1 if row.get("status") == "needs_review" else 2,
            -float(row.get("rank_score") or 0),
            float(row["posted_age_days"]) if row.get("posted_age_days") is not None else 9999,
            str(row.get("title") or ""),
        ),
    )


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run 120B second pass on enriched needs_review exports.")
    parser.add_argument("--out-dir", default="exports/job_hunt/enriched")
    parser.add_argument("--model", default="openai/gpt-oss-120b")
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--sleep-ms", type=int, default=8000)
    return parser


async def main() -> None:
    args = make_parser().parse_args()
    out_dir = Path(args.out_dir)
    accepted_path = out_dir / "latest.json"
    review_path = out_dir / "latest_needs_review.json"
    rejected_path = out_dir / "latest_rejected.json"
    accepted = read_export(accepted_path)
    review = read_export(review_path)
    rejected = read_export(rejected_path)

    remaining_review: list[dict[str, Any]] = []
    moved_accepted: list[dict[str, Any]] = []
    moved_rejected: list[dict[str, Any]] = []
    failures: list[dict[str, Any]] = []

    rows_to_process = review[: max(0, args.limit)]
    untouched_review = review[max(0, args.limit) :]
    for index, row in enumerate(rows_to_process, start=1):
        try:
            candidate = candidate_from_row(row)
            classification = await classify_review(candidate, model=args.model)
            updated = dict(row)
            updated.update(
                {
                    "status": classification.status,
                    "category": classification.category,
                    "fit_score": classification.fit_score,
                    "rank_score": final_score(candidate, classification),
                    "reason": classification.reason,
                    "matched_criteria": classification.matched_criteria,
                    "rejected_criteria": classification.rejected_criteria,
                    "review_refined_at": datetime.now(UTC).isoformat(),
                    "review_refine_model": args.model,
                    "review_refine_previous_status": row.get("status"),
                    "review_refine_previous_reason": row.get("reason"),
                }
            )
            if classification.status == "accepted":
                moved_accepted.append(updated)
            elif classification.status == "rejected":
                moved_rejected.append(updated)
            else:
                remaining_review.append(updated)
        except Exception as exc:
            failed = dict(row)
            failed["review_refine_error"] = f"{type(exc).__name__}: {exc}"
            failures.append(failed)
            remaining_review.append(failed)
        if args.sleep_ms > 0 and index < len(rows_to_process):
            await asyncio.sleep(args.sleep_ms / 1000)

    accepted = sort_rows([*accepted, *moved_accepted])
    review = sort_rows([*remaining_review, *untouched_review])
    rejected = sort_rows([*rejected, *moved_rejected])
    write_json(accepted_path, accepted)
    write_csv(out_dir / "latest.csv", accepted)
    write_json(review_path, review)
    write_csv(out_dir / "latest_needs_review.csv", review)
    write_json(rejected_path, rejected)

    print(
        json.dumps(
            {
                "ok": True,
                "model": args.model,
                "processed_count": len(rows_to_process),
                "moved_accepted_count": len(moved_accepted),
                "moved_rejected_count": len(moved_rejected),
                "remaining_review_count": len(review),
                "failure_count": len(failures),
                "moved_accepted": [
                    {"source": row.get("source"), "job_id": row.get("job_id"), "title": row.get("title")}
                    for row in moved_accepted
                ],
                "moved_rejected": [
                    {"source": row.get("source"), "job_id": row.get("job_id"), "title": row.get("title"), "reason": row.get("reason")}
                    for row in moved_rejected
                ],
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    asyncio.run(main())
