import { NextResponse } from 'next/server';
import { readDbRows, updateDbRow, upsertDbRow } from '@/app/crm/db';
import type { JobRow } from '@/app/crm/CrmDashboardClient';

const FOLLOW_UP_GRACE_BUSINESS_DAYS = 3;

function addBusinessDays(start: Date, days: number) {
  const next = new Date(start);
  let added = 0;
  while (added < days) {
    next.setUTCDate(next.getUTCDate() + 1);
    const day = next.getUTCDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }
  return next;
}

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as { application_id?: string; source?: string; job_id?: string };
    if (!input.application_id && (!input.source || !input.job_id)) {
      return NextResponse.json({ ok: false, error: 'application_id or source/job_id is required' }, { status: 400 });
    }

    const dbUpdated = await updateDbRow(input, (row) => {
      const now = new Date();
      const followUpDue = addBusinessDays(now, FOLLOW_UP_GRACE_BUSINESS_DAYS);
      const expiresAt = new Date(now);
      expiresAt.setUTCDate(expiresAt.getUTCDate() + 30);
      return {
        ...row,
        application_status: 'applied',
        applied_at: row.applied_at || now.toISOString(),
        follow_up_due_at: row.follow_up_due_at || followUpDue.toISOString(),
        follow_up_status: row.follow_up_status || 'drafted',
        follow_up_sent_at: row.follow_up_sent_at || null,
        expires_at: row.expires_at || expiresAt.toISOString(),
      };
    });
    if (dbUpdated) {
      const relatedApplications: JobRow[] = [];
      const company = String(dbUpdated.company || dbUpdated.employer_name || '').trim();
      const title = String(dbUpdated.title || '').trim();
      if (company && title) {
        const duplicateReady = await readDbRows(
          `where source = $1
            and job_id != $2
            and lower(coalesce(company, employer_name, raw->>'company', raw->>'employer_name', '')) = lower($3)
            and lower(coalesce(title, raw->>'title', '')) = lower($4)
            and (
              application_status = 'ready_to_apply'
              or (application_status is null and status = 'accepted')
            )`,
          [dbUpdated.source, dbUpdated.job_id, company, title]
        );
        const now = new Date().toISOString();
        for (const row of duplicateReady || []) {
          const related = {
            ...row,
            application_id: row.application_id || `${row.source}:${row.job_id}`,
            application_status: 'rejected_by_ai',
            ai_status: 'rejected',
            ai_reason: `Duplicate of applied lead ${dbUpdated.application_id || `${dbUpdated.source}:${dbUpdated.job_id}`}.`,
            ai_rejected_criteria: row.ai_rejected_criteria?.length ? row.ai_rejected_criteria : ['duplicate applied lead'],
            reviewed_at: now,
            review_decision: 'dropped',
          };
          await upsertDbRow(related);
          relatedApplications.push(related);
        }
      }

      return NextResponse.json({ ok: true, application: dbUpdated, related_applications: relatedApplications });
    }

    return NextResponse.json({ ok: false, error: 'application not found' }, { status: 404 });
  } catch (error) {
    console.error('[MARK_APPLIED_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to mark applied' }, { status: 500 });
  }
}
