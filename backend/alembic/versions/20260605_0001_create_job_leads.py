"""create job leads

Revision ID: 20260605_0001
Revises:
Create Date: 2026-06-05
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260605_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "job_leads",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("job_id", sa.String(length=255), nullable=False),
        sa.Column("application_id", sa.String(length=340), nullable=True),
        sa.Column("status", sa.String(length=80), nullable=True),
        sa.Column("application_status", sa.String(length=80), nullable=True),
        sa.Column("title", sa.String(length=500), nullable=True),
        sa.Column("company", sa.String(length=500), nullable=True),
        sa.Column("location", sa.String(length=500), nullable=True),
        sa.Column("compensation", sa.String(length=255), nullable=True),
        sa.Column("job_url", sa.Text(), nullable=True),
        sa.Column("apply_url", sa.Text(), nullable=True),
        sa.Column("employer_name", sa.String(length=500), nullable=True),
        sa.Column("employer_type", sa.String(length=120), nullable=True),
        sa.Column("ai_fit_score", sa.Float(), nullable=True),
        sa.Column("cover_letter", sa.Text(), nullable=True),
        sa.Column("follow_up_email", sa.Text(), nullable=True),
        sa.Column("follow_up_status", sa.String(length=80), nullable=True),
        sa.Column("applied_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("follow_up_due_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("follow_up_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("raw", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("source", "job_id", name="uq_job_leads_source_job_id"),
    )
    op.create_index("ix_job_leads_application_status", "job_leads", ["application_status"], unique=False)
    op.create_index("ix_job_leads_expires_at", "job_leads", ["expires_at"], unique=False)
    op.create_index("ix_job_leads_follow_up_due_at", "job_leads", ["follow_up_due_at"], unique=False)
    op.create_index("ix_job_leads_status", "job_leads", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_job_leads_status", table_name="job_leads")
    op.drop_index("ix_job_leads_follow_up_due_at", table_name="job_leads")
    op.drop_index("ix_job_leads_expires_at", table_name="job_leads")
    op.drop_index("ix_job_leads_application_status", table_name="job_leads")
    op.drop_table("job_leads")
