import { projects } from '@/config/projects';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import StoreReviews from '@/components/StoreReviews';
import CTA from '@/components/CTA';
import SlideIn from '@/components/SlideIn';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

type CaseStudyDetail = {
  role: string;
  scope: string;
  engineeringHighlights: string[];
};

const caseStudyDetails: Record<string, CaseStudyDetail> = {
  journpad: {
    role: 'End-to-end product engineering across mobile, backend, AI integrations, and production release.',
    scope:
      'A voice-first journaling product that combines a React Native mobile experience with Python services, AI-assisted processing, cloud infrastructure, and an automated publishing system.',
    engineeringHighlights: [
      'Built the cross-platform mobile product in React Native / Expo and TypeScript.',
      'Connected voice capture to backend and AI processing for titles, summaries, subjects, keywords, and organization.',
      'Extended the product with a Python/CrewAI publishing pipeline backed by PostgreSQL and FastAPI.',
      'Shipped the application through public mobile-store distribution.',
    ],
  },
  'clivique-hmis': {
    role: 'Full-stack web engineering across clinical workflows, backend services, data modeling, and automated testing.',
    scope:
      'A hospital operations platform covering patient and facility workflows across outpatient care, emergency, inpatient care, referrals, theatre, billing, transport, and operational summaries.',
    engineeringHighlights: [
      'Built a workflow-heavy Next.js and React web application rather than a static administrative dashboard.',
      'Implemented backend services with FastAPI, SQLAlchemy, Alembic, and PostgreSQL.',
      'Modeled interconnected clinical and operational workflows across multiple hospital departments.',
      'Used Playwright alongside the application stack to support end-to-end workflow verification.',
    ],
  },
  rentpayor: {
    role: 'Product engineering across mobile, backend, data, rent-payment workflows, and internal operational tooling.',
    scope:
      'A rent collection and reconciliation product for landlords, supported by a React Native application, FastAPI/PostgreSQL backend, authentication, CRM tooling, lead intelligence, and sales automation.',
    engineeringHighlights: [
      'Built the React Native product and FastAPI/PostgreSQL application backend as one connected system.',
      'Designed rent records around properties, leases, invoices, payments, and reconciliation workflows.',
      'Built a Next.js CRM for reviewing and managing property-management leads and outreach activity.',
      'Added Python-based lead enrichment and sales automation around the product go-to-market workflow.',
    ],
  },
  macsim: {
    role: 'Full-stack mobile and operations engineering across field workflows and administrative tooling.',
    scope:
      'A logistics and cargo product combining mobile operational workflows with backend services and a web-based administrative workspace.',
    engineeringHighlights: [
      'Built React Native workflows for cargo operations, trip activity, assignment details, and reservations.',
      'Connected the mobile product to Python/FastAPI and PostgreSQL backend services.',
      'Built a Next.js back-office dashboard for load, fleet, driver, staff, and operational management.',
      'Integrated authentication, file/storage capabilities, and operational data across mobile and web surfaces.',
    ],
  },
  'ai-stylist': {
    role: 'Mobile and backend product engineering with AI-assisted image and recommendation workflows.',
    scope:
      'A wardrobe assistant that organizes clothing, analyzes items, and generates weather-aware outfit recommendations from a mobile-first experience.',
    engineeringHighlights: [
      'Built the React Native / Expo mobile application and TypeScript client architecture.',
      'Connected the application to Python/FastAPI services and relational/local persistence.',
      'Integrated image understanding and recommendation workflows into the product experience.',
      'Implemented authentication and subscription-aware product foundations.',
    ],
  },
};

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
    title: `${project.title} — Full-Stack Case Study | Joel Mbaka`,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} — Engineering Case Study`,
      description: project.description,
      url: canonical,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Engineering Case Study`,
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

  const detail = caseStudyDetails[project.id];
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
        jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
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
      <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="mb-8">
          <Link href="/#work" className="text-sm font-medium text-ocean-blue hover:underline">
            ← Selected work
          </Link>
        </div>

        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
            <span>{project.type}</span>
            <span aria-hidden>·</span>
            <span>Engineering case study</span>
          </div>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">{project.title}</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-300">{project.description}</p>
        </header>

        {detail && (
          <section className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">My role</p>
              <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">{detail.role}</p>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Product scope</p>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{detail.scope}</p>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Engineering focus</p>
              <ul className="mt-4 space-y-3">
                {detail.engineeringHighlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-palm-green" aria-hidden />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}

        {project.screenshots?.web && project.screenshots.web.length > 0 && (
          <section className="mt-14">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Product evidence</p>
              <h2 className="mt-2 text-2xl font-semibold">Web application</h2>
            </div>
            <ImageGallery images={project.screenshots.web} variant="web" />
          </section>
        )}

        {project.screenshots?.app && project.screenshots.app.length > 0 && (
          <section className="mt-14">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Product evidence</p>
              <h2 className="mt-2 text-2xl font-semibold">Mobile application</h2>
            </div>
            <ImageGallery images={project.screenshots.app.slice(0, 5)} />
          </section>
        )}

        {project.enhancements && project.enhancements.length > 0 && (
          <section className="mt-14">
            <div className="mb-5 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Beyond the core product</p>
              <h2 className="mt-2 text-2xl font-semibold">Supporting systems & extensions</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                These systems show the additional engineering needed around the product—from internal tooling to automation and operational workflows.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {project.enhancements.map((enhancement) => (
                <article
                  key={enhancement.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{enhancement.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{enhancement.description}</p>
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
                        Supporting system screenshot not available
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Stack</h4>
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
                    <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">{enhancement.note}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Technology</p>
          <h2 className="mt-2 text-2xl font-semibold">Core stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((technology) => (
              <span
                key={technology}
                className="rounded-full bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300"
              >
                {technology}
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
