import { NextResponse } from 'next/server';
import { updateDbRow } from '@/app/crm/db';

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as { application_id?: string; source?: string; job_id?: string };
    if (!input.application_id && (!input.source || !input.job_id)) {
      return NextResponse.json({ ok: false, error: 'application_id or source/job_id is required' }, { status: 400 });
    }

    const dbUpdated = await updateDbRow(input, (row) => {
      const now = new Date();
      return {
        ...row,
        application_status: 'followup_sent',
        follow_up_status: 'sent',
        follow_up_sent_at: row.follow_up_sent_at || now.toISOString(),
      };
    });
    if (dbUpdated) {
      return NextResponse.json({ ok: true, application: dbUpdated });
    }

    return NextResponse.json({ ok: false, error: 'application not found' }, { status: 404 });
  } catch (error) {
    console.error('[MARK_FOLLOWUP_SENT_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to mark follow-up sent' }, { status: 500 });
  }
}
