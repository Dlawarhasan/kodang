'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { getNews, getNewsBySlug, type NewsItem } from '@/lib/news'
import { translateText } from '@/lib/translate'
import { Calendar, User, ArrowRight, Instagram, Facebook, Twitter, Send, Youtube, Eye, Languages, Share2, Copy, Check, X, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import { getCategoryName } from '@/lib/category-mapping'
import { formatDate } from '@/lib/date-format'

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
  const [translating, setTranslating] = useState(false)
  const [translatedContent, setTranslatedContent] = useState<{
    title?: string
    content?: string
  }>({})
  const [linkCopied, setLinkCopied] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    // Clear article state when locale changes to force re-render
    setArticle(undefined)
    setTranslatedContent({})
    setLoading(true)
    
    console.log('Loading article with locale:', locale, 'slug:', resolvedParams.slug)
    
    getNewsBySlug(resolvedParams.slug, locale).then(data => {
      console.log('Article loaded:', { locale, hasData: !!data, title: data?.title?.substring(0, 50), needsTranslation: data?.needsTranslation })
      setArticle(data)
      setViews(data?.views || 0)
      setLoading(false)
      if (!data) {
        notFound()
      }
      
      // Auto-translate if translation is needed
      if (data?.needsTranslation && data.originalLocale && data.originalLocale !== locale) {
        autoTranslate(data, data.originalLocale, locale)
      }
    }).catch(error => {
      console.error('Error loading article:', error)
      setLoading(false)
    })
  }, [resolvedParams.slug, locale])

  const autoTranslate = async (articleData: NewsItem, from: string, to: string) => {
    if (!articleData || from === to) return
    
    setTranslating(true)
    
    try {
      // Translate title and content
      const [translatedTitle, translatedContent] = await Promise.all([
        translateText(articleData.title || '', from, to),
        translateText(articleData.content || '', from, to),
      ])
      
      setTranslatedContent({
        title: translatedTitle,
        content: translatedContent,
      })
    } catch (error) {
      console.error('Auto-translation error:', error)
    } finally {
      setTranslating(false)
    }
  }

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

  // Update meta tags for social sharing
  useEffect(() => {
    if (!article) return

    const siteUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'https://kodang.news')
    const postUrl = `${siteUrl}/${locale}/news/${resolvedParams.slug}`
    const postTitle = translatedContent.title || article.title
    const postDescription = (translatedContent.content || article.content || '').substring(0, 160)
    const postImage = article.image || `${siteUrl}/og-image.jpg`

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', property)
        } else {
          meta.setAttribute('name', property)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update title
    document.title = `${postTitle} | کۆدەنگ | KODANG`

    // Basic meta tags
    updateMetaTag('description', postDescription, false)
    
    // Open Graph tags
    updateMetaTag('og:type', 'article')
    updateMetaTag('og:url', postUrl)
    updateMetaTag('og:title', postTitle)
    updateMetaTag('og:description', postDescription)
    updateMetaTag('og:image', postImage)
    updateMetaTag('og:image:width', '1200')
    updateMetaTag('og:image:height', '630')
    updateMetaTag('og:locale', locale === 'fa' ? 'fa_IR' : locale === 'ku' ? 'ku' : 'en_US')
    updateMetaTag('og:site_name', 'کۆدەنگ | KODANG')
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', false)
    updateMetaTag('twitter:url', postUrl, false)
    updateMetaTag('twitter:title', postTitle, false)
    updateMetaTag('twitter:description', postDescription, false)
    updateMetaTag('twitter:image', postImage, false)
    
    // Article meta tags
    updateMetaTag('article:author', article.author, false)
    updateMetaTag('article:published_time', article.date, false)
    if (article.category) {
      updateMetaTag('article:section', article.category, false)
    }
  }, [article, locale, resolvedParams.slug, translatedContent])

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href={`/${locale}/news`}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 text-sm font-medium"
      >
        <ArrowRight className={locale === 'en' ? 'mr-2 h-4 w-4' : 'ml-2 h-4 w-4'} />
        {t('backToList')}
      </Link>

      <article className="bg-white">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
          {article.category && (
            <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded">
              {getCategoryName(article.category, locale)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(article.date, locale)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {views.toLocaleString()} {t('views')}
          </span>
        </div>

        {/* Title - Above Media */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-6">
          {translatedContent.title || article.title}
        </h1>

        {/* Media Section */}
        {article.video && (
          <div className="mb-8">
            <VideoPlayer 
              videoUrl={article.video} 
              title={article.title}
              autoplay={typeof window !== 'undefined' && window.location.hash === '#video'}
              thumbnail={article.image}
            />
          </div>
        )}
        {article.audio && (
          <div className="mb-8">
            <div className="w-full bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {locale === 'fa' ? 'صوت' : locale === 'ku' ? 'دەنگ' : 'Audio'}
              </h3>
              <audio src={article.audio} controls className="w-full" />
            </div>
          </div>
        )}
        {article.image && !article.video && !article.audio && (
          <div 
            className="relative w-full aspect-[16/9] mb-8 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setLightboxImage(article.image || null)}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-3">
                <Maximize2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )}
        {article.image && (article.video || article.audio) && (
          <div 
            className="relative w-full aspect-[16/9] mb-8 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setLightboxImage(article.image || null)}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-3">
                <Maximize2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="prose prose-lg max-w-none">
          {translating && (
            <div className="mb-6 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              <Languages className="h-4 w-4 animate-pulse" />
              <span>{locale === 'fa' ? 'در حال ترجمه...' : locale === 'ku' ? 'وەرگێڕان...' : 'Translating...'}</span>
            </div>
          )}
            
          <div className="text-gray-700 leading-relaxed space-y-4">
            {(translatedContent.content || article.content).split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base leading-7">
                {paragraph}
              </p>
            ))}
          </div>

            {article.images && article.images.length > 0 && (
              <div className="mt-12 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {locale === 'fa' ? 'تصاویر بیشتر' : locale === 'ku' ? 'وێنە زیاتر' : 'More Images'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.images.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className="relative w-full aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setLightboxImage(imageUrl)}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${article.title} - ${locale === 'fa' ? 'تصویر' : locale === 'ku' ? 'وێنە' : 'Image'} ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-2">
                          <Maximize2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {locale === 'fa' ? 'اشتراک‌گذاری' : locale === 'ku' ? 'هاوبەشکردن' : 'Share'}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {/* Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `/${locale}/news/${resolvedParams.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Facebook className="h-4 w-4" />
              <span className="text-sm font-medium">Facebook</span>
            </a>

            {/* Twitter Share */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `/${locale}/news/${resolvedParams.slug}`)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="text-sm font-medium">Twitter</span>
            </a>

            {/* Telegram Share */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `/${locale}/news/${resolvedParams.slug}`)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span className="text-sm font-medium">Telegram</span>
            </a>

            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${typeof window !== 'undefined' ? window.location.href : `/${locale}/news/${resolvedParams.slug}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? window.location.href : `/${locale}/news/${resolvedParams.slug}`
                navigator.clipboard.writeText(url).then(() => {
                  setLinkCopied(true)
                  setTimeout(() => setLinkCopied(false), 2000)
                })
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {linkCopied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {locale === 'fa' ? 'کپی شد!' : locale === 'ku' ? 'کۆپی کرا!' : 'Copied!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {locale === 'fa' ? 'کپی لینک' : locale === 'ku' ? 'کۆپی لینک' : 'Copy Link'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Author Social Media Links */}
        {(article.authorInstagram || article.authorFacebook || article.authorTwitter || article.authorTelegram || article.authorYoutube) && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {locale === 'fa' ? 'شبکه‌های اجتماعی نویسنده' : locale === 'ku' ? 'تۆرەکۆمەڵایەتییەکانی نووسەر' : 'Author Social Media'}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {article.authorInstagram && (
                <a
                  href={article.authorInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-blue-200 bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                  <span className="text-sm font-medium">YouTube</span>
                </a>
              )}
            </div>
          </div>
        )}
      </article>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label={locale === 'fa' ? 'بستن' : locale === 'ku' ? 'داخستن' : 'Close'}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={lightboxImage}
              alt={article.title}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

