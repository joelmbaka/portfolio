import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import CTA from '@/components/CTA';

export const metadata: Metadata = {
  title: 'Contact Joeltech Geek Systems | Software Development Enquiries',
  description: 'Discuss a mobile app, web platform, SaaS product or backend development project with Joeltech Geek Systems. Based in Kenya and working remotely worldwide.',
  alternates: { canonical: '/contact' },
};

const methods = [
  { title: 'Email the founder', value: 'mbakajoe26@gmail.com', href: 'mailto:mbakajoe26@gmail.com?subject=Software%20project%20enquiry%20-%20Joeltech%20Geek%20Systems', icon: Mail },
  { title: 'WhatsApp', value: '+254 717 990 442', href: 'https://wa.me/254717990442?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20software%20project.', icon: MessageCircle },
  { title: 'LinkedIn', value: 'Joel Mbaka', href: 'https://linkedin.com/in/joelmbaka', icon: Linkedin },
  { title: 'GitHub', value: '@joelmbaka', href: 'https://github.com/joelmbaka', icon: Github },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">Let&apos;s talk</p>
        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl">Tell us what you need to build.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">Whether you are improving an existing operation, launching a SaaS product or building a new mobile or web experience, Joeltech Geek Systems would be glad to hear about it. You&apos;ll be speaking directly with the founder and engineer.</p>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">Based in Kenya · Remote collaboration globally · EAT (UTC+3)</p>
      </header>

      <section className="mt-12 grid gap-5 sm:grid-cols-2" aria-label="Contact methods">
        {methods.map(({title,value,href,icon:Icon}) => (
          <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="group rounded-3xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:border-palm-green dark:border-gray-800 dark:bg-gray-900/60">
            <Icon className="h-7 w-7 text-palm-green" aria-hidden />
            <h2 className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</h2>
            <p className="mt-2 break-all text-lg font-semibold text-gray-900 group-hover:text-palm-green dark:text-white">{value}</p>
          </a>
        ))}
      </section>

      <section className="mt-14 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What to include in your enquiry</h2>
        <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">A short description of your business, the problem you want to solve, the people who will use the software and any timing or budget constraints. It&apos;s fine if you don't have a complete specification yet.</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/services" className="inline-flex items-center gap-2 text-palm-green hover:underline">Explore our services <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link href="/careers" className="inline-flex items-center gap-2 text-palm-green hover:underline">Looking for opportunities? Visit Careers <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>
      <CTA />
    </main>
  );
}
