import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { expertiseAreas, findExpertiseArea } from '@/config/expertise';
import { projects } from '@/config/projects';
import CTA from '@/components/CTA';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export function generateStaticParams() {
  return expertiseAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = findExpertiseArea(slug);

  if (!area) {
    return { title: 'Engineering Expertise Not Found' };
  }

  return {
    title: area.searchTitle,
    description: area.description,
    alternates: { canonical: `/expertise/${area.slug}` },
    openGraph: {
      type: 'website',
      url: `/expertise/${area.slug}`,
      title: area.searchTitle,
      description: area.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: area.searchTitle,
      description: area.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ExpertiseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const area = findExpertiseArea(slug);
  if (!area) return notFound();

  const evidence = area.evidenceProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  const canonical = `${base}/expertise/${area.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: area.searchTitle,
        description: area.description,
        dateModified: '2026-08-12',
        about: {
          '@id': `${base}/#person`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        url: base,
        jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
        knowsAbout: area.technologies,
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Expertise', item: `${base}/expertise` },
          { '@type': 'ListItem', position: 3, name: area.title, item: canonical },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/expertise" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-palm-green dark:text-gray-400">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Engineering expertise
      </Link>

      <header className="mt-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">{area.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">{area.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">{area.intro}</p>
      </header>

      <section className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">What this looks like in practice</p>
          <ul className="mt-5 space-y-4">
            {area.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-palm-green" aria-hidden />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Core technologies</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {area.technologies.map((technology) => (
              <span key={technology} className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                {technology}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-16" aria-labelledby="evidence-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Project evidence</p>
          <h2 id="evidence-heading" className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Products that demonstrate this capability</h2>
          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
            Each project below links to a deeper case study covering product scope, engineering ownership, supporting systems, and production evidence.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {evidence.map((project) => (
            <article key={project.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{project.type} · Case study</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{project.description}</p>
              <Link href={`/${project.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
                Read case study <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
