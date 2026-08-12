import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Remote Contract Product Engineer for Startups | Joel Mbaka',
  description:
    'Remote senior product engineer for startup contracts and full-time roles. Best fit: 0→1 products, React Native, Next.js, FastAPI/PostgreSQL, APIs, payments, AI integrations, and end-to-end feature ownership.',
  alternates: { canonical: '/work-with-me' },
  openGraph: {
    type: 'website',
    url: '/work-with-me',
    title: 'Remote Contract Product Engineer for Startups | Joel Mbaka',
    description: 'Contract preferred, remote only, open to full-time. Product engineering from 0→1 and through production.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remote Contract Product Engineer for Startups | Joel Mbaka',
    description: 'Contract preferred, remote only, open to full-time. Product engineering from 0→1 and through production.',
  },
};

const bestFit = [
  'Early-stage startups that need a product shipped from scratch or a prototype turned into a production system.',
  'Founders who want one engineer to own a meaningful product area across mobile/web UI, API, data, integrations, testing, and release.',
  'Existing implementations that need stronger architecture, faster UX, production hardening, payment/API integration, or mobile/web expansion.',
  'Remote teams that value fast iteration, direct communication, branch-based delivery, and measurable shipped outcomes.',
];

const engagement = [
  { title: 'Contract / project work — preferred', body: 'I prefer scoped engagements where I can understand the product, estimate the implementation, agree on deliverables, and quote based on the size and complexity of the work.' },
  { title: '0→1 startup product development', body: 'This is my strongest fit: turning a product requirement into architecture, implementation, backend state, integrations, tests, deployment, and a usable production release.' },
  { title: 'Feature or system ownership', body: 'I am comfortable taking ownership of a complete feature area rather than waiting for every implementation decision to be decomposed into isolated tickets.' },
  { title: 'Full-time roles — open', body: 'Contract work is my preference, not a restriction. I am open to a strong full-time remote role where the product, engineering scope, and ownership are a good fit.' },
];

export default function WorkWithMePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Work with Joel Mbaka — Remote Contract Product Engineer',
    url: `${base}/work-with-me`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${base}/#person`,
      name: 'Joel Mbaka',
      jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
      url: base,
      knowsAbout: ['0 to 1 product development', 'startup product engineering', 'React Native', 'Next.js', 'FastAPI', 'PostgreSQL', 'API integration', 'AI integration', 'mobile app release'],
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Work with me</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Remote product engineering for startups that need software shipped.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          I prefer contract work and 0→1 startup environments where the engineering problem is still broad enough to benefit from end-to-end ownership. I can scope a project, estimate it, build it, release it, and iterate after real users touch it. I am remote only and also open to a strong full-time role.
        </p>
        <div className="mt-7 flex flex-wrap gap-2 text-sm">
          {['Remote only', 'Contract preferred', 'Open to full-time', '0→1 products', 'Feature ownership', 'Fast iteration'].map((item) => (
            <span key={item} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">{item}</span>
          ))}
        </div>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {engagement.map((item) => (
          <article key={item.title} className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Best fit</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Where I create the most leverage.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {bestFit.map((item) => (
            <div key={item} className="flex gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-palm-green" aria-hidden />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Current founder context</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Building products does not prevent me from joining yours.</h2>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          My launched products are in learning and product-market-fit stages rather than continuous full-time feature development. Most current work is targeted UX improvement, maintenance, patches, distribution, and validation. That leaves me available for meaningful contract or full-time engineering work.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/work" className="inline-flex items-center gap-2 text-palm-green hover:underline">See product case studies <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/skills" className="inline-flex items-center gap-2 text-palm-green hover:underline">Review technical skills <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>

      <CTA />
    </main>
  );
}
