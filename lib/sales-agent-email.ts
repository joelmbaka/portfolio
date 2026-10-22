import { Resend } from 'resend';

type Delivery = {
  status: 'sent' | 'failed';
  providerId: string | null;
  errorMessage: string | null;
};

type NotificationPayload = {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  background: string;
  note: string;
  source: string;
};

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  };
  return value.replace(/[&<>"']/g, char => entities[char] || char);
}

function whatsappLink(phone: string): string | null {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) digits = '254' + digits.slice(1);
  if (digits.startsWith('7') && digits.length === 9) digits = '254' + digits;
  return digits.length >= 9 && digits.length <= 15 ? 'https://wa.me/' + digits : null;
}

async function deliver(
  resend: Resend,
  payload: NotificationPayload,
  applicationId: string,
  kind: 'internal' | 'applicant',
): Promise<Delivery> {
  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) throw new Error(error.message || 'Resend rejected the email');
    return { status: 'sent', providerId: data?.id || null, errorMessage: null };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : 'Email send failed';
    console.error('[SALES_AGENT_EMAIL_FAILED]', { applicationId, kind, message });
    return { status: 'failed', providerId: null, errorMessage: message };
  }
}

export async function sendSalesAgentApplicationEmails(
  applicant: Applicant,
): Promise<{ internal: Delivery; applicant: Delivery }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  const recipient = process.env.AGENT_APPLICATION_NOTIFY_TO?.trim() || 'mbakajoe26@gmail.com';

  if (!apiKey || !from) {
    console.error('[SALES_AGENT_EMAIL_NOT_CONFIGURED]', applicant.id);
    const failed: Delivery = {
      status: 'failed', providerId: null, errorMessage: 'Resend is not configured',
    };
    return { internal: failed, applicant: failed };
  }

  const fields = [
    ['Name', applicant.name],
    ['WhatsApp', applicant.phone],
    ['Email', applicant.email],
    ['Town / County', applicant.location],
    ['Background', applicant.background || 'Not provided'],
    ['Finding clients', applicant.note || 'Not provided'],
    ['Source', applicant.source],
    ['Application ID', applicant.id],
  ];
  const rows = fields.map(([label, value]) =>
    '<tr><td style="padding:8px;color:#475569">' + escapeHtml(label) +
    '</td><td style="padding:8px;font-weight:600">' + escapeHtml(value) + '</td></tr>'
  ).join('');
  const whatsapp = whatsappLink(applicant.phone);
  const internalHtml =
    '<div style="font-family:Arial,sans-serif;color:#0f172a;max-width:680px">' +
    '<h2>New Joeltech Sales Agent Application</h2><table>' + rows + '</table>' +
    (whatsapp ? '<p><a href="' + whatsapp + '">Message on WhatsApp</a></p>' : '') +
    '<p>Review this application before confirming any partnership.</p></div>';
  const internalText = fields.map(([label, value]) => label + ': ' + value).join('\n') +
    (whatsapp ? '\nWhatsApp: ' + whatsapp : '');

  const firstName = applicant.name.trim().split(/\s+/)[0] || 'there';
  const applicantHtml =
    '<div style="max-width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#1f2937">' +
    '<div style="background:#064e3b;color:white;padding:28px;border-radius:16px 16px 0 0">' +
    '<p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 8px">Joeltech Geek Systems</p>' +
    '<h1 style="font-size:25px;line-height:1.3;margin:0">We received your application</h1></div>' +
    '<div style="border:1px solid #e5e7eb;border-top:0;padding:28px;border-radius:0 0 16px 16px">' +
    '<p>Hi ' + escapeHtml(firstName) + ',</p>' +
    '<p>Thank you for your interest in working with Joeltech Geek Systems as an independent Sales Agent. ' +
    'Your application has been received.</p>' +
    '<p>We will review your details and reach out using your contact information if there is a suitable fit.</p>' +
    '<p><strong>No action is required right now.</strong> You can review the opportunity and commission terms here:</p>' +
    '<p><a href="https://joeltechgeek.com/careers/agents" style="color:#047857;font-weight:600">Sales Agents opportunity</a></p>' +
    '<p style="font-size:13px;line-height:1.6;color:#64748b">This email confirms receipt only, not approval or employment. ' +
    'An active partnership and commission entitlement require separately agreed written terms.</p>' +
    '<p style="margin-top:24px">Joeltech Geek Systems</p></div></div>';
  const applicantText = [
    'Hi ' + firstName + ',',
    '',
    'Thank you for your interest in working with Joeltech Geek Systems as an independent Sales Agent.',
    'Your application has been received.',
    '',
    'We will review your details and contact you if there is a suitable fit.',
    'No action is required right now.',
    '',
    'Review the opportunity and commission terms:',
    'https://joeltechgeek.com/careers/agents',
    '',
    'This email confirms receipt only, not approval or employment.',
    'An active partnership and commission entitlement require separately agreed written terms.',
    '',
    'Joeltech Geek Systems',
  ].join('\n');

  // Keep these requests independent: failure of one must never block the other.
  const resend = new Resend(apiKey);
  const internal = await deliver(resend, {
    from,
    to: [recipient],
    replyTo: applicant.email,
    subject: 'New Joeltech Sales Agent Application - ' + applicant.name + ' - ' + applicant.location,
    html: internalHtml,
    text: internalText,
  }, applicant.id, 'internal');
  const applicantResult = await deliver(resend, {
    from,
    to: [applicant.email],
    replyTo: recipient,
    subject: 'Your Sales Agent application was received - Joeltech Geek Systems',
    html: applicantHtml,
    text: applicantText,
  }, applicant.id, 'applicant');
  return { internal, applicant: applicantResult };
}
