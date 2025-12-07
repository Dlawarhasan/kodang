import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Debug endpoint to check a specific slug
 * Usage: /api/news/debug-slug?slug=YOUR_SLUG&locale=fa
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const locale = searchParams.get('locale') || 'fa'

    if (!slug) {
      return NextResponse.json({ 
        error: 'Slug parameter is required',
        usage: '/api/news/debug-slug?slug=YOUR_SLUG&locale=fa'
      }, { status: 400 })
    }

    const supabase = createServerClient()

    // Try exact match
    const exactMatch = await supabase
      .from('news')
      .select('slug, translations')
      .eq('slug', slug)
      .single()

    // Try case-insensitive
    const caseInsensitive = await supabase
      .from('news')
      .select('slug, translations')
      .ilike('slug', slug)
      .limit(5)
      .maybeSingle()

    // Check translation
    let translationInfo = null
    if (exactMatch.data) {
      const translation = exactMatch.data.translations?.[locale]
      translationInfo = {
        hasTranslation: !!translation,
        hasTitle: !!(translation?.title && translation.title.trim() !== ''),
        hasContent: !!(translation?.content && translation.content.trim() !== ''),
        titlePreview: translation?.title?.substring(0, 50) || null,
        availableLocales: Object.keys(exactMatch.data.translations || {})
      }
    }

    return NextResponse.json({
      slug: slug,
      locale: locale,
      exactMatch: {
        found: !!exactMatch.data,
        error: exactMatch.error?.message,
        slug: exactMatch.data?.slug,
        translationInfo: translationInfo
      },
      caseInsensitive: {
        found: !!caseInsensitive.data,
        error: caseInsensitive.error?.message,
        slug: caseInsensitive.data?.slug
      },
      suggestions: [
        'Check if slug matches exactly (case-sensitive)',
        'Check if article has title in requested locale',
        'Check available locales in translationInfo',
        'Try case-insensitive match if exact match fails'
      ]
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

