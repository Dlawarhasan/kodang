import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale: 'fa', // Farsi is the main/default language
  localePrefix: 'always', // Always show locale prefix for consistent language switching
  localeDetection: true // Enable automatic locale detection, but default to Farsi
})

export const config = {
  // Exclude API routes, Next.js internals, static files, short URL routes, and Google verification
  matcher: ['/((?!api|_next|.*\\..*|s|google).*)']
}

