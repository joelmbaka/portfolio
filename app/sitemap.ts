import type { MetadataRoute } from 'next';
import { projects } from '@/config/projects';
import { expertiseAreas } from '@/config/expertise';

const PORTFOLIO_UPDATED_AT = new Date('2026-08-12');

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://joelmbaka.com').replace(/\/$/, '');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/full-stack-web-mobile-engineer`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.98 },
    { url: `${base}/work`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${base}/skills`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.94 },
    { url: `${base}/expertise`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.93 },
    { url: `${base}/work-with-me`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${base}/industries`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/about`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/contact`, lastModified: PORTFOLIO_UPDATED_AT, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const expertiseRoutes: MetadataRoute.Sitemap = expertiseAreas.map((area) => ({
    url: `${base}/expertise/${area.slug}`,
    lastModified: PORTFOLIO_UPDATED_AT,
    changeFrequency: 'monthly',
    priority: 0.88,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/${project.id}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly',
    priority: ['journpad', 'clivique-hmis', 'rentpayor'].includes(project.id) ? 0.94 : 0.8,
  }));

  return [...staticRoutes, ...expertiseRoutes, ...projectRoutes];
}
