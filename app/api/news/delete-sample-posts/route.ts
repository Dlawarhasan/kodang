import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    console.log('POST /api/news/delete-sample-posts called')
    
    // Get all posts
    const { data: allPosts, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })

    if (fetchError) {
      console.error('Error fetching posts:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!allPosts || allPosts.length === 0) {
      return NextResponse.json({ 
        message: 'No posts found',
        deleted: 0
      })
    }

    let deletedCount = 0
    const results = []

    for (const post of allPosts) {
      const translations = post.translations || {}
      
      // Check if post contains "Sample Instagram-style Post" in any language
      const hasSampleText = 
        (translations.fa?.title?.includes('Sample Instagram-style Post') ||
         translations.fa?.excerpt?.includes('Sample Instagram-style Post') ||
         translations.fa?.content?.includes('Sample Instagram-style Post')) ||
        (translations.ku?.title?.includes('Sample Instagram-style Post') ||
         translations.ku?.excerpt?.includes('Sample Instagram-style Post') ||
         translations.ku?.content?.includes('Sample Instagram-style Post')) ||
        (translations.en?.title?.includes('Sample Instagram-style Post') ||
         translations.en?.excerpt?.includes('Sample Instagram-style Post') ||
         translations.en?.content?.includes('Sample Instagram-style Post'))

      if (hasSampleText) {
        // Delete the post
        const { error: deleteError } = await supabase
          .from('news')
          .delete()
          .eq('slug', post.slug)

        if (deleteError) {
          console.error(`Error deleting post ${post.slug}:`, deleteError)
          results.push({
            slug: post.slug,
            status: 'error',
            error: deleteError.message
          })
        } else {
          deletedCount++
          results.push({
            slug: post.slug,
            status: 'deleted',
            reason: 'Contains "Sample Instagram-style Post"'
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Sample posts deleted successfully',
      deleted: deletedCount,
      total: allPosts.length,
      results
    })
  } catch (error: any) {
    console.error('Error deleting sample posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

