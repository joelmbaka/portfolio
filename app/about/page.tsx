import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { projects } from '@/config/projects';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'About Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
  description:
    'Learn how Joel Mbaka works across React Native mobile apps, Next.js web applications, FastAPI/PostgreSQL backends, payments, AI integrations, testing, and production delivery.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    url: '/about',
    title: 'About Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
    description:
      'Product engineering across mobile, web, backend, data, integrations, testing, and production delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
    description:
      'Product engineering across mobile, web, backend, data, integrations, testing, and production delivery.',
  },
};

const ownership = [
  'React Native and Expo mobile products for iOS and Android',
  'Next.js and React web applications and operational workspaces',
  'Python/FastAPI services, PostgreSQL data models, and business logic',
  'Authentication, payments, AI APIs, cloud integrations, and automation',
  'Testing, release, deployment, observability, and post-launch iteration',
];

export default function AboutPage() {
  const flagship = ['journpad', 'clivique-hmis', 'rentpayor']
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${base}/about#webpage`,
        url: `${base}/about`,
        name: 'About Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
        dateModified: '2026-08-12',
        mainEntity: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        url: base,
        jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
        description:
          'Full-stack product engineer working across mobile, web, backend, data, integrations, and production delivery.',
        knowsAbout: [
          'React Native',
          'Expo',
          'Next.js',
          'React',
          'TypeScript',
          'Python',
          'FastAPI',
          'PostgreSQL',
          'SQLAlchemy',
          'M-Pesa integrations',
          'AI integrations',
        ],
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka', 'https://x.com/mbaka_joe'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${base}/about` },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">About</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          I build complete software products across web and mobile.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          I work as a senior full-stack product engineer across the layers that make software useful in production: the mobile or web interface, backend APIs, relational data, integrations, testing, deployment, and the operational systems around the core product.
        </p>
      </header>

      <section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">What I own</p>
          <ul className="mt-5 space-y-4">
            {ownership.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-palm-green" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">How I think about full-stack work</p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">The product is the system, not just the interface.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            A useful feature often crosses several boundaries at once. A rent payment touches the tenant experience, payment provider, invoice model, callback handling, reconciliation and receipts. A hospital workflow touches permissions, patient context, departmental queues, billing and auditability. I prefer owning those boundaries together so the product behaves coherently end to end.
          </p>
          <Link href="/expertise" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
            Explore engineering expertise <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      </section>

      <section className="mt-16" aria-labelledby="representative-work">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Representative work</p>
          <h2 id="representative-work" className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Three products, three sides of the stack</h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {flagship.map((project) => (
            <article key={project.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{project.type}</p>
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
