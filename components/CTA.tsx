import Link from 'next/link';

export default function CTA() {
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-20">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50/70 to-purple-50/70 dark:from-blue-950/30 dark:to-purple-950/20 p-8 sm:p-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">Ready to build something extraordinary together?</h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">Let&apos;s ship your next React Native app—from MVP to production.</p>
        <div className="mt-6">
          <Link href="/#hero" className="inline-flex items-center justify-center rounded-full bg-blue-500 text-white px-6 py-3 font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/70">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
