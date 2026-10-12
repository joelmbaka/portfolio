import { SITE_URL } from '@/lib/site';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/crm',
        '/crm/',
        '/blog',
        '/blog/',
        '/website-requirements',
        '/website-requirements/',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
