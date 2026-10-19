import type { Metadata } from 'next';
import { Linkedin, Mail, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Joel Mbaka | Joeltech Geek Systems',
  description: 'Get in touch directly with Joel Mbaka, founder of Joeltech Geek Systems in Kenya. Reach out with a question, an idea, or anything you would like to discuss.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact Joel Mbaka | Joeltech Geek Systems',
    description: 'A direct way to get in touch with Joel Mbaka, founder of Joeltech Geek Systems. Start a conversation.',
  },
};

const methods = [
  {
    title: 'Email me',
    value: 'mbakajoe26@gmail.com',
    href: 'mailto:mbakajoe26@gmail.com?subject=Hello%20Joel',
    icon: Mail,
  },
  {
    title: 'WhatsApp me',
    value: '+254 717 990 442',
    href: 'https://wa.me/254717990442?text=Hi%20Joel%2C%20I%27d%20like%20to%20get%20in%20touch.',
    icon: MessageCircle,
  },
  {
    title: 'Connect on LinkedIn',
    value: 'Joel Mbaka',
    href: 'https://linkedin.com/in/joelmbaka',
    icon: Linkedin,
  },
];

export default function ContactPage() {
  return (
    <main className="site-container pb-16 pt-28">
      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-palm-green">A direct conversation</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Let&apos;s talk.</h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          I&apos;m Joel Mbaka, founder of Joeltech Geek Systems. If there&apos;s something you&apos;d like to discuss, feel free to reach out using whichever channel works best for you. I&apos;ll read your message personally.
        </p>
        <p className="mt-4 text-sm leading-7 text-gray-500 dark:text-gray-400">
          Based in Kenya · East Africa Time (UTC+3)
        </p>
      </header>

      <section className="mt-12" aria-labelledby="contact-methods-heading">
        <h2 id="contact-methods-heading" className="text-2xl font-bold text-gray-900 dark:text-white">How to reach me</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          Pick the channel you prefer and send me a message.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map(({ title, value, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex min-w-0 flex-col rounded-3xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:border-palm-green hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palm-green dark:border-gray-800 dark:bg-gray-900/60"
            >
              <Icon className="h-7 w-7 text-palm-green" aria-hidden />
              <h3 className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</h3>
              <p className="mt-2 break-words text-lg font-semibold text-gray-900 group-hover:text-palm-green dark:text-white">{value}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">A quick introduction is enough.</h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300">
          Just tell me a little about yourself and what you&apos;d like to discuss. You can include any helpful context or links, but there&apos;s no need to prepare a formal proposal.
        </p>
      </section>
    </main>
  );
}
