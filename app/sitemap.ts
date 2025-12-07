import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodang.news'
  const locales = ['fa', 'ku', 'en']
  
  const supabase = createServerClient()
  
  // Fetch all news articles
  const { data: articles, error } = await supabase
    .from('news')
    .select('slug, updated_at, created_at, translations')
    .order('created_at', { ascending: false })
  
  if (error || !articles) {
    console.error('Error fetching articles for sitemap:', error)
    // Return at least the homepage
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...locales.map(locale => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      })),
    ]
  }

  // Create sitemap entries for homepage and locale homepages
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })),
    ...locales.map(locale => ({
      url: `${baseUrl}/${locale}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
  ]

  // Add entries for each article in each locale
  for (const article of articles) {
    for (const locale of locales) {
      // Only include article if it has content in this locale
      const hasContent = article.translations?.[locale]?.title || 
                        article.translations?.fa?.title // Fallback to Farsi
      
      if (hasContent) {
        // Handle date - article might have updated_at or created_at
        let lastModified = new Date()
        if (article.updated_at) {
          lastModified = new Date(article.updated_at)
        } else if (article.created_at) {
          lastModified = new Date(article.created_at)
        }
        
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/news/${encodeURIComponent(article.slug)}`,
          lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      }
    }
  }

  return sitemapEntries
}

