import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/news called')
    const supabase = createServerClient()
    console.log('Supabase client created')
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'ku'
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
      title: item.translations?.[locale]?.title || item.translations?.ku?.title || '',
      excerpt: item.translations?.[locale]?.excerpt || item.translations?.ku?.excerpt || '',
      content: item.translations?.[locale]?.content || item.translations?.ku?.content || '',
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

    // Validate required fields
    if (!body.titleKu || !body.excerptKu || !body.contentKu) {
      return NextResponse.json(
        { error: 'ناونیشان، دەربارە و ناوەڕۆکی کوردی پێویستە' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = body.slug || body.titleKu
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Prepare translations
    const translations = {
      ku: {
        title: body.titleKu,
        excerpt: body.excerptKu,
        content: body.contentKu,
      },
      fa: {
        title: body.titleFa || body.titleKu,
        excerpt: body.excerptFa || body.excerptKu,
        content: body.contentFa || body.contentKu,
      },
      en: {
        title: body.titleEn || body.titleKu,
        excerpt: body.excerptEn || body.excerptKu,
        content: body.contentEn || body.contentKu,
      },
    }

    // Prepare tags
    const tags = body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []

    const newsItem = {
      slug,
      date: body.date || new Date().toISOString().split('T')[0],
      author: body.author || 'کۆدەنگ',
      category: body.category || 'social',
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

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

