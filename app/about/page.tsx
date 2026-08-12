import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { projects } from '@/config/projects';
import CTA from '@/components/CTA';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'About Joel Mbaka — Senior Full-Stack Product Engineer for Web & Mobile',
  description:
    'Joel Mbaka is a remote senior full-stack product engineer working across React Native, Next.js, FastAPI, PostgreSQL, APIs, payments, AI/LLM integrations, app release, technical SEO, and 0→1 startup product development.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    url: '/about',
    title: 'About Joel Mbaka — Senior Full-Stack Product Engineer',
    description: 'Remote product engineering across mobile, web, APIs, data, payments, AI integrations, release, and startup delivery.',
  },
  twitter: { card: 'summary_large_image', title: 'About Joel Mbaka — Senior Full-Stack Product Engineer', description: 'Remote product engineering across mobile, web, backend, data, integrations, release, and startup delivery.' },
};

const ownership = [
  'React Native and Expo mobile products for iOS and Android',
  'Next.js and React web applications, dashboards, and public product websites',
  'Python/FastAPI services, REST APIs, GraphQL integrations, PostgreSQL data models, and business logic',
  'Authentication, payments, M-Pesa/Daraja, subscriptions, AI/LLM APIs, cloud integrations, and automation',
  'Git/GitHub workflows, testing, Vercel deployment, Expo EAS builds, App Store / Play Store release, and OTA updates',
  'Technical SEO, structured data, sitemaps, robots controls, Search Console, Bing Webmaster Tools, and search-intent landing pages',
];

export default function AboutPage() {
  const flagship = ['journpad', 'clivique-hmis', 'rentpayor']
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${base}/about#webpage`,
        url: `${base}/about`,
        name: 'About Joel Mbaka — Senior Full-Stack Product Engineer',
        dateModified: '2026-08-12',
        mainEntity: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        url: base,
        jobTitle: 'Senior Full-Stack Engineer — Web & Mobile',
        description:
          'Remote senior full-stack product engineer specializing in 0→1 mobile and web products, React Native, Next.js, FastAPI, PostgreSQL, APIs, payments, AI integrations, release engineering, and technical SEO.',
        knowsAbout: [
          'React Native', 'Expo', 'Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'SQL', 'REST APIs', 'GraphQL', 'Neo4j', 'M-Pesa Daraja', 'Payment reconciliation', 'Voice applications', 'Whisper', 'LLM integrations', 'AI agents', 'Authentication', 'OAuth', 'App Store Connect', 'Google Play Console', 'Expo EAS', 'Vercel', 'Technical SEO', 'Google Search Console', 'Google Ads',
        ],
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${base}/about` },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">About</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">I build complete software products and prefer owning the path from requirement to production.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          I am a senior full-stack product engineer based in Kenya and working remotely. My core stack is React Native / Expo for mobile, Next.js / React / TypeScript for web, and Python / FastAPI / PostgreSQL for backend systems. I work across APIs, authentication, data modeling, payments, AI integrations, cloud deployment, mobile release, and the operational tooling around the product.
        </p>
      </header>

      <section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">What I own</p>
          <ul className="mt-5 space-y-4">
            {ownership.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-palm-green" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">How I work</p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">The product is the system, not just the interface.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            A useful feature often crosses several boundaries at once. A rent payment touches the tenant experience, payment provider, invoice model, callback handling, reconciliation and receipts. A hospital workflow touches permissions, patient context, departmental queues, billing and auditability. I prefer owning those boundaries together so the product behaves coherently end to end.
          </p>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            I use AI heavily as an engineering tool as well: ChatGPT and Codex for repository analysis, system design, implementation planning, code generation, debugging, testing, and review. In the products themselves, I use LLMs and open-source models for reasoning, transcription, image understanding, and automation; I am an AI application engineer rather than an ML researcher or model-training specialist.
          </p>
          <Link href="/skills" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">See the full technical stack <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </article>
      </section>

      <section className="mt-16 grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Founder & healthcare experience</p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">Co-founder and software engineer at CliviQue HMIS.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            I co-founded CliviQue HMIS with a doctor. I built the initial product and the connected clinical, facility, billing, and backend foundation from scratch. The product is now at a stage where my co-founder can continue enhancing parts of the application while I remain involved as a co-founder rather than working on it full-time every day.
          </p>
          <Link href="/clivique-hmis" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">Read the CliviQue case study <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </article>

        <article className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Availability & preferred work</p>
          <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">Contract preferred. Remote only. Open to full-time.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            My preferred work is with startups that need products shipped from scratch, features owned end to end, or an existing implementation improved quickly. I prefer scoped contract work because it makes the engineering objective and delivery measurable, but I am flexible and open to a strong full-time remote role.
          </p>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            My launched products are currently in learning and product-market-fit stages. Most work on them is targeted UX improvement, maintenance, patches, distribution, and on-demand iteration rather than continuous full-time feature development.
          </p>
          <Link href="/work-with-me" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">How I engage with startups <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </article>
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Mentoring & leadership</p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">I make time for engineers who want to learn how I build.</h2>
        <p className="mt-4 max-w-4xl text-base leading-7 text-gray-600 dark:text-gray-300">
          I occasionally hold calls with aspiring software engineers who want practical guidance on building full-stack web and mobile products. My approach is hands-on: establish the architecture and workflow, explain how the pieces fit together, and encourage them to learn by shipping with modern tools such as ChatGPT and Codex rather than waiting until they feel they know everything.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="representative-work">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Representative work</p>
          <h2 id="representative-work" className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Case studies remain the strongest proof.</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">The skills pages make me discoverable. These products show whether I can actually build the systems being described.</p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {flagship.map((project) => (
            <article key={project.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{project.type}</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{project.description}</p>
              <Link href={`/${project.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">Read case study <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </article>
          ))}
        </div>
      </section>

      <CTA />
    </main>
  );
}
