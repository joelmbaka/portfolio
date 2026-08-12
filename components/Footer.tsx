import { Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-transparent text-gray-600 dark:border-gray-800 dark:text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm sm:px-6 md:flex-row lg:px-8">
        <div className="text-center md:text-left">
          <p className="font-medium text-gray-900 dark:text-white">Joel Mbaka</p>
          <p className="mt-1">Senior Full-Stack Engineer · Web & Mobile</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="mailto:mbakajoe26@gmail.com" className="inline-flex items-center gap-2 hover:text-palm-green">
            <Mail className="h-4 w-4" aria-hidden /> Email
          </a>
          <a
            href="https://wa.me/254717990442"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-palm-green"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </a>
          <a
            href="https://github.com/joelmbaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-palm-green"
          >
            <Github className="h-4 w-4" aria-hidden /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/joelmbaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-palm-green"
          >
            <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
