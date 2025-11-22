import { NextRequest, NextResponse } from 'next/server'

// Translation API endpoint using Google Translate API
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

    // Language code mapping for Google Translate
    const languageMap: Record<string, string> = {
      'fa': 'fa', // Persian/Farsi
      'ku': 'ckb', // Kurdish (Central Kurdish - Sorani)
      'en': 'en', // English
      'ar': 'ar', // Arabic
      'tr': 'tr', // Turkish
    }

    const fromLang = languageMap[from] || from
    const toLang = languageMap[to] || to

    // Check if Google Translate API key is configured
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY

    if (!apiKey) {
      console.error('Google Translate API key not configured')
      return NextResponse.json(
        { 
          error: 'Translation service not configured. Please set GOOGLE_TRANSLATE_API_KEY environment variable.',
          translatedText: text 
        },
        { status: 500 }
      )
    }

    // Use Google Translate API v2 (REST API)
    try {
      const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
      
      const response = await fetch(translateUrl, {
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
        const translatedText = data.data?.translations?.[0]?.translatedText || text
        
        console.log('Translation successful:', { from: fromLang, to: toLang, textLength: text.length })
        
        return NextResponse.json({ translatedText })
      } else {
        const errorData = await response.json()
        console.error('Google Translate API error:', errorData)
        return NextResponse.json(
          { 
            error: errorData.error?.message || 'Translation failed',
            translatedText: text 
          },
          { status: response.status }
        )
      }
    } catch (error: any) {
      console.error('Google Translate API request error:', error)
      return NextResponse.json(
        { 
          error: error.message || 'Translation service error',
          translatedText: text 
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}

