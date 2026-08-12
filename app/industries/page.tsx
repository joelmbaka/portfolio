import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Industry Experience — FinTech, PropTech, Healthcare, Logistics & SaaS | Joel Mbaka',
  description:
    'Product engineering experience across FinTech, PropTech, accounting/reconciliation, healthcare/HMIS, logistics/transport, voice/AI SaaS, and other industries that need web, mobile, backend, cloud, and API systems.',
  alternates: { canonical: '/industries' },
  openGraph: {
    type: 'website',
    url: '/industries',
    title: 'Industry Experience | Joel Mbaka',
    description: 'Domain experience backed by production case studies, plus an industry-agnostic approach to web and mobile product engineering.',
  },
  twitter: { card: 'summary_large_image', title: 'Industry Experience | Joel Mbaka', description: 'FinTech, PropTech, healthcare, logistics, SaaS, and industry-agnostic product engineering.' },
};

const proven = [
  {
    title: 'FinTech, PropTech & accounting workflows',
    body: 'RentPayor combines property operations with financial and accounting state: rent invoices, M-Pesa collection, automatic invoice reconciliation, partial balances, tenant credits, receipts, leases, units, tenants, and payment history.',
    href: '/rentpayor',
  },
  {
    title: 'Healthcare & HMIS',
    body: 'CliviQue HMIS connects patient registration, clinical departments, inpatient/outpatient workflows, billing, facility operations, permissions, and facility-bound M-Pesa patient payments.',
    href: '/clivique-hmis',
  },
  {
    title: 'Logistics, transport & operational finance',
    body: 'Macsim Cargo covers loads, reservations, drivers, fleet, trip operations, documents, administration, finance, Daraja collection funding, and guarded B2C driver payouts.',
    href: '/macsim',
  },
  {
    title: 'Voice, consumer SaaS & applied AI',
    body: 'JournPad is a voice-first journaling product spanning audio capture, transcription, AI-assisted organization, goals, reminders, playback, subscriptions, and production mobile release.',
    href: '/journpad',
  },
];

const openIndustries = ['Construction', 'Finance', 'Banking', 'Insurance', 'Trade & commerce', 'Healthcare', 'Education', 'Legal', 'Government', 'Agriculture', 'Real estate', 'Property management', 'Transport', 'Logistics', 'Retail', 'Professional services', 'B2B SaaS', 'Consumer apps'];

export default function IndustriesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Industry experience — Joel Mbaka',
    url: `${base}/industries`,
    about: { '@id': `${base}/#person` },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Industry experience</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Domain-aware engineering without being limited to one industry.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          My strongest domain experience is backed by products in property/finance, healthcare, logistics, and consumer AI. I am still fundamentally industry-agnostic: if a business needs a mobile or web touchpoint, backend APIs, data, cloud services, payments, automation, or operational software, the underlying engineering problems are often transferable.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Proven domain experience">
        {proven.map((item) => (
          <article key={item.title} className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.body}</p>
            <Link href={item.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">See case study <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Open industries</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">I am open to any industry where software is a meaningful part of the product or operation.</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">Examples include the sectors below. They are not claims that I have already shipped a product in every one of them; they describe the markets I am open to working in.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {openIndustries.map((industry) => <span key={industry} className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">{industry}</span>)}
        </div>
      </section>

      <CTA />
    </main>
  );
}
