'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X, Globe, Search, Flame } from 'lucide-react'
import { locales } from '@/i18n'
import Logo from './Logo'

export default function Header() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
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
        <div className="relative mt-3 overflow-visible rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-100/50 shadow-sm backdrop-blur">
          <span className="pointer-events-none absolute inset-x-16 top-0 h-[3px] rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-blue-600 opacity-90" />

          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          {/* Logo */}
            <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2 text-slate-900 transition hover:bg-white">
              <Logo size="small" variant="inline" />
          </Link>

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href)
                return (
              <Link
                key={item.href}
                href={item.href}
                    className={`group relative overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
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
              </Link>
                )
              })}
          </nav>

          {/* Right Side Actions */}
            <div className="flex items-center gap-3">
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
                      const currentPath =
                        typeof window !== 'undefined'
                          ? window.location.pathname.replace(/^\/[^/]+/, '')
                      : ''
                      const normalizedPath =
                        currentPath === ''
                          ? ''
                          : currentPath.startsWith('/')
                            ? currentPath
                            : `/${currentPath}`
                      const targetHref = `/${lang.code}${normalizedPath}`
                    return (
                      <Link
                        key={lang.code}
                          href={targetHref}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        onClick={() => setIsLangMenuOpen(false)}
                      >
                          <span className="text-lg">{lang.flag}</span>
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
                className="inline-flex rounded-full border border-slate-200 bg-white/70 p-2 text-slate-600 transition hover:border-slate-300 md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            </div>
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

