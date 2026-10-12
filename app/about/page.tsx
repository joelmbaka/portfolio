import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Building2, Code2, Globe2 } from 'lucide-react';
import CTA from '@/components/CTA';

export const metadata: Metadata = {
  title: 'About Joeltech Geek Systems | Founder-Led Software Company in Kenya',
  description: 'Meet Joeltech Geek Systems, a Kenya-registered software development business led by founder and senior software engineer Joel Mbaka. Building products globally and mentoring developers.',
  alternates: { canonical: '/about' },
};

const values = [
  { title: 'Ownership over handoffs', description: 'One accountable engineering lead connecting business goals, product decisions and working software.', icon: Code2 },
  { title: 'Engineering with purpose', description: 'Systems designed for the actual people, transactions and decisions behind business operations.', icon: Building2 },
  { title: 'Talent through mentorship', description: 'Sharing practical software engineering knowledge and making room for emerging developers to grow.', icon: BookOpen },
  { title: 'Kenyan roots, global collaboration', description: 'Based in Kenya and structured for focused, transparent remote engagements across borders.', icon: Globe2 },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Our story</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">A software business built on engineering ownership.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">Joeltech Geek Systems is a Kenyan software development business building mobile applications, web platforms, SaaS solutions and backend systems for organisations working toward better ways of operating.</p>
        <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">We work remotely with clients worldwide. Our approach is intentionally founder-led: direct communication, transparent scope, careful implementation and continued responsibility after launch.</p>
      </header>

      <section className="mt-16 grid items-center gap-10 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/60 sm:p-10 lg:grid-cols-[280px_1fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl"><Image src="/images/joel.webp" alt="Joel Mbaka, founder of Joeltech Geek Systems" fill sizes="(max-width:1024px) 85vw,280px" className="object-cover" /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Meet the founder</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">Joel Mbaka</h2>
          <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">Founder · Senior Software Engineer · Technology Entrepreneur · Developer Mentor</p>
          <p className="mt-6 text-base leading-8 text-gray-600 dark:text-gray-300">Joel combines product leadership with hands-on engineering across React Native, Next.js, Python/FastAPI and PostgreSQL. His work includes rent and school-fee platforms, healthcare workflows, construction software, logistics systems and AI-powered mobile applications.</p>
          <p className="mt-4 text-base leading-8 text-gray-600 dark:text-gray-300">A graduate in Information Technology from JKUAT, he leads architecture and delivery while helping upcoming software developers develop real-world engineering judgment.</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
            <a href="https://linkedin.com/in/joelmbaka" target="_blank" rel="noopener noreferrer" className="text-palm-green hover:underline">LinkedIn ↗</a>
            <a href="https://github.com/joelmbaka" target="_blank" rel="noopener noreferrer" className="text-palm-green hover:underline">GitHub ↗</a>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">What guides us</p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Built in Kenya. Engineered for the world.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {values.map(({title,description,icon:Icon}) => (
            <div key={title} className="rounded-3xl border border-gray-200 p-7 dark:border-gray-800">
              <Icon className="h-7 w-7 text-palm-green" aria-hidden />
              <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gray-50 p-7 dark:bg-gray-900/60 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Business identity</p>
        <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Registered in Kenya. Working globally.</h2>
        <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">Joeltech Geek Systems is registered under Kenya's Registration of Business Names Act (registration BN-P7SEWW57). The business is owned and led by Joel Mbaka and operates with a remote-first delivery approach.</p>
        <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
          <Link href="/work" className="inline-flex items-center gap-2 text-palm-green hover:underline">Explore our products <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/careers" className="inline-flex items-center gap-2 text-palm-green hover:underline">Careers &amp; mentorship <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>
      <CTA />
    </main>
  );
}
