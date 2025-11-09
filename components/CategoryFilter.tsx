'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Filter } from 'lucide-react'

export default function CategoryFilter() {
  const t = useTranslations('categories')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: t('all') },
    { id: 'social', label: t('social') },
    { id: 'politics', label: t('politics') },
    { id: 'sports', label: t('sports') },
    { id: 'technology', label: t('technology') },
    { id: 'culture', label: t('culture') },
    { id: 'health', label: t('health') },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

