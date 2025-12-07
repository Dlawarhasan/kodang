import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Resolve a short code to get slug and locale
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Look up the short URL
    const { data, error } = await supabase
      .from('short_urls')
      .select('slug, locale')
      .eq('code', code)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      // Check if table doesn't exist
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Short URLs table does not exist. Please run the SQL script in Supabase.',
          code: 'TABLE_NOT_FOUND'
        }, { status: 500 })
      }
      return NextResponse.json({ error: 'Short URL not found', details: error.message }, { status: 404 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Short URL not found' }, { status: 404 })
    }

    return NextResponse.json({
      slug: data.slug,
      locale: data.locale
    })
  } catch (error: any) {
    console.error('Resolve short URL error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

