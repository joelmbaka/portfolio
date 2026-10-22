import type { Metadata } from 'next';
import { Clock3, Linkedin, Mail, MapPin, MessageCircle, Video } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Joeltech Geek Systems | Project Enquiries',
  description: 'Discuss a software project with Joel Mbaka, founder of Joeltech Geek Systems. Project enquiries welcome from the US, Kenya and beyond.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact Joeltech Geek Systems | Project Enquiries',
    description: 'Discuss your software project directly with Joel Mbaka. Remote collaboration for US, Kenyan and international teams.',
  },
};

const methods = [
  {
    title: 'Email Joel',
    value: 'mbakajoe26@gmail.com',
    href: 'mailto:mbakajoe26@gmail.com?subject=Hello%20Joel',
    icon: Mail,
  },
  {
    title: 'Chat on WhatsApp',
    value: 'Start a WhatsApp conversation',
    href: 'https://wa.me/254717990442?text=Hi%20Joel%2C%20I%27d%20like%20to%20get%20in%20touch.',
    icon: MessageCircle,
  },
  {
    title: 'View LinkedIn profile',
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
          I&apos;m Joel Mbaka, founder of Joeltech Geek Systems. Whether your business is in the US, Kenya or elsewhere, tell me what you&apos;re working on. I&apos;ll read your message personally.
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

      <section className="mt-14 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/50 sm:p-9" aria-labelledby="availability-heading">
        <h2 id="availability-heading" className="text-2xl font-bold text-gray-900 dark:text-white">Working Across Time Zones</h2>
        <div className="mt-7 grid gap-6 md:grid-cols-3">
          <div className="min-w-0">
            <MapPin className="h-6 w-6 text-palm-green" aria-hidden />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">US, Kenya &amp; international enquiries</h3>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">We discuss software projects remotely, wherever your team operates.</p>
          </div>
          <div className="min-w-0">
            <Clock3 className="h-6 w-6 text-palm-green" aria-hidden />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">Flexible meeting times</h3>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">We can find a suitable time for US, Kenyan and international teams.</p>
          </div>
          <div className="min-w-0">
            <Video className="h-6 w-6 text-palm-green" aria-hidden />
            <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">Calls &amp; meetings by arrangement</h3>
            <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">Google Meet is preferred. We can agree on a convenient time and share a meeting link.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
