import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/news called')
    const supabase = createServerClient()
    console.log('Supabase client created')
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'fa' // Default to Farsi
    const category = searchParams.get('category')

    let query = supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    console.log('Executing query...')
    const { data, error } = await query
    console.log('Query result:', { hasData: !!data, error })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Filter posts: Only show posts that are fully in the requested language
    // Post must have title AND excerpt AND content in the requested language
    // This ensures only posts that are actually "posted in" that language are shown
    const filteredData = data?.filter(item => {
      const translation = item.translations?.[locale]
      if (!translation) {
        console.log(`Post ${item.slug}: No translation for locale ${locale}`)
        return false
      }
      
      // Check if fields exist and are not empty (handle both string and null)
      const hasTitle = translation.title && typeof translation.title === 'string' && translation.title.trim() !== ''
      const hasExcerpt = translation.excerpt && typeof translation.excerpt === 'string' && translation.excerpt.trim() !== ''
      const hasContent = translation.content && typeof translation.content === 'string' && translation.content.trim() !== ''
      
      // Post must have ALL THREE: title, excerpt, AND content in the requested language
      // This ensures the post is fully written in that language, not just partially translated
      const isValid = hasTitle && hasExcerpt && hasContent
      
      if (!isValid) {
        console.log(`Post ${item.slug}: Missing fields for locale ${locale}`, {
          hasTitle,
          hasExcerpt,
          hasContent,
          title: translation.title?.substring(0, 30),
        })
      }
      
      return isValid
    }) || []

    // Map data to include translations based on locale
    const news = filteredData.map(item => ({
      ...item,
      title: item.translations?.[locale]?.title || '',
      excerpt: item.translations?.[locale]?.excerpt || '',
      content: item.translations?.[locale]?.content || '',
      // Map database column names (snake_case) to camelCase for frontend
      authorInstagram: item.author_instagram || null,
      authorFacebook: item.author_facebook || null,
      authorTwitter: item.author_twitter || null,
      authorTelegram: item.author_telegram || null,
      authorYoutube: item.author_youtube || null,
      views: item.views || 0,
    })).filter(item => item.title || item.excerpt || item.content) // Remove empty posts

    console.log(`Filtered news for locale ${locale}: ${news.length} posts (from ${data?.length || 0} total)`)

    return NextResponse.json({ news })
  } catch (error: any) {
    console.error('GET /api/news error:', error)
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      error: error.message || 'هەڵەیەک ڕوویدا',
      type: error.constructor.name,
      details: error.toString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    // Validate: At least one language must be provided
    if (!body.titleFa && !body.titleKu && !body.titleEn) {
      return NextResponse.json(
        { error: 'لطفاً حداقل ناونیشان را به یکی از زبان‌ها (فارسی، کردی یا انگلیسی) وارد کنید' },
        { status: 400 }
      )
    }

    // Generate slug from any available title (prefer Farsi, then Kurdish, then English)
    const titleForSlug = body.titleFa || body.titleKu || body.titleEn || 'post'
    
    // Create short slug: take first 3-4 words and limit to 25 characters
    const words = titleForSlug.split(/\s+/).slice(0, 4) // Take first 4 words max
    const shortTitle = words.join(' ')
    
    let baseSlug = body.slug || shortTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\u0621-\u064A]+/g, '-') // Support Persian, Kurdish, and English characters
      .replace(/(^-|-$)/g, '')
      .substring(0, 25) // Limit to 25 characters for very short URLs
      .replace(/-+$/, '') // Remove trailing dashes
    
    // If slug is empty after processing, use a default with timestamp
    if (!baseSlug || baseSlug.trim() === '') {
      baseSlug = `post-${Date.now().toString().slice(-6)}` // Use last 6 digits of timestamp
    }
    
    // Check if slug exists and make it unique
    let slug = baseSlug
    let counter = 1
    let slugExists = true
    
    while (slugExists) {
      const { data: existingPost } = await supabase
        .from('news')
        .select('slug')
        .eq('slug', slug)
        .single()
      
      if (!existingPost) {
        slugExists = false
      } else {
        slug = `${baseSlug}-${counter}`
        counter++
      }
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
      slug,
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
    }

    const { data, error } = await supabase
      .from('news')
      .insert([newsItem])
      .select()
      .single()

    if (error) {
      // Handle duplicate slug error with better message
      if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
        return NextResponse.json(
          { error: 'پۆستێک بەم ناونیشانە هەیە. تکایە ناونیشانێکی جیاواز بنووسە یان slug بگۆڕە.' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    // Better error handling for duplicate slug
    if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'پۆستێک بەم ناونیشانە هەیە. تکایە ناونیشانێکی جیاواز بنووسە.' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: error.message || 'هەڵەیەک ڕوویدا' }, { status: 500 })
  }
}

