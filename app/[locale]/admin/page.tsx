'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Save, Upload, Image as ImageIcon, Video, Music, X, Edit, Trash2, Plus, List, Lock } from 'lucide-react'
import { getNews, type NewsItem } from '@/lib/news'
import { newsDataWithTranslations } from '@/lib/news-translations'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminPage() {
  const locale = useLocale()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
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
    section: 'general', // 'hero', 'breaking', 'general'
    author: 'کۆدەنگ',
    tags: '',
    image: '',
    video: '',
    audio: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Check authentication on mount
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token')
    if (token) {
      setIsAuthenticated(true)
    }
    setIsCheckingAuth(false)
  }, [])

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem('admin_token', data.token)
        setIsAuthenticated(true)
        setLoginUsername('')
        setLoginPassword('')
      } else {
        setLoginError(data.message || 'هەڵە لە ناسینەوە')
      }
    } catch (error) {
      setLoginError('هەڵە لە پەیوەندی بە سێرڤەرەوە')
    }
  }

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setLoginUsername('')
    setLoginPassword('')
  }

  const loadNews = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch directly from API to ensure we get the latest data
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${baseUrl}/api/news?locale=${locale}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setNewsList(data.news || [])
      } else {
        // Fallback to getNews if API fails
        const data = await getNews(locale)
        setNewsList(data)
      }
    } catch (error) {
      console.error('Error loading news:', error)
      // Fallback to getNews if fetch fails
      try {
        const data = await getNews(locale)
        setNewsList(data)
      } catch (fallbackError) {
        setMessage({ type: 'error', text: 'هەڵە لە بارکردنی پۆستەکان' })
      }
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => {
    if (mode === 'list' && isAuthenticated) {
      loadNews()
    }
  }, [mode, locale, loadNews, isAuthenticated])

  const handleEdit = async (slug: string) => {
    try {
      let post = null
      
      // First, check if post is in the current list
      const listPost = newsList.find(item => item.slug === slug)
      if (listPost) {
        console.log('Found post in current list')
        post = listPost
      } else {
        // Try to get post from API
        const encodedSlug = encodeURIComponent(slug)
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        const url = `${baseUrl}/api/news/${encodedSlug}?locale=${locale}`
        
        console.log('Loading post for edit from API:', url)
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          post = data.news
          console.log('Found post in API')
        } else {
          console.log('API returned error, checking static data...')
        }
        
        // Fallback to static data if API doesn't have the post or returned error
        if (!post) {
          console.log('Looking for post in static data with slug:', slug)
          const staticPost = newsDataWithTranslations.find(item => item.slug === slug)
          if (staticPost) {
            console.log('Found post in static data')
            post = {
              ...staticPost,
              title: staticPost.translations[locale as keyof typeof staticPost.translations]?.title || staticPost.translations.ku.title,
              excerpt: staticPost.translations[locale as keyof typeof staticPost.translations]?.excerpt || staticPost.translations.ku.excerpt,
              content: staticPost.translations[locale as keyof typeof staticPost.translations]?.content || staticPost.translations.ku.content,
            }
          } else {
            console.error('Post not found in static data either. Available slugs:', newsDataWithTranslations.map(n => n.slug))
            throw new Error('پۆست نەدۆزرایەوە')
          }
        }
      }
      console.log('Setting form data for post:', { slug, hasTranslations: !!post.translations, post })
      
      setFormData({
        titleKu: post.translations?.ku?.title || post.title || '',
        titleFa: post.translations?.fa?.title || '',
        titleEn: post.translations?.en?.title || '',
        excerptKu: post.translations?.ku?.excerpt || post.excerpt || '',
        excerptFa: post.translations?.fa?.excerpt || '',
        excerptEn: post.translations?.en?.excerpt || '',
        contentKu: post.translations?.ku?.content || post.content || '',
        contentFa: post.translations?.fa?.content || '',
        contentEn: post.translations?.en?.content || '',
        category: post.category || 'social',
        section: post.section || 'general',
        author: post.author || 'کۆدەنگ',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        image: post.image || '',
        video: post.video || '',
        audio: post.audio || '',
        date: post.date || new Date().toISOString().split('T')[0],
      })
      setEditingSlug(slug)
      setMode('edit')
      setMessage(null)
    } catch (error: any) {
      console.error('Edit error:', error)
      let errorMessage = 'هەڵە لە بارکردنی پۆست'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        errorMessage = 'کێشەی پەیوەندی لەگەڵ server. تکایە دڵنیا بە کە dev server کار دەکات.'
      }
      
      setMessage({ type: 'error', text: errorMessage })
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('دڵنیایت لە سڕینەوەی ئەم پۆستە؟')) {
      return
    }

    try {
      const encodedSlug = encodeURIComponent(slug)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = `${baseUrl}/api/news/${encodedSlug}`
      
      console.log('Deleting post:', url)
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP error! status: ${response.status}` }
        }
        console.error('Delete API Error:', errorData)
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'پۆست بە سەرکەوتووی سڕایەوە!' })
        loadNews()
      } else {
        throw new Error(data.error || 'هەڵە لە سڕینەوەی پۆست')
      }
    } catch (error: any) {
      console.error('Delete error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      let errorMessage = 'هەڵەیەک ڕوویدا'
      
      if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        errorMessage = 'کێشەی پەیوەندی لەگەڵ server. تکایە دڵنیا بە کە dev server کار دەکات و API route دروستە.'
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.cause) {
        errorMessage = `کێشە: ${error.cause}`
      }
      
      setMessage({ type: 'error', text: errorMessage })
    }
  }

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

  const handleUploadFile = async (file: File, type: 'image' | 'video' | 'audio') => {
    if (!file) return null

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        return data.url
      }
      throw new Error(data.error || 'Upload failed')
    } catch (error: any) {
      setMessage({ type: 'error', text: `هەڵە لە upload: ${error.message}` })
      return null
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      if (file.type.startsWith('video/')) {
        setVideoPreview(URL.createObjectURL(file))
      }
    }
  }

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      if (file.type.startsWith('audio/')) {
        setAudioPreview(URL.createObjectURL(file))
      }
    }
  }

  const handleSubmit = async () => {
    if (!formData.titleKu || !formData.excerptKu || !formData.contentKu) {
      setMessage({ type: 'error', text: 'تکایە ناونیشان، دەربارە و ناوەڕۆکی کوردی پڕ بکەوە' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // Upload files first if exists
      let imageUrl = formData.image
      let videoUrl = formData.video
      let audioUrl = formData.audio

      if (imageFile) {
        imageUrl = await handleUploadFile(imageFile, 'image')
        if (!imageUrl) {
          setIsSubmitting(false)
          return
        }
      }

      if (videoFile) {
        videoUrl = await handleUploadFile(videoFile, 'video')
        if (!videoUrl) {
          setIsSubmitting(false)
          return
        }
      }

      if (audioFile) {
        audioUrl = await handleUploadFile(audioFile, 'audio')
        if (!audioUrl) {
          setIsSubmitting(false)
          return
        }
      }

      // Submit post
      const encodedSlug = editingSlug ? encodeURIComponent(editingSlug) : ''
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const url = editingSlug ? `${baseUrl}/api/news/${encodedSlug}` : `${baseUrl}/api/news`
      const method = editingSlug ? 'PUT' : 'POST'
      
      console.log('Submitting post:', url, method)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: editingSlug || undefined,
          image: imageUrl || formData.image,
          video: videoUrl || formData.video,
          audio: audioUrl || formData.audio,
        }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP error! status: ${response.status}` }
        }
        console.error('Submit API Error:', errorData)
        const errorMessage = errorData.error || errorData.details || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Submit response:', data)

      if (data.success) {
        setMessage({ type: 'success', text: editingSlug ? 'پۆست بە سەرکەوتووی نوێ کرا!' : 'پۆست بە سەرکەوتووی زیاد کرا!' })
        // Reset form
        setFormData({
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
          section: 'general',
          author: 'کۆدەنگ',
          tags: '',
          image: '',
          video: '',
          audio: '',
          date: new Date().toISOString().split('T')[0],
        })
        setImageFile(null)
        setImagePreview('')
        setVideoFile(null)
        setVideoPreview('')
        setAudioFile(null)
        setAudioPreview('')
        setEditingSlug(null)
        setMode('list')
        // Wait a bit before reloading to ensure database is updated
        setTimeout(() => {
          loadNews()
        }, 500)
      } else {
        throw new Error(data.error || 'هەڵە لە زیادکردنی پۆست')
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'هەڵەیەک ڕوویدا' })
    } finally {
      setIsSubmitting(false)
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

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">بارکردن...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">چوونەژوورەوە</h1>
            <p className="text-slate-600">تکایە username و password بنووسە</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Username"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              <Lock className="h-5 w-5" />
              چوونەژوورەوە
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (mode === 'list') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">بەڕێوەبردنی پۆستەکان</h1>
              <p className="text-slate-600 mt-2">لیستی هەموو پۆستەکان</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                <Lock className="h-5 w-5" />
                دەرچوون
              </button>
              <button
                onClick={() => {
                  setMode('add')
                  setEditingSlug(null)
                setFormData({
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
                  section: 'general',
                  author: 'کۆدەنگ',
                  tags: '',
                  image: '',
                  video: '',
                  audio: '',
                  date: new Date().toISOString().split('T')[0],
                })
                }}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                <Plus className="h-5 w-5" />
                پۆستی نوێ
              </button>
            </div>
          </div>

          {message && (
            <div className={`rounded-lg p-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">بارکردن...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.excerpt}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{item.category}</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>{item.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/${locale}/news/${item.slug}`}
                      target="_blank"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      aria-label="بینین"
                    >
                      <List className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleEdit(item.slug)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      aria-label="دەستکاری"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.slug)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      aria-label="سڕینەوە"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {editingSlug ? 'دەستکاریکردنی پۆست' : 'زیادکردنی پۆستی نوێ'}
            </h1>
            <p className="text-slate-600 mt-2">
              {editingSlug ? 'پۆستەکە دەستکاری بکە' : 'فۆرمێکی سادە بۆ زیادکردنی پۆستی نوێ'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              <Lock className="h-5 w-5" />
              دەرچوون
            </button>
            <button
              onClick={() => {
                setMode('list')
                setEditingSlug(null)
              }}
              className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition"
            >
              <List className="h-5 w-5" />
              لیست
            </button>
          </div>
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
              <option value="culture">کلتور</option>
              <option value="health">تەندروستی</option>
              <option value="women">ژنان</option>
              <option value="workers">کارگر</option>
              <option value="kolbar">کۆڵبەر</option>
              <option value="children">منداڵان</option>
              <option value="arrest">دەستبەسەرکردن</option>
              <option value="students">خوێندکار</option>
              <option value="suicide">خۆکوژی</option>
            </select>
          </div>

          {/* Section/Position */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              بەشی پۆست
            </label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="general">بەشە گشتیەکە (General Section)</option>
              <option value="hero">سەرەوەی هەواڵ (Hero/Top Story)</option>
              <option value="breaking">هەواڵی گەرم (Breaking News)</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              پۆستەکەت لە کام بەشی وێبسایتەکە دەرکەوێت؟
            </p>
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
              <ImageIcon className="h-5 w-5" />
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
                <Image src={imagePreview} alt="Preview" width={80} height={80} className="h-20 w-20 object-cover rounded-lg" />
                <button
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview('')
                    setFormData({ ...formData, image: '' })
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ڤیدیۆ (Upload یان لینک)
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.video}
              onChange={(e) => setFormData({ ...formData, video: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="لینکی ڤیدیۆ (YouTube, Vimeo, یان لینکی دایەکت)"
            />
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition w-fit">
              <Video className="h-5 w-5" />
              <span>ڤیدیۆ upload بکە</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
            {videoPreview && (
              <div className="relative w-full max-w-md">
                <video src={videoPreview} controls className="w-full rounded-lg" />
                <button
                  onClick={() => {
                    setVideoFile(null)
                    setVideoPreview('')
                    setFormData({ ...formData, video: '' })
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audio Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ڤۆیس/ئۆدیۆ (Upload یان لینک)
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.audio}
              onChange={(e) => setFormData({ ...formData, audio: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="لینکی ڤۆیس/ئۆدیۆ"
            />
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition w-fit">
              <Music className="h-5 w-5" />
              <span>ڤۆیس upload بکە</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
              />
            </label>
            {audioPreview && (
              <div className="relative w-full max-w-md">
                <audio src={audioPreview} controls className="w-full" />
                <button
                  onClick={() => {
                    setAudioFile(null)
                    setAudioPreview('')
                    setFormData({ ...formData, audio: '' })
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
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

        {/* Message */}
        {message && (
          <div className={`rounded-lg p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {isSubmitting ? 'لە زیادکردندا...' : 'پۆست زیاد بکە'}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
          >
            <Save className="h-5 w-5" />
            کۆپی JSON (Backup)
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">رێنمایی:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>فۆرمەکە پڕ بکەوە</li>
            <li>وێنە upload بکە (یان لینکی وێنە بنووسە)</li>
            <li>کلیک لە &quot;پۆست زیاد بکە&quot; بکە</li>
            <li>پۆستەکە خۆکار لە database زیاد دەبێت</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

