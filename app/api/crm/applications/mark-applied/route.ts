import { NextResponse } from 'next/server';
import { updateDbRow } from '@/app/crm/db';

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
      return NextResponse.json({ ok: true, application: dbUpdated });
    }

    return NextResponse.json({ ok: false, error: 'application not found' }, { status: 404 });
  } catch (error) {
    console.error('[MARK_APPLIED_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to mark applied' }, { status: 500 });
  }
}
