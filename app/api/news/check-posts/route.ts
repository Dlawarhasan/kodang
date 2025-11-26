import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get all posts
    const { data: allPosts, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!allPosts || allPosts.length === 0) {
      return NextResponse.json({ 
        message: 'No posts found',
        posts: [],
        summary: {
          farsi: 0,
          kurdish: 0,
          english: 0,
          mixed: 0,
          empty: 0
        }
      })
    }

    // Analyze each post
    const analyzedPosts = allPosts.map(post => {
      const translations = post.translations || {}
      
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

      let language = 'empty'
      if (hasFarsi && !hasKurdish && !hasEnglish) {
        language = 'farsi'
      } else if (hasKurdish && !hasFarsi && !hasEnglish) {
        language = 'kurdish'
      } else if (hasEnglish && !hasFarsi && !hasKurdish) {
        language = 'english'
      } else if (hasFarsi || hasKurdish || hasEnglish) {
        language = 'mixed'
      }

      return {
        slug: post.slug,
        date: post.date,
        language,
        hasFarsi,
        hasKurdish,
        hasEnglish,
        titleFa: translations.fa?.title?.substring(0, 50) || '',
        titleKu: translations.ku?.title?.substring(0, 50) || '',
        titleEn: translations.en?.title?.substring(0, 50) || '',
      }
    })

    // Count by language
    const summary = {
      farsi: analyzedPosts.filter(p => p.language === 'farsi').length,
      kurdish: analyzedPosts.filter(p => p.language === 'kurdish').length,
      english: analyzedPosts.filter(p => p.language === 'english').length,
      mixed: analyzedPosts.filter(p => p.language === 'mixed').length,
      empty: analyzedPosts.filter(p => p.language === 'empty').length,
      total: analyzedPosts.length
    }

    return NextResponse.json({
      message: 'Posts analyzed successfully',
      summary,
      posts: analyzedPosts
    })
  } catch (error: any) {
    console.error('Error analyzing posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

