import { createSocialBrandImage } from '@/components/SocialBrandImage';

export const alt = 'Joeltech Geek Systems — Bridgeframe logo and software development services';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return createSocialBrandImage();
}
