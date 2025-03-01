import Image from 'next/image';
import { Typewriter } from './Typewriter';

export default function Hero() {
  const phrases = [
    "Let's build something extraordinary together",
    "Favorite Quote: You Only Live Once",
    "A.I is the new electricity - Andrew Ng",
    "Let's make the world a better place",
  ];

  return (
    <section className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-12 px-4 sm:px-6 mb-8 md:mb-12">
      {/* Photo Container - centered on mobile */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-4 border-blue-500/30 overflow-hidden shrink-0 self-center md:self-center">
        <Image
          src="/images/joel.png"
          alt="Joel Mbaka"
          width={224}
          height={224}
          priority
          className="object-cover w-full h-full"
        />
      </div>

      {/* Text Content - centered on mobile */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-8 md:ml-8 space-y-4 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">
          Joel Mbaka
        </h1>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl text-blue-400 font-medium">
          Software Developer
        </h2>

        <div className="min-h-[60px] sm:min-h-[80px] md:min-h-[100px]">
          <Typewriter 
            words={phrases}
            className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
}