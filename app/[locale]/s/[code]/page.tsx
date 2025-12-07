import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * Redirect /[locale]/s/[code] to /s/[code]
 * This handles old short URLs that were created with locale prefix
 */
export default async function LocaleShortUrlRedirect({ 
  params 
}: { 
  params: Promise<{ code: string; locale: string }> | { code: string; locale: string }
}) {
  const resolvedParams = 'then' in params ? await params : params
  const code = resolvedParams.code
  
  // Redirect to the non-locale version
  if (code) {
    redirect(`/s/${code}`)
  } else {
    redirect('/')
  }
}

