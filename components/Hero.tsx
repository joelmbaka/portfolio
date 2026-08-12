'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { ContactModal } from './ContactModal';

export default function Hero() {
  const [isContactOpen, setContactOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        className="container mx-auto grid items-center gap-10 px-4 sm:px-6 md:grid-cols-[1fr_auto] md:px-8 lg:gap-16 lg:px-12"
      >
        <div className="max-w-3xl text-center md:text-left">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-palm-green">
            Senior Full-Stack Engineer · Web & Mobile
          </p>

          <h1 className="text-4xl font-bold leading-tight text-black dark:text-sandy-beach sm:text-5xl lg:text-6xl">
            I build production software across mobile, web, backend, and data.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
            I take products from idea to production using React Native, Next.js, TypeScript, Python/FastAPI,
            and PostgreSQL—covering the user experience, APIs, data model, integrations, testing, and release.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {['React Native', 'Next.js', 'TypeScript', 'Python / FastAPI', 'PostgreSQL'].map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-sunset-yellow px-5 py-2.5 font-medium text-black hover:bg-sunset-yellow-dark focus:outline-none focus:ring-2 focus:ring-sunset-yellow/70"
            >
              View selected work
              <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
            <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-medium text-gray-900 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Contact me
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5 text-sm text-gray-500 dark:text-gray-400 md:justify-start">
            <a
              href="https://github.com/joelmbaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
            >
              <Github className="h-4 w-4" aria-hidden /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/joelmbaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-gray-900 dark:hover:text-white"
            >
              <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
            </a>
            <span>UTC+3 · Nairobi</span>
          </div>
        </div>

        <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:h-56 sm:w-56 lg:h-72 lg:w-72">
          <Image
            src="/images/joel.webp"
            alt="Joel Mbaka, senior full-stack web and mobile engineer"
            fill
            priority
            sizes="(max-width: 768px) 224px, 288px"
            className="object-cover"
          />
        </div>
      </section>

      <ContactModal isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
