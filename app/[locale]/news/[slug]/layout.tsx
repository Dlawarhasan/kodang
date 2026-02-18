import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodang.news'

async function getArticleForMeta(slug: string, locale: string) {
  const supabase = createServerClient()
  const decodedSlug = decodeURIComponent(slug)
  let data: { slug: string; image?: string; translations: unknown } | null = null
  const exact = await supabase.from('news').select('slug, image, translations, updated_at, created_at').eq('slug', decodedSlug).maybeSingle()
  if (exact.data) data = exact.data
  else {
    const ilike = await supabase.from('news').select('slug, image, translations, updated_at, created_at').ilike('slug', decodedSlug).limit(1).maybeSingle()
    if (ilike.data) data = ilike.data
  }
  if (!data) return null
  const t = data.translations as Record<string, { title?: string; excerpt?: string; content?: string }> | null
  const loc = locale in (t || {}) ? locale : 'fa'
  const title = t?.[loc]?.title || t?.fa?.title || t?.ku?.title || t?.en?.title || 'KODANG'
  const description = t?.[loc]?.excerpt || t?.[loc]?.content?.slice(0, 160) || t?.fa?.excerpt || ''
  const image = data.image || `${baseUrl}/og-image.jpg`
  const articleUrl = `${baseUrl}/${locale}/news/${encodeURIComponent(data.slug)}`
  return { title, description, image, articleUrl }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }> | { slug: string; locale: string }
}): Promise<Metadata> {
  const { slug, locale } = 'then' in params ? await params : params
  const article = await getArticleForMeta(slug, locale)
  if (!article) {
    return {
      title: 'پەڕە نەدۆزرایەوە | Page Not Found | KODANG',
    }
  }
  return {
    title: `${article.title} | KODANG`,
    description: article.description.slice(0, 160),
    alternates: {
      canonical: article.articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description.slice(0, 160),
      url: article.articleUrl,
      siteName: 'KODANG',
      images: [{ url: article.image, width: 1200, height: 630 }],
      locale: locale === 'fa' ? 'fa_IR' : locale === 'ku' ? 'ku_IQ' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description.slice(0, 160),
      images: [article.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
