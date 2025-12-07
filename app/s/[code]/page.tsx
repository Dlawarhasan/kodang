import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ code: string }> | { code: string }
}

export default async function ShortUrlRedirect({ params }: PageProps) {
  const resolvedParams = 'then' in params ? await params : params
  const code = resolvedParams.code

  if (!code || typeof code !== 'string') {
    notFound()
  }

  try {
    const supabase = createServerClient()

    // Look up the short URL
    const { data, error } = await supabase
      .from('short_urls')
      .select('slug, locale')
      .eq('code', code.trim())
      .single()

    if (error) {
      console.error('Short URL lookup error:', {
        code,
        error: error.message,
        errorCode: error.code,
        hint: error.hint,
        details: error.details
      })
      
      // If table doesn't exist, show helpful error
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.error('Short URLs table does not exist. Please run the SQL script.')
        notFound()
      }
      
      // If it's a "not found" error (PGRST116 or similar), that's expected for invalid codes
      // But log it for debugging
      if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
        console.error('Short URL code not found in database:', code)
        notFound()
      }
      
      // For other errors, still return 404 but log more details
      console.error('Unexpected error looking up short URL:', error)
      notFound()
    }

    if (!data || !data.slug || !data.locale) {
      console.error('Short URL data missing:', { code, data })
      notFound()
    }

    // Validate locale
    const validLocales = ['fa', 'ku', 'en']
    const locale = validLocales.includes(data.locale) ? data.locale : 'fa'

    // Handle slug encoding
    // Next.js routes automatically decode URL parameters
    // So we need to ensure the slug is properly formatted for the URL
    let slug = data.slug
    
    // If slug contains % signs, it's URL-encoded - decode it
    if (slug.includes('%')) {
      try {
        slug = decodeURIComponent(slug)
      } catch (e) {
        console.warn('Failed to decode slug:', slug, e)
        // If decode fails, try using as-is
      }
    }

    // Verify the article exists before redirecting
    // Try multiple matching strategies like the article API does
    let articleFound = false
    try {
      // Try exact match first
      let { data: article, error: articleError } = await supabase
        .from('news')
        .select('slug')
        .eq('slug', slug)
        .single()

      if (article && !articleError) {
        articleFound = true
      } else {
        // Try case-insensitive match
        const { data: caseInsensitive } = await supabase
          .from('news')
          .select('slug')
          .ilike('slug', slug)
          .limit(1)
          .maybeSingle()
        
        if (caseInsensitive) {
          articleFound = true
          slug = caseInsensitive.slug // Use the actual slug from database
        } else {
          // Try partial match as last resort
          const { data: partial } = await supabase
            .from('news')
            .select('slug')
            .ilike('slug', `%${slug.substring(0, Math.min(10, slug.length))}%`)
            .limit(1)
          
          if (partial && partial.length > 0) {
            articleFound = true
            slug = partial[0].slug // Use the actual slug from database
          }
        }
      }

      if (!articleFound) {
        console.error('Article not found for slug after all attempts:', {
          code,
          originalSlug: data.slug,
          processedSlug: slug,
          locale,
          error: articleError?.message
        })
        // Still redirect - let the article page handle the 404 with better debugging
      } else {
        console.log('Article found for short URL:', { code, slug, locale })
      }
    } catch (verifyError) {
      console.warn('Could not verify article existence:', verifyError)
      // Continue with redirect anyway
    }

    // Encode the slug properly for the URL
    // Next.js routes will decode it automatically when the page loads
    // But redirect() needs a properly encoded URL
    const encodedSlug = encodeURIComponent(slug)
    const redirectUrl = `/${locale}/news/${encodedSlug}`
    
    console.log('Redirecting short URL:', { 
      code, 
      originalSlug: data.slug, 
      processedSlug: slug,
      encodedSlug,
      locale, 
      redirectUrl,
      timestamp: new Date().toISOString()
    })
    
    redirect(redirectUrl)
  } catch (error: any) {
    console.error('Error resolving short URL:', {
      code,
      error: error?.message || error,
      stack: error?.stack
    })
    notFound()
  }
}

