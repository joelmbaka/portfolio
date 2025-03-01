import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'], // Just webp is enough for modern browsers
  },
  // Core performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
