'use client';

import { Play } from 'lucide-react';
import { useRef, useState } from 'react';

interface DemoVideoPlayerProps {
  src: string;
  poster: string;
  title: string;
  mimeType?: 'video/mp4' | 'video/webm';
  captions?: string;
}

export default function DemoVideoPlayer({ src, poster, title, mimeType = 'video/mp4', captions }: DemoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const playDemo = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    try {
      await video.play();
    } catch {
      // Some browsers still require a muted retry even after a direct click.
      video.muted = true;
      await video.play();
    }
    setShowOverlay(false);
  };

  return (
    <div className="demo-player relative overflow-hidden rounded-2xl border border-gray-300 bg-black shadow-xl dark:border-gray-700">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        onEnded={() => setShowOverlay(true)}
        aria-label={title}
        className="block aspect-video w-full"
      >
        <source src={src} type={mimeType} />
        {captions && <track kind="captions" src={captions} srcLang="en" label="English captions" default />}
        Your browser does not support embedded video.
      </video>

      {showOverlay && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45">
          <div className="relative flex flex-col items-center gap-3">
            <span className="demo-ripple demo-ripple-one" aria-hidden="true" />
            <span className="demo-ripple demo-ripple-two" aria-hidden="true" />
            <span className="demo-ripple demo-ripple-three" aria-hidden="true" />
            <button
              type="button"
              onClick={playDemo}
              className="pointer-events-auto relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white text-gray-950 shadow-2xl transition hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-24 sm:w-24"
              aria-label={`Play ${title}`}
            >
              <Play className="ml-1 h-9 w-9 fill-current sm:h-10 sm:w-10" aria-hidden="true" />
            </button>
            <span className="relative z-10 text-sm font-semibold tracking-wide text-white">Play Demo</span>
          </div>
        </div>
      )}
    </div>
  );
}
