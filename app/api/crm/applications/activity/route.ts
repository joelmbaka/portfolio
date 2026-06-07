import { NextResponse } from 'next/server';
import { updateDbRow } from '@/app/crm/db';
import type { JobRow } from '@/app/crm/CrmDashboardClient';

type ActivityInput = {
  application_id?: string;
  source?: string;
  job_id?: string;
  application_status?: string;
  note?: string;
};

type ActivityNote = NonNullable<JobRow['activity_notes']>[number];
type ApplicationEvent = NonNullable<JobRow['application_events']>[number];

function statusLabel(status?: string) {
  if (!status) return '';
  const labels: Record<string, string> = {
    applied: 'Applied',
    interview_scheduled: 'Interview scheduled',
    interviewing: 'Interviewing',
    offer: 'Offer',
    hired: 'Hired',
    rejected_after_apply: 'Rejected',
    withdrawn: 'Withdrawn',
    followup_sent: 'Follow-up sent',
  };
  return labels[status] || status.replaceAll('_', ' ');
}

function id(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as ActivityInput;
    if (!input.application_id && (!input.source || !input.job_id)) {
      return NextResponse.json({ ok: false, error: 'application_id or source/job_id is required' }, { status: 400 });
    }

    const note = String(input.note || '').trim();
    const nextStatus = input.application_status;
    if (!note && !nextStatus) {
      return NextResponse.json({ ok: false, error: 'note or application_status is required' }, { status: 400 });
    }

    const dbUpdated = await updateDbRow(input, (row) => {
      const now = new Date().toISOString();
      const statusChanged = Boolean(nextStatus && nextStatus !== row.application_status);
      const activityNotes = row.activity_notes || [];
      const applicationEvents = row.application_events || [];
      const nextNotes: ActivityNote[] = note
        ? [{ id: id('note'), text: note, created_at: now }, ...activityNotes]
        : activityNotes;
      const nextEvents: ApplicationEvent[] = statusChanged && nextStatus
        ? [
            {
              id: id('event'),
              status: nextStatus,
              label: statusLabel(nextStatus),
              created_at: now,
            },
            ...applicationEvents,
          ]
        : applicationEvents;
      return {
        ...row,
        application_status: nextStatus || row.application_status,
        activity_notes: nextNotes,
        application_events: nextEvents,
      };
    });
    if (dbUpdated) {
      return NextResponse.json({ ok: true, application: dbUpdated });
    }

    return NextResponse.json({ ok: false, error: 'application not found' }, { status: 404 });
  } catch (error) {
    console.error('[APPLICATION_ACTIVITY_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to update application activity' }, { status: 500 });
  }
}
