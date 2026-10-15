import { SITE_URL } from '@/lib/site';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin } from 'lucide-react';
import { publicProjects } from '@/config/projects';

export const metadata: Metadata = {
  title: 'Joel Mbaka — Founder, Senior React Native & Full-Stack Engineer',
  description: 'Meet Joel Mbaka, founder of Joeltech Geek Systems and senior React Native and full-stack engineer building mobile apps, SaaS platforms, and FastAPI backends.',
  alternates: { canonical: '/founder' },
  openGraph: {
    type: 'profile', url: '/founder', title: 'Joel Mbaka | Founder & Senior Software Engineer',
    description: 'The founder and lead engineer behind Joeltech Geek Systems products and commissioned engineering work.',
  },
};

const specialties = [
  { title: 'React Native mobile engineering', body: 'React Native, Expo and TypeScript for Android and iOS software; architecture, authentication, APIs, device features, testing and app release.', href: '/services/react-native-app-development' },
  { title: 'Next.js and full-stack web engineering', body: 'React/Next.js applications, responsive dashboards, operational workspaces and business workflows.', href: '/services/web-app-development' },
  { title: 'Python backend architecture', body: 'FastAPI, PostgreSQL, SQLAlchemy, Alembic, permission boundaries and transactional API design.', href: '/services/fastapi-backend-development' },
  { title: 'Payments, AI integration and delivery', body: 'M-Pesa reconciliation, validated callbacks, applied AI APIs, test automation and production release workflows.', href: '/services' },
];

export default function FounderPage() {
  const proof = ['rentpayor', 'journpad', 'schoolpey', 'clivique-hmis', 'macsim', 'milliol']
    .map((id) => publicProjects.find((project) => project.id === id))
    .filter((project): project is (typeof publicProjects)[number] => Boolean(project));
  const base = SITE_URL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${base}/founder#profile`,
        url: `${base}/founder`,
        mainEntity: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        url: `${base}/founder`,
        image: `${base}/images/joel.webp`,
        jobTitle: 'Founder and Senior Full-Stack Software Engineer',
        worksFor: { '@id': `${base}/#organization` },
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka'],
        knowsAbout: ['React Native', 'Expo', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'SaaS', 'M-Pesa integration', 'Applied AI APIs', 'Software architecture'],
      },
    ],
  };

  return (
    <main className="site-container pb-16 pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="grid items-center gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-palm-green">Meet the founder</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Joel Mbaka</h1>
          <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Founder of Joeltech Geek Systems · Senior Full-Stack Software Engineer · React Native Specialist</p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            I founded Joeltech Geek Systems to build useful software for businesses and develop commercial products of our own. I lead the architecture and hands-on engineering behind mobile apps, web dashboards, backend systems, payment integrations and product releases.
          </p>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
            Based in Nairobi, Kenya, I work with remote clients and engineering teams internationally. I am open to relevant senior React Native, full-stack product engineering and technical-lead roles, as well as scoped software projects through Joeltech Geek Systems.
          </p>
          <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold">
            <a href="https://linkedin.com/in/joelmbaka" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-palm-green hover:underline"><Linkedin className="h-4 w-4" aria-hidden /> LinkedIn</a>
            <a href="https://github.com/joelmbaka" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-palm-green hover:underline"><Github className="h-4 w-4" aria-hidden /> GitHub</a>
            <Link href="/contact" className="inline-flex items-center gap-2 text-palm-green hover:underline">Contact / collaboration <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
          <Image src="/images/joel.webp" alt="Joel Mbaka, founder of Joeltech Geek Systems" fill sizes="(max-width:1024px) 90vw,280px" className="object-cover" />
        </div>
      </header>

      <section className="mt-16">
        <h2 className="text-3xl font-bold">Engineering leadership and specialization</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          My core focus is production mobile and full-stack product engineering, not listing every technology as a separate service. React Native is our primary mobile framework—not Flutter or standalone native Swift/Kotlin development.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {specialties.map((specialty) => (
            <article key={specialty.title} className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
              <h3 className="text-xl font-semibold">{specialty.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{specialty.body}</p>
              <Link href={specialty.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">Related company service <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-bold">Products and client systems I&apos;ve helped build</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Technical evidence matters more than a job title. These case studies distinguish products developed within our business from commissioned client work and show the platforms actually built.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {proof.map((project) => (
            <article key={project.id} className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
              <p className="text-xs font-bold uppercase tracking-widest text-palm-green">{project.engagement === 'Client project' ? 'Client project' : 'Company-developed product'}</p>
              <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
              {project.platforms && <p className="mt-2 text-xs font-semibold text-gray-500">{project.platforms.join(' · ')}</p>}
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{project.description}</p>
              <Link href={`/${project.id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palm-green hover:underline">View engineering case study <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gray-50 p-7 dark:bg-gray-900/60 sm:p-9">
        <h2 className="text-2xl font-bold">Founder, engineer and mentor</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          I hold a BSc in Information Technology from JKUAT and support emerging developers through practical learning and feedback. My company also welcomes enquiries about engineering collaboration, remote roles and software projects. Any paid employment, internship or placement arrangement is subject to an agreed opportunity.
        </p>
        <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold">
          <Link href="/about" className="text-palm-green hover:underline">About the company</Link>
          <Link href="/mentorship" className="text-palm-green hover:underline">Mentorship approach</Link>
          <Link href="/careers" className="text-palm-green hover:underline">Careers and internships</Link>
        </div>
      </section>
    </main>
  );
}
