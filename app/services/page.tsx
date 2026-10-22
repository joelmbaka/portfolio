import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe2, MonitorSmartphone, Users } from 'lucide-react';
import { services } from '@/config/services';
import { SITE_URL } from '@/lib/site';
import CTA from '@/components/CTA';

export const metadata: Metadata = {
  title: 'Custom Software Development | Joeltech Geek Systems',
  description: 'Remote software development for US, Kenyan and international businesses: React Native apps, Next.js dashboards, FastAPI backends, SaaS and payment integrations.',
  alternates: { canonical: '/services' },
  openGraph: { title: 'Software Development Services | Joeltech Geek Systems', description: 'Engineering services for organisations that need working mobile, web and business software.', url: '/services' },
};

export default function ServicesPage() {
  const base = SITE_URL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Software development services — Joeltech Geek Systems',
    url: `${base}/services`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem', position: index + 1, name: service.title, url: `${base}/services/${service.slug}`,
      })),
    },
  };

  return (
    <main className="site-container pb-16 pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">What clients hire us to build</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Custom software development services.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Joeltech Geek Systems designs, develops and supports software for businesses in the US, Kenya and beyond. We work remotely across time zones and focus on practical outcomes: applications people use, dependable transaction records, and systems that help teams make decisions.
        </p>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          Our core mobile specialization is <strong>React Native with Expo and TypeScript</strong>. For web applications we use Next.js and React; for backend services, Python, FastAPI and PostgreSQL. We integrate existing AI APIs where useful—we do not offer Flutter development, standalone native Swift/Kotlin projects, Java, C++, C#, PHP or Ruby development, machine-learning research or model training.
        </p>
      </header>

      <section className="mt-14 grid gap-5 md:grid-cols-2" aria-label="Software development services">
        {services.map((service) => (
          <article key={service.slug} className="flex flex-col rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/60">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-palm-green">{service.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{service.title}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">{service.summary}</p>
            <Link href={`/services/${service.slug}`} className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-palm-green hover:underline">
              How we deliver this service <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-5 lg:grid-cols-3" aria-label="How we work">
        <article className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
          <MonitorSmartphone className="h-7 w-7 text-palm-green" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold">From requirement to release</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">We can take on complete products or a defined module: discovery, design decisions, implementation, testing and production handover.</p>
        </article>
        <article className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
          <Globe2 className="h-7 w-7 text-palm-green" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold">Serving US &amp; Kenyan teams remotely</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">We collaborate remotely across time zones. Scope, communication, pricing and delivery arrangements are agreed for each engagement.</p>
        </article>
        <article className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900/60">
          <Users className="h-7 w-7 text-palm-green" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold">Engineering collaboration</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">Need technical leadership or extra engineering capacity? Discuss founder-led project delivery or remote developer collaboration, subject to skills, availability and agreement. No staffing or relocation placement is guaranteed.</p>
        </article>
      </section>

      <section className="mt-16 rounded-3xl border border-gray-200 p-7 dark:border-gray-800 sm:p-9">
        <h2 className="text-2xl font-bold">See actual software, not just a capabilities list.</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Our portfolio distinguishes products we develop for our own business from work commissioned by clients. Explore the real workflows, platforms, stack and engineering responsibilities behind each system.
        </p>
        <Link href="/work" className="mt-5 inline-flex items-center gap-2 font-semibold text-palm-green hover:underline">
          View products and client projects <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
      <CTA />
    </main>
  );
}
