import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const runtime = 'edge'

/**
 * Google Search Console verification file
 * This route serves the verification file at the root URL
 * Google expects the exact text: "google-site-verification: google6df8cc884e12b968.html"
 */
export async function GET() {
  const content = 'google-site-verification: google6df8cc884e12b968.html'
  
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}

