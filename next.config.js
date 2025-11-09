/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './i18n.ts'
)

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)

