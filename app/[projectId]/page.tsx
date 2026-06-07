import { projects } from '@/config/projects';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ImageGallery from '@/components/ImageGallery';
import StoreReviews from '@/components/StoreReviews';
import CTA from '@/components/CTA';
import SlideIn from '@/components/SlideIn';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

function getPrimaryProjectImage(project: (typeof projects)[number]) {
  return (
    project.icon ||
    project.screenshots?.web?.[0] ||
    project.screenshots?.app?.[0] ||
    '/images/og-default.jpg'
  );
}

function findProjectById(projectId: string) {
  return projects.find((p) => p.id === projectId || p.aliases?.includes(projectId));
}

export function generateStaticParams() {
  return projects.flatMap((p) => [
    { projectId: p.id },
    ...(p.aliases ?? []).map((projectId) => ({ projectId })),
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = findProjectById(projectId);
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
  const project = findProjectById(projectId);
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

      {project.screenshots?.web && project.screenshots.web.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Web App Screenshots</h2>
          <ImageGallery images={project.screenshots.web} variant="web" />
        </section>
      )}

      {project.screenshots?.app && project.screenshots.app.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">App Screenshots</h2>
          <ImageGallery images={project.screenshots.app.slice(0, 5)} />
        </section>
      )}

      {project.enhancements && project.enhancements.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-center">Enhancements</h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {project.enhancements.map((enhancement) => (
              <article
                key={enhancement.title}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {enhancement.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {enhancement.description}
                    </p>
                  </div>
                  {enhancement.url && (
                    <a
                      href={enhancement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center rounded-md border border-ocean-blue px-3 py-2 text-sm font-medium text-ocean-blue transition hover:bg-ocean-blue hover:text-white"
                    >
                      View live
                    </a>
                  )}
                </div>

                <div className={`mt-4 grid gap-4 ${(enhancement.screenshots?.length || 0) > 1 ? 'sm:grid-cols-2' : ''}`}>
                  {enhancement.screenshots && enhancement.screenshots.length > 0 ? (
                    enhancement.screenshots.map((screenshot) => (
                      <div
                        key={screenshot}
                        className="relative aspect-[16/10] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-950"
                      >
                        <Image
                          src={screenshot}
                          alt={`${enhancement.title} screenshot`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
                      Enhancement screenshot pending
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Enhancement stack</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {enhancement.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {enhancement.note && (
                  <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {enhancement.note}
                  </p>
                )}
              </article>
            ))}
          </div>
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
      <CTA />
    </main>
    </SlideIn>
  );
}
