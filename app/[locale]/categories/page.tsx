'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CategoriesPage() {
  const t = useTranslations('categories')
  const locale = useLocale()

  const categories = [
    { id: 'social', label: t('social') },
    { id: 'politics', label: t('politics') },
    { id: 'sports', label: t('sports') },
    { id: 'technology', label: t('technology') },
    { id: 'culture', label: t('culture') },
    { id: 'health', label: t('health') },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/category/${category.id}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 group"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {category.label}
            </h2>
            <span className="inline-flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
              {t('viewNews')}
              <ArrowLeft className={locale === 'en' ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

