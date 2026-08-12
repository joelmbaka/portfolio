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

const siteTitle = 'Senior Full-Stack Product Engineer — Web & Mobile | Joel Mbaka';
const siteDescription =
  'Remote senior full-stack product engineer building production mobile and web software with React Native, Expo, Next.js, TypeScript, Python, FastAPI, PostgreSQL, REST/GraphQL APIs, Playwright/Maestro E2E testing, pytest/Jest, payments, voice/LLM integrations, CI/CD, app-store release, and technical SEO.';

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
    'senior product engineer',
    'full-stack web and mobile engineer',
    'remote contract software engineer',
    'startup product engineer',
    '0 to 1 product engineer',
    'React Native engineer',
    'Expo engineer',
    'Next.js engineer',
    'TypeScript engineer',
    'Python engineer',
    'FastAPI engineer',
    'PostgreSQL engineer',
    'REST API engineer',
    'GraphQL engineer',
    'API integration engineer',
    'end to end testing engineer',
    'Playwright testing',
    'Maestro mobile testing',
    'mobile E2E testing',
    'web E2E testing',
    'pytest',
    'Jest testing',
    'automated regression testing',
    'voice app developer',
    'voice AI engineer',
    'speech-to-text engineer',
    'Whisper integration',
    'LLM integration engineer',
    'AI application engineer',
    'AI agent engineer',
    'FinTech software engineer',
    'PropTech engineer',
    'accounting software engineer',
    'payment integration engineer',
    'M-Pesa Daraja developer',
    'healthcare software engineer',
    'HMIS engineer',
    'logistics software engineer',
    'Expo EAS CI CD',
    'App Store release engineer',
    'Google Play release engineer',
    'technical SEO engineer',
    'Google Search Console',
    'Google Ads search campaigns',
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
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
