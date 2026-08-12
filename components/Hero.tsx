'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { ContactModal } from './ContactModal';

export default function Hero() {
  const [isContactOpen, setContactOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="container mx-auto grid items-center gap-9 px-0 sm:px-6 md:grid-cols-[1fr_auto] md:px-8 lg:gap-16 lg:px-12"
      >
        <div className="max-w-3xl text-center md:text-left">
          <Link
            href="/full-stack-web-mobile-engineer"
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-palm-green hover:underline sm:text-sm sm:tracking-[0.18em]"
          >
            Senior Full-Stack Product Engineer · Web & Mobile
          </Link>

          <h1 className="text-4xl font-bold leading-[1.08] text-black dark:text-sandy-beach sm:text-5xl lg:text-6xl">
            I build production software across mobile, web, backend, and data.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-6 sm:text-lg md:mx-0">
            I take products from idea to production using React Native, Next.js, TypeScript, Python/FastAPI, and PostgreSQL—covering APIs, data models, authentication, payments, AI integrations, testing, CI/CD, and release. My strongest fit is 0→1 startup product development and end-to-end feature ownership.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {['React Native', 'Next.js', 'TypeScript', 'Python / FastAPI', 'PostgreSQL', 'REST APIs', 'LLM integrations'].map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 sm:text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap md:justify-start">
            <a
              href="#work"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-sunset-yellow px-5 py-2.5 font-medium text-black hover:bg-sunset-yellow-dark focus:outline-none focus:ring-2 focus:ring-sunset-yellow/70 sm:w-auto"
            >
              View selected work
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href="/work-with-me"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-medium text-gray-900 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-white sm:w-auto"
            >
              Work with me
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-medium text-gray-900 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-white sm:w-auto"
            >
              <Mail className="h-4 w-4" aria-hidden /> Contact me
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-gray-500 dark:text-gray-400 md:justify-start">
            <a href="https://github.com/joelmbaka" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-gray-900 dark:hover:text-white">
              <Github className="h-4 w-4" aria-hidden /> GitHub
            </a>
            <a href="https://linkedin.com/in/joelmbaka" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-gray-900 dark:hover:text-white">
              <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
            </a>
            <span className="basis-full sm:basis-auto">Remote only · Contract preferred · Open to full-time · UTC+3</span>
          </div>
        </div>

        <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:h-56 sm:w-56 lg:h-72 lg:w-72">
          <Image
            src="/images/joel.webp"
            alt="Joel Mbaka, senior full-stack product engineer for web and mobile"
            fill
            priority
            sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 288px"
            className="object-cover"
          />
        </div>
      </section>

      <ContactModal isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
