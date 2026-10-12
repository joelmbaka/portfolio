'use client';

import { getImageProps } from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Globe2, Mail } from 'lucide-react';
import { useState } from 'react';
import { ContactModal } from './ContactModal';

// Art-directed hero: each breakpoint uses its own composition instead of cropping the desktop image.
// Next.js serves appropriately sized, optimized images from the original PNG assets.
const heroAlt =
  'From fragmented paper-based work to a connected web dashboard and mobile app that track business operations and confirm payments.';
const heroSizes = '(max-width: 639px) 92vw, (max-width: 1023px) 85vw, (max-width: 1279px) 53vw, 620px';

function getHeroImageSources() {
  const common = { alt: heroAlt, sizes: heroSizes, quality: 80 };

  const { props: { srcSet: mobileSrcSet } } = getImageProps({
    ...common,
    src: '/joeltech-hero-mobile.png',
    width: 941,
    height: 1672,
  });

  const { props: { srcSet: tabletSrcSet } } = getImageProps({
    ...common,
    src: '/joeltech-hero-tablet.png',
    width: 1448,
    height: 1086,
  });

  const { props: desktopProps } = getImageProps({
    ...common,
    src: '/joeltech-hero-desktop.png',
    width: 1672,
    height: 941,
  });

  return { mobileSrcSet, tabletSrcSet, desktopProps };
}

export default function Hero() {
  const { mobileSrcSet, tabletSrcSet, desktopProps } = getHeroImageSources();
  const [isContactOpen, setContactOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
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

        <figure className="mx-auto w-full max-w-sm sm:max-w-3xl lg:max-w-none">
          <div className="overflow-hidden rounded-[1.5rem] border border-gray-200 bg-gray-100 shadow-xl shadow-gray-950/10 dark:border-gray-800 dark:bg-gray-900">
            <picture>
              <source media="(max-width: 639px)" srcSet={mobileSrcSet} sizes={heroSizes} width={941} height={1672} />
              <source media="(min-width: 640px) and (max-width: 1023px)" srcSet={tabletSrcSet} sizes={heroSizes} width={1448} height={1086} />
              <img
                {...desktopProps}
                alt={heroAlt}
                className="block h-auto w-full"
                fetchPriority="high"
              />
            </picture>
          </div>
          <figcaption className="mt-4 text-center text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">
            Web visibility. Mobile action. One connected system.
            <span className="mt-1 block text-xs font-normal text-gray-500 dark:text-gray-400">
              Illustrative software concept · Not a screenshot of a specific client product
            </span>
          </figcaption>
        </figure>
      </section>
      <ContactModal isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
