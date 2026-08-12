import Link from 'next/link';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-transparent text-gray-600 dark:border-gray-800 dark:text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="max-w-sm">
            <p className="font-medium text-gray-900 dark:text-white">Joel Mbaka</p>
            <p className="mt-1 text-sm">Senior Full-Stack Engineer · Web & Mobile</p>
            <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-500">
              Production software across mobile, web, backend, data, payments, AI integrations, and release.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2" aria-label="Footer navigation">
            <Link href="/work" className="flex min-h-10 items-center hover:text-palm-green">Work</Link>
            <Link href="/expertise" className="flex min-h-10 items-center hover:text-palm-green">Expertise</Link>
            <Link href="/about" className="flex min-h-10 items-center hover:text-palm-green">About</Link>
            <Link href="/contact" className="flex min-h-10 items-center hover:text-palm-green">Contact</Link>
          </nav>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <a href="mailto:mbakajoe26@gmail.com" className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green">
              <Mail className="h-4 w-4" aria-hidden /> Email
            </a>
            <a
              href="https://wa.me/254717990442"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
            <a
              href="https://github.com/joelmbaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"
            >
              <Github className="h-4 w-4" aria-hidden /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/joelmbaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"
            >
              <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
