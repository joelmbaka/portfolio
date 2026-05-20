'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length
        );
      } else if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + images.length) % images.length
        );
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, images.length]);

  if (!images.length) return null;

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activeLabelIndex = activeIndex === null ? 0 : activeIndex + 1;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="relative aspect-[9/19.5] w-full">
              <Image
                src={image}
                alt={`Screenshot ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                unoptimized
              />
            </div>
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen screenshot viewer"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            aria-label="Close fullscreen gallery"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((current) =>
                  current === null ? null : (current - 1 + images.length) % images.length
                );
              }}
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            className="relative h-[88vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={`Fullscreen screenshot ${activeLabelIndex}`}
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((current) =>
                  current === null ? null : (current + 1) % images.length
                );
              }}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
