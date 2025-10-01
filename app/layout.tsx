import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '../components/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '')),
  title: 'Senior React Native & Full-Stack Software Engineer – Joel Mbaka',
  description: 'Senior mobile and full-stack engineer specializing in React Native, SwiftUI, Kotlin, Next.js, Node.js/TypeScript, Python, and AI integrations (LangChain, CrewAI).',
  keywords: [
    'Joel Mbaka',
    'senior software engineer',
    'senior mobile software engineer',
    'senior react native engineer',
    'senior react native developer',
    'mobile developer',
    'mobile engineer',
    'cross-platform mobile application engineer',
    'cross-platform mobile application developer',
    'mobile application programmer',
    'mobile application developer',
    'mobile application engineer',
    'swift developer',
    'kotlin developer',
    'swiftui engineer',
    'android app developer',
    'web developer',
    'web design agency',
    'web application developer',
    'nextjs developer',
    'react developer',
    'nodejs/typescript developer',
    'javascript developer',
    'full stack software engineer',
    'frontend engineer',
    'backend engineer',
    'full stack web and mobile developer',
    'Python developer',
    'AI integration specialist',
    'langchain developer',
    'crewai specialist',
    'AI engineer',
    'AI developer',
  ],
  applicationName: 'Joel Mbaka Portfolio',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Joel Mbaka',
    title: 'Senior React Native & Full-Stack Software Engineer – Joel Mbaka',
    description: 'Senior mobile and full-stack engineer specializing in React Native, SwiftUI, Kotlin, Next.js, Node.js/TypeScript, Python, and AI integrations (LangChain, CrewAI).',
    images: ['/images/og-default.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Senior React Native & Full-Stack Software Engineer – Joel Mbaka',
    description: 'Senior mobile and full-stack engineer specializing in React Native, SwiftUI, Kotlin, Next.js, Node.js/TypeScript, Python, and AI integrations (LangChain, CrewAI).',
    images: ['/images/og-default.jpg'],
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
          <Navbar />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
