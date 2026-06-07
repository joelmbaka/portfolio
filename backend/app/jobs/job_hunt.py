from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path

from app.jobs.classifier import Classification, heuristic_classify, llm_classify


@dataclass
class JobCandidate:
    source: str
    source_detail: str | None
    job_id: str
    job_url: str
    title: str | None = None
    company: str | None = None
    location: str | None = None
    compensation: str | None = None
    posted_age: str | None = None
    posted_age_days: float | None = None
    posted_at_estimated: str | None = None
    posted_age_confidence: str | None = None
    text: str | None = None

    @property
    def company_slug(self) -> str | None:
        return self.company


def read_export(path: Path) -> list[dict[str, object]]:
    if not path.exists():
        return []
    rows = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(rows, list):
        return []
    return [row for row in rows if isinstance(row, dict)]


def wellfound_candidate(row: dict[str, object]) -> JobCandidate | None:
    job_id = row.get("job_id")
    job_url = row.get("job_url")
    if not job_id or not job_url:
        return None
    return JobCandidate(
        source="wellfound",
        source_detail=str(row.get("source_role") or row.get("source") or ""),
        job_id=str(job_id),
        job_url=str(job_url),
        title=str(row["title"]) if row.get("title") else None,
        company=str(row["company_slug"]) if row.get("company_slug") else None,
        location=str(row["location"]) if row.get("location") else None,
        compensation=str(row["compensation"]) if row.get("compensation") else None,
        posted_age=str(row["posted_age"]) if row.get("posted_age") else None,
        posted_age_days=float(row["posted_age_days"]) if row.get("posted_age_days") is not None else None,
        posted_at_estimated=str(row["posted_at_estimated"]) if row.get("posted_at_estimated") else None,
        posted_age_confidence=str(row["posted_age_confidence"]) if row.get("posted_age_confidence") else None,
        text=str(row["text"]) if row.get("text") else None,
    )


def linkedin_candidate(row: dict[str, object]) -> JobCandidate | None:
    job_id = row.get("job_id")
    job_url = row.get("job_url")
    if not job_id or not job_url:
        return None
    return JobCandidate(
        source="linkedin",
        source_detail=str(row.get("source_query") or ""),
        job_id=str(job_id),
        job_url=str(job_url),
        title=str(row["title"]) if row.get("title") else None,
        company=str(row["company"]) if row.get("company") else None,
        location=str(row["location"]) if row.get("location") else None,
        compensation=None,
        posted_age=str(row["posted_age"]) if row.get("posted_age") else None,
        posted_age_days=float(row["posted_age_days"]) if row.get("posted_age_days") is not None else None,
        posted_at_estimated=str(row["posted_at_estimated"]) if row.get("posted_at_estimated") else None,
        posted_age_confidence=str(row["posted_age_confidence"]) if row.get("posted_age_confidence") else None,
        text=str(row["text"]) if row.get("text") else None,
    )


def yc_candidate(row: dict[str, object]) -> JobCandidate | None:
    job_id = row.get("job_id")
    job_url = row.get("job_url")
    if not job_id or not job_url:
        return None
    return JobCandidate(
        source="yc",
        source_detail=str(row.get("source_role") or row.get("source") or ""),
        job_id=str(job_id),
        job_url=str(job_url),
        title=str(row["title"]) if row.get("title") else None,
        company=str(row["company"]) if row.get("company") else None,
        location=str(row["location"]) if row.get("location") else None,
        compensation=str(row["compensation"]) if row.get("compensation") else None,
        posted_age=str(row["posted_age"]) if row.get("posted_age") else None,
        posted_age_days=float(row["posted_age_days"]) if row.get("posted_age_days") is not None else None,
        posted_at_estimated=str(row["posted_at_estimated"]) if row.get("posted_at_estimated") else None,
        posted_age_confidence=str(row["posted_age_confidence"]) if row.get("posted_age_confidence") else None,
        text="\n".join(
            part
            for part in [
                str(row.get("text") or ""),
                str(row.get("tagline") or ""),
                str(row.get("category") or ""),
            ]
            if part
        )
        or None,
    )


def load_candidates(
    wellfound_path: Path,
    yc_path: Path | None = None,
    linkedin_path: Path | None = None,
) -> list[JobCandidate]:
    candidates: dict[str, JobCandidate] = {}
    for row in read_export(wellfound_path):
        candidate = wellfound_candidate(row)
        if candidate:
            candidates[f"{candidate.source}:{candidate.job_id}"] = candidate
    if yc_path is not None:
        for row in read_export(yc_path):
            candidate = yc_candidate(row)
            if candidate:
                candidates[f"{candidate.source}:{candidate.job_id}"] = candidate
    if linkedin_path is not None:
        for row in read_export(linkedin_path):
            candidate = linkedin_candidate(row)
            if candidate:
                candidates[f"{candidate.source}:{candidate.job_id}"] = candidate
    return list(candidates.values())


def recency_score(candidate: JobCandidate) -> float:
    if candidate.posted_age_days is None:
        return 0.05
    if candidate.posted_age_days <= 1:
        return 0.2
    if candidate.posted_age_days <= 3:
        return 0.16
    if candidate.posted_age_days <= 7:
        return 0.12
    if candidate.posted_age_days <= 14:
        return 0.08
    if candidate.posted_age_days <= 31:
        return 0.04
    return 0


def source_score(candidate: JobCandidate) -> float:
    if candidate.source == "wellfound":
        return 0.06
    if candidate.source == "yc":
        return 0.12
    if candidate.source == "linkedin":
        return 0.04
    return 0


def final_score(candidate: JobCandidate, classification: Classification) -> float:
    score = classification.fit_score + recency_score(candidate) + source_score(candidate)
    if candidate.compensation:
        score += 0.03
    if candidate.source_detail and "," in candidate.source_detail:
        score += 0.04
    return round(min(score, 1.0), 4)


async def classify_candidates(
    candidates: list[JobCandidate],
    *,
    use_llm: bool = False,
) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for candidate in candidates:
        classification = await llm_classify(candidate) if use_llm else heuristic_classify(candidate)
        row = asdict(candidate)
        row.update(
            {
                "status": classification.status,
                "category": classification.category,
                "fit_score": classification.fit_score,
                "rank_score": final_score(candidate, classification),
                "reason": classification.reason,
                "matched_criteria": classification.matched_criteria,
                "rejected_criteria": classification.rejected_criteria,
            }
        )
        rows.append(row)
    rows.sort(
        key=lambda row: (
            0 if row["status"] == "accepted" else 1 if row["status"] == "needs_review" else 2,
            -float(row["rank_score"]),
            float(row["posted_age_days"]) if row["posted_age_days"] is not None else 9999,
            str(row["title"] or ""),
        )
    )
    return rows
