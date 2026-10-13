'use client';

import Link from 'next/link';
import { SITE_URL } from '@/lib/site';
import Hero from '@/components/Hero';
import CTA from '@/components/CTA';
import { projects } from '@/config/projects';
import ProjectsCarousel from '@/components/ProjectsCarousel';
import SlideIn from '@/components/SlideIn';
import { ArrowRight, Braces, Database, GraduationCap, MonitorSmartphone, Rocket, ShieldCheck } from 'lucide-react';

const serviceCards = [
  { title: 'Mobile applications', description: 'Purpose-built Android and iOS apps for customers, staff and field teams, with robust APIs, payments and release workflows.', href: '/services', icon: MonitorSmartphone },
  { title: 'Web platforms & dashboards', description: 'Business dashboards, SaaS workspaces and responsive web experiences built around real operations and reporting.', href: '/services', icon: Braces },
  { title: 'Backend systems & integrations', description: 'Secure APIs, PostgreSQL data models, M-Pesa payment flows, authentication, billing and reliable third-party integrations.', href: '/services', icon: Database },
  { title: 'End-to-end delivery', description: 'Technical discovery, architecture, implementation, quality engineering, deployment and ongoing iteration.', href: '/services', icon: Rocket },
];

const delivery = [
  { title: 'Understand the problem', description: 'Start with business goals, user journeys, constraints and a clear implementation scope.' },
  { title: 'Build the right system', description: 'Design complete workflows—from interfaces and APIs to data, access controls and integrations.' },
  { title: 'Launch with confidence', description: 'Test the critical paths, deploy carefully and improve based on real-world feedback.' },
];

export default function Home() {
  const selectedWork = ['rentpayor', 'schoolpey', 'clivique-hmis', 'milliol']
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is (typeof projects)[number] => Boolean(project));
  const base = SITE_URL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'Joeltech Geek Systems',
        url: base,
        logo: `${base}/brand/bridgeframe-512.png`,
        image: `${base}/brand/bridgeframe-512.png`,
        description: 'Kenya-based, founder-led software development business serving clients globally through remote delivery.',
        founder: { '@id': `${base}/#person` },
        areaServed: 'Worldwide',
        address: { '@type': 'PostalAddress', addressCountry: 'KE' },
        knowsAbout: ['Custom software development', 'Mobile applications', 'SaaS', 'Web dashboards', 'FastAPI', 'PostgreSQL', 'Payment integrations'],
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        jobTitle: 'Founder and Senior Software Engineer',
        worksFor: { '@id': `${base}/#organization` },
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka'],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name: 'Joeltech Geek Systems',
        url: base,
        publisher: { '@id': `${base}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${base}/#webpage`,
        url: `${base}/`,
        name: 'Joeltech Geek Systems | Software Development in Kenya',
        isPartOf: { '@id': `${base}/#website` },
        about: { '@id': `${base}/#organization` },
      },
    ],
  };

  return (
    <SlideIn>
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <Hero />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="mt-20 grid gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/40 sm:grid-cols-3 sm:p-7">
          {[
            { label: 'Based in', value: 'Kenya' },
            { label: 'Working with', value: 'Clients worldwide' },
            { label: 'Focused on', value: 'Real business outcomes' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl px-3 py-3 sm:border-l sm:border-palm-green sm:pl-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-palm-green">{item.label}</p>
              <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section id="services" className="mt-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">How we help</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Your business challenge. Our engineering focus.</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">We create software people actually use—from the first idea and architecture through deployment and ongoing improvements.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {serviceCards.map(({ title, description, href, icon: Icon }) => (
              <Link key={title} href={href} className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-palm-green dark:border-gray-800 dark:bg-gray-900/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-palm-green dark:bg-emerald-950/30"><Icon className="h-5 w-5" aria-hidden /></div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green">See services <ArrowRight className="h-4 w-4" aria-hidden /></span>
              </Link>
            ))}
          </div>
        </section>

        <section id="work" className="mt-24">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Solutions &amp; selected work</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Products are our proof.</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We build with the realities of finance, property, education, healthcare, construction and logistics in mind. Explore the products and client projects that demonstrate our capabilities.
            </p>
          </div>
          <ProjectsCarousel projects={selectedWork} />
          <Link href="/work" className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-palm-green hover:underline">Explore all solutions and case studies <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </section>

        <section className="mt-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Our approach</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">From challenge to shipped software.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {delivery.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/60">
                <span className="text-sm font-bold text-palm-green">0{index + 1}</span>
                <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-8 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/60 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">The founder</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Leadership rooted in building.</h2>
            <p className="mt-5 text-base leading-8 text-gray-600 dark:text-gray-300">Joeltech Geek Systems is founded and led by Joel Mbaka, a software engineer and technology entrepreneur. He takes direct responsibility for product architecture, software delivery and turning challenging operational problems into useful systems.</p>
            <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-300">Beyond building products, Joel mentors emerging software developers and believes the next generation of technical talent grows through practical experience and thoughtful guidance.</p>
            <Link href="/about" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-palm-green hover:underline">Meet the founder <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
          <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-7 dark:bg-gray-950/70">
            <GraduationCap className="h-10 w-10 text-palm-green" aria-hidden />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Build your future with us.</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">Explore software development internships and SaaS sales representative opportunities. Compensation and reimbursement arrangements depend on the opportunity and solution.</p>
              <Link href="/careers" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-palm-green hover:underline">Explore careers <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </div>
        </section>

        <div className="mt-10 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"><ShieldCheck className="h-4 w-4 text-palm-green" aria-hidden /> Kenya-registered business · Founder-led · Remote collaboration worldwide</div>
        <CTA />
      </main>
    </SlideIn>
  );
}
