import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-sandy-beach/60 text-palm-green px-4 py-2 text-sm font-medium">
        404 — Page not found
      </div>
      <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-palm-green">This page doesn’t exist</h1>
      <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
        The page you’re looking for was moved, deleted, or the URL is incorrect.
      </p>
      <div className="mt-7 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-sunset-yellow text-black px-6 py-3 font-medium hover:bg-sunset-yellow-dark focus:outline-none focus:ring-2 focus:ring-sunset-yellow/70"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
