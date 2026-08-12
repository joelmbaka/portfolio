import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteTitle = 'Senior Full-Stack Engineer — Web & Mobile | Joel Mbaka';
const siteDescription =
  'Senior full-stack engineer building production web and mobile products end-to-end with React Native, Next.js, TypeScript, Python, FastAPI, PostgreSQL, payments, AI integrations, and modern cloud infrastructure.';

export const metadata: Metadata = {
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '')),
  title: siteTitle,
  description: siteDescription,
  applicationName: 'Joel Mbaka Portfolio',
  authors: [{ name: 'Joel Mbaka', url: 'https://joelmbaka.com' }],
  creator: 'Joel Mbaka',
  publisher: 'Joel Mbaka',
  category: 'technology',
  keywords: [
    'Joel Mbaka',
    'senior full-stack engineer',
    'full-stack web and mobile engineer',
    'senior web and mobile engineer',
    'React Native engineer',
    'Next.js engineer',
    'TypeScript engineer',
    'Python FastAPI engineer',
    'PostgreSQL engineer',
    'mobile application engineer',
    'web application engineer',
    'product engineer',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Joel Mbaka',
    title: siteTitle,
    description: siteDescription,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
