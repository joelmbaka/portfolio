from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Float, Index, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ScrapedJob(Base):
    __tablename__ = "scraped_jobs"
    __table_args__ = (
        UniqueConstraint("source", "job_id", name="uq_scraped_jobs_source_job_id"),
        Index("ix_scraped_jobs_source", "source"),
        Index("ix_scraped_jobs_processed_at", "processed_at"),
        Index("ix_scraped_jobs_posted_age_days", "posted_age_days"),
        Index("ix_scraped_jobs_last_seen_at", "last_seen_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    source_detail: Mapped[str | None] = mapped_column(String(255))
    job_id: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str | None] = mapped_column(String(500))
    company: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(500))
    compensation: Mapped[str | None] = mapped_column(String(255))
    job_url: Mapped[str | None] = mapped_column(Text)
    company_url: Mapped[str | None] = mapped_column(Text)
    posted_age: Mapped[str | None] = mapped_column(String(120))
    posted_age_days: Mapped[float | None] = mapped_column(Float)
    posted_at_estimated: Mapped[str | None] = mapped_column(String(40))
    posted_age_confidence: Mapped[str | None] = mapped_column(String(80))
    raw: Mapped[dict[str, object]] = mapped_column(JSONB, nullable=False, default=dict)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class JobLead(Base):
    __tablename__ = "job_leads"
    __table_args__ = (
        UniqueConstraint("source", "job_id", name="uq_job_leads_source_job_id"),
        Index("ix_job_leads_application_status", "application_status"),
        Index("ix_job_leads_status", "status"),
        Index("ix_job_leads_follow_up_due_at", "follow_up_due_at"),
        Index("ix_job_leads_expires_at", "expires_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[str] = mapped_column(String(80), nullable=False)
    job_id: Mapped[str] = mapped_column(String(255), nullable=False)
    application_id: Mapped[str | None] = mapped_column(String(340))
    status: Mapped[str | None] = mapped_column(String(80))
    application_status: Mapped[str | None] = mapped_column(String(80))
    title: Mapped[str | None] = mapped_column(String(500))
    company: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(500))
    compensation: Mapped[str | None] = mapped_column(String(255))
    job_url: Mapped[str | None] = mapped_column(Text)
    apply_url: Mapped[str | None] = mapped_column(Text)
    employer_name: Mapped[str | None] = mapped_column(String(500))
    employer_type: Mapped[str | None] = mapped_column(String(120))
    ai_fit_score: Mapped[float | None] = mapped_column(Float)
    cover_letter: Mapped[str | None] = mapped_column(Text)
    follow_up_email: Mapped[str | None] = mapped_column(Text)
    follow_up_status: Mapped[str | None] = mapped_column(String(80))
    applied_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    follow_up_due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    follow_up_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    raw: Mapped[dict[str, object]] = mapped_column(JSONB, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
