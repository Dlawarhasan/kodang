'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, User, ArrowLeft, Play, Facebook, Instagram, Twitter, Share2 } from 'lucide-react'
import type { NewsItem } from '@/lib/news'
import { getCategoryName } from '@/lib/category-mapping'
import { formatDateShort } from '@/lib/date-format'
import { getYouTubeThumbnail, getYouTubeVideoId, isDirectVideoUrl } from '@/lib/video-utils'

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
    <div className="space-y-8">
      {news.map((item, index) => (
        <article
          key={item.id}
          className="group border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:translate-x-2 hover:shadow-md"
        >
          <Link
            href={`/${locale}/news/${item.slug}${item.video ? '#video' : ''}`}
            className="block"
          >
            <div className="flex flex-col md:flex-row gap-6">

              {/* Media Section */}
              {(item.image || item.video) && (
                <div className="relative w-full md:w-80 lg:w-96 aspect-[4/3] flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg group-hover:scale-105 transition-transform duration-300">
                  {item.video ? (
                    <>
                      {(() => {
                        const thumbnailUrl = item.video ? getYouTubeThumbnail(item.video, item.image) : null
                        const isDirectVideo = item.video ? isDirectVideoUrl(item.video) : false
                        
                        return thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 320px"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              // Fallback to hqdefault if maxresdefault fails
                              const videoId = item.video ? getYouTubeVideoId(item.video) : null
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
                                  placeholder.className = 'absolute inset-0 bg-gray-200'
                                  parent.appendChild(placeholder)
                                }
                              }
                            }}
                          />
                        ) : isDirectVideo ? (
                          // For direct videos without thumbnail, show video preview
                          <video
                            src={item.video!}
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
                          <div className="absolute inset-0 bg-gray-200" />
                        )
                      })()}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-red-600 rounded-full p-4 shadow-lg">
                          <Play className="h-6 w-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                          <Play className="h-3 w-3 fill-white" />
                          {locale === 'fa' ? 'ویدیو' : locale === 'ku' ? 'ڤیدیۆ' : 'Video'}
                        </span>
                      </div>
                    </>
                  ) : item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 320px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : null}
                </div>
              )}

              {/* Content Section */}
              <div className="flex-1 space-y-3">

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {item.category && (
                    <span className="inline-block px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded">
                      {getCategoryName(item.category, locale)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDateShort(item.date, locale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {item.author}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base md:text-lg font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                  {item.title}
                </h2>

                {/* Content Preview */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm line-clamp-2 mt-1">
                  {(item.content || '').substring(0, 150)}...
                </p>

                {/* Footer with Share Icons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/${locale}/news/${item.slug}` : `/${locale}/news/${item.slug}`)}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/${locale}/news/${item.slug}` : `/${locale}/news/${item.slug}`)}&text=${encodeURIComponent(item.title)}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://www.instagram.com/kodang.official?igsh=MWN3dThraTZ4YmFldw==`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-pink-50 text-gray-500 hover:text-pink-600 transition-colors"
                      aria-label="Follow on Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {tCommon('readMore')} →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}

