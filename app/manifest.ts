import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Joeltech Geek Systems — Software Development',
    short_name: 'Joeltech Geek',
    description:
      'Kenya-based software development for businesses worldwide: web, mobile, SaaS, payments and integrations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07111F',
    theme_color: '#059669',
    icons: [
      { src: '/brand/bridgeframe-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
