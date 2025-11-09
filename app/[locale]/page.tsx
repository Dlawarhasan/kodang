'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, Flame, ArrowRight } from 'lucide-react'
import NewsList from '@/components/NewsList'
import CategoryFilter from '@/components/CategoryFilter'
import { getNews } from '@/lib/news'
import { getCategoryName } from '@/lib/category-mapping'

export default function Home() {
  const t = useTranslations('home')
  const locale = useLocale()
  const news = getNews(locale)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'all') {
      return news
    }
    return news.filter((item) => item.category === selectedCategory)
  }, [news, selectedCategory])

  const heroArticle = filteredNews[0]
  const remainingNews = heroArticle ? filteredNews.slice(1) : filteredNews
  const breakingItems = filteredNews.slice(0, 6)

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <header className="space-y-3 animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-700">
          <Flame className="h-4 w-4" />
          {t('politicsFocus')}
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          {t('title')}
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
          {t('subtitle')}
        </p>
      </header>

      {heroArticle && (
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl ring-1 ring-white/10 animate-fade-in">
          <div className="absolute inset-0 -z-10">
            {heroArticle.image && (
              <Image
                src={heroArticle.image}
                alt={heroArticle.title}
                fill
                priority
                className="object-cover opacity-60"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 1200px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-red-900/60" />
          </div>

          <div className="relative grid gap-8 p-8 md:grid-cols-[2fr,1fr] md:p-12 lg:p-16">
            <div className="space-y-6 max-w-2xl">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200/80">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                  {t('topStory')}
                </span>
                {heroArticle.category && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 font-semibold text-red-100">
                    {getCategoryName(heroArticle.category, locale)}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(heroArticle.date).toLocaleDateString(
                    locale === 'ku' ? 'ckb-IQ' : locale === 'fa' ? 'fa-IR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight drop-shadow-lg">
                  {heroArticle.title}
                </h2>
                <p className="text-lg md:text-xl text-slate-200/90 max-w-2xl">
                  {heroArticle.excerpt}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/news/${heroArticle.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/40 transition hover:bg-red-400 hover:shadow-red-400/40"
                >
                  {t('heroButton')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href={`/${locale}/news`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {t('heroSecondary')}
                </Link>
              </div>
            </div>

            {heroArticle.tags && heroArticle.tags.length > 0 && (
              <aside className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {heroArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white/90"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {breakingItems.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 bg-red-600 px-6 py-3 text-white">
            <Flame className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              {t('breaking')}
            </span>
          </div>
          <div className="relative">
            <div className="flex items-center gap-8 whitespace-nowrap py-4 pl-6 pr-6 text-slate-700 animate-marquee">
              {[...breakingItems, ...breakingItems].map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/${locale}/news/${item.slug}`}
                  className="flex items-center gap-2 text-sm font-medium transition hover:text-red-600"
                >
                  <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white to-transparent" />
          </div>
        </section>
      )}

      <section className="space-y-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <NewsList news={remainingNews} />
      </section>
    </div>
  )
}

