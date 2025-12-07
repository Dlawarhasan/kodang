import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ code: string }> | { code: string }
}

export default async function ShortUrlRedirect({ params }: PageProps) {
  const resolvedParams = 'then' in params ? await params : params
  const code = resolvedParams.code

  if (!code) {
    redirect('/')
  }

  try {
    const supabase = createServerClient()

    // Look up the short URL
    const { data, error } = await supabase
      .from('short_urls')
      .select('slug, locale')
      .eq('code', code)
      .single()

    if (error || !data) {
      console.error('Short URL not found:', code, error)
      redirect('/')
    }

    // Redirect to the full URL
    redirect(`/${data.locale}/news/${data.slug}`)
  } catch (error) {
    console.error('Error resolving short URL:', error)
    redirect('/')
  }
}

