import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Base62 characters for encoding
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate a short code (6-8 characters)
 */
function generateShortCode(): string {
  // Generate a random code
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += BASE62[Math.floor(Math.random() * BASE62.length)]
  }
  return code
}

/**
 * GET: Get or create a short URL for a slug+locale
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const locale = searchParams.get('locale') || 'fa'

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if short URL already exists for this slug+locale
    const { data: existing } = await supabase
      .from('short_urls')
      .select('code')
      .eq('slug', slug)
      .eq('locale', locale)
      .single()

    if (existing) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodang.news'
      return NextResponse.json({
        shortUrl: `${baseUrl}/s/${existing.code}`,
        code: existing.code
      })
    }

    // Generate a new short code
    let code = generateShortCode()
    let attempts = 0
    const maxAttempts = 10

    // Ensure code is unique
    while (attempts < maxAttempts) {
      const { data: existingCode } = await supabase
        .from('short_urls')
        .select('code')
        .eq('code', code)
        .single()

      if (!existingCode) {
        break // Code is unique
      }

      code = generateShortCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 })
    }

    // Insert new short URL
    const { data, error } = await supabase
      .from('short_urls')
      .insert({
        code,
        slug,
        locale
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating short URL:', error)
      return NextResponse.json({ error: 'Failed to create short URL' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kodang.news'
    return NextResponse.json({
      shortUrl: `${baseUrl}/s/${code}`,
      code: data.code
    })
  } catch (error: any) {
    console.error('Short URL API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

