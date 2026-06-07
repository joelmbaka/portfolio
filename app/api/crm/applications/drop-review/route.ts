import { NextResponse } from 'next/server';
import { upsertDbRow } from '@/app/crm/db';

type ApplicationRow = {
  application_id?: string;
  source?: string;
  job_id?: string;
  application_status?: string;
  ai_rejected_criteria?: string[];
  rejected_criteria?: string[];
  [key: string]: unknown;
};

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as ApplicationRow & { reason?: string };
    if (!input.source || !input.job_id) {
      return NextResponse.json({ ok: false, error: 'source and job_id are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const dropped: ApplicationRow = {
      ...input,
      application_id: input.application_id || `${input.source}:${input.job_id}`,
      application_status: 'rejected_by_ai',
      ai_status: 'rejected',
      ai_reason: input.reason || input.ai_reason || 'Dropped from enrichment review.',
      ai_rejected_criteria: input.ai_rejected_criteria?.length ? input.ai_rejected_criteria : ['manual review drop'],
      reviewed_at: input.reviewed_at || now,
      review_decision: 'dropped',
    };

    await upsertDbRow(dropped);
    return NextResponse.json({ ok: true, application: dropped });
  } catch (error) {
    console.error('[DROP_REVIEW_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to drop review job' }, { status: 500 });
  }
}
