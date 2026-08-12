import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/config/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import CTA from '@/components/CTA';
import Chatbot from '@/components/Chatbot';
import SlideIn from '@/components/SlideIn';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Engineering Work — Web, Mobile & Full-Stack Projects | Joel Mbaka',
  description:
    'Explore Joel Mbaka’s engineering work across React Native mobile apps, Next.js web platforms, FastAPI backends, PostgreSQL systems, integrations, and production releases.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Engineering Work — Web, Mobile & Full-Stack Projects | Joel Mbaka',
    description:
      'Production software projects spanning mobile, web, backend, data, integrations, and release.',
    url: `${base}/work`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Work — Web, Mobile & Full-Stack Projects | Joel Mbaka',
    description:
      'Production software projects spanning mobile, web, backend, data, integrations, and release.',
  },
};

export default function WorkPage() {
  const flagshipIds = ['journpad', 'clivique-hmis', 'rentpayor'];
  const orderedProjects = [
    ...flagshipIds
      .map((id) => projects.find((project) => project.id === id))
      .filter((project): project is (typeof projects)[number] => Boolean(project)),
    ...projects.filter((project) => !flagshipIds.includes(project.id)),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Work — Joel Mbaka',
    description:
      'Engineering case studies and product work across mobile, web, backend, data, integrations, and production delivery.',
    url: `${base}/work`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: orderedProjects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        url: `${base}/${project.id}`,
      })),
    },
  };

  return (
    <SlideIn>
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 md:pb-14 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-palm-green dark:text-gray-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to selected work
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Engineering work</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Products I’ve built across web, mobile, backend, and data.
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
              The homepage highlights three projects that best demonstrate breadth. This page keeps the complete public set of engineering case studies available for deeper review and discovery.
            </p>
          </div>
        </div>

        <section className="container mx-auto mt-12 px-4 sm:px-6 md:px-8 lg:px-12" aria-label="All engineering projects">
          <ProjectsCarousel projects={orderedProjects} />
        </section>

        <CTA />
        <Chatbot />
      </main>
    </SlideIn>
  );
}
