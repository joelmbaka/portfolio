'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathname = useRef<string | null>(null);

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

    lastPathname.current = window.location.pathname;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const current = new URL(window.location.href);
      // Same-document fragment and query navigation is not a page load.
      if (destination.pathname === current.pathname) {
        clear();
        return;
      }
      start();
    };

    const onPopState = () => {
      const nextPathname = window.location.pathname;
      if (nextPathname === lastPathname.current) {
        // Back/forward through a hash or query is still on the same page.
        clear();
        return;
      }
      lastPathname.current = nextPathname;
      start();
    };
    const onHashChange = () => {
      // In-page anchors must never leave a blocking overlay on screen.
      if (window.location.pathname === lastPathname.current) clear();
    };
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onHashChange);
      if (showTimer.current) clearTimeout(showTimer.current);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  useEffect(() => {
    lastPathname.current = window.location.pathname;
    if (showTimer.current) clearTimeout(showTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
    showTimer.current = null;
    safetyTimer.current = null;
    setVisible(false);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/75 px-4 backdrop-blur-[3px] dark:bg-gray-950/80"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white px-6 py-4 text-sm font-medium text-gray-700 shadow-xl shadow-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:shadow-black/30">
        <span className="h-6 w-6 shrink-0 animate-spin rounded-full border-[3px] border-palm-green/20 border-t-palm-green motion-reduce:animate-none" aria-hidden="true" />
        Loading page…
      </div>
    </div>
  );
}
