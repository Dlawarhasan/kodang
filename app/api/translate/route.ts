import { NextRequest, NextResponse } from 'next/server'

// Translation API endpoint
// Uses LibreTranslate (free) or Google Translate API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, from, to } = body

    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'Text, from, and to languages are required' },
        { status: 400 }
      )
    }

    // If same language, return original text
    if (from === to) {
      return NextResponse.json({ translatedText: text })
    }

    // Language code mapping
    const languageMap: Record<string, string> = {
      'fa': 'fa', // Persian/Farsi
      'ku': 'ku', // Kurdish
      'en': 'en', // English
      'ar': 'ar', // Arabic
      'tr': 'tr', // Turkish
    }

    const fromLang = languageMap[from] || from
    const toLang = languageMap[to] || to

    // Try LibreTranslate (free, open-source)
    try {
      const libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate'
      
      const response = await fetch(libreTranslateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: toLang,
          format: 'text',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ translatedText: data.translatedText || text })
      }
    } catch (error) {
      console.log('LibreTranslate error, trying alternative:', error)
    }

    // Fallback: Use Google Translate via browser API (client-side)
    // For server-side, we'll return a message to use client-side translation
    return NextResponse.json({
      translatedText: text,
      note: 'Translation service unavailable. Using original text. Consider using client-side translation.',
    })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}

