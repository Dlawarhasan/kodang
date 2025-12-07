'use client'

import { useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'

function ShortUrlRedirectContent() {
  const params = useParams()
  const router = useRouter()
  const code = params?.code as string

  useEffect(() => {
    if (!code) {
      router.replace('/')
      return
    }

    // Fetch the full URL from the database
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    fetch(`${baseUrl}/api/shorten/resolve?code=${encodeURIComponent(code)}`)
      .then(res => res.json())
      .then(data => {
        if (data.slug && data.locale) {
          // Redirect to the full URL
          router.replace(`/${data.locale}/news/${data.slug}`)
        } else {
          // Invalid short URL, redirect to homepage
          router.replace('/')
        }
      })
      .catch(error => {
        console.error('Error resolving short URL:', error)
        router.replace('/')
      })
  }, [code, router])

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

