'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import type { NewsItem } from '@/lib/news'
import { getCategoryName } from '@/lib/category-mapping'

interface NewsListProps {
  news: NewsItem[]
}

export default function NewsList({ news }: NewsListProps) {
  const t = useTranslations('news')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{t('noNews')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <Link
          key={item.id}
          href={`/${locale}/news/${item.slug}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
        >
          {item.image && (
            <div className="w-full aspect-[4/5] bg-gray-200 relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
              {new Date(item.date).toLocaleDateString(locale === 'ku' ? 'ku' : locale === 'fa' ? 'fa-IR' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              </span>
              {item.category && (
                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                  {getCategoryName(item.category, locale)}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
              {item.title}
            </h2>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {item.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <User className="h-4 w-4" />
                {item.author}
              </span>
              <span className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                {tCommon('readMore')}
                <ArrowLeft className={locale === 'en' ? 'mr-2 h-4 w-4 rotate-180' : 'ml-2 h-4 w-4'} />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

