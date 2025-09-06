import type { Metadata } from 'next';
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
  title: 'Joel Mbaka - React Native Developer',
  description: 'Lets build something extraordinary together',
  keywords: ['Joel Mbaka', 'Software Developer', 'Software Engineer', 'AI Engineer', 'ML Engineer','Web & Mobile Programmer', 'Full Stack Web & Mobile Application Developer', 'AI Developer', 'Machine Learning Developer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Blockchain Developer'],
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
