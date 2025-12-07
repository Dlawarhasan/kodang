import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Check if a specific article exists and return detailed info
 * Usage: /api/news/check-article?slug=YOUR_SLUG
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ 
        error: 'Slug parameter is required',
        usage: '/api/news/check-article?slug=YOUR_SLUG'
      }, { status: 400 })
    }

    const supabase = createServerClient()

    // Try exact match
    const exactMatch = await supabase
      .from('news')
      .select('slug, translations, created_at')
      .eq('slug', slug)
      .single()

    // Try decoded version
    let decodedSlug = slug
    try {
      decodedSlug = decodeURIComponent(slug)
    } catch (e) {
      // Ignore
    }

    const decodedMatch = decodedSlug !== slug ? await supabase
      .from('news')
      .select('slug, translations, created_at')
      .eq('slug', decodedSlug)
      .single() : { data: null, error: null }

    // Try case-insensitive
    const caseInsensitive = await supabase
      .from('news')
      .select('slug, translations, created_at')
      .ilike('slug', slug)
      .limit(3)

    // Get all slugs for comparison
    const allSlugs = await supabase
      .from('news')
      .select('slug')
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({
      requestedSlug: slug,
      decodedSlug: decodedSlug,
      exactMatch: {
        found: !!exactMatch.data,
        slug: exactMatch.data?.slug,
        hasFa: !!(exactMatch.data?.translations?.fa?.title),
        hasKu: !!(exactMatch.data?.translations?.ku?.title),
        hasEn: !!(exactMatch.data?.translations?.en?.title),
        error: exactMatch.error?.message
      },
      decodedMatch: {
        found: !!decodedMatch.data,
        slug: decodedMatch.data?.slug,
        error: decodedMatch.error?.message
      },
      caseInsensitive: {
        found: caseInsensitive.data && caseInsensitive.data.length > 0,
        count: caseInsensitive.data?.length || 0,
        slugs: caseInsensitive.data?.map(a => a.slug) || []
      },
      allSlugs: {
        total: allSlugs.data?.length || 0,
        slugs: allSlugs.data?.slice(0, 20).map(a => a.slug) || []
      },
      suggestions: [
        'Check if slug matches exactly (including Persian/Arabic numbers)',
        'Check if article has translations in requested locale',
        'Try one of the slugs from allSlugs list'
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

