import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Ensure RESEND_API_KEY exists in .env.local (process.env)
const resend = new Resend(process.env.RESEND_API_KEY ?? '');

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const { data, error: resendError } = await resend.emails.send({
      from: 'Portfolio <contact@joelmbaka.site>',
      to: ['mbakajoe26@gmail.com'],
      subject: `New message from ${name}`,
      replyTo: email,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${(message || '').replace(/\n/g, '<br/>')}</p>`,
    });

    console.log('RESEND RESPONSE', { data, resendError });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
