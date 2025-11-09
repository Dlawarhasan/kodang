'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe, Search } from 'lucide-react'
import { locales } from '@/i18n'

export default function Header() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  const languages = [
    { code: 'ku', name: tCommon('kurdish'), flag: '🇹🇯' },
    { code: 'fa', name: tCommon('persian'), flag: '🇮🇷' },
    { code: 'en', name: tCommon('english'), flag: '🇬🇧' },
  ]

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/categories`, label: t('categories') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl font-bold text-red-600 leading-none">KD</span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-black">KODANG</span>
              <span className="text-xs font-semibold text-blue-700">کۆدەنگ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-primary-600 transition-colors" aria-label={tCommon('search')}>
              <Search className="h-5 w-5" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="hidden sm:inline">{currentLanguage.name}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {languages.map((lang) => {
                    const currentPath = typeof window !== 'undefined' 
                      ? window.location.pathname.replace(`/${locale}`, '') 
                      : ''
                    return (
                      <Link
                        key={lang.code}
                        href={`/${lang.code}${currentPath || '/'}`}
                        className="w-full text-right px-4 py-2 hover:bg-gray-100 flex items-center gap-2 block"
                        onClick={() => setIsLangMenuOpen(false)}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

