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
import { getYouTubeThumbnail, getYouTubeVideoId, isDirectVideoUrl } from '@/lib/video-utils'

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
        const content = (item.content || '').toLowerCase()
        const author = (item.author || '').toLowerCase()
        const tags = (item.tags || []).join(' ').toLowerCase()
        
        return title.includes(query) || 
               content.includes(query) ||
               author.includes(query) ||
               tags.includes(query)
      })
    }
    
    return filtered
  }, [news, selectedCategory, searchQuery])

  // Get posts by section
  const heroArticles = filteredNews.filter((item: any) => item.section === 'hero')
  const breakingArticles = filteredNews.filter((item: any) => item.section === 'breaking')
  const generalArticles = filteredNews.filter((item: any) => !item.section || item.section === 'general' || item.section === null)

  // Sort all news by date (newest first)
  const sortedNews = [...filteredNews].sort((a: any, b: any) => {
    const dateA = new Date(a.date || 0).getTime()
    const dateB = new Date(b.date || 0).getTime()
    return dateB - dateA
  })

  // Use first hero article, or first general article as fallback
  const heroArticle = heroArticles.length > 0 ? heroArticles[0] : (generalArticles.length > 0 ? generalArticles[0] : null)
  
  // Breaking news: Show posts with section='breaking' OR newest posts
  const now = new Date().getTime()
  const oneDayAgo = now - (24 * 60 * 60 * 1000)
  const newestPosts = sortedNews.filter((item: any) => {
    const postDate = new Date(item.date || 0).getTime()
    return postDate >= oneDayAgo
  }).slice(0, 10)
  
  const allBreakingCandidates = [...breakingArticles, ...newestPosts]
  const uniqueBreaking = allBreakingCandidates.filter((item, index, self) => 
    index === self.findIndex((t) => t.slug === item.slug)
  )
  
  const breakingItems = uniqueBreaking
    .filter((item: any) => item.slug !== heroArticle?.slug)
    .slice(0, 10)

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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Main Content Grid - Iran International Style */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Article - Large */}
            {heroArticle && (
              <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <Link href={`/${locale}/news/${heroArticle.slug}${heroArticle.video ? '#video' : ''}`} className="block group">
                  {(heroArticle.image || heroArticle.video) && (
                    <div className="relative w-full aspect-[16/9] mb-4 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      {heroArticle.video ? (
                        <>
                          {(() => {
                            const thumbnailUrl = heroArticle.video ? getYouTubeThumbnail(heroArticle.video, heroArticle.image) : null
                            const isDirectVideo = heroArticle.video ? isDirectVideoUrl(heroArticle.video) : false
                            
                            return thumbnailUrl ? (
                              <Image
                                src={thumbnailUrl}
                                alt={heroArticle.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 900px"
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                  // Fallback to hqdefault if maxresdefault fails
                                  const videoId = heroArticle.video ? getYouTubeVideoId(heroArticle.video) : null
                                  if (videoId && thumbnailUrl.includes('maxresdefault')) {
                                    const target = e.target as HTMLImageElement
                                    target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                                  } else {
                                    // If still fails, show placeholder
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent) {
                                      const placeholder = document.createElement('div')
                                      placeholder.className = 'absolute inset-0 bg-gray-200 dark:bg-gray-800'
                                      parent.appendChild(placeholder)
                                    }
                                  }
                                }}
                              />
                            ) : isDirectVideo && heroArticle.video ? (
                              // For direct videos without thumbnail, show video preview
                              <video
                                src={heroArticle.video}
                                className="absolute inset-0 w-full h-full object-cover"
                                muted
                                playsInline
                                preload="metadata"
                                onLoadedMetadata={(e) => {
                                  // Show first frame
                                  const video = e.target as HTMLVideoElement
                                  video.currentTime = 0.1
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
                            )
                          })()}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="bg-red-600 rounded-full p-6">
                              <Play className="h-10 w-10 text-white fill-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-semibold text-white">
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
                          sizes="(max-width: 768px) 100vw, 900px"
                        />
                      ) : null}
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {heroArticle.category && (
                        <span className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-semibold">
                          {getCategoryName(heroArticle.category, locale)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(heroArticle.date, locale)}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {heroArticle.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                      {(heroArticle.content || '').substring(0, 150)}...
                    </p>
                  </div>
                </Link>
              </article>
            )}

            {/* Breaking News Section */}
            {breakingItems.length > 0 && (
              <section className="bg-blue-900 dark:bg-blue-950 border border-blue-800 rounded-lg overflow-hidden shadow-lg">
                <div className="flex items-center gap-3 px-4 py-2 bg-blue-900 dark:bg-blue-950 border-b border-blue-800">
                  <div className="bg-white/20 rounded-full p-1.5">
                    <Flame className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    {t('breaking')}
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-white/30 rounded-full text-xs font-bold">
                      {breakingItems.length}
                    </span>
                  </h2>
                </div>
                <div className="bg-blue-900 dark:bg-blue-950 py-2 overflow-hidden">
                  <div className="flex animate-marquee whitespace-nowrap">
                    {[...breakingItems.slice(0, 5), ...breakingItems.slice(0, 5)].map((item, index) => (
                      <Link
                        key={`${item.id}-${index}`}
                        href={`/${locale}/news/${item.slug}`}
                        className="inline-flex items-center gap-3 mx-4 group hover:text-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-white group-hover:text-blue-300">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-500">•</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* News Grid */}
            <section>
              {searchQuery && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t('searchResults')}: &quot;{searchQuery}&quot;
                  </h2>
                  {remainingNews.length === 0 && (
                    <p className="text-gray-600 dark:text-gray-400">{t('noResults')}</p>
                  )}
                </div>
              )}
              {remainingNews.length > 0 ? (
                <NewsList news={remainingNews} />
              ) : searchQuery ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">{t('noResults')}</p>
                </div>
              ) : null}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Most Viewed Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {locale === 'fa' ? 'پربازدیدترین ها' : locale === 'ku' ? 'زۆرترین بینراو' : 'Most Viewed'}
              </h3>
              <div className="space-y-4">
                {sortedNews.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.slug}`}
                    className="block group"
                  >
                    {item.image && (
                      <div className="relative w-full h-24 mb-2 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      </div>
                    )}
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {formatDate(item.date, locale)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
