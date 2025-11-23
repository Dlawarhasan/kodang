/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'mllmvvxjkuiihaekswpd.supabase.co'],
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
    ],
  },
  // Increase body size limit for video uploads (100MB)
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    responseLimit: '100mb',
  },
}

module.exports = withNextIntl(nextConfig)

