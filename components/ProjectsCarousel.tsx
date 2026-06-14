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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" role="list" aria-label="Projects">
        {projects.map((p) => {
          const cardImage = getCardImage(p);
          const iconStyle = p.iconBackground ? { backgroundColor: p.iconBackground } : undefined;
          const mediaAspectClass = getMediaAspectClass(cardImage);
          return (
            <div
              key={p.id}
              role="listitem"
              className="group rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow bg-white/60 dark:bg-gray-900/60 backdrop-blur"
            >
              <div className="p-4 pb-3 h-[120px] overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold min-w-0 flex-1">
                    <Link href={`/${p.id}`} className="hover:underline block truncate">
                      {p.title}
                    </Link>
                  </h3>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                      aria-label="Open live project"
                    >
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{p.description}</p>
              </div>
              <Link href={`/${p.id}`} className="block">
                <div
                  className={`relative w-full bg-gray-100 dark:bg-gray-800 ${mediaAspectClass}`}
                  style={iconStyle}
                >
                  <Image
                    src={cardImage.src}
                    alt={cardImage.alt}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 380px"
                    className={cardImage.className}
                    unoptimized
                  />
                </div>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
