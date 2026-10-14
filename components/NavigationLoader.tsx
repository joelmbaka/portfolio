'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clear = () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      showTimer.current = null;
      safetyTimer.current = null;
      setVisible(false);
    };

    const start = () => {
      clear();
      showTimer.current = setTimeout(() => setVisible(true), 180);
      safetyTimer.current = setTimeout(clear, 10000);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const current = new URL(window.location.href);
      if (destination.pathname === current.pathname && destination.search === current.search) return;
      start();
    };

    const onPopState = () => start();
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
      if (showTimer.current) clearTimeout(showTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    showTimer.current = null;
    safetyTimer.current = null;
    setVisible(false);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div role="status" aria-live="polite" aria-label="Loading page" className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex justify-center">
      <div className="mt-4 flex items-center gap-3 rounded-full border border-gray-200 bg-white/95 px-5 py-3 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-200">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-palm-green/20 border-t-palm-green motion-reduce:animate-none" aria-hidden="true" />
        Loading page…
      </div>
    </div>
  );
}
