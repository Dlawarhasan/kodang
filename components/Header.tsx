'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe, Search, Flame, Facebook, Send, Instagram, Youtube } from 'lucide-react'
import { locales, defaultLocale } from '@/i18n'
import Logo from './Logo'
import CategoryFilter from './CategoryFilter'
import { getCategoryName } from '@/lib/category-mapping'

export default function Header() {
  const t = useTranslations('nav')
  const tCategories = useTranslations('categories')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all')

  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    setSelectedCategory(category)
  }, [searchParams])

  const languages = [
    { code: 'ku', name: tCommon('kurdish'), flag: '🇹🇯' },
    { code: 'fa', name: tCommon('persian'), flag: '🇮🇷' },
    { code: 'en', name: tCommon('english'), flag: '🇬🇧' },
  ]

  const navItems = [
    { href: `/${locale}`, label: tCategories('all'), category: 'all' },
    { href: `/${locale}`, label: tCategories('women'), category: 'women' },
    { href: `/${locale}`, label: tCategories('workers'), category: 'workers' },
    { href: `/${locale}`, label: tCategories('kolbar'), category: 'kolbar' },
    { href: `/${locale}`, label: tCategories('children'), category: 'children' },
    { href: `/${locale}`, label: tCategories('arrest'), category: 'arrest' },
    { href: `/${locale}`, label: tCategories('students'), category: 'students' },
    { href: `/${locale}`, label: tCategories('suicide'), category: 'suicide' },
  ]

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="relative mt-3 overflow-visible rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-100/50 shadow-sm backdrop-blur z-50">
          <span className="pointer-events-none absolute inset-x-16 top-0 h-[3px] rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-blue-600 opacity-90" />

          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          {/* Logo */}
            <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2 text-slate-900 transition hover:bg-white">
              <Logo size="small" variant="inline" />
          </Link>

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 flex-1 overflow-x-auto overflow-y-visible relative">
              {navItems.map((item) => {
                const isActive = selectedCategory === item.category
                return (
                  <button
                    key={item.category}
                    onClick={() => {
                      setSelectedCategory(item.category)
                      const params = new URLSearchParams()
                      params.set('category', item.category)
                      router.push(`/${locale}?${params.toString()}`)
                    }}
                    className={`group relative overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-transparent bg-gradient-to-r from-red-500 via-red-400 to-blue-600 text-white shadow-md shadow-red-500/20'
                        : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isActive && <Flame className="h-4 w-4" />}
                {item.label}
                    </span>
                    {!isActive && (
                      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40 bg-gradient-to-r from-red-500/40 to-blue-600/40" />
                    )}
                  </button>
                )
              })}
              
              {/* Category Filter Button */}
              <div className="ml-auto">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={(category) => {
                    setSelectedCategory(category)
                    const params = new URLSearchParams()
                    params.set('category', category)
                    router.push(`/${locale}?${params.toString()}`)
                  }}
                />
              </div>
          </nav>

          {/* Right Side Actions */}
            <div className="flex items-center gap-2">
            {/* Social Media Links */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href="https://www.facebook.com/share/1GqxCa4MuK/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/kodang.official?igsh=MWN3dThraTZ4YmFldw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/kodangofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@kodangnews?si=KNdtPuv8XCvCwp93"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Search */}
              <button
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-red-400 hover:text-red-500"
                aria-label={tCommon('search')}
              >
              <Search className="h-5 w-5" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
              </button>

              {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl z-20">
                  {languages.map((lang) => {
                      // Get current path and remove locale prefix
                      let pathWithoutLocale = pathname
                      
                      // Remove any locale prefix from path (check all locales)
                      for (const loc of locales) {
                        // Check for paths like /fa/admin, /ku/admin, etc.
                        if (pathWithoutLocale.startsWith(`/${loc}/`)) {
                          pathWithoutLocale = pathWithoutLocale.replace(`/${loc}`, '')
                          break
                        } 
                        // Check for exact locale match like /fa, /ku
                        else if (pathWithoutLocale === `/${loc}`) {
                          pathWithoutLocale = '/'
                          break
                        }
                      }
                      
                      // If path is empty or just '/', ensure it's '/'
                      if (!pathWithoutLocale || pathWithoutLocale === '') {
                        pathWithoutLocale = '/'
                      }
                      
                      // Ensure path starts with /
                      if (!pathWithoutLocale.startsWith('/')) {
                        pathWithoutLocale = '/' + pathWithoutLocale
                      }
                      
                      // Preserve query parameters
                      const queryString = searchParams.toString()
                      const query = queryString ? `?${queryString}` : ''
                      
                      // Build target href
                      // Always add locale prefix for consistent navigation
                      let targetHref = `/${lang.code}${pathWithoutLocale}${query}`
                      
                      // Clean up double slashes (but keep http:// or https://)
                      targetHref = targetHref.replace(/([^:]\/)\/+/g, '$1')
                      
                      // Remove trailing slash if not root (except for query params)
                      if (targetHref !== '/' && targetHref.endsWith('/') && !query) {
                        targetHref = targetHref.slice(0, -1)
                      }
                      
                      // Use full URL for navigation to ensure proper locale change
                      const fullUrl = typeof window !== 'undefined' 
                        ? `${window.location.origin}${targetHref}`
                        : targetHref
                      
                    return (
                      <button
                        key={lang.code}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsLangMenuOpen(false)
                          
                          // If clicking current language, do nothing
                          if (lang.code === locale) {
                            return
                          }
                          
                          // Navigate to new locale with full page reload
                          console.log('Language Switch Debug:', {
                            currentLocale: locale,
                            targetLocale: lang.code,
                            currentPathname: pathname,
                            pathWithoutLocale: pathWithoutLocale,
                            targetHref: targetHref,
                            fullUrl: fullUrl,
                            windowLocation: typeof window !== 'undefined' ? window.location.href : 'N/A'
                          })
                          
                          // Force a full page reload to ensure locale change
                          // Use setTimeout to ensure state updates complete first
                          setTimeout(() => {
                            if (typeof window !== 'undefined') {
                              console.log('Navigating to:', fullUrl)
                              window.location.href = fullUrl
                            }
                          }, 50)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-slate-50 text-left ${
                          lang.code === locale ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                        }`}
                      >
                          <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {lang.code === locale && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-slate-300 md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        </div>


        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t space-y-4">
            {/* Category Filter for Mobile */}
            <div className="px-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                  setSelectedCategory(category)
                  setIsMenuOpen(false)
                  const params = new URLSearchParams()
                  params.set('category', category)
                  router.push(`/${locale}?${params.toString()}`)
                }}
              />
            </div>
            
            {/* Category Navigation Items */}
            <div className="border-t pt-4">
              {navItems.map((item) => (
                <button
                  key={item.category}
                  onClick={() => {
                    setSelectedCategory(item.category)
                    setIsMenuOpen(false)
                    const params = new URLSearchParams()
                    params.set('category', item.category)
                    router.push(`/${locale}?${params.toString()}`)
                  }}
                  className={`block w-full text-left px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors ${
                    selectedCategory === item.category ? 'font-bold text-red-600 bg-red-50' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

