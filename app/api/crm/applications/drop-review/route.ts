import { NextResponse } from 'next/server';
import { readDbRows, upsertDbRow } from '@/app/crm/db';

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
      ai_reason: input.reason || input.ai_reason || 'Manually dropped from CRM.',
      ai_rejected_criteria: input.ai_rejected_criteria?.length ? input.ai_rejected_criteria : ['manual crm drop'],
      reviewed_at: input.reviewed_at || now,
      review_decision: 'dropped',
    };

    await upsertDbRow(dropped);

    const relatedDropped: ApplicationRow[] = [];
    const company = String(input.company || input.employer_name || '').trim();
    if (input.application_status === 'ready_to_apply' && company) {
      const relatedReady = await readDbRows(
        `where source = $1
          and lower(coalesce(company, employer_name, raw->>'company', raw->>'employer_name', '')) = lower($2)
          and (
            application_status = 'ready_to_apply'
            or (application_status is null and status = 'accepted')
          )`,
        [input.source, company]
      );
      for (const row of relatedReady || []) {
        if (row.source === dropped.source && row.job_id === dropped.job_id) continue;
        const existing = row as ApplicationRow;
        const related: ApplicationRow = {
          ...row,
          application_id: row.application_id || `${row.source}:${row.job_id}`,
          application_status: 'rejected_by_ai',
          ai_status: 'rejected',
          ai_reason: row.ai_reason || `Manually dropped with ${company} from CRM.`,
          ai_rejected_criteria: row.ai_rejected_criteria?.length ? row.ai_rejected_criteria : ['manual crm company drop'],
          reviewed_at: existing.reviewed_at || now,
          review_decision: 'dropped',
        };
        await upsertDbRow(related);
        relatedDropped.push(related);
      }
    }

    return NextResponse.json({ ok: true, application: dropped, related_applications: relatedDropped });
  } catch (error) {
    console.error('[DROP_REVIEW_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to drop review job' }, { status: 500 });
  }
}
