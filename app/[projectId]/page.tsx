import { projects } from '@/config/projects';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import StoreReviews from '@/components/StoreReviews';
import RelatedProjects from '@/components/RelatedProjects';
import CTA from '@/components/CTA';
import SlideIn from '@/components/SlideIn';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

function getPrimaryProjectImage(project: (typeof projects)[number]) {
  return (
    project.icon ||
    project.screenshots?.ios?.[0] ||
    project.screenshots?.android?.[0] ||
    '/images/og-default.jpg'
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({ projectId: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return { title: 'Project Not Found' };
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');
  const canonical = `${base}/${project.id}`;
  const ogImage = getPrimaryProjectImage(project);
  return {
    title: `${project.title} – Joel Mbaka`,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description: project.description,
      url: canonical,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = projects.find((p) => p.id === projectId);
  if (!project) return notFound();
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');
  const ogImage = getPrimaryProjectImage(project);
  const imageAbs = ogImage.startsWith('http') ? ogImage : `${base}${ogImage}`;
  const canonical = `${base}/${project.id}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: canonical,
      image: imageAbs,
      author: {
        '@type': 'Person',
        name: 'Joel Mbaka',
        url: base,
        sameAs: [
          'https://github.com/joelmbaka',
          'https://linkedin.com/in/joelmbaka',
          'https://x.com/mbaka_joe',
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${base}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: project.title,
          item: canonical,
        },
      ],
    },
  ];

  return (
    <SlideIn>
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-6">
        <Link href="/" className="text-sm text-ocean-blue dark:text-ocean-blue hover:underline">← Home</Link>
      </div>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-palm-green">{project.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 text-xs">
              {project.type}
            </span>
          </div>
        </div>
      </header>

      <p className="text-gray-700 dark:text-gray-300 text-base leading-7">{project.description}</p>

      {project.screenshots?.ios && project.screenshots.ios.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">iPhone Screenshots</h2>
          <ImageGallery images={project.screenshots.ios} />
        </section>
      )}

      {project.screenshots?.android && project.screenshots.android.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Android Screenshots</h2>
          <ImageGallery images={project.screenshots.android} />
        </section>
      )}

<section className="mt-8">
  <h2 className="text-xl font-semibold mb-3 text-center">Tech stack</h2>
  <div className="flex flex-wrap gap-2 justify-center">
    {project.tech.map((t) => (
      <span
        key={t}
        className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      >
        {t}
      </span>
    ))}
  </div>
</section>
      <StoreReviews project={project} />
      <RelatedProjects project={project} />
      <CTA />
    </main>
    </SlideIn>
  );
}
