'use client'

import { useTranslations, useLocale } from 'next-intl'
import NewsList from '@/components/NewsList'
import { getNewsByCategory } from '@/lib/news'
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
  
  const validCategories = ['all', 'social', 'politics', 'sports', 'technology', 'culture', 'health']
  const categoryId = resolvedParams.id
  
  if (!validCategories.includes(categoryId)) {
    notFound()
  }
  
  const news = getNewsByCategory(categoryId, locale)
  
  const categoryNames: Record<string, string> = {
    all: t('all'),
    social: t('social'),
    politics: t('politics'),
    sports: t('sports'),
    technology: t('technology'),
    culture: t('culture'),
    health: t('health'),
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

      <NewsList news={news} />
    </div>
  )
}

