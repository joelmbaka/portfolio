import { Github, Linkedin, Mail } from 'lucide-react';

export default function CTA() {
  return (
    <section id="contact" className="container mx-auto mb-4 mt-24 px-4 sm:mb-6 sm:px-6 md:mb-8 md:px-8 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-sandy-beach/70 to-ocean-blue/10 p-8 text-center dark:border-gray-800 dark:from-gray-900/50 dark:to-ocean-blue/20 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-palm-green">Let&apos;s work together</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Looking for an engineer who can own the product beyond a single layer?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-700 dark:text-gray-300 sm:text-base">
          I&apos;m interested in senior product engineering work across web, mobile, backend, and integrations—especially teams shipping real products end-to-end.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:mbakajoe26@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-sunset-yellow px-5 py-2.5 font-medium text-black hover:bg-sunset-yellow-dark focus:outline-none focus:ring-2 focus:ring-ocean-blue/70"
          >
            <Mail className="h-4 w-4" aria-hidden /> Email me
          </a>
          <a
            href="https://linkedin.com/in/joelmbaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-medium text-gray-900 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-white"
          >
            <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
          </a>
          <a
            href="https://github.com/joelmbaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 font-medium text-gray-900 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-white"
          >
            <Github className="h-4 w-4" aria-hidden /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
