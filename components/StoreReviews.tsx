import { Project } from '@/config/projects';
import Image from 'next/image';

export default function StoreReviews({ project }: { project: Project }) {
  const { appStore, playStore } = project;
  if (!appStore && !playStore) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-center text-xl font-semibold">Production availability</h2>
      <p className="mx-auto mb-4 max-w-xl text-center text-sm leading-6 text-gray-600 dark:text-gray-400">
        Public store links are shown as release evidence. Ratings and review counts are intentionally not displayed unless they are verified from the stores.
      </p>
      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-4">
        {appStore && (
          <a
            href={appStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-200 bg-white/60 p-5 text-center backdrop-blur transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <Image
              src="/images/app-store.png"
              alt="View on the App Store"
              width={160}
              height={40}
              className="h-10 w-auto"
              loading="lazy"
            />
          </a>
        )}
        {playStore && (
          <a
            href={playStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-200 bg-white/60 p-5 text-center backdrop-blur transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60"
          >
            <Image
              src="/images/play-store.png"
              alt="View on Google Play"
              width={160}
              height={40}
              className="h-10 w-auto"
              loading="lazy"
            />
          </a>
        )}
      </div>
    </section>
  );
}
