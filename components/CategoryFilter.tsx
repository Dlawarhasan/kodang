'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  Filter,
  Users,
  Landmark,
  Theater,
  HeartPulse,
  Globe2,
  UserCircle,
  Briefcase,
  Package,
  Smile,
  Lock,
  BookOpen,
  AlertTriangle,
  ChevronDown,
  X,
} from 'lucide-react'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const t = useTranslations('categories')
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right,
      })
    }
  }, [isOpen])

  const categories = [
    { id: 'all', label: t('all'), icon: Globe2, accent: 'from-slate-500 to-slate-800' },
    { id: 'social', label: t('social'), icon: Users, accent: 'from-blue-400 to-indigo-600' },
    { id: 'politics', label: t('politics'), icon: Landmark, accent: 'from-red-500 to-rose-600' },
    { id: 'culture', label: t('culture'), icon: Theater, accent: 'from-amber-400 to-orange-600' },
    { id: 'health', label: t('health'), icon: HeartPulse, accent: 'from-pink-400 to-rose-600' },
    { id: 'women', label: t('women'), icon: UserCircle, accent: 'from-purple-400 to-pink-600' },
    { id: 'workers', label: t('workers'), icon: Briefcase, accent: 'from-blue-500 to-cyan-600' },
    { id: 'kolbar', label: t('kolbar'), icon: Package, accent: 'from-orange-400 to-red-600' },
    { id: 'children', label: t('children'), icon: Smile, accent: 'from-yellow-400 to-amber-600' },
    { id: 'arrest', label: t('arrest'), icon: Lock, accent: 'from-gray-500 to-slate-700' },
    { id: 'students', label: t('students'), icon: BookOpen, accent: 'from-indigo-400 to-blue-600' },
    { id: 'suicide', label: t('suicide'), icon: AlertTriangle, accent: 'from-red-600 to-rose-800' },
  ]

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0]
  const SelectedIcon = selectedCategoryData.icon

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-400 hover:text-red-500 whitespace-nowrap"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm">{selectedCategoryData.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed z-50 w-[600px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-down"
            style={{ top: `${dropdownPosition.top}px`, right: `${dropdownPosition.right}px` }}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{t('title')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
      </div>
            <div className="p-6 grid gap-3 grid-cols-2 lg:grid-cols-3">
              {categories.map(({ id, label, icon: Icon, accent }) => {
                const isActive = selectedCategory === id
                return (
          <button
                    key={id}
                    onClick={() => {
                      onCategoryChange(id)
                      setIsOpen(false)
                    }}
                    className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? 'border-transparent shadow-lg shadow-red-500/20 scale-105'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${categories.indexOf(categories.find(c => c.id === id) || categories[0]) * 0.05}s` }}
                  >
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-70 ${
                        isActive ? 'opacity-80' : ''
                      } bg-gradient-to-br ${accent}`}
                    />
                    <div className="relative flex items-center gap-3 px-4 py-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-slate-700 transition-transform duration-300 ${
                          isActive ? 'scale-110 text-slate-900' : 'group-hover:scale-105'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? 'text-white drop-shadow-sm' : 'text-slate-700 group-hover:text-slate-900'
            }`}
          >
                        {label}
                      </span>
                    </div>
          </button>
                )
              })}
            </div>
      </div>
        </>
      )}
    </div>
  )
}

