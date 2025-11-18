'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Save, Upload, Image as ImageIcon, X } from 'lucide-react'

export default function AdminPage() {
  const t = useTranslations('admin')
  const locale = useLocale()
  const [formData, setFormData] = useState({
    titleKu: '',
    titleFa: '',
    titleEn: '',
    excerptKu: '',
    excerptFa: '',
    excerptEn: '',
    contentKu: '',
    contentFa: '',
    contentEn: '',
    category: 'social',
    author: 'کۆدەنگ',
    tags: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const generatePostJSON = () => {
    const slug = generateSlug(formData.titleKu || formData.titleEn)
    const nextId = Date.now().toString()
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

    const postJSON = {
      id: nextId,
      slug: slug,
      date: formData.date,
      author: formData.author,
      category: formData.category,
      image: formData.image || '/images/placeholder.jpg',
      tags: tagsArray.length > 0 ? tagsArray : ['کۆدەنگ'],
      translations: {
        ku: {
          title: formData.titleKu,
          excerpt: formData.excerptKu,
          content: formData.contentKu,
        },
        fa: {
          title: formData.titleFa,
          excerpt: formData.excerptFa,
          content: formData.contentFa,
        },
        en: {
          title: formData.titleEn,
          excerpt: formData.excerptEn,
          content: formData.contentEn,
        },
      },
    }

    return JSON.stringify(postJSON, null, 2)
  }

  const handleDownload = () => {
    const json = generatePostJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `post-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    const json = generatePostJSON()
    navigator.clipboard.writeText(json)
    alert('JSON کۆپی کرا! دەتوانیت لە فایلی news-translations.ts بچێژیت')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900">زیادکردنی پۆستی نوێ</h1>
          <p className="text-slate-600 mt-2">فۆرمێکی سادە بۆ زیادکردنی پۆستی نوێ</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              بابەت
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="social">کۆمەڵایەتی</option>
              <option value="politics">سیاسی</option>
              <option value="sports">وەرزش</option>
              <option value="technology">تەکنەلۆژیا</option>
              <option value="culture">کلتور</option>
              <option value="health">تەندروستی</option>
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              نووسەر
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="کۆدەنگ"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              بەروار
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              لینکی وێنە
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="/images/post-name.jpg"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            وێنە (Upload)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition">
              <Upload className="h-5 w-5" />
              <span>وێنە هەڵبژێرە</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview('')
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {imageFile && (
            <p className="text-sm text-slate-600 mt-2">
              وێنەکە upload بکە بۆ public/images/ و ناوی فایلەکە لە خوارەوە بنووسە
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tags (بە کۆما جیا بکەرەوە)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="کۆدەنگ, کورد, کوردستان"
          />
        </div>

        {/* Kurdish */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">کوردی</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.titleKu}
              onChange={(e) => setFormData({ ...formData, titleKu: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="ناونیشان (کوردی)"
            />
            <textarea
              value={formData.excerptKu}
              onChange={(e) => setFormData({ ...formData, excerptKu: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="دەربارە (کوردی)"
              rows={2}
            />
            <textarea
              value={formData.contentKu}
              onChange={(e) => setFormData({ ...formData, contentKu: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="ناوەڕۆک (کوردی)"
              rows={6}
            />
          </div>
        </div>

        {/* Persian */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">فارسی</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.titleFa}
              onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="ناونیشان (فارسی)"
            />
            <textarea
              value={formData.excerptFa}
              onChange={(e) => setFormData({ ...formData, excerptFa: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="دەربارە (فارسی)"
              rows={2}
            />
            <textarea
              value={formData.contentFa}
              onChange={(e) => setFormData({ ...formData, contentFa: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="ناوەڕۆک (فارسی)"
              rows={6}
            />
          </div>
        </div>

        {/* English */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">English</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Title (English)"
            />
            <textarea
              value={formData.excerptEn}
              onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Excerpt (English)"
              rows={2}
            />
            <textarea
              value={formData.contentEn}
              onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Content (English)"
              rows={6}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <Save className="h-5 w-5" />
            کۆپی JSON
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
          >
            <Save className="h-5 w-5" />
            داونلۆد JSON
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">رێنمایی:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>فۆرمەکە پڕ بکەوە</li>
            <li>JSON کۆپی بکە یان داونلۆد بکە</li>
            <li>لە فایلی <code className="bg-blue-100 px-1 rounded">lib/news-translations.ts</code> لە کۆتایی لیستەکە زیاد بکە</li>
            <li>کۆمیت و push بکە بۆ GitHub</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

