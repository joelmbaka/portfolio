import { Project } from '@/config/projects';

function StarRow({ rating = 0 }: { rating?: number }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className="mt-1 flex items-center justify-center gap-1 text-yellow-500" aria-label={`Rated ${rating} out of 5`}>
      {stars.map((filled, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 ${filled ? 'opacity-100' : 'opacity-30'}`}
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.15 3.532a1 1 0 00.95.69h3.708c.969 0 1.371 1.24.588 1.81l-3 2.18a1 1 0 00-.364 1.118l1.15 3.532c.3.921-.755 1.688-1.54 1.118l-3-2.18a1 1 0 00-1.176 0l-3 2.18c-.784.57-1.838-.197-1.539-1.118l1.15-3.532a1 1 0 00-.364-1.118l-3-2.18c-.783-.57-.38-1.81.588-1.81h3.708a1 1 0 00.95-.69l1.15-3.532z" />
        </svg>
      ))}
    </div>
  );
}

function formatCount(n?: number) {
  if (typeof n !== 'number') return undefined;
  return new Intl.NumberFormat().format(n);
}

export default function StoreReviews({ project }: { project: Project }) {
  const { appStore, playStore } = project;
  const hasBoth = !!appStore && !!playStore;
  const gridCols = hasBoth ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';
  if (!appStore && !playStore) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">What users say</h2>
      <div className={`grid ${gridCols} gap-4 place-items-center`}>
        {appStore && (
          <a
            href={appStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur p-5 hover:shadow-md transition-shadow text-center"
          >
            <div className="flex items-center justify-center">
              <img
                src="/images/app-store.png"
                alt="Download on the App Store"
                className="h-10 w-auto"
                loading="lazy"
              />
            </div>
            <StarRow rating={appStore.rating} />
            {typeof appStore.reviewsCount === 'number' && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatCount(appStore.reviewsCount)} ratings</div>
            )}
          </a>
        )}
        {playStore && (
          <a
            href={playStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur p-5 hover:shadow-md transition-shadow text-center"
          >
            <div className="flex items-center justify-center">
              <img
                src="/images/play-store.png"
                alt="Get it on Google Play"
                className="h-10 w-auto"
                loading="lazy"
              />
            </div>
            <StarRow rating={playStore.rating} />
            {typeof playStore.reviewsCount === 'number' && (
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatCount(playStore.reviewsCount)} ratings</div>
            )}
          </a>
        )}
      </div>
    </section>
  );
}
