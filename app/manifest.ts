import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Joel Mbaka — Senior Full-Stack Engineer',
    short_name: 'Joel Mbaka',
    description:
      'Engineering portfolio covering production mobile, web, backend, data, payment, and AI integration work.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
  };
}
