import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const contactRecipient = 'mbakajoe26@gmail.com';

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

export async function POST(req: Request) {
  try {
    const payload: unknown = await req.json();
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid contact request' }, { status: 400 });
    }

    const { name, email, message } = payload as Record<string, unknown>;
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ ok: false, error: 'Name, email and message are required' }, { status: 400 });
    }

    const senderName = name.trim();
    const senderEmail = email.trim();
    const messageText = message.trim();
    if (
      !senderName ||
      senderName.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail) ||
      senderEmail.length > 254 ||
      !messageText ||
      messageText.length > 10000
    ) {
      return NextResponse.json({ ok: false, error: 'Invalid contact details' }, { status: 400 });
    }

    // Resend configuration is optional at build time, but required to send email.
    // Never fall back to the expired joelmbaka.com sending domain.
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM?.trim();
    if (!apiKey || !from) {
      console.error('[CONTACT_NOT_CONFIGURED] RESEND_API_KEY or RESEND_FROM missing');
      return NextResponse.json(
        { ok: false, error: 'Email delivery is temporarily unavailable' },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [contactRecipient],
      subject: `New portfolio message from ${senderName}`,
      replyTo: senderEmail,
      html: `<p><strong>Name:</strong> ${escapeHtml(senderName)}</p><p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p><p>${escapeHtml(messageText).replace(/\n/g, '<br/>')}</p>`,
    });

    if (error) {
      console.error('[CONTACT_DELIVERY_ERROR]', error);
      return NextResponse.json(
        { ok: false, error: 'Unable to deliver the message' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return NextResponse.json({ ok: false, error: 'Unable to process the message' }, { status: 500 });
  }
}
