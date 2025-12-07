import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

/**
 * Google Search Console verification file
 * This route serves the verification file at the root URL
 * Google expects the exact text from the verification file
 */
export async function GET() {
  const content = 'google-site-verification: google554a3422c136c820.html'
  
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
    },
  })
}

