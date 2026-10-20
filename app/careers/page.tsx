import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, GraduationCap, Handshake, PackageCheck, Sparkles } from 'lucide-react';
import { careerOpportunities } from '@/config/career-opportunities';

export const metadata: Metadata = {
  title: 'Careers, Internships & Partnerships | Joeltech Geek Systems',
  description: 'Explore engineering collaborations, internships, SaaS sales partnerships and independent sales agent opportunities at Joeltech Geek Systems.',
  alternates: { canonical: '/careers' },
  openGraph: {
    type: 'website',
    url: '/careers',
    title: 'Careers & Partnerships | Joeltech Geek Systems',
    description: 'Explore engineering, learning and independent sales opportunities at Joeltech Geek Systems.',
  },
};

const icons = {
  engineers: Code2,
  internships: GraduationCap,
  saas: PackageCheck,
  agents: Handshake,
};

export default function CareersPage() {
  return (
    <main className="site-container pb-16 pt-28">
      <header className="max-w-4xl">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-palm-green">
          <Sparkles className="h-4 w-4" aria-hidden /> Careers &amp; partnerships
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Find your way to work with Joeltech Geek Systems.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Explore engineering collaborations, practical internships and two distinct ways to connect businesses with software. Select an opportunity to see the details and how to express interest.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
          Kenya-based · Remote options depend on the opportunity · These are expressions of interest, not guaranteed vacancies
        </p>
      </header>

      <section className="mt-12 grid items-stretch gap-5 md:grid-cols-2" aria-label="Careers and partnership opportunities">
        {careerOpportunities.map((opportunity) => {
          const Icon = icons[opportunity.slug];
          return (
            <article key={opportunity.slug} id={opportunity.anchor} className="flex min-w-0 flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-palm-green hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-palm-green dark:bg-emerald-950/40">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-palm-green">{opportunity.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{opportunity.title}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">{opportunity.summary}</p>
              <ul className="mt-5 space-y-2" aria-label="Highlights">
                {opportunity.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2.5 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    <span className="text-palm-green" aria-hidden>✓</span><span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <Link href={'/careers/' + opportunity.slug} aria-label={'Explore ' + opportunity.title + ' opportunity'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-palm-green px-5 py-3 text-sm font-semibold text-palm-green transition hover:bg-palm-green hover:text-white">
                  Explore opportunity <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-16 grid gap-7 rounded-3xl bg-gray-50 p-8 dark:bg-gray-900/60 md:grid-cols-[auto_1fr] sm:p-10">
        <BookOpen className="h-10 w-10 text-palm-green" aria-hidden />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Looking for developer mentorship?</h2>
          <p className="mt-3 text-base leading-8 text-gray-600 dark:text-gray-300">Mentorship is a separate learning pathway. It is not employment, an accredited qualification or a guaranteed internship.</p>
          <Link href="/mentorship" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-palm-green hover:underline">
            Explore mentorship <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
      <p className="mt-10 text-sm text-gray-600 dark:text-gray-400">
        Have a different enquiry? <Link href="/contact" className="font-semibold text-palm-green hover:underline">Contact Joeltech Geek Systems</Link>.
      </p>
    </main>
  );
}
