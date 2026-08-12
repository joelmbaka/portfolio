import type { Metadata } from 'next';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Contact Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
  description:
    'Contact Joel Mbaka, a Nairobi-based remote senior full-stack product engineer, about React Native, Next.js, FastAPI, web, mobile, backend, contract, and full-time opportunities.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
    description: 'Nairobi-based remote product engineer on EAT (UTC+3). Get in touch about contract or full-time work across web, mobile, backend, and integrations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Joel Mbaka — Senior Full-Stack Web & Mobile Engineer',
    description: 'Nairobi-based remote product engineer on EAT (UTC+3). Get in touch about contract or full-time product engineering work.',
  },
};

const contactMethods = [
  {
    title: 'Email',
    value: 'mbakajoe26@gmail.com',
    href: 'mailto:mbakajoe26@gmail.com',
    icon: Mail,
  },
  {
    title: 'LinkedIn',
    value: 'Joel Mbaka',
    href: 'https://linkedin.com/in/joelmbaka',
    icon: Linkedin,
  },
  {
    title: 'GitHub',
    value: '@joelmbaka',
    href: 'https://github.com/joelmbaka',
    icon: Github,
  },
  {
    title: 'WhatsApp',
    value: '+254 717 990 442',
    href: 'https://wa.me/254717990442',
    icon: MessageCircle,
  },
];

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${base}/contact#webpage`,
        url: `${base}/contact`,
        name: 'Contact Joel Mbaka',
        description: metadata.description,
        dateModified: '2026-08-12',
        about: { '@id': `${base}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: 'Joel Mbaka',
        url: base,
        email: 'mailto:mbakajoe26@gmail.com',
        jobTitle: 'Senior Full-Stack Product Engineer — Web & Mobile',
        homeLocation: {
          '@type': 'Place',
          name: 'Nairobi, Kenya',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nairobi',
            addressCountry: 'KE',
          },
        },
        sameAs: ['https://github.com/joelmbaka', 'https://linkedin.com/in/joelmbaka'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${base}/contact` },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Contact</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Let’s talk about the product you need to ship.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          I’m based in Nairobi, Kenya and work remotely on East Africa Time (EAT, UTC+3). I’m interested in senior product engineering work where I can own meaningful parts of the system across mobile, web, backend, data, integrations, and production delivery. Contract work is preferred, I am open to full-time roles, and international contract payments can be made in USD or EUR.
        </p>
      </header>

      <section className="mt-12 grid gap-5 sm:grid-cols-2" aria-label="Contact methods">
        {contactMethods.map(({ title, value, href, icon: Icon }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group rounded-3xl border border-gray-200 bg-white p-7 transition hover:-translate-y-0.5 hover:border-palm-green dark:border-gray-800 dark:bg-gray-900/70"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-palm-green dark:bg-emerald-950/30">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-palm-green dark:text-white">{value}</p>
          </a>
        ))}
      </section>

      <section className="mt-14 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-palm-green">Good fit</p>
        <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">Web, mobile, backend, and product ownership.</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          The strongest fit is work that benefits from an engineer who can move between React Native or Next.js interfaces, Python/FastAPI services, PostgreSQL data, third-party integrations, testing, and production delivery without treating each layer as a separate problem.
        </p>
      </section>
    </main>
  );
}
