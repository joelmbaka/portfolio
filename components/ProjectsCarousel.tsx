import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Project, ProjectStorePreview } from '@/config/projects';

type CardImagePresentation = 'web' | 'store' | 'icon';

interface CardImage {
  alt: string;
  className: string;
  crop?: ProjectStorePreview['crop'];
  presentation: CardImagePresentation;
  src: string;
  platform?: ProjectStorePreview['platform'];
}

function getCardImage(project: Project): CardImage {
  if (project.storePreview) {
    const label =
      project.storePreview.platform === 'ios'
        ? 'App Store listing screenshot'
        : project.storePreview.platform === 'android'
          ? 'Play Store listing screenshot'
          : 'web app screenshot';
    return {
      alt: `${project.title} ${label}`,
      className: project.storePreview.platform === 'android' ? 'object-cover object-top' : 'object-cover',
      crop: project.storePreview.crop,
      presentation: 'store' as const,
      platform: project.storePreview.platform,
      src: project.storePreview.src,
    };
  }

  if (project.screenshots?.web?.length) {
    return {
      alt: `${project.title} web app screenshot`,
      className: 'object-cover',
      presentation: 'web' as const,
      src: project.screenshots.web[0],
    };
  }

  return {
    alt: `${project.title} app icon`,
    className: 'object-contain p-8',
    presentation: 'icon' as const,
    src: project.icon ?? '/images/placeholder-app.svg',
  };
}

function getMediaAspectClass(image: CardImage) {
  if (image.presentation === 'store') {
    if (image.platform === 'android' && image.crop === 'title') return 'aspect-[2/1]';
    return image.platform === 'android' ? 'aspect-[3/2]' : 'aspect-[4/3]';
  }
  if (image.presentation === 'web') return 'aspect-[16/10]';
  return 'aspect-square';
}

export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2" role="list" aria-label="Projects">
      {projects.map((project) => {
        const cardImage = getCardImage(project);
        const iconStyle = project.iconBackground ? { backgroundColor: project.iconBackground } : undefined;
        const mediaAspectClass = getMediaAspectClass(cardImage);

        return (
          <article
            key={project.id}
            role="listitem"
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/70"
          >
            <Link href={`/${project.id}`} className="block">
              <div
                className={`relative w-full bg-gray-100 dark:bg-gray-800 ${mediaAspectClass}`}
                style={iconStyle}
              >
                <Image
                  src={cardImage.src}
                  alt={cardImage.alt}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 520px"
                  className={cardImage.className}
                  unoptimized
                />
              </div>
            </Link>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
                    <span>{project.type}</span>
                    <span aria-hidden>·</span>
                    <span>Case study</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    <Link href={`/${project.id}`} className="hover:text-palm-green">
                      {project.title}
                    </Link>
                  </h3>
                </div>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-palm-green hover:text-palm-green dark:border-gray-700 dark:text-gray-400"
                    aria-label={`Open ${project.title} live project`}
                  >
                    <ArrowUpRight size={17} />
                  </a>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.slice(0, 5).map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <Link
                href={`/${project.id}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-green hover:underline"
              >
                Read engineering case study <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
