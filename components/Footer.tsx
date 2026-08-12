import Link from 'next/link';
import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-transparent text-gray-600 dark:border-gray-800 dark:text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="max-w-sm">
            <p className="font-medium text-gray-900 dark:text-white">Joel Mbaka</p>
            <p className="mt-1 text-sm">Senior Full-Stack Engineer · Web & Mobile</p>
            <p className="mt-3 text-xs leading-5 text-gray-500 dark:text-gray-500">Remote product engineering across mobile, web, APIs, data, payments, AI/LLM integrations, release, technical SEO, and startup delivery.</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3" aria-label="Footer navigation">
            {[
              ['/work', 'Work'],
              ['/expertise', 'Expertise'],
              ['/skills', 'Skills'],
              ['/industries', 'Industries'],
              ['/about', 'About'],
              ['/work-with-me', 'Work with me'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="flex min-h-10 items-center hover:text-palm-green">{label}</Link>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <a href="mailto:mbakajoe26@gmail.com" className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"><Mail className="h-4 w-4" aria-hidden /> Email</a>
            <a href="https://wa.me/254717990442" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"><MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp</a>
            <a href="https://github.com/joelmbaka" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"><Github className="h-4 w-4" aria-hidden /> GitHub</a>
            <a href="https://linkedin.com/in/joelmbaka" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 hover:text-palm-green"><Linkedin className="h-4 w-4" aria-hidden /> LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
