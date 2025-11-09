import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('common')
  
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        پەڕەکە نەدۆزرایەوە | Page Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        پەڕەیەک کە داوات کردووە بوونی نییە.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        گەڕانەوە بۆ ماڵەوە
      </Link>
    </div>
  )
}

