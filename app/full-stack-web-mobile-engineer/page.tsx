import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { projects } from '@/config/projects';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Senior Full-Stack Web & Mobile Engineer | Joel Mbaka',
  description:
    'Senior full-stack web and mobile engineer building production React Native apps, Next.js web products, FastAPI/PostgreSQL backends, payment integrations, AI workflows, and operational tooling.',
  alternates: { canonical: '/full-stack-web-mobile-engineer' },
  openGraph: {
    type: 'profile',
    url: '/full-stack-web-mobile-engineer',
    title: 'Senior Full-Stack Web & Mobile Engineer | Joel Mbaka',
    description:
      'Production product engineering across React Native, Next.js, FastAPI, PostgreSQL, payments, AI integrations, testing, and release.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senior Full-Stack Web & Mobile Engineer | Joel Mbaka',
    description:
      'Production product engineering across React Native, Next.js, FastAPI, PostgreSQL, payments, AI integrations, testing, and release.',
  },
  robots: { index: true, follow: true },
};

const stackLayers = [
  {
    title: 'Mobile',
    body: 'React Native and Expo applications with native device capabilities, secure authentication, API integration, local persistence, testing, and iOS/Android release work.',
    href: '/expertise/react-native-mobile-engineering',
  },
  {
    title: 'Web',
    body: 'Next.js and React products ranging from public search-oriented websites to authenticated operational systems and workflow-heavy dashboards.',
    href: '/expertise/nextjs-web-engineering',
  },
  {
    title: 'Backend & data',
    body: 'Python/FastAPI services, PostgreSQL data models, SQLAlchemy/Alembic migrations, business rules, callbacks, authentication, and transactional workflows.',
    href: '/expertise/fastapi-postgresql-backends',
  },
  {
    title: 'Integrations & automation',
    body: 'M-Pesa/Daraja payment flows, AI APIs, voice and image processing, lead automation, cloud services, testing, deployment, and production operations.',
    href: '/expertise/ai-integrations-automation',
  },
];

const faqs = [
  {
    question: 'What does full-stack web and mobile engineering mean in your work?',
    answer:
      'It means owning the product across the interface and the systems behind it: React Native or Next.js, backend APIs, relational data, authentication, integrations, testing, deployment, and production behavior.',
  },
  {
    question: 'What mobile technologies do you work with?',
    answer:
      'My primary mobile stack is React Native with Expo and TypeScript, including native device capabilities, secure authentication, API integration, local persistence, analytics, testing, and App Store or Play Store release work.',
  },
  {
    question: 'What web and backend technologies do you use?',
    answer:
      'My web work centers on Next.js, React, and TypeScript. On the backend I commonly use Python, FastAPI, PostgreSQL, SQLAlchemy, and Alembic for APIs, transactional workflows, and relational business data.',
  },
  {
    question: 'Which projects best demonstrate end-to-end ownership?',
    answer:
      'JournPad demonstrates mobile and AI-assisted voice workflows, CliviQue HMIS demonstrates a complex web and backend system, and RentPayor demonstrates mobile, backend, data, M-Pesa collection, reconciliation, and internal operational tooling.',
  },
];

export default function FullStackWebMobileEngineerPage() {
  const evidence = ['journpad', 'clivique-hmis', 'rentpayor']
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  const canonical = `${base}/full-stack-web-mobile-engineer`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: 'Senior Full-Stack Web & Mobile Engineer | Joel Mbaka',
        description: metadata.description,
        dateModified: '2026-08-12',
        mainEntity: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
        url: base,
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
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Full-Stack Web & Mobile Engineer', item: canonical },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Senior product engineering</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Senior Full-Stack Web &amp; Mobile Engineer
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          I build and operate complete software products across the layers that users see and the systems they depend on: mobile apps, web applications, APIs, relational data, payments, AI integrations, testing, and production delivery.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Full-stack engineering layers">
        {stackLayers.map((layer) => (
          <article key={layer.title} className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">{layer.title}</p>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{layer.body}</p>
            <Link href={layer.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
              Explore this capability <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-16" aria-labelledby="end-to-end-proof">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">End-to-end evidence</p>
          <h2 id="end-to-end-proof" className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Products that cross multiple engineering layers</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            The strongest evidence is not a technology list. It is software where one product requirement crosses the interface, backend, data model, integration boundary, and production workflow.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {evidence.map((project) => (
            <article key={project.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{project.type} · Case study</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{project.description}</p>
              <Link href={`/${project.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
                Read engineering case study <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">What end-to-end ownership changes</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            'Product decisions can account for backend and data constraints before they become UI problems.',
            'Payment and callback workflows can be designed around idempotency, reconciliation, and failure states rather than only the happy path.',
            'Mobile and web interfaces can share coherent business rules because the API contracts and relational model are designed with them.',
            'Testing and release become part of the feature design instead of a separate hand-off after implementation.',
          ].map((item) => (
            <div key={item} className="flex gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-palm-green" aria-hidden />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-4xl" aria-labelledby="full-stack-faq">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Frequently asked questions</p>
        <h2 id="full-stack-faq" className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Full-stack web and mobile engineering</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/70">
              <summary className="cursor-pointer list-none font-semibold text-gray-900 dark:text-white">{faq.question}</summary>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
