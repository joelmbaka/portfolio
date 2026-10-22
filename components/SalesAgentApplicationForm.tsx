'use client';

import { FormEvent, useState } from 'react';

type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const inputClass =
  'mt-2 min-h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-palm-green focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-emerald-900';

export function SalesAgentApplicationForm() {
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const [isFormReady, setIsFormReady] = useState(false);

  function updateFormReadiness(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement | null)?.value ?? '';
    const digits = phone.replace(/\D/g, '');

    // Mirror API phone requirements; don't enable the CTA for invalid contact details.
    setIsFormReady(form.checkValidity() && /^[+0-9() .-]+$/.test(phone) && digits.length >= 9 && digits.length <= 15);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormReady || state.status === 'submitting') return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setState({ status: 'submitting' });

    try {
      const response = await fetch('/api/sales-agent-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.get('fullName'),
          phone: data.get('phone'),
          email: data.get('email'),
          location: data.get('location'),
          background: data.get('background'),
          note: data.get('note'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
          source: new URLSearchParams(window.location.search).get('utm_source') || 'website',
        }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || 'We could not submit your application. Please try again.');
      }
      form.reset();
      setIsFormReady(false);
      setState({ status: 'success' });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'We could not submit your application.',
      });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-7 dark:border-emerald-800 dark:bg-emerald-950/40 sm:p-8" role="status">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Application received</h3>
        <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-200">
          Thanks for your interest. We&apos;ll review your details and contact you on WhatsApp or email if there&apos;s a suitable fit. Submitting does not automatically enrol you or guarantee work.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      onInput={updateFormReadiness}
      onChange={updateFormReadiness}
      className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Apply to become a sales partner</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
        About a minute to apply. No CV or coding experience required.
      </p>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="sales-agent-website">Website</label>
        <input id="sales-agent-website" name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          Full name <span aria-hidden="true">*</span>
          <input className={inputClass} type="text" name="fullName" placeholder="Your name" autoComplete="name" minLength={2} maxLength={100} required />
        </label>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          WhatsApp number <span aria-hidden="true">*</span>
          <input className={inputClass} type="tel" name="phone" placeholder="e.g. 0712 345 678" autoComplete="tel" minLength={9} maxLength={32} required />
        </label>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          Email address <span aria-hidden="true">*</span>
          <input className={inputClass} type="email" name="email" placeholder="you@example.com" autoComplete="email" maxLength={254} required />
        </label>
        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
          Town / county <span aria-hidden="true">*</span>
          <input className={inputClass} type="text" name="location" placeholder="e.g. Kisii" autoComplete="address-level1" minLength={2} maxLength={100} required />
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
        Your background <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
        <select name="background" className={inputClass} defaultValue="">
          <option value="">Select if applicable</option>
          <option value="Student or recent graduate">Student or recent graduate</option>
          <option value="IT or software professional">IT or software professional</option>
          <option value="Sales or business development">Sales or business development</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="mt-5 block text-sm font-semibold text-gray-800 dark:text-gray-200">
        How might you find businesses that need software? <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
        <textarea
          name="note"
          rows={3}
          maxLength={500}
          placeholder="For example, local shops, schools, clinics or business owners you know."
          className={inputClass + ' min-h-24 resize-y'}
        />
      </label>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
        <input className="mt-1 h-4 w-4 shrink-0 accent-emerald-600" name="consent" type="checkbox" required />
        <span>I agree that Joeltech Geek Systems may store these details and contact me about this sales partnership application. I can request removal at mbakajoe26@gmail.com.</span>
      </label>

      {state.status === 'error' && (
        <p className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200" role="alert">
          {state.message} If this continues, email mbakajoe26@gmail.com.
        </p>
      )}

      <button
        type="submit"
        disabled={!isFormReady || state.status === 'submitting'}
        className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 py-3 font-semibold transition sm:w-auto ${
          isFormReady && state.status !== 'submitting'
            ? 'bg-palm-green text-white hover:opacity-90'
            : 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        {state.status === 'submitting' ? 'Submitting...' : 'Submit application'}
      </button>
      <p className="mt-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
        No signup fee. This is an independent, commission-based opportunity—not a salaried vacancy. Commission is subject to accepted referrals and written terms.
      </p>
    </form>
  );
}
