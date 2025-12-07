import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Test endpoint to directly fetch a specific article
 * Usage: /api/news/test-article?slug=YOUR_SLUG&locale=fa
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const locale = searchParams.get('locale') || 'fa'

    if (!slug) {
      return NextResponse.json({ 
        error: 'Slug parameter is required',
        usage: '/api/news/test-article?slug=YOUR_SLUG&locale=fa'
      }, { status: 400 })
    }

    const supabase = createServerClient()

    // Direct lookup
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return NextResponse.json({
        found: false,
        error: error?.message,
        slug: slug,
        locale: locale
      }, { status: 404 })
    }

    // Get translation with fallback
    const getTranslation = (field: 'title' | 'excerpt' | 'content') => {
      if (data.translations?.[locale]?.[field]) {
        return data.translations[locale][field]
      }
      if (data.translations?.fa?.[field]) {
        return data.translations.fa[field]
      }
      if (data.translations?.ku?.[field]) {
        return data.translations.ku[field]
      }
      if (data.translations?.en?.[field]) {
        return data.translations.en[field]
      }
      return ''
    }

    const title = getTranslation('title')
    const content = getTranslation('content')

    return NextResponse.json({
      found: true,
      slug: slug,
      locale: locale,
      article: {
        ...data,
        title: title || 'Untitled',
        content: content || '',
        excerpt: getTranslation('excerpt') || null,
        authorInstagram: data.author_instagram || null,
        authorFacebook: data.author_facebook || null,
        authorTwitter: data.author_twitter || null,
        authorTelegram: data.author_telegram || null,
        authorYoutube: data.author_youtube || null,
        views: data.views || 0,
      },
      translationInfo: {
        hasTitle: !!title,
        hasContent: !!content,
        titlePreview: title?.substring(0, 50),
        availableLocales: Object.keys(data.translations || {})
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

