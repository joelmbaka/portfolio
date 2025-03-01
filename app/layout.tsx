import type { Metadata } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Joel Mbaka - Software Developer',
  description: 'Lets build something extraordinary together',
  keywords: ['Joel Mbaka', 'Software Developer', 'Software Engineer', 'AI Engineer', 'ML Engineer','Web & Mobile Programmer', 'Full Stack Web & Mobile Application Developer', 'AI Developer', 'Machine Learning Developer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Blockchain Developer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
