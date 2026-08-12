'use client';

import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl dark:border-gray-800/70 dark:bg-gray-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-gray-900 dark:text-white" aria-label="Joel Mbaka home">
          Joel Mbaka
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-gray-600 dark:text-gray-300 md:flex" aria-label="Primary navigation">
          <Link href="/#work" className="transition hover:text-palm-green">Work</Link>
          <Link href="/#capabilities" className="transition hover:text-palm-green">Capabilities</Link>
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

        <div className="flex items-center gap-2">
          <a
            href="mailto:mbakajoe26@gmail.com"
            className="hidden rounded-full bg-palm-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:inline-flex"
          >
            Contact
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
