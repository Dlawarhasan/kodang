import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * GET: Debug endpoint to check a specific short URL code
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ 
        error: 'Code parameter is required',
        usage: '/api/shorten/debug?code=YOUR_CODE'
      }, { status: 400 })
    }

    const supabase = createServerClient()

    // Try to find the code
    const { data, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('code', code.trim())
      .single()

    if (error) {
      return NextResponse.json({
        code: code.trim(),
        found: false,
        error: {
          message: error.message,
          code: error.code,
          hint: error.hint,
          details: error.details
        },
        suggestions: [
          'Check if the code exists in the database',
          'Verify the code is correct (case-sensitive)',
          'Check if the short_urls table exists',
          'Run: SELECT * FROM short_urls WHERE code = \'' + code.trim() + '\';'
        ]
      }, { status: 404 })
    }

    if (!data) {
      return NextResponse.json({
        code: code.trim(),
        found: false,
        message: 'Code not found in database',
        suggestions: [
          'The short URL may not have been created yet',
          'Try copying the link again to create a new short URL',
          'Check if the code is correct'
        ]
      }, { status: 404 })
    }

    return NextResponse.json({
      code: code.trim(),
      found: true,
      data: {
        id: data.id,
        code: data.code,
        slug: data.slug,
        locale: data.locale,
        created_at: data.created_at,
        expires_at: data.expires_at
      },
      redirectUrl: `/${data.locale}/news/${data.slug}`,
      message: 'Code found successfully'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

