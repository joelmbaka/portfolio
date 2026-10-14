import type { NextConfig } from 'next';

const noIndexHeader = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80],
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/expertise', destination: '/services', permanent: true },
      { source: '/taifa-hmis', destination: '/clivique-hmis', permanent: true },
      { source: '/skills', destination: '/founder', permanent: true },
      { source: '/work-with-me', destination: '/founder', permanent: true },
      { source: '/full-stack-web-mobile-engineer', destination: '/founder', permanent: true },
      { source: '/expertise/react-native-mobile-engineering', destination: '/services/react-native-app-development', permanent: true },
      { source: '/expertise/nextjs-web-engineering', destination: '/services/web-app-development', permanent: true },
      { source: '/expertise/fastapi-postgresql-backends', destination: '/services/fastapi-backend-development', permanent: true },
      { source: '/expertise/api-engineering-integrations', destination: '/services/fastapi-backend-development', permanent: true },
      { source: '/expertise/databases-data-modeling', destination: '/services/fastapi-backend-development', permanent: true },
      { source: '/expertise/voice-ai-llm-engineering', destination: '/services/ai-api-integrations', permanent: true },
      { source: '/expertise/authentication-application-security', destination: '/services/fastapi-backend-development', permanent: true },
      { source: '/expertise/payments-fintech-saas', destination: '/services/payment-integrations', permanent: true },
      { source: '/expertise/automated-testing-quality-engineering', destination: '/services', permanent: true },
      { source: '/expertise/mobile-app-release-ci-cd', destination: '/services/react-native-app-development', permanent: true },
      { source: '/expertise/technical-seo-search-growth', destination: '/services/web-app-development', permanent: true },
    ];
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
