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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Featured Article */}
          {heroArticle && (
            <article className="border-b border-gray-200 pb-6">
              <Link href={`/${locale}/news/${heroArticle.slug}${heroArticle.video ? '#video' : ''}`} className="block group">
                {(heroArticle.image || heroArticle.video) && (
                  <div className="relative w-full h-64 md:h-80 mb-4 bg-gray-100 overflow-hidden">
                    {heroArticle.video ? (
                      <>
                        {heroArticle.image ? (
                          <Image
                            src={heroArticle.image}
                            alt={heroArticle.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-red-600 rounded-full p-4">
                            <Play className="h-8 w-8 text-white fill-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                            <Play className="h-3 w-3 fill-white" />
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
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    ) : null}
                  </div>
                )}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {heroArticle.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        {getCategoryName(heroArticle.category, locale)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(heroArticle.date, locale)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 group-hover:text-red-600 transition-colors">
                    {heroArticle.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed line-clamp-2">
                    {heroArticle.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          )}

          {/* Breaking News Section */}
          {breakingItems.length > 0 && (
            <section className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">{t('breaking')}</h2>
              </div>
              <div className="space-y-3">
                {breakingItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.slug}`}
                    className="block group border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatDate(item.date, locale)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* News Grid */}
          <section>
            {searchQuery && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t('searchResults')}: &quot;{searchQuery}&quot;
                </h2>
                {remainingNews.length === 0 && (
                  <p className="text-gray-600">{t('noResults')}</p>
                )}
              </div>
            )}
            {remainingNews.length > 0 ? (
              <NewsList news={remainingNews} />
            ) : searchQuery ? (
              <div className="text-center py-12">
                <p className="text-gray-600">{t('noResults')}</p>
              </div>
            ) : null}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Latest News */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {locale === 'fa' ? 'آخرین اخبار' : locale === 'ku' ? 'دوایین هەواڵەکان' : 'Latest News'}
            </h3>
            <div className="space-y-4">
              {sortedNews.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.slug}`}
                  className="block group"
                >
                  {item.image && (
                    <div className="relative w-full h-24 mb-2 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    </div>
                  )}
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {formatDate(item.date, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              {locale === 'fa' ? 'دسته‌بندی‌ها' : locale === 'ku' ? 'پۆلەکان' : 'Categories'}
            </h3>
            <div className="space-y-2">
              {['politics', 'social', 'culture', 'health'].map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}?category=${cat}`}
                  className="block text-sm text-gray-700 hover:text-red-600 transition-colors py-1"
                >
                  {getCategoryName(cat, locale)}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

