'use client'

import { notFound } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { getNews, getNewsBySlug } from '@/lib/news'
import { Calendar, User, ArrowRight } from 'lucide-react'
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
  const article = getNewsBySlug(resolvedParams.slug, locale)

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
        {article.image && !article.video && (
          <div className="w-full h-96 bg-gray-200 relative overflow-hidden">
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
        {article.image && article.video && (
          <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
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
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
        </div>
      </div>
    </article>
  )
}

