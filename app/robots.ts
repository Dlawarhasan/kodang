import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodang.news'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/s/', // Short URLs are redirects, no need to index
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

