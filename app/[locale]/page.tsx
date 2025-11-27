'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Calendar, Flame, ArrowRight, Play } from 'lucide-react'
import NewsList from '@/components/NewsList'
import { getNews, type NewsItem } from '@/lib/news'
import { getCategoryName } from '@/lib/category-mapping'
import { formatDate } from '@/lib/date-format'

export default function Home() {
  const t = useTranslations('home')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const selectedCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    getNews(locale).then(data => {
      console.log('Homepage loaded news:', data.length, 'items')
      setNews(data)
      setLoading(false)
    }).catch(error => {
      console.error('Error loading news:', error)
      setLoading(false)
    })
    
    // Auto-refresh every 30 seconds to show new posts
    const interval = setInterval(() => {
      getNews(locale).then(data => {
        console.log('Auto-refresh: loaded', data.length, 'items')
        setNews(data)
      }).catch(error => {
        console.error('Auto-refresh error:', error)
      })
    }, 30000) // 30 seconds
    
    return () => clearInterval(interval)
  }, [locale, selectedCategory])

  const filteredNews = useMemo(() => {
    if (!Array.isArray(news)) return []
    
    let filtered = news
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        const title = (item.title || '').toLowerCase()
        const excerpt = (item.excerpt || '').toLowerCase()
        const content = (item.content || '').toLowerCase()
        const author = (item.author || '').toLowerCase()
        const tags = (item.tags || []).join(' ').toLowerCase()
        
        return title.includes(query) || 
               excerpt.includes(query) || 
               content.includes(query) ||
               author.includes(query) ||
               tags.includes(query)
      })
    }
    
    return filtered
  }, [news, selectedCategory, searchQuery])

  // Get posts by section
  // Check for section field (might be undefined for old posts)
  const heroArticles = filteredNews.filter((item: any) => item.section === 'hero')
  const breakingArticles = filteredNews.filter((item: any) => item.section === 'breaking')
  const generalArticles = filteredNews.filter((item: any) => !item.section || item.section === 'general' || item.section === null)

  // Sort all news by date (newest first) for breaking news
  const sortedNews = [...filteredNews].sort((a: any, b: any) => {
    const dateA = new Date(a.date || 0).getTime()
    const dateB = new Date(b.date || 0).getTime()
    return dateB - dateA
  })

  // Debug logging
  useEffect(() => {
    console.log('News sections:', {
      total: filteredNews.length,
      hero: heroArticles.length,
      breaking: breakingArticles.length,
      general: generalArticles.length,
      allSections: filteredNews.map((n: any) => ({ slug: n.slug, section: n.section, title: n.title?.substring(0, 30) })),
    })
  }, [filteredNews, heroArticles, breakingArticles, generalArticles])

  // Use first hero article, or first general article as fallback
  const heroArticle = heroArticles.length > 0 ? heroArticles[0] : (generalArticles.length > 0 ? generalArticles[0] : null)
  
  // Breaking news: Show posts with section='breaking' OR newest posts (auto-include new posts)
  // Get newest posts (last 24 hours or last 10 posts, whichever is more)
  const now = new Date().getTime()
  const oneDayAgo = now - (24 * 60 * 60 * 1000)
  const newestPosts = sortedNews.filter((item: any) => {
    const postDate = new Date(item.date || 0).getTime()
    return postDate >= oneDayAgo
  }).slice(0, 10)
  
  // Combine breaking articles with newest posts, remove duplicates
  const allBreakingCandidates = [...breakingArticles, ...newestPosts]
  const uniqueBreaking = allBreakingCandidates.filter((item, index, self) => 
    index === self.findIndex((t) => t.slug === item.slug)
  )
  
  // Exclude hero article from breaking news
  const breakingItems = uniqueBreaking
    .filter((item: any) => item.slug !== heroArticle?.slug)
    .slice(0, 10) // Limit to 10 items
  // Remaining news: Show all posts except hero article
  // Posts in breaking news should also appear in the main list
  const remainingNews = filteredNews.filter((item: any) => 
    item.slug !== heroArticle?.slug
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-lg">بارکردن...</p>
      </div>
    )
  }

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
        <article className="mb-12 pb-8 border-b border-gray-200">
          <Link href={`/${locale}/news/${heroArticle.slug}${heroArticle.video ? '#video' : ''}`} className="block group">
            {/* Media Section */}
            {(heroArticle.image || heroArticle.video) && (
              <div className="relative w-full h-96 md:h-[500px] mb-6 bg-gray-100 rounded-lg overflow-hidden">
                {heroArticle.video ? (
                  <>
                    {heroArticle.image ? (
                      <Image
                        src={heroArticle.image}
                        alt={heroArticle.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="bg-red-600 rounded-full p-6 shadow-lg">
                        <Play className="h-10 w-10 text-white fill-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-2 rounded bg-red-600 px-3 py-1.5 text-sm font-semibold text-white">
                        <Play className="h-4 w-4 fill-white" />
                        {locale === 'fa' ? 'ویدیو' : locale === 'ku' ? 'ڤیدیۆ' : 'Video'}
                      </span>
                    </div>
                  </>
                ) : heroArticle.image ? (
                  <Image
                    src={heroArticle.image}
                    alt={heroArticle.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                  />
                ) : null}
              </div>
            )}

            {/* Content Section */}
            <div className="space-y-4">
              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded">
                  <Flame className="h-3 w-3" />
                  {t('topStory')}
                </span>
                {heroArticle.category && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    {getCategoryName(heroArticle.category, locale)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(heroArticle.date, locale)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 group-hover:text-red-600 transition-colors">
                {heroArticle.title}
              </h2>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 leading-relaxed">
                {heroArticle.excerpt}
              </p>

              {/* Read More Link */}
              <div className="pt-2">
                <span className="text-red-600 font-semibold group-hover:underline">
                  {t('heroButton')} →
                </span>
              </div>
            </div>
          </Link>
        </article>
      )}

      {breakingItems.length > 0 && (
        <section className="group relative overflow-hidden rounded-3xl border-2 border-red-500/30 bg-gradient-to-br from-white via-red-50/30 to-white shadow-xl shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-500 hover:border-red-500/50">
          {/* Decorative Border Lines */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent group-hover:via-red-500 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent group-hover:via-red-500 transition-opacity duration-500" />
          </div>

          {/* Header with Enhanced Design */}
          <div className="relative flex items-center gap-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-6 py-4 text-white shadow-lg">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-red-700/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-32 h-full bg-gradient-to-l from-red-700/50 to-transparent" />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative">
                <Flame className="h-6 w-6 animate-pulse drop-shadow-lg" />
                <div className="absolute inset-0 bg-red-400 blur-xl opacity-50 animate-pulse" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest drop-shadow-lg relative">
                {t('breaking')}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white/60 rounded-full" />
              </span>
            </div>
            
            {/* Animated Indicator */}
            <div className="relative z-10 ml-auto flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-white/60 animate-pulse delay-75" />
              <span className="h-2 w-2 rounded-full bg-white/40 animate-pulse delay-150" />
            </div>
          </div>

          {/* News Ticker */}
          <div className="relative bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-8 whitespace-nowrap py-5 pl-8 pr-8 text-slate-800 animate-marquee">
              {[...breakingItems, ...breakingItems].map((item, index) => (
                <Link
                  key={`${item.id}-${index}`}
                  href={`/${locale}/news/${item.slug}`}
                  className="group/item flex items-center gap-3 text-sm font-semibold transition-all duration-300 hover:text-red-600 hover:scale-105"
                >
                  {/* Animated Dot */}
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/40 group-hover/item:scale-125 transition-transform duration-300">
                    <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
                  </span>
                  
                  {/* Title with Gradient Effect */}
                  <span className="relative">
                    {item.title}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-red-500 to-red-600 group-hover/item:w-full transition-all duration-300" />
                  </span>
                  
                  {/* Separator */}
                  <span className="text-red-300 font-bold">•</span>
                </Link>
              ))}
            </div>
            
            {/* Gradient Fade Effects */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
            
            {/* Bottom Border Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent" />
          </div>

          {/* Corner Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-500/40 rounded-tl-lg opacity-60 group-hover:opacity-100 group-hover:border-red-500 transition-all duration-500" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-500/40 rounded-tr-lg opacity-60 group-hover:opacity-100 group-hover:border-red-500 transition-all duration-500" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-500/40 rounded-bl-lg opacity-60 group-hover:opacity-100 group-hover:border-red-500 transition-all duration-500" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-500/40 rounded-br-lg opacity-60 group-hover:opacity-100 group-hover:border-red-500 transition-all duration-500" />
        </section>
      )}

      <section className="space-y-8">
        {searchQuery && (
          <div className="mb-4 px-4">
            <h2 className="text-xl font-bold text-slate-900">
              {t('searchResults')}: &quot;{searchQuery}&quot;
            </h2>
            {remainingNews.length === 0 && (
              <p className="mt-2 text-slate-600">{t('noResults')}</p>
            )}
          </div>
        )}
        {remainingNews.length > 0 ? (
          <NewsList news={remainingNews} />
        ) : searchQuery ? (
          <div className="text-center py-12 px-4">
            <p className="text-slate-600 text-lg">{t('noResults')}</p>
          </div>
        ) : null}
      </section>
    </div>
  )
}

