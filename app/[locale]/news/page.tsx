'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import NewsList from '@/components/NewsList'
import { getNews, type NewsItem } from '@/lib/news'

export default function NewsPage() {
  const t = useTranslations('news')
  const locale = useLocale()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNews(locale).then(data => {
      setNews(data)
      setLoading(false)
    })
  }, [locale])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('loading') || 'بارکردن...'}</p>
        </div>
      ) : (
      <NewsList news={news} />
      )}
    </div>
  )
}

