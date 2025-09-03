'use client';

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const prev = () => {
    setCurrent((current - 1 + images.length) % images.length);
  };

  const next = () => {
    setCurrent((current + 1) % images.length);
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden bg-gray-800"
      style={{ aspectRatio: '9 / 19.5' }}
    >
      <Image
        src={images[current]}
        alt={`Screenshot ${current + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 448px"
        className="object-cover"
        unoptimized
        priority
      />

      {images.length > 1 && (
        <>
          <button
            aria-label="Previous screenshot"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900 text-white p-2 rounded-full"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Next screenshot"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/70 hover:bg-gray-900 text-white p-2 rounded-full"
            type="button"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === current ? "bg-white" : "bg-gray-500"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
