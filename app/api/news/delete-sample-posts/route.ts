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
      
      // Check if post contains sample text patterns
      const samplePatterns = [
        'Sample Instagram-style Post',
        'نمونە پۆستێکی شێوازێکی ئینستاگرام',
        'دەستگیرکردن و گواستنەوەی جەعفەر صادقی',
        'کۆبوونەوەی ناڕەزایی کادرەکانی تەندروستی کرمانشاه',
        'پاڵەوانیەتی تۆپی پێ لە هەولێر',
        'پێشکەوتنی نوێ لە بواری دەستکردی زیرەک',
        'فێستیڤاڵی کلتوری سلێمانی',
        'کرانەوەی نەخۆشخانەی نوێ لە هەولێر',
        'ئەنجامدانی هەڵبژاردنی نوێ',
        'چاکسازی لە سیستەمی پەروەردە',
        'خودکشی مازیار احمدی',
        'جعفر صادقی',
        'کوهنورد و مربی سنگ‌نوردی',
        'اشنویه',
        'سردشت',
        'سلێمانی',
        'هەولێر',
        'کرمانشاه',
        'نمونە',
        'sample',
        '#sample',
        '#instagram',
        '#aspect-4-5'
      ]
      
      // Check if post contains any sample pattern in any language
      const hasSampleText = samplePatterns.some(pattern => 
        (translations.fa?.title?.includes(pattern) ||
         translations.fa?.excerpt?.includes(pattern) ||
         translations.fa?.content?.includes(pattern)) ||
        (translations.ku?.title?.includes(pattern) ||
         translations.ku?.excerpt?.includes(pattern) ||
         translations.ku?.content?.includes(pattern)) ||
        (translations.en?.title?.includes(pattern) ||
         translations.en?.excerpt?.includes(pattern) ||
         translations.en?.content?.includes(pattern))
      )

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

