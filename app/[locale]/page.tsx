'use client'

import { useTranslations, useLocale } from 'next-intl'
import NewsList from '@/components/NewsList'
import CategoryFilter from '@/components/CategoryFilter'
import { getNews } from '@/lib/news'

export default function Home() {
  const t = useTranslations('home')
  const locale = useLocale()
  const news = getNews(locale)

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

      <CategoryFilter />
      
      <NewsList news={news} />
    </div>
  )
}

