// URL Shortener utility
// Generates short URLs for news posts without requiring a database

// Base62 characters for encoding
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate a short code from a slug and locale
 * Uses a simple hash function to create a deterministic short code
 */
export function generateShortCode(slug: string, locale: string = 'fa'): string {
  // Combine slug and locale for uniqueness
  const input = `${locale}:${slug}`
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Make it positive
  hash = Math.abs(hash)
  
  // Convert to base62 (6-8 characters)
  let code = ''
  while (hash > 0) {
    code = BASE62[hash % 62] + code
    hash = Math.floor(hash / 62)
  }
  
  // Ensure minimum length of 6 characters
  while (code.length < 6) {
    code = BASE62[0] + code
  }
  
  // Limit to 8 characters max
  return code.substring(0, 8)
}

/**
 * Get short URL - uses the shortest possible format
 * Format: /s/{shortCode}?l={locale}&s={slug}
 * The shortCode is deterministic based on slug+locale, so same inputs = same code
 */
export function getShortUrl(slug: string, locale: string = 'fa', baseUrl?: string): string {
  const shortCode = generateShortCode(slug, locale)
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  // Use minimal query params: l for locale, s for slug
  return `${origin}/s/${shortCode}?l=${locale}&s=${encodeURIComponent(slug)}`
}

/**
 * Parse short URL parameters
 */
export function parseShortUrl(searchParams: URLSearchParams): { locale: string; slug: string } | null {
  const locale = searchParams.get('l') || 'fa'
  const slug = searchParams.get('s')
  
  if (!slug) {
    return null
  }
  
  return { locale, slug: decodeURIComponent(slug) }
}

