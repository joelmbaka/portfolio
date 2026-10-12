import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Braces, Cloud, Database, Smartphone, Workflow } from 'lucide-react';
import CTA from '@/components/CTA';

export const metadata: Metadata = {
  title: 'Software Development Services in Kenya | Joeltech Geek Systems',
  description: 'Founder-led custom software development in Kenya for local and global clients: mobile applications, SaaS dashboards, backend APIs, M-Pesa payments and integrations.',
  alternates: { canonical: '/services' },
};

const services = [
  { title: 'Mobile app development', icon: Smartphone, description: 'Android and iOS experiences for customers, field operations and business teams. From React Native architecture and native integrations through release and iteration.', deliverables: ['React Native & Expo', 'Authentication & offline-aware flows', 'Store releases & updates'] },
  { title: 'Web platforms & SaaS dashboards', icon: Braces, description: 'Responsive web applications and management consoles that turn operational complexity into clear, actionable workflows.', deliverables: ['Next.js & React', 'Administrative dashboards', 'Role-based product experiences'] },
  { title: 'APIs, backends & databases', icon: Database, description: 'The durable foundations behind great software: backend business logic, transactional records, permissions and integrations.', deliverables: ['Python & FastAPI', 'PostgreSQL data modeling', 'REST APIs & webhooks'] },
  { title: 'Payments & business integrations', icon: Workflow, description: 'Connect software to the way businesses transact, reconcile and communicate, including local Kenyan payment workflows.', deliverables: ['M-Pesa & Tuma integrations', 'Invoices & reconciliation', 'Third-party API connections'] },
  { title: 'Production engineering & support', icon: Cloud, description: 'Improve, test, launch and maintain software systems with careful deployment and practical quality checks.', deliverables: ['End-to-end testing', 'Deployment & release workflows', 'Product improvements'] },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Services</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Full-stack software development, from Kenya to the world.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">A founder-led engineering partner for businesses that need more than screens: carefully modeled data, reliable workflows, clean interfaces, integrations and production-ready delivery.</p>
      </header>

      <section className="mt-14 grid gap-5 md:grid-cols-2" aria-label="Software development services">
        {services.map(({title,icon:Icon,description,deliverables}) => (
          <article key={title} className="rounded-3xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-palm-green dark:bg-emerald-950/30"><Icon className="h-6 w-6" aria-hidden /></div>
            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{description}</p>
            <ul className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {deliverables.map((item)=><li key={item} className="flex gap-2"><span className="font-bold text-palm-green" aria-hidden>✓</span>{item}</li>)}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-3xl bg-gray-50 p-7 dark:bg-gray-900/60 sm:p-9">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Direct collaboration, accountable delivery.</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300">Work directly with Joel Mbaka, founder and lead engineer. We start by understanding the business problem, agree on a realistic scope and delivery plan, then build and validate the solution. Engagements can cover new products, selected features or improvements to an existing system.</p>
        <Link href="/work" className="mt-5 inline-flex items-center gap-2 font-semibold text-palm-green hover:underline">See the products behind our expertise <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </section>
      <CTA />
    </main>
  );
}
