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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item, index) => (
        <Link
          key={item.id}
          href={`/${locale}/news/${item.slug}`}
          className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-500/10 group animate-fade-up"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {item.image && (
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )}

          <div className="space-y-4 p-6">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {item.category && (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-600">
                  {getCategoryName(item.category, locale)}
                </span>
              )}
              <span className="flex items-center gap-2 text-slate-500">
                <Calendar className="h-4 w-4 text-red-500" />
                {new Date(item.date).toLocaleDateString(
                  locale === 'ku' ? 'ckb-IQ' : locale === 'fa' ? 'fa-IR' : 'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-red-600 line-clamp-2">
              {item.title}
            </h2>

            <p className="text-sm text-slate-600 line-clamp-3">
              {item.excerpt}
            </p>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-500">
                <User className="h-4 w-4 text-slate-400" />
                {item.author}
              </span>
              <span className="flex items-center gap-1 text-red-600 font-semibold transition-all duration-300 group-hover:gap-2">
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

