'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { getNews, getNewsBySlug, type NewsItem } from '@/lib/news'
import { Calendar, User, ArrowRight, Instagram, Facebook, Twitter, Send, Youtube, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import { getCategoryName } from '@/lib/category-mapping'

export default function NewsDetail({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }>
} | {
  params: { slug: string; locale: string }
}) {
  const resolvedParams = 'then' in params ? use(params) : params
  const t = useTranslations('news')
  const locale = useLocale()
  const [article, setArticle] = useState<NewsItem | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [views, setViews] = useState<number>(0)

  useEffect(() => {
    getNewsBySlug(resolvedParams.slug, locale).then(data => {
      setArticle(data)
      setViews(data?.views || 0)
      setLoading(false)
      if (!data) {
        notFound()
      }
    })
  }, [resolvedParams.slug, locale])

  // Track view when article is loaded
  useEffect(() => {
    if (article && !loading) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const encodedSlug = encodeURIComponent(resolvedParams.slug)
      const apiUrl = `${baseUrl}/api/news/views?slug=${encodedSlug}`
      
      console.log('Tracking view for:', resolvedParams.slug, 'API URL:', apiUrl)
      
      // Increment view count
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          console.log('Views API response status:', res.status)
          if (!res.ok) {
            return res.json().then(err => {
              console.error('Views API error:', err)
              throw new Error(err.error || 'Failed to increment views')
            })
          }
          return res.json()
        })
        .then(data => {
          console.log('Views API response:', data)
          if (data.success && data.views !== undefined) {
            setViews(data.views)
            console.log('Views updated to:', data.views)
          } else {
            console.warn('Views API response missing success or views:', data)
          }
        })
        .catch(error => {
          console.error('Error tracking view:', error)
        })
    }
  }, [article, loading, resolvedParams.slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg">بارکردن...</p>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href={`/${locale}/news`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowRight className={locale === 'en' ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
        {t('backToList')}
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {article.video && (
          <div className="p-8 pb-0">
            <VideoPlayer videoUrl={article.video} title={article.title} />
          </div>
        )}
        {article.audio && (
          <div className="p-8 pb-0">
            <div className="w-full bg-slate-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">ئۆدیۆ</h3>
              <audio src={article.audio} controls className="w-full" />
            </div>
          </div>
        )}
        {article.image && !article.video && !article.audio && (
          <div className="relative w-full aspect-[4/5] bg-gray-200 overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        )}
        {article.image && (article.video || article.audio) && (
          <div className="relative w-full aspect-[4/5] bg-gray-200 overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString(locale === 'ku' ? 'ku' : locale === 'fa' ? 'fa-IR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {views.toLocaleString()} {t('views')}
            </span>
            {article.category && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                {getCategoryName(article.category, locale)}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="space-y-4">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base leading-7">
                  {paragraph}
                </p>
              ))}
            </div>

            {article.images && article.images.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  وێنە زیاتر | More Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.images.map((imageUrl, index) => (
                    <div key={index} className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`${article.title} - وێنەی ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Author Social Media Links */}
          {(article.authorInstagram || article.authorFacebook || article.authorTwitter || article.authorTelegram || article.authorYoutube) && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {locale === 'fa' ? 'شبکه‌های اجتماعی نویسنده' : locale === 'ku' ? 'تۆرەکۆمەڵایەتییەکانی نووسەر' : 'Author Social Media'}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {article.authorInstagram && (
                  <a
                    href={article.authorInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 transition"
                  >
                    <Instagram className="h-4 w-4" />
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                )}
                {article.authorFacebook && (
                  <a
                    href={article.authorFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <Facebook className="h-4 w-4" />
                    <span className="text-sm font-medium">Facebook</span>
                  </a>
                )}
                {article.authorTwitter && (
                  <a
                    href={article.authorTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="text-sm font-medium">Twitter</span>
                  </a>
                )}
                {article.authorTelegram && (
                  <a
                    href={article.authorTelegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition"
                  >
                    <Send className="h-4 w-4" />
                    <span className="text-sm font-medium">Telegram</span>
                  </a>
                )}
                {article.authorYoutube && (
                  <a
                    href={article.authorYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    <Youtube className="h-4 w-4" />
                    <span className="text-sm font-medium">YouTube</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

