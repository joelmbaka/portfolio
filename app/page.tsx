'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import { projects } from '@/config/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import Chatbot from '@/components/Chatbot';
import SlideIn from '@/components/SlideIn';
import { ArrowRight, Braces, Database, MonitorSmartphone, Rocket } from 'lucide-react';

const capabilityGroups = [
  {
    title: 'Mobile engineering',
    description:
      'React Native and Expo applications with authentication, native device capabilities, APIs, payments, audio/location workflows, testing, EAS builds, OTA updates, and App Store / Play Store release work.',
    technologies: 'React Native · Expo · TypeScript · EAS · iOS · Android',
    href: '/expertise/react-native-mobile-engineering',
    icon: MonitorSmartphone,
  },
  {
    title: 'Web applications',
    description:
      'Production web products and operational dashboards built around real workflows, responsive interfaces, data-heavy views, public search surfaces, and maintainable component systems.',
    technologies: 'Next.js · React · TypeScript · TanStack · Tailwind',
    href: '/expertise/nextjs-web-engineering',
    icon: Braces,
  },
  {
    title: 'Backend, APIs & data',
    description:
      'REST/GraphQL APIs, business logic, webhooks, relational data models, authentication, and third-party integrations designed to support complete products rather than isolated screens.',
    technologies: 'Python · FastAPI · PostgreSQL · SQLAlchemy · REST · GraphQL',
    href: '/expertise/fastapi-postgresql-backends',
    icon: Database,
  },
  {
    title: 'Production ownership',
    description:
      'I work across architecture, implementation, automated testing, payments, AI/LLM integrations, GitHub workflows, Vercel deployment, Expo EAS release, app stores, technical SEO, and iteration after launch.',
    technologies: 'Playwright · Maestro · Pytest · Jest · GitHub · Vercel · Expo EAS',
    href: '/expertise/automated-testing-quality-engineering',
    icon: Rocket,
  },
];

const productScopeSummary = [
  'Production mobile apps',
  'Complex web platforms',
  'APIs & relational data',
  'Testing, integrations & release',
];

export default function Home() {
  const selectedWork = ['journpad', 'clivique-hmis', 'rentpayor']
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${base}/#webpage`,
        url: `${base}/`,
        name: 'Joel Mbaka — Senior Full-Stack Product Engineer, Web & Mobile',
        dateModified: '2026-08-12',
        mainEntity: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        jobTitle: 'Senior Full-Stack Product Engineer — Web & Mobile',
        description:
          'Remote senior full-stack product engineer building 0→1 and production web/mobile products across React Native, Next.js, FastAPI, PostgreSQL, APIs, authentication, automated testing, payments, voice/LLM integrations, release engineering, and technical SEO.',
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
          'SQL',
          'SQLAlchemy',
          'REST APIs',
          'GraphQL',
          'Neo4j',
          'OAuth',
          'JWT authentication',
          'End-to-end testing',
          'Playwright',
          'Maestro',
          'pytest',
          'Jest',
          'M-Pesa Daraja',
          'Payment reconciliation',
          'Voice applications',
          'Speech-to-text',
          'Whisper',
          'LLM integrations',
          'AI agents',
          'Expo EAS',
          'App Store Connect',
          'Google Play Console',
          'Vercel',
          'Technical SEO',
          'Google Search Console',
          'Google Ads',
        ],
        sameAs: [
          'https://github.com/joelmbaka',
          'https://linkedin.com/in/joelmbaka',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name: 'Joel Mbaka',
        url: base,
        description:
          'Engineering portfolio covering production mobile, web, APIs, backend, data, automated testing, payments, voice/AI integration, app release, technical SEO, and startup product work.',
        publisher: { '@id': `${base}/#person` },
      },
    ],
  };

  return (
    <SlideIn>
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 md:pb-14 lg:px-8">
        <Hero />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section
          className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-2 border-y border-gray-200 py-4 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200 sm:gap-3 sm:py-5 lg:grid-cols-4 lg:gap-0 lg:py-6 lg:text-center"
          aria-label="Product engineering scope"
        >
          {productScopeSummary.map((item) => (
            <div
              key={item}
              className="flex min-h-16 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left leading-5 dark:border-gray-800 dark:bg-gray-900/60 sm:px-4 lg:min-h-0 lg:justify-center lg:rounded-none lg:border-0 lg:bg-transparent lg:px-3 lg:py-0 lg:text-center dark:lg:bg-transparent"
            >
              <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-palm-green lg:hidden" aria-hidden />
              <span>{item}</span>
            </div>
          ))}
        </section>

        <section id="capabilities" className="container mx-auto mt-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Engineering scope</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              One engineer across the product stack.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              My strongest work sits at the intersection of product engineering and systems thinking: building the interface users touch while also owning the APIs, data model, authentication, automated tests, integrations, and production path behind it.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {capabilityGroups.map(({ title, description, technologies, href, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-palm-green dark:bg-emerald-950/30">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
                <p className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-400">{technologies}</p>
                <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">
                  Explore expertise <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link href="/expertise" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-palm-green dark:text-gray-400">
              View engineering expertise <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-palm-green dark:text-gray-400">
              Complete technical skills <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/industries" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-palm-green dark:text-gray-400">
              Industry experience <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <section id="work" className="container mx-auto mt-24 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Selected work</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Products that show different sides of the stack.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              These projects are selected for engineering breadth: a production voice/mobile product, a complex healthcare web platform, and a PropTech/FinTech product spanning mobile, backend, data, payments, accounting-style reconciliation, testing, and operational tooling.
            </p>
          </div>
          <ProjectsCarousel projects={selectedWork} />
          <div className="mt-7 flex justify-center">
            <Link href="/work" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-palm-green dark:text-gray-400">
              View all projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <CTA />
        <Chatbot />
      </main>
    </SlideIn>
  );
}
