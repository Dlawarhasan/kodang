import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

/**
 * Google Search Console verification file
 * This route serves the verification file at the root URL
 */
export async function GET() {
  return new NextResponse('google-site-verification: google6df8cc884e12b968.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}

