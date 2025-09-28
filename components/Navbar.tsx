'use client';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';
import { AuthButton } from './AuthButton';

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
  
  // Base logos for the marquee
  const baseLogos = [
    { src: 'https://reactnative.dev/img/header_logo.svg', alt: 'React Native' },
    { src: 'https://media.licdn.com/dms/image/v2/C560BAQFIsAFkfMxydQ/company-logo_200_200/company-logo_200_200/0/1631415865328/exponent_js_logo?e=2147483647&v=beta&t=eNd42lCXmk3Ydhwt2DnRXUk_zL9HhaohHQt6w16AWL8' },
    { src: 'https://www.gstatic.com/devrel-devsite/prod/v80eb94e0352d656ad1e20abf6117cdec6c1343c7722ef10f52a1a3f77f1e58f7/firebase/images/touchicon-180.png' },
    { src: 'https://miro.medium.com/1*uII4elorSUwsIA5m1j-o2w.png' },
    { src: 'https://miro.medium.com/v2/resize:fit:512/0*DsqinkcruvLl3S4m.png' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTajxBpamocvywaH8NR2xhkj8KEUUymVvQCbg&s' },
    { src: 'https://cdn.iconscout.com/icon/free/png-256/free-jest-3629451-3031514.png?f=webp' },
    { src: 'https://wollacebuarque.gallerycdn.vsassets.io/extensions/wollacebuarque/tailwind-theme/0.5.7/1661810447799/Microsoft.VisualStudio.Services.Icons.Default' },
    { src: 'https://cdn.iconscout.com/icon/free/png-256/free-nodejs-2-226035.png' },
  ];
  // Repeat logos so that one half of the track is wider than the container (seamless loop)
  const allLogos = [...baseLogos, ...baseLogos, ...baseLogos, ...baseLogos];
  return (
    <header className={`fixed top-0 left-0 w-full px-0 sm:px-0 py-4 z-50 bg-transparent backdrop-blur-md transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-5xl mx-auto w-full relative flex items-center">
      {/* Scrolling tech logos */}
        <div className="overflow-hidden w-full mr-10">
          <div className="inline-flex w-max items-center gap-6 logo-marquee">
            {allLogos.map((logo, idx) => (
              <img key={idx} src={logo.src} alt={logo.alt} className="h-6 w-auto" />
            ))}
          </div>
        </div>
      <div className="absolute right-4">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
          </div>
    </header>
  );
}
