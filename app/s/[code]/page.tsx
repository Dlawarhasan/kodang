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

    // Decode slug if it's URL-encoded (handle both encoded and unencoded slugs)
    let slug = data.slug
    try {
      // Try to decode - if it's already decoded, this will just return the original
      const decoded = decodeURIComponent(slug)
      // If decoding changed it, use decoded version
      if (decoded !== slug) {
        slug = decoded
      }
    } catch (e) {
      // If decode fails, slug is probably not encoded, use as-is
      slug = data.slug
    }

    // Encode the slug properly for the URL
    const encodedSlug = encodeURIComponent(slug)
    const redirectUrl = `/${locale}/news/${encodedSlug}`
    console.log('Redirecting short URL:', { code, originalSlug: data.slug, decodedSlug: slug, locale, redirectUrl })
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

