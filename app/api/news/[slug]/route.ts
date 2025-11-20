import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = 'then' in params ? await params : params
    const slug = decodeURIComponent(resolvedParams.slug)
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'ku'

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'پۆست نەدۆزرایەوە' }, { status: 404 })
    }

    // Map translations based on locale
    const newsItem = {
      ...data,
      title: data.translations?.[locale]?.title || data.translations?.ku?.title || '',
      excerpt: data.translations?.[locale]?.excerpt || data.translations?.ku?.excerpt || '',
      content: data.translations?.[locale]?.content || data.translations?.ku?.content || '',
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

    // Validate required fields
    if (!body.titleKu || !body.excerptKu || !body.contentKu) {
      return NextResponse.json(
        { error: 'ناونیشان، دەربارە و ناوەڕۆکی کوردی پێویستە' },
        { status: 400 }
      )
    }

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
      slug: body.slug || slug,
      date: body.date || new Date().toISOString().split('T')[0],
      author: body.author || 'کۆدەنگ',
      category: body.category || 'social',
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

