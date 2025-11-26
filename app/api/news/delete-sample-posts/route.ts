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
    const checkedPosts = []

    console.log(`Found ${allPosts.length} total posts to check`)

    for (const post of allPosts) {
      const translations = post.translations || {}
      
      // Log post info for debugging
      const postInfo = {
        slug: post.slug,
        titleFa: translations.fa?.title?.substring(0, 50) || '',
        titleKu: translations.ku?.title?.substring(0, 50) || '',
        titleEn: translations.en?.title?.substring(0, 50) || '',
        tags: post.tags || []
      }
      checkedPosts.push(postInfo)
      
      // Check if post contains sample text patterns (case-insensitive, partial matches)
      const samplePatterns = [
        'Sample Instagram-style Post',
        'نمونە پۆستێکی شێوازێکی ئینستاگرام',
        'نمونە',
        'دەستگیرکردن و گواستنەوەی جەعفەر صادقی',
        'جەعفەر صادقی',
        'جعفر صادقی',
        'کۆبوونەوەی ناڕەزایی کادرەکانی تەندروستی',
        'کادرەکانی تەندروستی کرمانشاه',
        'پاڵەوانیەتی تۆپی پێ لە هەولێر',
        'پێشکەوتنی نوێ لە بواری دەستکردی زیرەک',
        'فێستیڤاڵی کلتوری سلێمانی',
        'کرانەوەی نەخۆشخانەی نوێ لە هەولێر',
        'ئەنجامدانی هەڵبژاردنی نوێ',
        'چاکسازی لە سیستەمی پەروەردە',
        'خودکشی مازیار احمدی',
        'مازیار احمدی',
        'کوهنورد و مربی سنگ‌نوردی',
        'اشنویه',
        'سردشت',
        'سلێمانی',
        'هەولێر',
        'کرمانشاه',
        'sample',
        '#sample',
        '#instagram',
        '#aspect-4-5',
        'aspect-4-5'
      ]
      
      // Helper function to check if text contains any pattern (case-insensitive)
      const containsPattern = (text: string | undefined | null): boolean => {
        if (!text) return false
        const lowerText = text.toLowerCase()
        return samplePatterns.some(pattern => {
          const lowerPattern = pattern.toLowerCase()
          return lowerText.includes(lowerPattern)
        })
      }
      
      // Check if post contains any sample pattern in any language
      const hasSampleText = 
        containsPattern(translations.fa?.title) ||
        containsPattern(translations.fa?.excerpt) ||
        containsPattern(translations.fa?.content) ||
        containsPattern(translations.ku?.title) ||
        containsPattern(translations.ku?.excerpt) ||
        containsPattern(translations.ku?.content) ||
        containsPattern(translations.en?.title) ||
        containsPattern(translations.en?.excerpt) ||
        containsPattern(translations.en?.content) ||
        // Also check tags
        (post.tags && Array.isArray(post.tags) && post.tags.some((tag: string) => containsPattern(tag)))

      if (hasSampleText) {
        console.log(`Found sample post: ${post.slug} - ${translations.ku?.title || translations.fa?.title || translations.en?.title || 'No title'}`)
        
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
            error: deleteError.message,
            title: translations.ku?.title || translations.fa?.title || translations.en?.title || 'No title'
          })
        } else {
          deletedCount++
          console.log(`Successfully deleted post: ${post.slug}`)
          results.push({
            slug: post.slug,
            status: 'deleted',
            title: translations.ku?.title || translations.fa?.title || translations.en?.title || 'No title',
            reason: 'Contains sample pattern'
          })
        }
      }
    }

    console.log(`Deletion complete: ${deletedCount} posts deleted out of ${allPosts.length} total`)

    return NextResponse.json({
      message: 'Sample posts deleted successfully',
      deleted: deletedCount,
      total: allPosts.length,
      checked: checkedPosts.length,
      results
    })
  } catch (error: any) {
    console.error('Error deleting sample posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

