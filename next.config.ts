import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'], // Just webp is enough for modern browsers
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  // Core performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/website-requirements',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/website-requirements/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
