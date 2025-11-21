'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Facebook, Instagram, Send, Youtube } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tCategories = useTranslations('categories')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    quickLinks: [
      { href: `/${locale}`, label: tNav('home') },
      { href: `/${locale}/news`, label: tNav('news') },
      { href: `/${locale}/categories`, label: tNav('categories') },
      { href: `/${locale}/about`, label: tNav('about') },
    ],
    categories: [
      { href: `/${locale}/category/social`, label: tCategories('social') },
      { href: `/${locale}/category/politics`, label: tCategories('politics') },
      { href: `/${locale}/category/culture`, label: tCategories('culture') },
      { href: `/${locale}/category/health`, label: tCategories('health') },
      { href: `/${locale}/category/women`, label: tCategories('women') },
      { href: `/${locale}/category/workers`, label: tCategories('workers') },
      { href: `/${locale}/category/kolbar`, label: tCategories('kolbar') },
      { href: `/${locale}/category/children`, label: tCategories('children') },
      { href: `/${locale}/category/arrest`, label: tCategories('arrest') },
      { href: `/${locale}/category/students`, label: tCategories('students') },
      { href: `/${locale}/category/suicide`, label: tCategories('suicide') },
    ],
  }

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/kodang.official?igsh=MWN3dThraTZ4YmFldw==', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/share/1GqxCa4MuK/?mibextid=wwXIfr', label: 'Facebook' },
    { icon: Send, href: 'https://t.me/kodangofficial', label: 'Telegram' },
    { icon: Youtube, href: 'https://youtube.com/@kodangnews?si=KNdtPuv8XCvCwp93', label: 'YouTube' },
  ]

  return (
    <footer className="bg-white text-gray-700 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">KD</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">KODANG</span>
                  <span className="text-base font-semibold text-blue-400">کۆدەنگ</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {t('aboutText')}
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                // Different styling for each social media platform
                const getIconStyles = (label: string) => {
                  switch (label) {
                    case 'Instagram':
                      return 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-500 hover:text-white'
                    case 'Facebook':
                      return 'hover:bg-blue-600 hover:text-white'
                    case 'Telegram':
                      return 'hover:bg-blue-500 hover:text-white'
                    case 'YouTube':
                      return 'hover:bg-red-600 hover:text-white'
                    default:
                      return 'hover:bg-primary-600 hover:text-white'
                  }
                }
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 ${getIconStyles(social.label)}`}
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">بابەتەکان</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>© {currentYear} کۆدەنگ. {t('copyright')}.</p>
          <p className="mt-2 text-xs text-gray-400">
            Created by{' '}
            <a
              href="https://www.instagram.com/dlawar.hasan?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition-colors underline"
            >
              dlawarhasan
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

