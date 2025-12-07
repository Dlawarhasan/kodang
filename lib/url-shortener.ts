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
    const apiUrl = `${origin}/api/shorten?slug=${encodeURIComponent(slug)}&locale=${locale}`
    console.log('Fetching short URL from:', apiUrl)
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    if (response.ok && data.shortUrl) {
      console.log('Short URL created successfully:', data.shortUrl)
      return data.shortUrl
    }
    
    if (response.ok && data.code) {
      const shortUrl = `${origin}/s/${data.code}`
      console.log('Short URL created with code:', shortUrl)
      return shortUrl
    }
    
    // API returned error
    console.error('API error response:', {
      status: response.status,
      statusText: response.statusText,
      data
    })
    
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

