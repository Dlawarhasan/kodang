import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Increment view count for a post
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const decodedSlug = decodeURIComponent(slug)
    const supabase = createServerClient()

    console.log('Incrementing views for slug:', decodedSlug)

    // Get current views
    const { data: postData, error: fetchError } = await supabase
      .from('news')
      .select('views')
      .eq('slug', decodedSlug)
      .single()

    if (fetchError || !postData) {
      console.error('Error fetching post for views:', fetchError)
      return NextResponse.json({ 
        error: 'Post not found', 
        details: fetchError?.message 
      }, { status: 404 })
    }

    console.log('Current views:', postData.views)

    // Increment views
    const currentViews = postData.views || 0
    const newViews = currentViews + 1

    const { data: updatedData, error: updateError } = await supabase
      .from('news')
      .update({ views: newViews })
      .eq('slug', decodedSlug)
      .select('views')
      .single()

    if (updateError) {
      console.error('Error incrementing views:', updateError)
      return NextResponse.json({ 
        error: 'Failed to increment views', 
        details: updateError.message 
      }, { status: 500 })
    }

    console.log('Views updated successfully to:', newViews)

    return NextResponse.json({ success: true, views: newViews })
  } catch (error: any) {
    console.error('Error in views endpoint:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}

// Get view count for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json({ views: 0 })
    }

    const decodedSlug = decodeURIComponent(slug)
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('news')
      .select('views')
      .eq('slug', decodedSlug)
      .single()

    if (error || !data) {
      return NextResponse.json({ views: 0 })
    }

    return NextResponse.json({ views: data.views || 0 })
  } catch (error: any) {
    return NextResponse.json({ views: 0 })
  }
}

