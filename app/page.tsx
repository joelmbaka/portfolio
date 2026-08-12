'use client';

import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import { projects } from '@/config/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import Chatbot from '@/components/Chatbot';
import SlideIn from '@/components/SlideIn';
import { Braces, Database, MonitorSmartphone, Rocket } from 'lucide-react';

const capabilityGroups = [
  {
    title: 'Mobile engineering',
    description:
      'React Native and Expo applications with authentication, native device capabilities, API integrations, testing, and App Store / Play Store release work.',
    technologies: 'React Native · Expo · TypeScript · iOS · Android',
    icon: MonitorSmartphone,
  },
  {
    title: 'Web applications',
    description:
      'Production web products and operational dashboards built around real workflows, responsive interfaces, data-heavy views, and maintainable component systems.',
    technologies: 'Next.js · React · TypeScript · TanStack · Tailwind',
    icon: Braces,
  },
  {
    title: 'Backend & data',
    description:
      'APIs, business logic, background workflows, relational data models, authentication, and integrations designed to support complete products rather than isolated screens.',
    technologies: 'Python · FastAPI · PostgreSQL · SQLAlchemy · REST',
    icon: Database,
  },
  {
    title: 'Production ownership',
    description:
      'I work across the full delivery path: architecture, implementation, third-party integrations, testing, deployment, observability, release, and iteration after launch.',
    technologies: 'Vercel · Docker · CI/testing · Cloud APIs · AI integrations',
    icon: Rocket,
  },
];

export default function Home() {
  const selectedWork = ['journpad', 'clivique-hmis', 'rentpayor']
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  const additionalWork = projects.filter(
    (project) => !selectedWork.some((selected) => selected.id === project.id),
  );

  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Joel Mbaka',
      jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
      description:
        'Senior full-stack engineer building production web and mobile products across frontend, backend, data, integrations, and release.',
      url: base,
      knowsAbout: [
        'React Native',
        'Next.js',
        'TypeScript',
        'Python',
        'FastAPI',
        'PostgreSQL',
        'Mobile application development',
        'Web application development',
        'AI integrations',
      ],
      sameAs: [
        'https://github.com/joelmbaka',
        'https://linkedin.com/in/joelmbaka',
        'https://x.com/mbaka_joe',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Joel Mbaka',
      url: base,
    },
  ];

  return (
    <SlideIn>
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 md:pb-14 lg:px-8">
        <Hero />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="mx-auto mt-16 grid max-w-5xl gap-3 border-y border-gray-200 py-6 text-center text-sm font-medium text-gray-600 dark:border-gray-800 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
          <span>Production mobile apps</span>
          <span>Complex web platforms</span>
          <span>APIs & relational data</span>
          <span>Integrations & release</span>
        </section>

        <section id="capabilities" className="container mx-auto mt-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Engineering scope</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              One engineer across the product stack.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              My strongest work sits at the intersection of product engineering and systems thinking: building the interface users touch while also owning the APIs, data model, integrations, and production path behind it.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {capabilityGroups.map(({ title, description, technologies, icon: Icon }) => (
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
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="container mx-auto mt-24 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Selected work</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Products that show different sides of the stack.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              These projects are selected for engineering breadth: a production mobile product, a complex web platform, and a product spanning mobile, backend, data, and operational tooling.
            </p>
          </div>
          <ProjectsCarousel projects={selectedWork} />
        </section>

        {additionalWork.length > 0 && (
          <section className="container mx-auto mt-20 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">More work</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Additional product builds</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mobile, operations, and AI-assisted products</p>
            </div>
            <ProjectsCarousel projects={additionalWork} />
          </section>
        )}

        <CTA />
        <Chatbot />
      </main>
    </SlideIn>
  );
}
