import Link from 'next/link';

export default function CTA() {
  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-20 mb-4 sm:mb-6 md:mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-sandy-beach/70 to-ocean-blue/10 dark:from-gray-900/40 dark:to-ocean-blue/20 p-8 sm:p-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-palm-green">Ready to build something extraordinary together?</h2>
        <p className="mt-3 text-sm sm:text-base text-black dark:text-white">Let&apos;s ship your next React Native app—from MVP to production.</p>
        <div className="mt-6">
          <Link href="/#hero" className="inline-flex items-center justify-center rounded-full bg-sunset-yellow text-black px-6 py-3 font-medium hover:bg-sunset-yellow-dark focus:outline-none focus:ring-2 focus:ring-ocean-blue/70">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
