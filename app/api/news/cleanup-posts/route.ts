import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { action, keepLanguage } = body // action: 'delete', keepLanguage: 'fa' | 'ku' | 'en'
    
    console.log('POST /api/news/cleanup-posts called', { action, keepLanguage })
    
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
        deleted: 0,
        kept: 0
      })
    }

    let deletedCount = 0
    let keptCount = 0
    const results = []

    for (const post of allPosts) {
      const translations = post.translations || {}
      
      // Check which languages have complete content
      const hasFarsi = translations.fa && 
        translations.fa.title && translations.fa.title.trim() !== '' &&
        translations.fa.excerpt && translations.fa.excerpt.trim() !== '' &&
        translations.fa.content && translations.fa.content.trim() !== ''
      
      const hasKurdish = translations.ku && 
        translations.ku.title && translations.ku.title.trim() !== '' &&
        translations.ku.excerpt && translations.ku.excerpt.trim() !== '' &&
        translations.ku.content && translations.ku.content.trim() !== ''
      
      const hasEnglish = translations.en && 
        translations.en.title && translations.en.title.trim() !== '' &&
        translations.en.excerpt && translations.en.excerpt.trim() !== '' &&
        translations.en.content && translations.en.content.trim() !== ''

      // Determine if post should be kept or deleted
      // Keep only Farsi posts, delete Kurdish and English posts
      let shouldKeep = false
      
      if (keepLanguage === 'fa') {
        // Keep only posts that have Farsi content (and optionally no Kurdish/English)
        shouldKeep = hasFarsi && !hasKurdish && !hasEnglish
      } else if (keepLanguage === 'ku') {
        // Keep only posts that have Kurdish content (and no Farsi/English)
        shouldKeep = hasKurdish && !hasFarsi && !hasEnglish
      } else if (keepLanguage === 'en') {
        // Keep only posts that have English content (and no Farsi/Kurdish)
        shouldKeep = hasEnglish && !hasFarsi && !hasKurdish
      }

      if (!shouldKeep) {
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
            reason: hasKurdish ? 'Has Kurdish content' : hasEnglish ? 'Has English content' : 'No Farsi content'
          })
        }
      } else {
        keptCount++
        results.push({
          slug: post.slug,
          status: 'kept',
          language: keepLanguage
        })
      }
    }

    return NextResponse.json({
      message: 'Posts cleaned up successfully',
      deleted: deletedCount,
      kept: keptCount,
      total: allPosts.length,
      results
    })
  } catch (error: any) {
    console.error('Error cleaning up posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

