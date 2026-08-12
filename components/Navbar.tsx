'use client';

import Link from 'next/link';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-950/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMobile}
          className="font-semibold tracking-tight text-gray-900 dark:text-white"
          aria-label="Joel Mbaka home"
        >
          Joel Mbaka
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-gray-600 dark:text-gray-300 md:flex" aria-label="Primary navigation">
          <Link href="/work" className="transition hover:text-palm-green">Work</Link>
          <Link href="/expertise" className="transition hover:text-palm-green">Expertise</Link>
          <Link href="/about" className="transition hover:text-palm-green">About</Link>
          <a
            href="https://github.com/joelmbaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-palm-green"
          >
            <Github className="h-4 w-4" aria-hidden /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/joelmbaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-palm-green"
          >
            <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
          </a>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/contact"
            className="hidden rounded-full bg-palm-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:inline-flex"
          >
            Contact
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-palm-green/50 dark:text-gray-200 dark:hover:bg-gray-900 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-gray-200/70 bg-white px-4 pb-5 pt-3 shadow-lg dark:border-gray-800/70 dark:bg-gray-950 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid max-w-6xl gap-1">
            {[
              ['/work', 'Work'],
              ['/expertise', 'Expertise'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-gray-800 transition hover:bg-gray-100 hover:text-palm-green dark:text-gray-200 dark:hover:bg-gray-900"
              >
                {label}
              </Link>
            ))}

            <div className="mt-2 flex gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
              <a
                href="https://github.com/joelmbaka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                <Github className="h-4 w-4" aria-hidden /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/joelmbaka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
