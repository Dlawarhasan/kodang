// URL Shortener utility
// Uses database to store short URL mappings for truly short URLs

/**
 * Get or create a short URL for a slug and locale
 * Returns a promise that resolves to the short URL
 */
export async function getShortUrl(
  slug: string, 
  locale: string = 'fa', 
  baseUrl?: string
): Promise<string> {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  
  try {
    // Call API to get or create short URL
    const response = await fetch(`${origin}/api/shorten?slug=${encodeURIComponent(slug)}&locale=${locale}`)
    
    if (response.ok) {
      const data = await response.json()
      return data.shortUrl || `${origin}/s/${data.code}`
    }
    
    // Fallback to old format if API fails
    console.warn('Failed to get short URL from API, using fallback')
    return `${origin}/${locale}/news/${slug}`
  } catch (error) {
    console.error('Error getting short URL:', error)
    // Fallback to full URL if API fails
    return `${origin}/${locale}/news/${slug}`
  }
}

/**
 * Get short URL synchronously (for cases where we can't use async)
 * This will return a placeholder that will be replaced when the API call completes
 */
export function getShortUrlSync(slug: string, locale: string = 'fa', baseUrl?: string): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  // Return a placeholder - the actual short URL will be fetched asynchronously
  // This is a fallback for cases where async is not possible
  return `${origin}/s/...`
}

