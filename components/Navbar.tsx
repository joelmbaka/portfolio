'use client';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function Navbar() {
  const [showHeader, setShowHeader] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const current = window.scrollY;
      if (current > lastY && current > 100) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      lastY = current;
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 left-0 w-full px-4 sm:px-6 py-4 z-50 bg-transparent backdrop-blur-md transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-5xl mx-auto w-full relative flex items-center justify-center">
      <Image src="https://reactnative.dev/img/header_logo.svg" alt="React Native" width={32} height={32} />
      <div className="absolute right-0"><ThemeToggle /></div>
          </div>
    </header>
  );
}
