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
      title: data.translations?.[locale]?.title || data.translations?.fa?.title || '',
      excerpt: data.translations?.[locale]?.excerpt || data.translations?.fa?.excerpt || '',
      content: data.translations?.[locale]?.content || data.translations?.fa?.content || '',
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

    // Validate required fields (Farsi is required)
    if (!body.titleFa || !body.excerptFa || !body.contentFa) {
      return NextResponse.json(
        { error: 'ناونیشان، خلاصه و محتوای فارسی الزامی است' },
        { status: 400 }
      )
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
      slug: body.slug || slug,
      date: body.date || new Date().toISOString().split('T')[0],
      author: body.author || 'کۆدەنگ',
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

