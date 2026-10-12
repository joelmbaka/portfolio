import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects } from '@/config/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import CTA from '@/components/CTA';
import Chatbot from '@/components/Chatbot';
import SlideIn from '@/components/SlideIn';

const base = SITE_URL;

export const metadata: Metadata = {
  title: 'Software Products & Client Projects | Joeltech Geek Systems',
  description:
    'Explore software products and client engineering by Joeltech Geek Systems, including RentPayor, SchoolPey, Milliol, JournPad, CliviQue and Macsim Cargo.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Software Products & Client Projects | Joeltech Geek Systems',
    description:
      'Production software projects spanning mobile, web, backend, data, payments, integrations, and release.',
    url: `${base}/work`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software Products & Client Projects | Joeltech Geek Systems',
    description:
      'Production software projects spanning mobile, web, backend, data, payments, integrations, and release.',
  },
  robots: { index: true, follow: true },
};

export default function WorkPage() {
  const flagshipIds = ['rentpayor', 'schoolpey', 'clivique-hmis', 'milliol', 'journpad', 'macsim'];
  const orderedProjects = [
    ...flagshipIds
      .map((id) => projects.find((project) => project.id === id))
      .filter((project): project is (typeof projects)[number] => Boolean(project)),
    ...projects.filter((project) => !flagshipIds.includes(project.id)),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${base}/work#collection`,
    name: 'Software Solutions — Joeltech Geek Systems',
    description:
      'Engineering case studies and product work across mobile, web, backend, data, payments, AI integrations, and production delivery.',
    url: `${base}/work`,
    dateModified: '2026-08-12',
    author: { '@id': `${base}/#person` },
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Solutions &amp; case studies</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Software products and client work, built for real operations.
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
              Explore founder-led products and client projects across property, education, healthcare, construction, logistics and AI. Each case study explains the systems, platforms and engineering behind the solution.
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
