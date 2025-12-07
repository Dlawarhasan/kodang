'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { parseShortUrl } from '@/lib/url-shortener'

function ShortUrlRedirectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const params = parseShortUrl(searchParams)
    
    if (params) {
      // Redirect to the full URL
      router.replace(`/${params.locale}/news/${params.slug}`)
    } else {
      // Invalid short URL, redirect to homepage
      router.replace('/')
    }
  }, [searchParams, router])

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <p className="text-gray-500 text-lg">در حال هدایت...</p>
    </div>
  )
}

export default function ShortUrlRedirect() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg">در حال هدایت...</p>
      </div>
    }>
      <ShortUrlRedirectContent />
    </Suspense>
  )
}

