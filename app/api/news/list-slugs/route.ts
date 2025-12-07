import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: List all article slugs for debugging
 * Usage: /api/news/list-slugs?limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('news')
      .select('slug, translations')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ 
        error: 'Database error',
        details: error.message
      }, { status: 500 })
    }

    const slugs = data?.map(item => ({
      slug: item.slug,
      hasFa: !!(item.translations?.fa?.title),
      hasKu: !!(item.translations?.ku?.title),
      hasEn: !!(item.translations?.en?.title),
      titleFa: item.translations?.fa?.title?.substring(0, 50) || null,
    })) || []

    return NextResponse.json({
      total: slugs.length,
      slugs: slugs
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error.message
    }, { status: 500 })
  }
}

