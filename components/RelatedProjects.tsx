"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects, Project } from '@/config/projects';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function useScrollState(
  ref: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>
) {
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth - 1;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < max);
  }, [ref]);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => update();
    el.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('resize', onResize);
    };
  }, [update]);

  return { canPrev, canNext, update };
}

export default function RelatedProjects({ project }: { project: Project }) {
  const related = projects.filter((p) => p.type === project.type && p.id !== project.id);

  const trackRef = useRef<HTMLDivElement>(null);
  const { canPrev, canNext, update } = useScrollState(trackRef);
  if (related.length === 0) return null;

  const scrollByCard = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector('[data-card]') as HTMLElement | null;
    const gapStr = getComputedStyle(el).columnGap || getComputedStyle(el).gap || '16px';
    const gap = parseFloat(gapStr);
    const distance = (firstCard?.offsetWidth || el.clientWidth) + (Number.isFinite(gap) ? gap : 16);
    el.scrollBy({ left: dir * distance, behavior: 'smooth' });
    setTimeout(update, 350);
  };

  return (
    <section className="mt-12">
  <div className="flex items-center justify-center mb-4">
    <h2 className="text-xl font-semibold">Related projects</h2>
  </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-6 md:px-8"
          role="list"
          aria-label="Related projects"
        >
          {related.map((p) => {
            const img = p.screenshots?.[0] ?? '/globe.svg';
            return (
              <Link
                key={p.id}
                href={`/${p.id}`}
                data-card
                role="listitem"
                className="group snap-start flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow bg-white/60 dark:bg-gray-900/60 backdrop-blur min-w-[240px] sm:min-w-[280px] md:min-w-[320px] max-w-[320px]"
                prefetch={false}
              >
                <div className="relative w-full bg-gray-800" style={{ aspectRatio: '9 / 19.5' }}>
                  <Image
                    src={img}
                    alt={`${p.title} featured screenshot`}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 320px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{p.type}</div>
                  <div className="mt-1 font-semibold group-hover:text-blue-500">{p.title}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {related.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => scrollByCard(-1)}
              className={`flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-gray-900/70 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/70 ${canPrev ? '' : 'opacity-40 cursor-not-allowed'}`}
              disabled={!canPrev}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => scrollByCard(1)}
              className={`flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-gray-900/70 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/70 ${canNext ? '' : 'opacity-40 cursor-not-allowed'}`}
              disabled={!canNext}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
