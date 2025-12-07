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
        hint: error.hint
      })
      
      // If table doesn't exist, show helpful error
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.error('Short URLs table does not exist. Please run the SQL script.')
        notFound()
      }
      
      notFound()
    }

    if (!data || !data.slug || !data.locale) {
      console.error('Short URL data missing:', { code, data })
      notFound()
    }

    // Validate locale
    const validLocales = ['fa', 'ku', 'en']
    const locale = validLocales.includes(data.locale) ? data.locale : 'fa'

    // Handle slug - slugs in database might be URL-encoded or unencoded
    // The news API route expects the slug to be URL-encoded in the path
    // So we need to ensure proper encoding for the redirect
    let slug = data.slug
    
    // If slug contains % signs, it's likely URL-encoded
    // Decode it first, then we'll encode it properly for the URL
    if (slug.includes('%')) {
      try {
        slug = decodeURIComponent(slug)
      } catch (e) {
        // If decode fails, slug might not be properly encoded, try to use as-is
        console.warn('Failed to decode slug, trying direct redirect:', slug)
      }
    }

    // The slug should match what's in the news table
    // Next.js will handle URL encoding in the route, but we encode it here for safety
    // Use the slug directly - Next.js route will decode it
    const redirectUrl = `/${locale}/news/${slug}`
    console.log('Redirecting short URL:', { 
      code, 
      originalSlug: data.slug, 
      processedSlug: slug,
      locale, 
      redirectUrl 
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

