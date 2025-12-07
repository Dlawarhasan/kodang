'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const [allSlugs, setAllSlugs] = useState<Array<{ slug: string; titleFa: string | null }>>([])
  const [loading, setLoading] = useState(true)

  // Extract slug from pathname if it's a news article
  const slugMatch = pathname?.match(/\/news\/(.+)$/)
  const slug = slugMatch ? slugMatch[1] : null

  useEffect(() => {
    if (slug) {
      // Fetch all slugs for debugging
      fetch('/api/news/list-slugs?limit=50')
        .then(res => res.json())
        .then(data => {
          setAllSlugs(data.slugs || [])
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [slug])

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          پەڕەکە نەدۆزرایەوە | Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          پەڕەیەک کە داوات کردووە بوونی نییە.
        </p>
      </div>

      {slug && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-red-900 mb-2">
            {locale === 'fa' ? 'زانیاری Debug:' : locale === 'ku' ? 'زانیاری Debug:' : 'Debug Information:'}
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Slug:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
          </p>
          
          {loading ? (
            <p className="text-sm text-gray-500 italic">
              {locale === 'fa' ? 'بارکردنی زانیاری...' : locale === 'ku' ? 'بارکردنی زانیاری...' : 'Loading...'}
            </p>
          ) : allSlugs.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {locale === 'fa' ? 'هەموو Article-ەکان (20 یەکەم):' : locale === 'ku' ? 'هەموو Article-ەکان (20 یەکەم):' : 'All Articles (First 20):'}
              </p>
              <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto text-left">
                {allSlugs.slice(0, 20).map((item, idx) => (
                  <li key={idx} className="text-sm">
                    <Link 
                      href={`/${locale}/news/${item.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.slug} {item.titleFa && `- ${item.titleFa.substring(0, 30)}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="text-center">
        <Link
          href={`/${locale}`}
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mr-4"
        >
          گەڕانەوە بۆ ماڵەوە
        </Link>
        <Link
          href={`/${locale}/news`}
          className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {locale === 'fa' ? 'هەموو هەواڵەکان' : locale === 'ku' ? 'هەموو هەواڵەکان' : 'All News'}
        </Link>
      </div>
    </div>
  )
}

