'use client';
import Image from 'next/image';
import { Typewriter } from './Typewriter';

import { useState } from 'react';
import dynamic from 'next/dynamic';
const PopupButton = dynamic(() => import('react-calendly').then((m) => m.PopupButton), { ssr: false });
import { ContactModal } from './ContactModal';

export default function Hero() {
  const phrases = [
    "Let's build something amazing together",
    "A.I is the new electricity - Andrew Ng",
    "Let's make the world a better place",
  ];

  const [isContactOpen, setContactOpen] = useState(false);

  return (<>
    <section id="hero" className="container mx-auto flex flex-col md:flex-row-reverse items-center md:items-start gap-6 md:gap-8 lg:gap-12 px-4 sm:px-6 md:px-8 lg:px-12 mb-8 md:mb-12">
      {/* Photo Container - centered on mobile */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full border-4 border-blue-500/30 overflow-hidden shrink-0 self-center md:self-center">
        <Image
          src="/images/joel.webp"
          alt="Joel Mbaka"
          width={288}
          height={288}
          priority
          className="object-cover w-full h-full"
        />
      </div>

      {/* Text Content - centered on mobile */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-8 md:mr-8 space-y-4 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">
          Joel Mbaka
        </h1>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl text-blue-400 font-medium">
          Senior Software Engineer
        </h2>
        <p className="text-sm sm:text-base text-gray-400">React, React Native, SwiftUI, Python</p>

        <div className="min-h-[40px] sm:min-h-[60px] md:min-h-[80px]">
          <Typewriter 
            words={phrases}
            className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed"
          />
        </div>

        {/* CTA Buttons */}
        <div className="mt-2 flex gap-4">
          <button
            onClick={() => setContactOpen(true)}
            className="rounded-full bg-blue-400 border-2 border-blue-400 px-6 py-2 font-medium text-white hover:bg-blue-500 hover:border-blue-500"
          >
            Send a Message
          </button>
          <PopupButton
            url="https://calendly.com/mbakajoe26/30min"
            rootElement={typeof window !== 'undefined' ? (document.body as HTMLElement) : (null as unknown as HTMLElement)}
            text="Book a Call"
            className="rounded-full border-2 border-blue-400 px-6 py-2 font-medium text-blue-400 hover:bg-blue-400 hover:text-white"
          />
        </div>
      </div>
    </section>

    {/* Contact Modal */}
    <ContactModal isOpen={isContactOpen} onClose={() => setContactOpen(false)} />
  </>
  );
}