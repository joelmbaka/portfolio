import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { expertiseAreas } from '@/config/expertise';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Engineering Expertise — Mobile, Web, APIs, Data, AI, Payments & SEO | Joel Mbaka',
  description:
    'Explore Joel Mbaka’s specialist engineering expertise across React Native, Next.js, FastAPI/PostgreSQL, REST/GraphQL APIs, databases, voice/LLM systems, authentication, payments, CI/CD, app release, and technical SEO.',
  alternates: { canonical: '/expertise' },
  openGraph: {
    type: 'website',
    url: '/expertise',
    title: 'Engineering Expertise | Joel Mbaka',
    description: 'Mobile, web, backend, APIs, data, AI, payments, security, release, and search expertise supported by real product work.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Expertise | Joel Mbaka',
    description: 'Mobile, web, backend, APIs, data, AI, payments, security, release, and search expertise supported by real product work.',
  },
};

export default function ExpertisePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Expertise — Joel Mbaka',
    description: metadata.description,
    url: `${base}/expertise`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: expertiseAreas.map((area, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: area.title,
        url: `${base}/expertise/${area.slug}`,
      })),
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Engineering expertise</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Full-stack product engineering across the systems that make software work in production.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          These pages make the technical breadth behind my case studies explicit: mobile, web, APIs, databases, authentication, payments, voice and LLM integrations, cloud/release workflows, and search/distribution. Each area connects back to products that provide evidence instead of relying on a keyword list alone.
        </p>
        <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/skills" className="inline-flex items-center gap-2 text-palm-green hover:underline">Complete technical skills inventory <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/work-with-me" className="inline-flex items-center gap-2 text-palm-green hover:underline">Contract & startup work <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/industries" className="inline-flex items-center gap-2 text-palm-green hover:underline">Industry experience <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Engineering expertise areas">
        {expertiseAreas.map((area) => (
          <article key={area.slug} className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">{area.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{area.title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{area.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {area.technologies.slice(0, 7).map((technology) => (
                <span key={technology} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {technology}
                </span>
              ))}
            </div>
            <Link href={`/expertise/${area.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
              Explore this expertise <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>
        ))}
      </section>

      <CTA />
    </main>
  );
}
