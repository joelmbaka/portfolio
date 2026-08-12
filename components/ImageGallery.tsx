"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  variant?: "mobile" | "web";
}

export default function ImageGallery({
  images,
  variant = "mobile",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const isWeb = variant === "web";

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el || isWeb) return;
    const max = el.scrollWidth - el.clientWidth - 1;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < max);
  }, [isWeb]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        );
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (isWeb) return;
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      setContentWidth(el.scrollWidth);
      updateScrollState();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isWeb, updateScrollState, images.length]);

  useEffect(() => {
    if (isWeb) return;
    const top = topRef.current;
    const bottom = trackRef.current;
    if (!top || !bottom) return;
    const onTopScroll = () => {
      if (isSyncingRef.current) {
        isSyncingRef.current = false;
        return;
      }
      isSyncingRef.current = true;
      bottom.scrollLeft = top.scrollLeft;
      updateScrollState();
    };
    const onBottomScroll = () => {
      if (isSyncingRef.current) {
        isSyncingRef.current = false;
        return;
      }
      isSyncingRef.current = true;
      top.scrollLeft = bottom.scrollLeft;
      updateScrollState();
    };
    top.addEventListener("scroll", onTopScroll, {
      passive: true,
    } as AddEventListenerOptions);
    bottom.addEventListener("scroll", onBottomScroll, {
      passive: true,
    } as AddEventListenerOptions);
    return () => {
      top.removeEventListener("scroll", onTopScroll as EventListener);
      bottom.removeEventListener("scroll", onBottomScroll as EventListener);
    };
  }, [isWeb, updateScrollState]);

  if (!images.length) return null;

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activeLabelIndex = activeIndex === null ? 0 : activeIndex + 1;
  const scrollByScreenshot = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector(
      "[data-screenshot-card]",
    ) as HTMLElement | null;
    const gapStr =
      getComputedStyle(el).columnGap || getComputedStyle(el).gap || "16px";
    const gap = parseFloat(gapStr);
    const distance =
      (firstCard?.offsetWidth || el.clientWidth) +
      (Number.isFinite(gap) ? gap : 16);
    el.scrollBy({ left: dir * distance, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <>
      {isWeb ? (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={image}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  unoptimized
                />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="relative">
          <div
            ref={topRef}
            className="hidden overflow-x-auto pb-2 sm:block"
            aria-label="App screenshots (top scrollbar)"
          >
            <div style={{ width: contentWidth, height: 1 }} />
          </div>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 sm:gap-4 sm:pb-4"
            role="list"
            aria-label="App screenshots"
          >
            {images.map((image, index) => (
              <button
                key={image}
                data-screenshot-card
                type="button"
                onClick={() => setActiveIndex(index)}
                role="listitem"
                className="group relative w-[82vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[300px] md:w-[320px] dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="relative aspect-[9/16] w-full">
                  <Image
                    src={image}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 82vw, 320px"
                    className="object-contain transition duration-300 group-hover:scale-[1.02]"
                    unoptimized
                  />
                </div>
              </button>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400 sm:hidden">Swipe to browse screenshots</p>
              <button
                type="button"
                aria-label="Previous screenshot"
                onClick={() => scrollByScreenshot(-1)}
                className={`absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/70 p-2 text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/70 sm:flex ${canPrev ? "" : "cursor-not-allowed opacity-40"}`}
                disabled={!canPrev}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Next screenshot"
                onClick={() => scrollByScreenshot(1)}
                className={`absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/70 p-2 text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/70 sm:flex ${canNext ? "" : "cursor-not-allowed opacity-40"}`}
                disabled={!canNext}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen screenshot viewer"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            aria-label="Close fullscreen gallery"
            onClick={() => setActiveIndex(null)}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:top-4"
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
                  current === null
                    ? null
                    : (current - 1 + images.length) % images.length,
                );
              }}
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <div
            className="relative h-[82dvh] w-full max-w-6xl sm:h-[88vh]"
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
                  current === null ? null : (current + 1) % images.length,
                );
              }}
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
