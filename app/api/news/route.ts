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

    // Map data to include translations based on locale
    const news = data?.map(item => ({
      ...item,
      title: item.translations?.[locale]?.title || item.translations?.fa?.title || '',
      excerpt: item.translations?.[locale]?.excerpt || item.translations?.fa?.excerpt || '',
      content: item.translations?.[locale]?.content || item.translations?.fa?.content || '',
      // Map database column names (snake_case) to camelCase for frontend
      authorInstagram: item.author_instagram || null,
      authorFacebook: item.author_facebook || null,
      authorTwitter: item.author_twitter || null,
      authorTelegram: item.author_telegram || null,
      authorYoutube: item.author_youtube || null,
    })) || []

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

    // Validate required fields (Farsi is required)
    if (!body.titleFa || !body.excerptFa || !body.contentFa) {
      return NextResponse.json(
        { error: 'ناونیشان، خلاصه و محتوای فارسی الزامی است' },
        { status: 400 }
      )
    }

    // Generate slug from Farsi title
    let baseSlug = body.slug || body.titleFa
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-') // Support Persian characters
      .replace(/(^-|-$)/g, '')
    
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

    // Prepare translations (Farsi is required, Kurdish and English are optional)
    const translations = {
      fa: {
        title: body.titleFa,
        excerpt: body.excerptFa,
        content: body.contentFa,
      },
      ku: {
        title: body.titleKu || body.titleFa,
        excerpt: body.excerptKu || body.excerptFa,
        content: body.contentKu || body.contentFa,
      },
      en: {
        title: body.titleEn || body.titleFa,
        excerpt: body.excerptEn || body.excerptFa,
        content: body.contentEn || body.contentFa,
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

