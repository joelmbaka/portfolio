import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/crm', '/crm/', '/website-requirements', '/website-requirements/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
