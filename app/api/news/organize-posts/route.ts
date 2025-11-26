import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { action, targetLanguage } = body // action: 'organize', targetLanguage: 'fa' | 'ku' | 'en' | 'auto'
    
    console.log('POST /api/news/organize-posts called', { action, targetLanguage })
    
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
        updated: 0
      })
    }

    let updatedCount = 0
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

      // Determine primary language
      // Priority: Farsi > Kurdish > English
      // If post has Farsi content, keep only Farsi and remove Kurdish and English
      let primaryLanguage: 'fa' | 'ku' | 'en' | null = null
      
      if (targetLanguage === 'auto') {
        // Auto-detect: Use the first available complete language
        // Priority: Farsi first (as it's the main language)
        if (hasFarsi) {
          primaryLanguage = 'fa'
        } else if (hasKurdish) {
          primaryLanguage = 'ku'
        } else if (hasEnglish) {
          primaryLanguage = 'en'
        }
      } else if (targetLanguage === 'fa' && hasFarsi) {
        primaryLanguage = 'fa'
      } else if (targetLanguage === 'ku' && hasKurdish) {
        primaryLanguage = 'ku'
      } else if (targetLanguage === 'en' && hasEnglish) {
        primaryLanguage = 'en'
      }

      // If post has Farsi content, keep only Farsi and remove Kurdish and English
      // If post has Kurdish content (and no Farsi), keep only Kurdish and remove English
      // If post has English content (and no Farsi/Kurdish), keep only English
      const needsUpdate = 
        (hasFarsi && (hasKurdish || hasEnglish)) || // Farsi post with other languages
        (hasKurdish && !hasFarsi && hasEnglish) || // Kurdish post with English
        (hasEnglish && !hasFarsi && !hasKurdish && false) // English-only (no need to update)

      if (primaryLanguage && needsUpdate) {
        const newTranslations: any = {
          fa: primaryLanguage === 'fa' ? translations.fa : { title: '', excerpt: '', content: '' },
          ku: primaryLanguage === 'ku' ? translations.ku : { title: '', excerpt: '', content: '' },
          en: primaryLanguage === 'en' ? translations.en : { title: '', excerpt: '', content: '' },
        }

        // Update the post
        const { error: updateError } = await supabase
          .from('news')
          .update({ translations: newTranslations })
          .eq('slug', post.slug)

        if (updateError) {
          console.error(`Error updating post ${post.slug}:`, updateError)
          results.push({
            slug: post.slug,
            status: 'error',
            error: updateError.message
          })
        } else {
          updatedCount++
          results.push({
            slug: post.slug,
            status: 'updated',
            language: primaryLanguage
          })
        }
      } else {
        results.push({
          slug: post.slug,
          status: 'skipped',
          reason: primaryLanguage ? 'Already single language' : 'No complete content found'
        })
      }
    }

    return NextResponse.json({
      message: 'Posts organized successfully',
      updated: updatedCount,
      total: allPosts.length,
      results
    })
  } catch (error: any) {
    console.error('Error organizing posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

