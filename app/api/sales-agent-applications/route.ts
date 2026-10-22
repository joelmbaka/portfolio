import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const recipient = process.env.AGENT_APPLICATION_NOTIFY_TO?.trim() || 'mbakajoe26@gmail.com';
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    };
    return entities[char] || char;
  });
}

function whatsAppLink(phone: string): string | null {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) digits = '254' + digits.slice(1);
  if (digits.startsWith('7') && digits.length === 9) digits = '254' + digits;
  return digits.length >= 9 && digits.length <= 15 ? 'https://wa.me/' + digits : null;
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
      !name || name.length < 2 ||
      !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !phone || !/^[+0-9() .-]+$/.test(phone) ||
      phone.replace(/\D/g, '').length < 9 || phone.replace(/\D/g, '').length > 15 ||
      !location || location.length < 2 ||
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
      if (result.rows[0]?.attempts > 8) {
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

    let notificationStatus = 'failed';
    let providerId: string | null = null;
    let deliveryError: string | null = null;
    try {
      const apiKey = process.env.RESEND_API_KEY?.trim();
      const from = process.env.RESEND_FROM?.trim();
      if (!apiKey || !from) throw new Error('Resend is not configured');

      const whatsapp = whatsAppLink(phone);
      const fields = [
        ['Name', name],
        ['WhatsApp', phone],
        ['Email', email],
        ['Town / County', location],
        ['Background', background || 'Not provided'],
        ['Finding clients', note || 'Not provided'],
        ['Source', sourceSafe],
        ['Application ID', id],
      ];
      const rows = fields.map(([label, value]) =>
        '<tr><td style="padding:8px;color:#475569">' + escapeHtml(label) +
        '</td><td style="padding:8px;font-weight:600">' + escapeHtml(value) + '</td></tr>'
      ).join('');
      const html =
        '<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:680px">' +
        '<h2>New Joeltech Sales Agent Application</h2><table>' + rows + '</table>' +
        (whatsapp ? '<p><a href="' + whatsapp + '">Message on WhatsApp</a></p>' : '') +
        '<p>Review this application before confirming any partnership.</p></div>';
      const text = fields.map(([label, value]) => label + ': ' + value).join('\n') +
        (whatsapp ? '\nWhatsApp: ' + whatsapp : '');
      const resend = new Resend(apiKey);
      const { data: emailData, error } = await resend.emails.send({
        from,
        to: [recipient],
        replyTo: email,
        subject: 'New Joeltech Sales Agent Application - ' + name + ' - ' + location,
        html,
        text,
      });
      if (error) throw new Error(error.message || 'Resend delivery failed');
      notificationStatus = 'sent';
      providerId = emailData?.id || null;
    } catch (error) {
      deliveryError = error instanceof Error ? error.message.slice(0, 500) : 'Notification failed';
      console.error('[SALES_AGENT_NOTIFICATION_FAILED]', id, deliveryError);
    }

    try {
      await db.query(
        'update sales_agent_applications set notification_status = $2, notification_provider_id = $3, notification_error = $4 where id = $1',
        [id, notificationStatus, providerId, deliveryError],
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
