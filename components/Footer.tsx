import { Mail, MessageCircle } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-transparent text-ocean-blue">
      <div className="max-w-5xl mx-auto w-full px-4 py-3 flex flex-col xl:flex-row xl:flex-nowrap items-center justify-center gap-2 xl:gap-6 text-sm text-center">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden />
          <a
            href="mailto:mbakajoe26@gmail.com"
            className="hover:underline font-medium"
            aria-label="Email mbakajoe26@gmail.com"
          >
            mbakajoe26@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden />
          <a
            href="https://wa.me/254717990442"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp with Joel Mbaka"
            className="underline decoration-dotted underline-offset-4 hover:opacity-80"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
