import type { NextConfig } from 'next';

const noIndexHeader = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }];

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/website-requirements',
        headers: noIndexHeader,
      },
      {
        source: '/website-requirements/:path*',
        headers: noIndexHeader,
      },
      {
        source: '/crm',
        headers: noIndexHeader,
      },
      {
        source: '/crm/:path*',
        headers: noIndexHeader,
      },
      {
        source: '/blog',
        headers: noIndexHeader,
      },
      {
        source: '/blog/:path*',
        headers: noIndexHeader,
      },
    ];
  },
};

export default nextConfig;
