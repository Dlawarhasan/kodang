'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Calendar, User, ArrowLeft, Play, Facebook, Instagram, Twitter, Share2 } from 'lucide-react'
import type { NewsItem } from '@/lib/news'
import { getCategoryName } from '@/lib/category-mapping'
import { formatDateShort } from '@/lib/date-format'

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
          href={`/${locale}/news/${item.slug}${item.video ? '#video' : ''}`}
          className="group relative overflow-hidden rounded-3xl border-2 border-slate-200/60 bg-gradient-to-br from-white via-slate-50/30 to-white shadow-lg shadow-slate-200/20 transition-all duration-500 hover:-translate-y-2 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 animate-fade-up"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {/* Decorative Border Lines */}
          <div className="absolute inset-0 z-10 pointer-events-none rounded-3xl">
            {/* Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Left Border */}
            <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Right Border */}
            <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Corner Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-red-500/30 rounded-tl-lg opacity-0 group-hover:opacity-100 group-hover:border-red-500/60 transition-all duration-500" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-red-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 group-hover:border-red-500/60 transition-all duration-500" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-red-500/30 rounded-bl-lg opacity-0 group-hover:opacity-100 group-hover:border-red-500/60 transition-all duration-500" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-red-500/30 rounded-br-lg opacity-0 group-hover:opacity-100 group-hover:border-red-500/60 transition-all duration-500" />
          </div>

          {/* Top Gradient Bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {/* Video Section */}
          {item.video && (
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-900">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              )}
              {/* Video Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-all duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-all duration-500" />
                  <div className="relative bg-red-600/90 group-hover:bg-red-500 rounded-full p-6 shadow-2xl group-hover:scale-110 transition-all duration-300">
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
              {/* Video Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="inline-flex items-center gap-2 rounded-full bg-red-600/90 backdrop-blur-sm border-2 border-white/30 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                  <Play className="h-3 w-3 fill-white" />
                  {locale === 'fa' ? 'ویدیو' : locale === 'ku' ? 'ڤیدیۆ' : 'Video'}
                </span>
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              {/* Category Badge on Video */}
              {item.category && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-sm border-2 border-white/30 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                    {getCategoryName(item.category, locale)}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Image Section (only if no video) */}
          {item.image && !item.video && (
            <div className="relative w-full aspect-[4/5] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Category Badge on Image */}
              {item.category && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-sm border-2 border-white/30 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                    {getCategoryName(item.category, locale)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Social Media Share Icons */}
          {(item.video || item.image) && (
            <div className="px-6 pt-4 pb-2 flex items-center gap-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                {item.video && (
                  <div className="p-1.5 rounded-full bg-red-100 text-red-600">
                    <Play className="h-3.5 w-3.5 fill-red-600" />
                  </div>
                )}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/${locale}/news/${item.slug}` : `/${locale}/news/${item.slug}`)}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/${locale}/news/${item.slug}` : `/${locale}/news/${item.slug}`)}&text=${encodeURIComponent(item.title)}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://www.instagram.com/kodang.official?igsh=MWN3dThraTZ4YmFldw==`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition-colors"
                  aria-label="Follow on Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
              <span className="text-xs text-slate-500 ml-auto">kodang.official</span>
            </div>
          )}

          {/* Content Section */}
          <div className="relative space-y-4 p-6 bg-white/95 backdrop-blur-sm">
            {/* Decorative Line Above Content */}
            <div className="absolute -top-1 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Meta Information */}
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
              {!item.image && item.category && (
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/15 to-red-600/15 backdrop-blur-sm border-2 border-red-500/30 px-3 py-1.5 text-[11px] font-bold text-red-600 group-hover:border-red-500/50 group-hover:from-red-500/20 group-hover:to-red-600/20 transition-all duration-300">
                  {getCategoryName(item.category, locale)}
                </span>
              )}
              <span className="flex items-center gap-2 text-slate-500 group-hover:text-red-600 transition-colors duration-300">
                <Calendar className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                {formatDateShort(item.date, locale)}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black leading-tight text-slate-900 transition-all duration-300 group-hover:text-red-600 line-clamp-2 relative">
              <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-gradient-to-r from-red-500 to-red-400 rounded-full group-hover:w-full transition-all duration-500" />
              {item.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed relative pl-4 border-l-2 border-slate-200 group-hover:border-red-300 transition-colors duration-300">
              {item.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 group-hover:border-red-200 transition-colors duration-300">
              <span className="flex items-center gap-2 font-semibold text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
                <User className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors duration-300" />
                {item.author}
              </span>
              <span className="flex items-center gap-1 text-red-600 font-bold transition-all duration-300 group-hover:gap-2 group-hover:text-red-500">
                {tCommon('readMore')}
                <ArrowLeft className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${locale === 'en' ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </span>
            </div>
          </div>

          {/* Decorative Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/0 opacity-0 group-hover:opacity-10 group-hover:via-red-500/5 group-hover:to-red-500/10 transition-opacity duration-500 pointer-events-none" />
        </Link>
      ))}
    </div>
  )
}

