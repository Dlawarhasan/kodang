// Client-side translation utility
// Uses Google Translate widget or API

export interface TranslationOptions {
  text: string
  from: string
  to: string
}

// Language code mapping
const languageMap: Record<string, string> = {
  'fa': 'fa', // Persian/Farsi
  'ku': 'ku', // Kurdish (may not be supported by all services)
  'en': 'en', // English
  'ar': 'ar', // Arabic
  'tr': 'tr', // Turkish
}

export async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  // If same language, return original
  if (from === to || !text) {
    return text
  }

  try {
    // Try server-side translation API first
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

    const response = await fetch(`${baseUrl}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        from: languageMap[from] || from,
        to: languageMap[to] || to,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.translatedText && data.translatedText !== text) {
        return data.translatedText
      }
    }
  } catch (error) {
    console.error('Translation API error:', error)
  }

  // Fallback: Return original text
  return text
}

// Translate multiple texts
export async function translateTexts(
  texts: string[],
  from: string,
  to: string
): Promise<string[]> {
  if (from === to) {
    return texts
  }

  const translatedTexts = await Promise.all(
    texts.map(text => translateText(text, from, to))
  )

  return translatedTexts
}

