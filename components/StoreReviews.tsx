import { Project } from '@/config/projects';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export default function StoreReviews({ project }: { project: Project }) {
  const { url, appStore, playStore } = project;
  if (!url && !appStore && !playStore) return null;

  const linkCount = [url, appStore, playStore].filter(Boolean).length;

  return (
    <section className="mt-10">
      <h2 className="mb-3 text-center text-xl font-semibold">Live product & release links</h2>
      <p className="mx-auto mb-5 max-w-xl text-center text-sm leading-6 text-gray-600 dark:text-gray-400">
        Public product and store links are shown as release evidence. Ratings and review counts are intentionally not displayed unless they are verified from the stores.
      </p>
      <div
        className={`mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 ${
          linkCount === 2 ? 'sm:grid-cols-2' : linkCount >= 3 ? 'sm:grid-cols-3' : 'sm:max-w-sm'
        }`}
      >
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/60 px-5 py-4 text-center text-sm font-semibold text-gray-800 backdrop-blur transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-100"
          >
            Visit product website
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
          </a>
        )}
        {appStore && (
          <a
            href={appStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-16 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/60 px-5 py-4 text-center backdrop-blur transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <Image
              src="/images/app-store.png"
              alt={`View ${project.title} on the App Store`}
              width={160}
              height={40}
              className="h-10 w-auto max-w-full"
              loading="lazy"
            />
          </a>
        )}
        {playStore && (
          <a
            href={playStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-16 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/60 px-5 py-4 text-center backdrop-blur transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <Image
              src="/images/play-store.png"
              alt={`View ${project.title} on Google Play`}
              width={160}
              height={40}
              className="h-10 w-auto max-w-full"
              loading="lazy"
            />
          </a>
        )}
      </div>
    </section>
  );
}
