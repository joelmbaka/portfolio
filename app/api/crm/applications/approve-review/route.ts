import { NextResponse } from 'next/server';
import { upsertDbRow } from '@/app/crm/db';

type ApplicationRow = {
  application_id?: string;
  source?: string;
  job_id?: string;
  application_status?: string;
  title?: string;
  company?: string;
  employer_name?: string;
  employer_summary?: string;
  matched_criteria?: string[];
  ai_matched_criteria?: string[];
  cover_letter?: string | null;
  follow_up_email?: string | null;
  follow_up_status?: string | null;
  [key: string]: unknown;
};

function compact(value: unknown, limit = 1200) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

function companyName(row: ApplicationRow) {
  return row.employer_name || row.company || 'your team';
}

function fallbackCoverLetter(row: ApplicationRow) {
  const signals = [...(row.ai_matched_criteria || []), ...(row.matched_criteria || [])].slice(0, 4).join(', ');
  return [
    `Hi ${companyName(row)} team,`,
    '',
    `I am interested in the ${row.title || 'role'}. My strongest work is across React Native, Expo, React/Next.js, TypeScript, Python-backed product systems, and practical AI integrations.`,
    `The role stood out because it connects with ${signals || 'web/mobile product engineering and fast execution'}.`,
    '',
    'I can bring founder-level ownership, product judgment, and hands-on shipping speed across mobile, web, backend APIs, and AI-powered workflows.',
    '',
    'Best,',
    'Joel',
  ].join('\n');
}

function fallbackFollowUpEmail(row: ApplicationRow) {
  return [
    `Subject: Following up on ${row.title || 'the role'}`,
    '',
    `Hi ${companyName(row)} team,`,
    '',
    `I recently applied for ${row.title || 'the role'} and wanted to follow up briefly. I can contribute strong product engineering execution across React/Next.js, React Native/Expo, Python/JS backends, and AI-powered workflows.`,
    '',
    'Best,',
    'Joel',
  ].join('\n');
}

async function draftWithAi(row: ApplicationRow) {
  const fallback = {
    cover_letter: row.cover_letter || fallbackCoverLetter(row),
    follow_up_email: row.follow_up_email || fallbackFollowUpEmail(row),
    ai_draft_used: false,
    ai_draft_error: undefined as string | undefined,
  };

  if (!process.env.GROQ_API_KEY) {
    return { ...fallback, ai_draft_error: 'GROQ_API_KEY not configured' };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        temperature: 0.25,
        messages: [
          {
            role: 'system',
            content: 'Return strict JSON only with keys cover_letter and follow_up_email. Keep both concise, direct, and tailored for Joel.',
          },
          {
            role: 'user',
            content: [
              'Joel is a vision-led founder and senior engineer looking for quick cash roles that fit React Native, Expo, React, Next.js, TypeScript/JavaScript, Python/JS backends, and practical AI product work.',
              `Job: ${row.title || ''}`,
              `Company: ${companyName(row)}`,
              `Compensation: ${row.compensation || ''}`,
              `Employer summary: ${compact(row.employer_summary, 800)}`,
              `Fit reason: ${compact(row.ai_reason || row.reason, 800)}`,
              `Job description: ${compact(row.detail_body_excerpt || row.detail_description || row.text, 5000)}`,
              'Cover letter should be ready to send after external apply. Follow-up email should be ready for 3 business days after applying.',
            ].join('\n'),
          },
        ],
      }),
    });

    if (!response.ok) {
      return { ...fallback, ai_draft_error: `Groq ${response.status}` };
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || '{}') as Partial<Pick<ApplicationRow, 'cover_letter' | 'follow_up_email'>>;
    return {
      cover_letter: parsed.cover_letter || fallback.cover_letter,
      follow_up_email: parsed.follow_up_email || fallback.follow_up_email,
      ai_draft_used: true,
      ai_draft_error: undefined,
    };
  } catch (error) {
    return { ...fallback, ai_draft_error: `${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : 'AI draft failed'}` };
  }
}

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as ApplicationRow;
    if (!input.source || !input.job_id) {
      return NextResponse.json({ ok: false, error: 'source and job_id are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const drafts = await draftWithAi(input);
    const approved: ApplicationRow = {
      ...input,
      application_id: input.application_id || `${input.source}:${input.job_id}`,
      status: 'accepted',
      application_status: 'ready_to_apply',
      ai_status: input.ai_status || 'accepted',
      ai_reason: input.ai_reason || input.reason || 'Approved from enrichment review.',
      cover_letter: drafts.cover_letter,
      follow_up_email: drafts.follow_up_email,
      ai_draft_used: drafts.ai_draft_used,
      ai_draft_error: drafts.ai_draft_error,
      follow_up_status: input.follow_up_status || 'drafted',
      reviewed_at: input.reviewed_at || now,
      review_decision: 'approved',
    };

    await upsertDbRow(approved);
    return NextResponse.json({ ok: true, application: approved });
  } catch (error) {
    console.error('[APPROVE_REVIEW_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'failed to approve review job' }, { status: 500 });
  }
}
