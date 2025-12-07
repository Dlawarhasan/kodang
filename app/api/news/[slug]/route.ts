import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = 'then' in params ? await params : params
    let slug = resolvedParams.slug
    
    // Decode slug if it's URL-encoded
    // Next.js route params are already decoded, but handle both cases
    try {
      const decoded = decodeURIComponent(slug)
      if (decoded !== slug) {
        slug = decoded
      }
    } catch (e) {
      // If decode fails, slug is probably not encoded, use as-is
    }
    
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'fa' // Default to Farsi

    console.log('API: Looking up article:', { slug, locale, originalSlug: resolvedParams.slug })

    let data = null
    let error = null

    // Try exact match first
    const exactMatch = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single()

    if (exactMatch.data && !exactMatch.error) {
      data = exactMatch.data
    } else {
      error = exactMatch.error
      console.warn('API: Exact match failed, trying case-insensitive search:', { slug, error: error?.message })
      
      // Try case-insensitive search as fallback
      const caseInsensitiveMatch = await supabase
        .from('news')
        .select('*')
        .ilike('slug', slug)
        .limit(1)
        .maybeSingle()
      
      if (caseInsensitiveMatch.data && !caseInsensitiveMatch.error) {
        console.log('API: Found article with case-insensitive search')
        data = caseInsensitiveMatch.data
        error = null
      } else {
        error = caseInsensitiveMatch.error || error
      }
    }

    if (error || !data) {
      console.error('API: Article not found:', { 
        slug, 
        locale, 
        error: error?.message,
        errorCode: error?.code,
        triedExact: true,
        triedCaseInsensitive: true
      })
      return NextResponse.json({ 
        error: 'پۆست نەدۆزرایەوە',
        details: error?.message,
        slug: slug,
        locale: locale
      }, { status: 404 })
    }

    // Get translations - prioritize requested locale, fallback to Farsi
    const getTranslation = (field: 'title' | 'excerpt' | 'content') => {
      // First try requested locale
      if (data.translations?.[locale]?.[field]) {
        return data.translations[locale][field]
      }
      // Fallback to Farsi
      if (data.translations?.fa?.[field]) {
        return data.translations.fa[field]
      }
      // Fallback to Kurdish
      if (data.translations?.ku?.[field]) {
        return data.translations.ku[field]
      }
      // Fallback to English
      if (data.translations?.en?.[field]) {
        return data.translations.en[field]
      }
      return ''
    }

    // Use getTranslation function which already handles fallbacks
    // Don't require specific locale - just return what's available
    const title = getTranslation('title')
    const content = getTranslation('content')
    
    // Log what we found
    console.log('API: Translation results:', { 
      slug, 
      locale, 
      hasTitle: !!title, 
      hasContent: !!content,
      titlePreview: title?.substring(0, 50),
      availableLocales: Object.keys(data.translations || {})
    })
    
    // Only fail if we have absolutely no content at all
    if (!title && !content) {
      console.error('API: Post has no title or content in any language:', { slug, locale, availableLocales: Object.keys(data.translations || {}) })
      return NextResponse.json(
        { 
          error: 'Post not found - no content available',
          slug: slug,
          locale: locale,
          availableLocales: Object.keys(data.translations || {})
        },
        { status: 404 }
      )
    }

    // Map translations based on locale with fallbacks
    const newsItem = {
      ...data,
      title: getTranslation('title'),
      excerpt: getTranslation('excerpt') || null, // Excerpt is optional
      content: getTranslation('content') || '',
      // Map database column names to camelCase for frontend
      authorInstagram: data.author_instagram || null,
      authorFacebook: data.author_facebook || null,
      authorTwitter: data.author_twitter || null,
      authorTelegram: data.author_telegram || null,
      authorYoutube: data.author_youtube || null,
      views: data.views || 0,
    }

    return NextResponse.json({ news: newsItem })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = 'then' in params ? await params : params
    const slug = decodeURIComponent(resolvedParams.slug)
    const supabase = createServerClient()
    const body = await request.json()

    // Validate: At least one language must be provided
    if (!body.titleFa && !body.titleKu && !body.titleEn) {
      return NextResponse.json(
        { error: 'لطفاً حداقل ناونیشان را به یکی از زبان‌ها (فارسی، کردی یا انگلیسی) وارد کنید' },
        { status: 400 }
      )
    }

    // Prepare translations (all languages are optional)
    // IMPORTANT: Do NOT use fallbacks! Each language should only have its own content.
    // This ensures posts only appear in their respective language sections.
    // Convert empty strings to null to ensure proper filtering
    const cleanString = (str: string | undefined | null): string | null => {
      if (!str || typeof str !== 'string') return null
      const trimmed = str.trim()
      return trimmed === '' ? null : trimmed
    }

    const translations = {
      fa: {
        title: cleanString(body.titleFa),
        excerpt: cleanString(body.excerptFa),
        content: cleanString(body.contentFa),
      },
      ku: {
        title: cleanString(body.titleKu),
        excerpt: cleanString(body.excerptKu),
        content: cleanString(body.contentKu),
      },
      en: {
        title: cleanString(body.titleEn),
        excerpt: cleanString(body.excerptEn),
        content: cleanString(body.contentEn),
      },
    }

    // Prepare tags
    const tags = body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []

    const newsItem = {
      slug: body.slug || slug,
      date: body.date || new Date().toISOString().split('T')[0],
      author: body.author || 'کۆدەنگ',
      author_instagram: body.authorInstagram || null,
      author_facebook: body.authorFacebook || null,
      author_twitter: body.authorTwitter || null,
      author_telegram: body.authorTelegram || null,
      author_youtube: body.authorYoutube || null,
      category: body.category || 'social',
      section: body.section || 'general',
      image: body.image || '',
      video: body.video || null,
      audio: body.audio || null,
      images: body.images || null,
      tags,
      translations,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('news')
      .update(newsItem)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { error: error.message || 'هەڵە لە نوێکردنەوەی پۆست', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('PUT error:', error)
    return NextResponse.json(
      { error: error.message || 'هەڵەیەک ڕوویدا', details: error.toString() },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    console.log('DELETE request received')
    const resolvedParams = 'then' in params ? await params : params
    const slug = decodeURIComponent(resolvedParams.slug)
    console.log('Deleting slug:', slug)
    
    const supabase = createServerClient()
    console.log('Supabase client created')

    const { data, error } = await supabase
      .from('news')
      .delete()
      .eq('slug', slug)
      .select()

    console.log('Delete result:', { data, error })

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { 
          error: error.message || 'هەڵە لە سڕینەوەی پۆست', 
          details: error,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, deleted: data })
  } catch (error: any) {
    console.error('DELETE error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'هەڵەیەک ڕوویدا', 
        details: error.toString(),
        type: error.constructor.name
      },
      { status: 500 }
    )
  }
}

