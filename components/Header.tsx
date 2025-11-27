'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe, Search, Flame, Facebook, Send, Instagram, Youtube, Moon, Sun } from 'lucide-react'
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    setSelectedCategory(category)
    setSearchQuery(search)
  }, [searchParams])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const params = new URLSearchParams()
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory)
    }
    if (query.trim()) {
      params.set('search', query.trim())
    }
    router.push(`/${locale}?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
    setIsSearchOpen(false)
  }

  const languages = [
    { code: 'ku', name: tCommon('kurdish'), flag: '🇹🇯' },
    { code: 'fa', name: tCommon('persian') },
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
    <>
      {/* Top Line - Iran International Style - Full Width */}
      <div className="fixed top-0 left-0 right-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 z-50"></div>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 mt-1">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="small" variant="inline" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
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
                  className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Social Media Links */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href="https://www.facebook.com/share/1GqxCa4MuK/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/kodang.official?igsh=MWN3dThraTZ4YmFldw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/kodangofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@kodangnews?si=KNdtPuv8XCvCwp93"
                target="_blank"
                rel="noopener noreferrer"
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={tCommon('search')}
                    className="w-48 border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none"
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => setIsSearchOpen(false), 200)
                    }}
                  />
                  <button
                    type="submit"
                    className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                    aria-label={tCommon('search')}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setIsSearchOpen(false)
                      const params = new URLSearchParams()
                      if (selectedCategory !== 'all') {
                        params.set('category', selectedCategory)
                      }
                      router.push(`/${locale}?${params.toString()}`)
                    }}
                    className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label={tCommon('search')}
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20">
                  {languages.map((lang) => {
                      // Get current path from window.location to ensure we have the actual pathname with locale
                      const currentPath = typeof window !== 'undefined' 
                        ? window.location.pathname 
                        : pathname
                      
                      // Get current path and remove locale prefix
                      let pathWithoutLocale = currentPath
                      
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
                      const queryString = typeof window !== 'undefined' 
                        ? window.location.search 
                        : searchParams.toString()
                      const query = queryString ? queryString : ''
                      
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
                          const currentPathForLog = typeof window !== 'undefined' ? window.location.pathname : pathname
                          console.log('Language Switch Debug:', {
                            currentLocale: locale,
                            targetLocale: lang.code,
                            currentPathname: pathname,
                            windowPathname: currentPathForLog,
                            pathWithoutLocale: pathWithoutLocale,
                            targetHref: targetHref,
                            fullUrl: fullUrl,
                            windowLocation: typeof window !== 'undefined' ? window.location.href : 'N/A'
                          })
                          
                          // Force a full page reload to ensure locale change
                          if (typeof window !== 'undefined') {
                            // Clear any cached data
                            if (sessionStorage.getItem('admin_token')) {
                              // Keep admin token but force reload
                            }
                            
                            // Use href with cache busting to force complete reload
                            const separator = fullUrl.includes('?') ? '&' : '?'
                            const cacheBustUrl = `${fullUrl}${separator}_t=${Date.now()}`
                            console.log('Language Switch - Navigating to:', cacheBustUrl)
                            
                            // Force navigation - use href instead of replace for better cache clearing
                            window.location.href = cacheBustUrl
                          }
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 dark:hover:bg-gray-700 text-left ${
                          lang.code === locale ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {lang.flag && <span className="text-lg">{lang.flag}</span>}
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
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
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
    </>
  )
}

