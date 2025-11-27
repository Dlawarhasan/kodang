'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe, Search, Flame, Facebook, Send, Instagram, Youtube, Moon, Sun, Radio, Tv, Play } from 'lucide-react'
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
    { code: 'ku', name: tCommon('kurdish'), flag: 'kurdistan' }, // Kurdistan flag - custom CSS
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
      <div className="fixed top-[0.35px] left-0 right-0 w-full h-px bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 z-50"></div>
      
      {/* Top Bar - Language, Icons */}
      <div className="fixed top-[1.35px] left-0 right-0 bg-gray-900 dark:bg-gray-950 text-white text-sm z-40" style={{ borderBottom: '0.35px solid #1f2937' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-end py-2">
            <div className="flex items-center gap-4">
              {/* Language Selector - Compact */}
              <div className="relative z-50">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1 text-sm hover:text-blue-400 transition-colors"
                >
                  {currentLanguage.flag && (
                    currentLanguage.flag === 'kurdistan' ? (
                      <span className="inline-block w-4 h-3 relative" style={{
                        background: 'linear-gradient(to bottom, #E21E1E 0%, #E21E1E 33%, #FFFFFF 33%, #FFFFFF 66%, #00A651 66%, #00A651 100%)',
                        borderRadius: '2px',
                        border: '0.5px solid rgba(0,0,0,0.1)'
                      }}>
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                      </span>
                    ) : (
                      <span>{currentLanguage.flag}</span>
                    )
                  )}
                  {currentLanguage.name}
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 overflow-hidden border border-gray-700 bg-gray-800 shadow-lg z-50">
                    {languages.map((lang) => {
                      const currentPath = typeof window !== 'undefined' 
                        ? window.location.pathname 
                        : pathname
                      let pathWithoutLocale = currentPath
                      for (const loc of locales) {
                        if (pathWithoutLocale.startsWith(`/${loc}/`)) {
                          pathWithoutLocale = pathWithoutLocale.replace(`/${loc}`, '')
                          break
                        } else if (pathWithoutLocale === `/${loc}`) {
                          pathWithoutLocale = '/'
                          break
                        }
                      }
                      if (!pathWithoutLocale || pathWithoutLocale === '') {
                        pathWithoutLocale = '/'
                      }
                      if (!pathWithoutLocale.startsWith('/')) {
                        pathWithoutLocale = '/' + pathWithoutLocale
                      }
                      const queryString = typeof window !== 'undefined' 
                        ? window.location.search 
                        : searchParams.toString()
                      const query = queryString ? queryString : ''
                      let targetHref = `/${lang.code}${pathWithoutLocale}${query}`
                      targetHref = targetHref.replace(/([^:]\/)\/+/g, '$1')
                      if (targetHref !== '/' && targetHref.endsWith('/') && !query) {
                        targetHref = targetHref.slice(0, -1)
                      }
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
                            if (lang.code === locale) {
                              return
                            }
                            if (typeof window !== 'undefined') {
                              const separator = fullUrl.includes('?') ? '&' : '?'
                              const cacheBustUrl = `${fullUrl}${separator}_t=${Date.now()}`
                              window.location.href = cacheBustUrl
                            }
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-gray-700 text-left ${
                            lang.code === locale ? 'bg-gray-700 text-white' : 'text-gray-300'
                          }`}
                        >
                          {lang.flag && (
                            lang.flag === 'kurdistan' ? (
                              <span className="inline-block w-5 h-4 relative flex-shrink-0" style={{
                                background: 'linear-gradient(to bottom, #E21E1E 0%, #E21E1E 33%, #FFFFFF 33%, #FFFFFF 66%, #00A651 66%, #00A651 100%)',
                                borderRadius: '2px',
                                border: '0.5px solid rgba(0,0,0,0.1)'
                              }}>
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></span>
                              </span>
                            ) : (
                              <span className="text-base">{lang.flag}</span>
                            )
                          )}
                          <span>{lang.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1 hover:text-blue-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1 hover:text-blue-400 transition-colors"
                aria-label={tCommon('search')}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-blue-900 dark:bg-blue-950 text-white sticky top-[25px] z-30 border-b border-blue-800" style={{ borderWidth: '0.5px' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 py-3">
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
                    className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-white border-b-2 border-red-500'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-blue-200 transition-colors md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Search Bar - Full Width When Open */}
          {isSearchOpen && (
            <div className="border-t border-blue-800 py-3">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tCommon('search')}
                  className="flex-1 bg-blue-800 border border-blue-700 text-white px-4 py-2 text-sm placeholder-blue-300 focus:border-blue-500 focus:outline-none"
                  autoFocus
                  onBlur={() => {
                    setTimeout(() => setIsSearchOpen(false), 200)
                  }}
                />
                <button
                  type="submit"
                  className="p-2 text-white hover:text-blue-200 transition-colors"
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
                  className="p-2 text-white hover:text-blue-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 dark:bg-blue-950 border-t border-blue-800">
          <nav className="container mx-auto px-4 max-w-7xl py-4 space-y-4">
            {/* Category Navigation Items */}
            <div className="space-y-2">
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
                  className={`block w-full text-left px-4 py-2 text-sm text-blue-200 hover:text-white transition-colors ${
                    selectedCategory === item.category ? 'font-bold text-white border-r-2 border-red-500' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

