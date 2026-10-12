import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Joeltech Geek Systems — Software Development',
    short_name: 'Joeltech Geek',
    description:
      'Kenya-based software development for businesses worldwide: web, mobile, SaaS, payments and integrations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
  };
}
