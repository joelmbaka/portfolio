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
    role: 'End-to-end product engineering across the React Native app, backend services, AI processing, account safety, analytics, and mobile-store release.',
    scope:
      'A voice-first journal that keeps the original recording, transcribes spoken entries, generates useful AI-assisted metadata, and helps users return to entries through playback, search, dates, goals, reminders, and prompts.',
    engineeringHighlights: [
      'Built the cross-platform React Native / Expo experience for voice capture, entry playback, goal-linked journaling, reminders, prompts, and calendar-based review.',
      'Connected recorded entries to backend transcription and AI-assisted title, summary, and category generation while preserving the original audio as part of the journal record.',
      'Implemented account and data-safety flows including deletion behavior, authentication lifecycle handling, and optional biometric protection where supported.',
      'Extended the product with a separate Python/CrewAI publishing pipeline backed by FastAPI, PostgreSQL, Vercel Blob, and automated quality checks.',
    ],
  },
  'clivique-hmis': {
    role: 'Full-stack web engineering across clinical workflows, facility-scoped access, backend services, relational data, payments, security boundaries, and automated testing.',
    scope:
      'A hospital management information system connecting patient registration, OPD, emergency, inpatient care, orders, referrals, theatre, billing, ambulance, mortuary, duty coverage, movement history, documents, and facility operations.',
    engineeringHighlights: [
      'Built a workflow-heavy Next.js/React application and FastAPI/PostgreSQL backend around patient context and hand-offs between clinical, operational, and financial teams.',
      'Designed public marketing routes and authenticated clinical workspaces as separate security surfaces, with role- and facility-scoped access to private hospital data.',
      'Added facility-bound M-Pesa patient invoice collection with encrypted merchant credentials, request-bound payment state, callback validation, an independent Daraja status query, and idempotent receipt handling.',
      'Used SQLAlchemy, Alembic, PostgreSQL, and Playwright-backed workflow verification to support complex state transitions across departments and billing.',
    ],
  },
  rentpayor: {
    role: 'Product engineering across mobile, backend, relational rent records, M-Pesa collection, automatic reconciliation, and internal go-to-market tooling.',
    scope:
      'Rent collection and reconciliation software that connects each payment to the correct tenant, property, unit, lease, invoice, and billing period while maintaining accurate balances, credits, receipts, and payment history.',
    engineeringHighlights: [
      'Built the React Native product and FastAPI/PostgreSQL backend around properties, units, tenants, leases, invoices, payments, balances, and receipts.',
      'Implemented an invoice-linked M-Pesa collection flow where a confirmed payment can be validated and reconciled automatically against the correct rent invoice.',
      'Modeled partial payments, outstanding balances, overpayments carried forward as tenant credit, and manual recording for rent received outside the integrated online-payment flow.',
      'Built a Next.js CRM plus Python lead-enrichment and outbound automation systems for property-management prospecting, outreach, reply review, and follow-up operations.',
    ],
  },
  macsim: {
    role: 'Full-stack mobile and operations engineering across cargo workflows, backend services, administration, finance, and guarded M-Pesa driver payouts.',
    scope:
      'A cargo and logistics operations platform covering loads, reservations, driver assignments, trip tracking, documents, notifications, fleet operations, finance, and back-office administration.',
    engineeringHighlights: [
      'Built React Native workflows for load boards, active trips, driver assignments, reservation details, field operations, and location-aware cargo activity.',
      'Connected the mobile product to FastAPI/PostgreSQL services and a Next.js back-office workspace for load, fleet, driver, finance, staff, location, and consignee operations.',
      'Added a Daraja flow where STK Push funds a tracked collection-account ledger and B2C BusinessPayment sends full or partial load installments to a driver’s Safaricom number.',
      'Protected payout accounting with reservations, idempotency keys, callback-state guards, and an immutable ledger debit only after a successful B2C result is confirmed.',
    ],
  },
  'ai-stylist': {
    role: 'Mobile and backend product engineering across wardrobe management, AI-assisted image understanding, recommendations, location, local persistence, and OAuth.',
    scope:
      'A mobile wardrobe product where users organize clothing, upload item photos for AI-assisted analysis, and generate one-time, daily, or weekly outfit recommendations that can incorporate precise local weather.',
    engineeringHighlights: [
      'Built the Expo/React Native product around wardrobes, clothing-item detail, photo upload, outfit generation, and recommendation history.',
      'Designed AI-assisted clothing analysis for category, tags, and descriptions, with recommendation workflows that can use device location and weather context.',
      'Used SQLite for local recommendation history with a cloud-sync model backed by Python, SQLAlchemy, Alembic, and PostgreSQL.',
      'Designed authentication around Google and Apple OAuth with secure app-managed token storage rather than password authentication.',
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

function getOperatingSystem(project: (typeof projects)[number]) {
  if (project.id === 'clivique-hmis') return 'Web';
  return ['iOS', 'Android'];
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
    title: `${project.title} — Full-Stack Engineering Case Study | Joel Mbaka`,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} — Engineering Case Study`,
      description: project.description,
      url: canonical,
      type: 'article',
      modifiedTime: new Date(project.updatedAt).toISOString(),
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
  const externalReferences = [project.url, project.appStore?.url, project.playStore?.url].filter(
    (value): value is string => Boolean(value),
  );
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: `${project.title} — Engineering Case Study`,
        description: project.description,
        dateModified: project.updatedAt,
        image: imageAbs,
        isPartOf: { '@id': `${base}/work#collection` },
        mainEntity: { '@id': `${canonical}#software` },
        author: { '@id': `${base}/#person` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#software`,
        name: project.title,
        description: project.description,
        url: project.url || canonical,
        applicationCategory: project.type === 'Enterprise' ? 'BusinessApplication' : 'SoftwareApplication',
        operatingSystem: getOperatingSystem(project),
        image: imageAbs,
        creator: { '@id': `${base}/#person` },
        sameAs: externalReferences,
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
        url: base,
        sameAs: [
          'https://github.com/joelmbaka',
          'https://linkedin.com/in/joelmbaka',
          'https://x.com/mbaka_joe',
        ],
      },
      {
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
            name: 'Work',
            item: `${base}/work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <SlideIn>
      <main className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <div className="mb-8">
          <Link href="/work" className="text-sm font-medium text-ocean-blue hover:underline">
            ← All engineering work
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
