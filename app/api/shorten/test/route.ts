import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Test endpoint to check if short URL system is working
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check if table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('short_urls')
      .select('count')
      .limit(1)

    if (tableError) {
      if (tableError.code === 'PGRST116' || tableError.message?.includes('does not exist')) {
        return NextResponse.json({
          status: 'error',
          message: 'Short URLs table does not exist',
          solution: 'Please run the SQL script: supabase-create-short-urls-table.sql',
          error: tableError.message
        }, { status: 500 })
      }
      return NextResponse.json({
        status: 'error',
        message: 'Database error',
        error: tableError.message
      }, { status: 500 })
    }

    // Count total short URLs
    const { count, error: countError } = await supabase
      .from('short_urls')
      .select('*', { count: 'exact', head: true })

    // Get a sample short URL
    const { data: sample, error: sampleError } = await supabase
      .from('short_urls')
      .select('code, slug, locale, created_at')
      .limit(5)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      status: 'ok',
      tableExists: true,
      totalShortUrls: count || 0,
      sampleUrls: sample || [],
      message: 'Short URL system is working correctly'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error.message
    }, { status: 500 })
  }
}

