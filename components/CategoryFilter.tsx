'use client'

import { useTranslations, useLocale } from 'next-intl'
import {
  Filter,
  Users,
  Landmark,
  Trophy,
  Cpu,
  Theater,
  HeartPulse,
  Globe2,
} from 'lucide-react'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const t = useTranslations('categories')
  const locale = useLocale()

  const categories = [
    { id: 'all', label: t('all'), icon: Globe2, accent: 'from-slate-500 to-slate-800' },
    { id: 'social', label: t('social'), icon: Users, accent: 'from-blue-400 to-indigo-600' },
    { id: 'politics', label: t('politics'), icon: Landmark, accent: 'from-red-500 to-rose-600' },
    { id: 'sports', label: t('sports'), icon: Trophy, accent: 'from-emerald-400 to-green-600' },
    { id: 'technology', label: t('technology'), icon: Cpu, accent: 'from-purple-400 to-indigo-600' },
    { id: 'culture', label: t('culture'), icon: Theater, accent: 'from-amber-400 to-orange-600' },
    { id: 'health', label: t('health'), icon: HeartPulse, accent: 'from-pink-400 to-rose-600' },
  ]

  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-100/60 p-6 shadow-sm transition hover:shadow-lg">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-red-500/10 p-3 text-red-600">
            <Filter className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('title')}</h2>
            <p className="text-sm text-slate-500">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-900/90 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-sm">
          {locale.toUpperCase()}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(({ id, label, icon: Icon, accent }) => {
          const isActive = selectedCategory === id
          return (
            <button
              key={id}
              onClick={() => onCategoryChange(id)}
              className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                isActive
                  ? 'border-transparent shadow-lg shadow-red-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
              aria-pressed={isActive}
            >
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-70 ${
                  isActive ? 'opacity-80' : ''
                } bg-gradient-to-br ${accent}`}
              />
              <div className="relative flex h-full items-center gap-4 px-5 py-4">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-slate-700 transition-transform duration-300 ${
                    isActive ? 'scale-110 text-slate-900' : 'group-hover:scale-105'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <div className="space-y-1">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      isActive ? 'text-white drop-shadow-sm' : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </p>
                  {id !== 'all' && (
                    <p className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                      {t('viewNews')}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

