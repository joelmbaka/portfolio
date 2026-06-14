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
  return String(row.employer_name || row.company || 'your team')
    .replace(/^Www\s+/i, '')
    .replace(/\s+Com$/i, '.com')
    .replace(/\s+\d+$/, '')
    .trim() || 'your team';
}

function cleanEmployerSummary(row: ApplicationRow, limit = 260) {
  const company = companyName(row);
  const tagline = compact(row.tagline, limit);
  if (tagline) return tagline;
  const escapedCompany = company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return compact(row.employer_summary, limit + 300)
    .replace(/^About\s+Companies\s+Library\s+Partners\s+Resources\s+Startup Jobs\s+Log in\s+Apply\s*/i, '')
    .replace(/^Companies\s+Library\s+Partners\s+Resources\s+Startup Jobs\s+Log in\s+Apply\s*/i, '')
    .replace(/^Home\s+›\s+Companies\s+›\s*/i, '')
    .replace(new RegExp(`^${escapedCompany}\\s+${escapedCompany}\\s+`, 'i'), '')
    .replace(new RegExp(`^${escapedCompany}\\s+careers\\s+`, 'i'), '')
    .replace(/^[a-z0-9.-]+\s+careers\s+/i, '')
    .replace(/^careers\s+/i, '')
    .replace(/\bActively Hiring\b/gi, '')
    .replace(/\bJobs\s+View all jobs\b[\s\S]*$/i, '')
    .replace(/\bView all jobs\b[\s\S]*$/i, '')
    .replace(/\b(WINTER|SPRING|SUMMER|FALL)\s+\d{4}\b/gi, '')
    .replace(/\bACTIVE\b/gi, '')
    .replace(/\b\d+-\d+ Employees\b/gi, '')
    .replace(/\bCompany Jobs\s+\d+\b/gi, '')
    .replace(/\bNews\b\s+https?:\/\/\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

function fallbackCoverLetter(row: ApplicationRow) {
  const company = companyName(row);
  const signals = [...(row.ai_matched_criteria || []), ...(row.matched_criteria || [])].slice(0, 3).join(', ');
  const employerSummary = cleanEmployerSummary(row);
  const recognition = employerSummary
    ? `I came across ${company} and liked the work you are doing: ${employerSummary}.`
    : `I came across ${company} and liked the practical product work your team is building.`;
  const impact = signals
    ? `The role stood out because it connects with ${signals}, which is exactly the kind of execution early teams need when turning product momentum into shipped software.`
    : 'The role stood out because it seems close to the kind of practical product execution early teams need when turning product momentum into shipped software.';

  return [
    `Hi ${company} team,`,
    '',
    recognition,
    impact,
    '',
    'I am a Software Engineer focused on React Native, Next.js, TypeScript, Python, and AI-powered product development. I help founders and early-stage teams turn rough ideas into polished mobile and web applications, from MVP architecture to App Store/Play Store launch, backend systems, payments, analytics, and deployment.',
    '',
    `I have built and shipped products including JournPad, RentPayor, Macsim Cargo, AI Stylist, and CliviQue HMIS. For ${company}, I would be useful where you need someone who can understand the product, move quickly, and own delivery across mobile, web, backend APIs, and AI workflows.`,
    '',
    'Portfolio: https://joelmbaka.com',
    'I would be happy to talk if you are looking for someone who can move quickly and own delivery from idea to production.',
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

const NIM_BASE_URL = process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NIM_PRIMARY_MODEL = process.env.NVIDIA_NIM_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1';
const NIM_FALLBACK_MODEL = process.env.NVIDIA_NIM_FALLBACK_MODEL || 'meta/llama-4-maverick-17b-128e-instruct';

async function postNim(payload: Record<string, unknown>) {
  if (!process.env.NVIDIA_NIM_API_KEY) {
    throw new Error('NVIDIA_NIM_API_KEY not configured');
  }

  const models = Array.from(new Set([NIM_PRIMARY_MODEL, NIM_FALLBACK_MODEL].filter(Boolean)));
  let lastResponse: Response | undefined;
  for (const model of models) {
    const response = await fetch(`${NIM_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, model }),
    });
    if (response.ok) return response;
    lastResponse = response;
    if ([401, 403].includes(response.status)) break;
  }

  throw new Error(`NVIDIA NIM ${lastResponse?.status || 'request failed'}`);
}

async function draftWithAi(row: ApplicationRow) {
  const fallback = {
    cover_letter: row.cover_letter || fallbackCoverLetter(row),
    follow_up_email: row.follow_up_email || fallbackFollowUpEmail(row),
    ai_draft_used: false,
    ai_draft_error: undefined as string | undefined,
  };

  if (!process.env.NVIDIA_NIM_API_KEY) {
    return { ...fallback, ai_draft_error: 'NVIDIA_NIM_API_KEY not configured' };
  }

  try {
    const response = await postNim({
      temperature: 0.25,
      max_tokens: 1200,
      messages: [
          {
            role: 'system',
            content: [
              'Return strict JSON only with keys cover_letter and follow_up_email.',
              'Cover letters must be concise, direct, and founder/startup friendly.',
              'For cover_letter only: lead with the company, its product, users, mission, or impact before introducing Joel.',
              'Avoid generic praise. Use concrete details from employer summary, fit reason, and job description.',
              'Then explain why Joel is a strong fit: React Native, Next.js, TypeScript, Python, AI product development, full product ownership, App Store/Play Store launch, backend systems, payments, analytics, and deployment.',
              'Mention proof briefly: JournPad, RentPayor, Macsim Cargo, AI Stylist, and CliviQue HMIS.',
              'End with Portfolio: https://joelmbaka.com and a soft invitation to talk. Do not mention a CV, resume, or attachment.',
              'Do not change the follow_up_email style beyond making it concise and ready to send.',
            ].join(' '),
          },
          {
            role: 'user',
            content: [
              'Joel is a software engineer and product-minded founder targeting founders and early-stage startups. The application should feel like he recognizes their work and can help them ship.',
              `Job: ${row.title || ''}`,
              `Company: ${companyName(row)}`,
              `Compensation: ${row.compensation || ''}`,
              `Employer summary: ${compact(row.employer_summary, 800)}`,
              `Fit reason: ${compact(row.ai_reason || row.reason, 800)}`,
              `Job description: ${compact(row.detail_body_excerpt || row.detail_description || row.text, 5000)}`,
              'Cover letter structure: 1) recognize the company/product/problem, 2) state why its impact matters, 3) introduce Joel and his relevant fit, 4) mention 2-3 concrete contribution areas, 5) include Portfolio: https://joelmbaka.com and a soft invitation to talk. Do not mention a CV, resume, or attachment.',
              'Keep cover letter under 220 words. Follow-up email should be ready for 3 business days after applying.',
            ].join('\n'),
          },
        ],
    });

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
