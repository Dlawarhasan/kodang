'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Calendar, Flame, ArrowRight } from 'lucide-react'
import NewsList from '@/components/NewsList'
import { getNews, type NewsItem } from '@/lib/news'
import { getCategoryName } from '@/lib/category-mapping'

export default function Home() {
  const t = useTranslations('home')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const selectedCategory = searchParams.get('category') || 'all'

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
    if (selectedCategory === 'all') {
      // Show all posts when "all" category is selected
      console.log('Showing all posts:', news.length)
      return news
    }
    // Filter by specific category
    const filtered = news.filter((item) => item.category === selectedCategory)
    console.log(`Filtered by category "${selectedCategory}":`, filtered.length, 'posts')
    return filtered
  }, [news, selectedCategory])

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
        <section className="group relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl ring-2 ring-white/20 animate-fade-in transition-all duration-500 hover:shadow-red-500/30 hover:ring-red-500/40">
          {/* Decorative Border Lines */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Top Border Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent group-hover:via-red-400 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Bottom Border Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent group-hover:via-red-400 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Left Border Line */}
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-red-500/60 to-transparent group-hover:via-red-400 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Right Border Line */}
            <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-red-500/60 to-transparent group-hover:via-red-400 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-red-500/50 rounded-tl-lg group-hover:border-red-400 transition-colors duration-500" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-red-500/50 rounded-tr-lg group-hover:border-red-400 transition-colors duration-500" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-red-500/50 rounded-bl-lg group-hover:border-red-400 transition-colors duration-500" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-red-500/50 rounded-br-lg group-hover:border-red-400 transition-colors duration-500" />
          </div>

          {/* Background Image with Parallax Effect */}
          <div className="absolute inset-0 -z-10">
            {heroArticle.image && (
              <Image
                src={heroArticle.image}
                alt={heroArticle.title}
                fill
                priority
                className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 1200px"
              />
            )}
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/85 to-red-900/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content Grid */}
          <div className="relative grid gap-8 p-8 md:grid-cols-[2fr,1fr] md:p-12 lg:p-16">
            {/* Main Content */}
            <div className="space-y-6 max-w-2xl relative">
              {/* Decorative Line Before Content */}
              <div className="absolute -left-4 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-500 via-red-400 to-transparent rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 text-sm relative">
                {/* Decorative Line Under Badges */}
                <div className="absolute -bottom-2 left-0 w-24 h-[1px] bg-gradient-to-r from-red-500/60 to-transparent group-hover:w-32 group-hover:from-red-400 transition-all duration-500" />
                
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/30 to-red-600/30 backdrop-blur-sm border-2 border-red-400/40 px-4 py-1.5 font-semibold text-red-100 shadow-lg shadow-red-500/20 group-hover:border-red-400/60 transition-all duration-300">
                  <Flame className="h-4 w-4 animate-pulse" />
                  {t('topStory')}
                </span>
                {heroArticle.category && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 px-4 py-1.5 font-semibold text-white shadow-lg group-hover:border-white/50 transition-all duration-300">
                    {getCategoryName(heroArticle.category, locale)}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 px-4 py-1.5 text-white/90 group-hover:border-white/40 transition-all duration-300">
                  <Calendar className="h-4 w-4" />
                  {new Date(heroArticle.date).toLocaleDateString(
                    locale === 'ku' ? 'ckb-IQ' : locale === 'fa' ? 'fa-IR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>

              {/* Title and Excerpt */}
              <div className="space-y-4 relative">
                {/* Decorative Line Before Title */}
                <div className="absolute -left-6 top-0 w-[2px] h-16 bg-gradient-to-b from-red-500/60 via-red-400/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />
                
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-black leading-[1.1] drop-shadow-2xl bg-gradient-to-br from-white via-white to-slate-200 bg-clip-text text-transparent group-hover:from-red-100 group-hover:via-white group-hover:to-white transition-all duration-500 relative">
                  {/* Underline Effect */}
                  <span className="absolute -bottom-2 left-0 w-0 h-[3px] bg-gradient-to-r from-red-500 to-red-400 rounded-full group-hover:w-full transition-all duration-700" />
                  {heroArticle.title}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-slate-200/95 max-w-2xl leading-relaxed font-medium relative pl-4 border-l-2 border-white/20 group-hover:border-red-400/40 transition-colors duration-500">
                  {heroArticle.excerpt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 relative">
                {/* Decorative Line Above Buttons */}
                <div className="absolute -top-2 left-0 w-32 h-[1px] bg-gradient-to-r from-red-500/60 to-transparent group-hover:w-40 group-hover:from-red-400 transition-all duration-500" />
                
                <Link
                  href={`/${locale}/news/${heroArticle.slug}`}
                  className="group/btn relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-red-500/40 transition-all duration-300 hover:from-red-400 hover:to-red-500 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95 border-2 border-red-400/30 hover:border-red-300/50"
                >
                  {/* Button Glow Effect */}
                  <span className="absolute inset-0 rounded-full bg-red-400/20 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{t('heroButton')}</span>
                  <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
                <Link
                  href={`/${locale}/news`}
                  className="relative inline-flex items-center gap-2 rounded-full border-2 border-white/40 backdrop-blur-sm bg-white/5 px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/60 hover:scale-105 active:scale-95"
                >
                  {t('heroSecondary')}
                </Link>
              </div>
            </div>

            {/* Sidebar - Tags */}
            {heroArticle.tags && heroArticle.tags.length > 0 && (
              <aside className="rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/30 p-6 shadow-2xl h-fit relative group-hover:border-red-400/40 transition-all duration-500">
                {/* Decorative Lines on Sidebar */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-red-400 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:via-red-400 transition-colors duration-500" />
                
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/80 flex items-center gap-2 relative">
                  <span className="h-1 w-1 rounded-full bg-red-400 animate-pulse" />
                  <span className="absolute left-0 bottom-0 w-8 h-[2px] bg-gradient-to-r from-red-500 to-transparent" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {heroArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-medium text-white/95 shadow-lg hover:from-white/30 hover:to-white/20 hover:scale-105 hover:border-red-400/40 transition-all duration-200 cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </aside>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-all duration-500" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          {/* Corner Glow Effects */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/5 rounded-br-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-500/5 rounded-tl-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500" />
        </section>
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
        <NewsList news={remainingNews} />
      </section>
    </div>
  )
}

