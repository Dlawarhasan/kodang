'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import NewsList from '@/components/NewsList'
import { getNewsByCategory, type NewsItem } from '@/lib/news'
import { notFound } from 'next/navigation'
import { use } from 'react'

export default function CategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string; locale: string }>
} | {
  params: { id: string; locale: string }
}) {
  const resolvedParams = 'then' in params ? use(params) : params
  
  const t = useTranslations('categories')
  const locale = useLocale()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const validCategories = ['all', 'social', 'politics', 'culture', 'health', 'women', 'workers', 'kolbar', 'children', 'arrest', 'students', 'suicide']
  const categoryId = resolvedParams.id
  
  if (!validCategories.includes(categoryId)) {
    notFound()
  }
  
  useEffect(() => {
    getNewsByCategory(categoryId, locale).then(data => {
      setNews(data)
      setLoading(false)
    })
  }, [categoryId, locale])
  
  const categoryNames: Record<string, string> = {
    all: t('all'),
    social: t('social'),
    politics: t('politics'),
    culture: t('culture'),
    health: t('health'),
    women: t('women'),
    workers: t('workers'),
    kolbar: t('kolbar'),
    children: t('children'),
    arrest: t('arrest'),
    students: t('students'),
    suicide: t('suicide'),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {categoryNames[categoryId] || t('title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">بارکردن...</p>
        </div>
      ) : (
      <NewsList news={news} />
      )}
    </div>
  )
}

