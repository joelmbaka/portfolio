"""create scraped jobs

Revision ID: 20260606_0002
Revises: 20260605_0001
Create Date: 2026-06-06
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260606_0002"
down_revision: Union[str, None] = "20260605_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "scraped_jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("source_detail", sa.String(length=255), nullable=True),
        sa.Column("job_id", sa.String(length=255), nullable=False),
        sa.Column("title", sa.String(length=500), nullable=True),
        sa.Column("company", sa.String(length=500), nullable=True),
        sa.Column("location", sa.String(length=500), nullable=True),
        sa.Column("compensation", sa.String(length=255), nullable=True),
        sa.Column("job_url", sa.Text(), nullable=True),
        sa.Column("company_url", sa.Text(), nullable=True),
        sa.Column("posted_age", sa.String(length=120), nullable=True),
        sa.Column("posted_age_days", sa.Float(), nullable=True),
        sa.Column("posted_at_estimated", sa.String(length=40), nullable=True),
        sa.Column("posted_age_confidence", sa.String(length=80), nullable=True),
        sa.Column("raw", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("source", "job_id", name="uq_scraped_jobs_source_job_id"),
    )
    op.create_index("ix_scraped_jobs_last_seen_at", "scraped_jobs", ["last_seen_at"], unique=False)
    op.create_index("ix_scraped_jobs_posted_age_days", "scraped_jobs", ["posted_age_days"], unique=False)
    op.create_index("ix_scraped_jobs_processed_at", "scraped_jobs", ["processed_at"], unique=False)
    op.create_index("ix_scraped_jobs_source", "scraped_jobs", ["source"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_scraped_jobs_source", table_name="scraped_jobs")
    op.drop_index("ix_scraped_jobs_processed_at", table_name="scraped_jobs")
    op.drop_index("ix_scraped_jobs_posted_age_days", table_name="scraped_jobs")
    op.drop_index("ix_scraped_jobs_last_seen_at", table_name="scraped_jobs")
    op.drop_table("scraped_jobs")
