'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Theme menu"
        className="text-xl leading-none focus:outline-none"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-28 rounded-md bg-white dark:bg-gray-800 shadow-lg text-sm">
          {['light', 'dark', 'system'].filter((t) => t !== resolvedTheme).map((t) => (
            <li key={t}>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setTheme(t);
                  setOpen(false);
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
