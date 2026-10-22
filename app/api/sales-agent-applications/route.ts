import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { sendSalesAgentApplicationEmails } from '@/lib/sales-agent-email';

export const runtime = 'nodejs';

const allowedBackgrounds = new Set([
  '',
  'Student or recent graduate',
  'IT or software professional',
  'Sales or business development',
  'Other',
]);
let pool: Pool | undefined;

function getPool(): Pool | null {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return null;
  if (!pool) {
    const url = new URL(raw);
    url.searchParams.delete('channel_binding');
    pool = new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: false },
      max: 2,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text.length <= max ? text : null;
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 16000) {
      return NextResponse.json({ ok: false, error: 'Submission is too large.' }, { status: 413 });
    }

    const origin = request.headers.get('origin');
    if (origin && new URL(origin).host !== new URL(request.url).host) {
      return NextResponse.json({ ok: false, error: 'Invalid request origin.' }, { status: 403 });
    }

    const payload: unknown = await request.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json({ ok: false, error: 'Invalid application.' }, { status: 400 });
    }
    const data = payload as Record<string, unknown>;

    // Bots that fill the visually hidden field get a plausible response without a write.
    if (data.website) return NextResponse.json({ ok: true });

    const name = clean(data.full_name, 100);
    const email = clean(data.email, 254)?.toLowerCase();
    const phone = clean(data.phone, 32);
    const location = clean(data.location, 100);
    const background = clean(data.background ?? '', 80);
    const note = clean(data.note ?? '', 500);
    const source = clean(data.source ?? 'website', 40);
    const sourceSafe = source && /^[a-zA-Z0-9_-]{1,40}$/.test(source) ? source.toLowerCase() : 'website';

    if (
      data.consent !== true ||
      !name || name.length < 2 || /[\r\n]/.test(name) ||
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone || !/^[+0-9() .-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 9 || phone.replace(/\D/g, '').length > 15 ||
      !location || location.length < 2 || /[\r\n]/.test(location) ||
      background === null || !allowedBackgrounds.has(background) ||
      note === null
    ) {
      return NextResponse.json({ ok: false, error: 'Please check the required details and consent.' }, { status: 400 });
    }

    const db = getPool();
    if (!db) {
      console.error('[SALES_AGENT_APPLICATION] DATABASE_URL is missing');
      return NextResponse.json({ ok: false, error: 'Applications are temporarily unavailable. Please try again.' }, { status: 503 });
    }

    const ip = (request.headers.get('x-vercel-forwarded-for') ||
      request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    // Hash the address before storage. A server-only secret prevents correlation across sites.
    const secret = process.env.AGENT_APPLICATION_HASH_SECRET?.trim() || process.env.DATABASE_URL?.trim() || '';
    if (ip && secret) {
      const fingerprint = createHmac('sha256', secret).update(ip).digest('hex');
      const result = await db.query<{ attempts: number }>(
        'insert into sales_agent_application_rate_limits (ip_fingerprint, window_started_at, attempts) ' +
        'values ($1, now(), 1) on conflict (ip_fingerprint) do update set ' +
        'attempts = case when sales_agent_application_rate_limits.window_started_at < now() - interval \'1 hour\' then 1 else sales_agent_application_rate_limits.attempts + 1 end, ' +
        'window_started_at = case when sales_agent_application_rate_limits.window_started_at < now() - interval \'1 hour\' then now() else sales_agent_application_rate_limits.window_started_at end ' +
        'returning attempts',
        [fingerprint],
      );
      if (result.rows[0]?.attempts > 30) {
        return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }

    // An existing email gets the same response; do not create duplicate leads or resend emails.
    const insert = await db.query<{ id: string }>(
      'insert into sales_agent_applications ' +
      '(full_name, phone, email, location, background, note, source, consent_at, status, notification_status) ' +
      'values ($1, $2, $3, $4, $5, $6, $7, now(), \'new\', \'pending\') ' +
      'on conflict (email) do nothing returning id',
      [name, phone, email, location, background || null, note || null, sourceSafe],
    );
    const id = insert.rows[0]?.id;
    if (!id) return NextResponse.json({ ok: true });

    const delivery = await sendSalesAgentApplicationEmails({
      id,
      name,
      email,
      phone,
      location,
      background: background || '',
      note: note || '',
      source: sourceSafe,
    });

    // Distinguish owner notifications from applicant acknowledgements.
    try {
      await db.query(
        'update sales_agent_applications set ' +
          'notification_status = $2, notification_provider_id = $3, notification_error = $4, ' +
          'applicant_notification_status = $5, applicant_notification_provider_id = $6, applicant_notification_error = $7 ' +
          'where id = $1',
        [
          id,
          delivery.internal.status,
          delivery.internal.providerId,
          delivery.internal.errorMessage,
          delivery.applicant.status,
          delivery.applicant.providerId,
          delivery.applicant.errorMessage,
        ],
      );
    } catch (error) {
      console.error('[SALES_AGENT_NOTIFICATION_STATUS_UPDATE_FAILED]', id, error);
    }

    // The record is saved even when email delivery fails; retry/review via database.
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('[SALES_AGENT_APPLICATION_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Unable to submit right now. Please try again.' }, { status: 500 });
  }
}
