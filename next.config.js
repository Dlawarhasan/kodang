/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'mllmvvxjkuiihaekswpd.supabase.co', 'img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'mllmvvxjkuiihaekswpd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  // Note: Body size limits are handled in API routes via maxDuration and direct upload
}

module.exports = withNextIntl(nextConfig)

