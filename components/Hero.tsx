'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Globe2, Mail } from 'lucide-react';
import { useState } from 'react';
import { ContactModal } from './ContactModal';

export default function Hero() {
  const [isContactOpen, setContactOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="max-w-3xl">
          <p className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-palm-green sm:text-sm">
            <Globe2 className="h-4 w-4" aria-hidden />
            Kenya-based software development · Global delivery
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.07] tracking-tight text-gray-950 dark:text-sandy-beach sm:text-5xl lg:text-6xl">
            Software that moves businesses forward.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
            Joeltech Geek Systems designs, builds and supports web applications, mobile apps, SaaS platforms and backend systems. From Kenya, we partner remotely with clients around the world to turn complex business needs into reliable software.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-xs font-medium sm:text-sm">
            {['Business software', 'Mobile apps', 'SaaS platforms', 'Web dashboards', 'Payments & APIs'].map((item) => (
              <span key={item} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/work" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sunset-yellow px-6 py-3 font-semibold text-black transition hover:bg-sunset-yellow-dark">
              Explore our solutions <ArrowDown className="h-4 w-4" aria-hidden />
            </Link>
            <button type="button" onClick={() => setContactOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-900 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-white">
              <Mail className="h-4 w-4" aria-hidden /> Discuss your project
            </button>
            <Link href="/services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 font-medium text-palm-green hover:underline">
              What we do <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-9 border-l-2 border-palm-green pl-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Founder-led engineering, not an anonymous agency.</p>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Founded by Joel Mbaka — software engineer, technology entrepreneur and developer mentor. Built in Kenya. Engineered for the world.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-100 p-3 shadow-xl shadow-gray-950/5 dark:border-gray-800 dark:bg-gray-900">
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[1.5rem]">
              <Image src="/images/joel.webp" alt="Joel Mbaka, founder and lead software engineer at Joeltech Geek Systems" fill priority sizes="(max-width: 1024px) 90vw, 370px" className="object-cover" />
            </div>
            <div className="px-2 pb-2 pt-4">
              <p className="text-base font-bold text-gray-900 dark:text-white">Joel Mbaka</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Founder &amp; Senior Software Engineer</p>
            </div>
          </div>
        </div>
      </section>
      <ContactModal isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
