import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { expertiseAreas } from '@/config/expertise';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Technical Skills — React Native, Next.js, FastAPI, PostgreSQL, AI & APIs | Joel Mbaka',
  description:
    'Technical skills across React Native, Expo, Next.js, TypeScript, Python, FastAPI, PostgreSQL, REST, GraphQL, AI/LLM integrations, payments, authentication, CI/CD, cloud deployment, app stores, technical SEO, and search growth.',
  alternates: { canonical: '/skills' },
  openGraph: {
    type: 'website',
    url: '/skills',
    title: 'Technical Skills | Joel Mbaka',
    description: 'A complete technical inventory backed by production mobile, web, backend, payment, AI, and operational product work.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technical Skills | Joel Mbaka',
    description: 'A complete technical inventory backed by production product work.',
  },
};

const groups = [
  {
    title: 'Mobile engineering',
    items: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'EAS Build', 'EAS Submit', 'Expo Updates / OTA', 'SecureStore', 'AsyncStorage', 'SQLite', 'Biometrics', 'Push notifications', 'iOS', 'Android', 'TestFlight', 'App Store Connect', 'Google Play Console'],
  },
  {
    title: 'Web engineering',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'TanStack Query', 'TanStack Table', 'Responsive UI', 'Authenticated applications', 'Operational dashboards', 'Public product websites', 'Playwright'],
  },
  {
    title: 'Backend & APIs',
    items: ['Python', 'FastAPI', 'REST APIs', 'GraphQL', 'Webhooks', 'Callbacks', 'OAuth', 'JWT', 'Access tokens', 'Refresh tokens', 'Background workflows', 'Idempotency', 'Third-party API integration', 'API validation', 'Transactional business logic'],
  },
  {
    title: 'Databases & data modeling',
    items: ['PostgreSQL', 'SQL', 'SQLAlchemy', 'Alembic', 'SQLite', 'Neo4j', 'Graph data', 'Relational modeling', 'Migrations', 'Local persistence', 'Caching patterns', 'Key-value storage patterns', 'Data synchronization'],
  },
  {
    title: 'AI, voice & automation',
    items: ['LLM integration', 'LLM reasoning', 'Structured outputs', 'AI agents', 'Voice apps', 'Speech-to-text', 'Whisper', 'Audio workflows', 'Image understanding', 'Open-source models', 'NVIDIA-hosted inference', 'Modal', 'CrewAI', 'Human-reviewed automation', 'Prompt design'],
  },
  {
    title: 'Payments, SaaS & financial workflows',
    items: ['M-Pesa', 'Daraja', 'Payment APIs', 'STK Push', 'B2C payouts', 'Invoice reconciliation', 'Receipts', 'Ledgers', 'Partial payments', 'Credits', 'Subscriptions', 'RevenueCat', 'KYC/KYB', 'Payment callbacks', 'Financial verification flows'],
  },
  {
    title: 'Authentication & application security',
    items: ['Google Sign-In', 'Apple Sign-In', 'OAuth', 'JWT', 'Secure token storage', 'Access revocation', 'Biometrics', 'Password hashing', 'RBAC', 'Tenant/facility isolation', 'Backend identity truth', 'Sensitive vs non-sensitive local storage', 'Callback verification', 'Auditability'],
  },
  {
    title: 'Cloud, Git & CI/CD',
    items: ['Git', 'GitHub', 'Branches', 'Pull requests', 'Merging', 'Vercel', 'Expo EAS', 'Build profiles', 'Production deployments', 'Preview deployments', 'Mobile signing', 'Store submission', 'OTA updates', 'Release iteration'],
  },
  {
    title: 'Search, SEO & distribution',
    items: ['Technical SEO', 'Search intent', 'Next.js metadata', 'Canonical URLs', 'Schema.org structured data', 'XML sitemaps', 'robots.txt', 'Internal linking', 'Google Search Console', 'Bing Webmaster Tools', 'Screaming Frog SEO Spider', 'Google Ads', 'Search ads', 'Landing-page architecture'],
  },
  {
    title: 'AI-assisted software development',
    items: ['ChatGPT', 'Codex', 'AI-assisted coding', 'System design with AI', 'Bug investigation', 'Code review assistance', 'Repository analysis', 'Implementation planning', 'Test generation', 'Documentation and technical writing'],
  },
];

export default function SkillsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Technical Skills — Joel Mbaka',
    url: `${base}/skills`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${base}/#person`,
      name: 'Joel Mbaka',
      jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
      knowsAbout: groups.flatMap((group) => group.items),
      url: base,
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Technical skills</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          A full-stack engineering stack built around shipping complete products.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          My strongest skill is not one framework in isolation. It is moving across mobile, web, APIs, data, authentication, payments, AI integrations, deployment, app-store release, and search/distribution until the product works end to end. The project case studies remain the primary evidence; this page makes the complete technical surface explicit for recruiters, founders, search engines, and research agents.
        </p>
      </header>

      <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Technical skill groups">
        {groups.map((group) => (
          <article key={group.title} className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70 sm:p-7">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{group.title}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Evidence, not keyword stuffing</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Explore the specialist pages and the products that prove the stack.</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expertiseAreas.map((area) => (
            <Link key={area.slug} href={`/expertise/${area.slug}`} className="inline-flex min-h-12 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-palm-green hover:text-palm-green dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              {area.title}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
