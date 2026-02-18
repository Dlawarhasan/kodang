'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Save, Upload, Image as ImageIcon, Video, Music, FileText, X, Edit, Trash2, Plus, List, Lock, Users, UserPlus, Eye } from 'lucide-react'
import { getNews, type NewsItem } from '@/lib/news'
import { newsDataWithTranslations } from '@/lib/news-translations'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminPage() {
  const locale = useLocale()
  const t = useTranslations('admin')
  const tCategories = useTranslations('categories')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [mode, setMode] = useState<'list' | 'add' | 'edit' | 'users'>('list')
  const [userPermissions, setUserPermissions] = useState<{
    can_create: boolean
    can_edit: boolean
    can_delete: boolean
  }>({ can_create: true, can_edit: true, can_delete: true })
  const [users, setUsers] = useState<any[]>([])
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    can_create: false,
    can_edit: false,
    can_delete: false,
  })
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    titleFa: '', // Farsi is optional
    titleKu: '', // Kurdish is optional
    titleEn: '', // English is optional
    contentFa: '', // Farsi is optional
    contentKu: '', // Kurdish is optional
    contentEn: '', // English is optional
    category: 'social',
    section: 'general', // 'hero', 'breaking', 'general'
    author: 'کۆدەنگ',
    authorInstagram: '',
    authorFacebook: '',
    authorTwitter: '',
    authorTelegram: '',
    authorYoutube: '',
    tags: '',
    image: '',
    video: '',
    audio: '',
    pdf: '',
    date: new Date().toISOString().split('T')[0],
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreview, setAudioPreview] = useState<string>('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
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
        if (data.user?.permissions) {
          setUserPermissions(data.user.permissions)
          sessionStorage.setItem('user_permissions', JSON.stringify(data.user.permissions))
        } else if (data.permissions) {
          setUserPermissions(data.permissions)
          sessionStorage.setItem('user_permissions', JSON.stringify(data.permissions))
        }
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

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${baseUrl}/api/users`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setMessage({ type: 'error', text: 'هەڵە لە بارکردنی بەکارهێنەران' })
    }
  }, [])

  useEffect(() => {
    if (mode === 'list' && isAuthenticated) {
      loadNews()
    } else if (mode === 'users' && isAuthenticated) {
      loadUsers()
    }
  }, [mode, locale, loadNews, loadUsers, isAuthenticated])

  const handleEdit = async (slug: string) => {
    // Check permissions
    if (!userPermissions.can_edit) {
      setMessage({ type: 'error', text: 'شما اجازه ویرایش پست ندارید' })
      return
    }

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
        titleFa: post.translations?.fa?.title || post.title || '',
        titleKu: post.translations?.ku?.title || '',
        titleEn: post.translations?.en?.title || '',
        contentFa: post.translations?.fa?.content || post.content || '',
        contentKu: post.translations?.ku?.content || '',
        contentEn: post.translations?.en?.content || '',
        category: post.category || 'social',
        section: post.section || 'general',
        author: post.author || 'کۆدەنگ',
        authorInstagram: (post as any).authorInstagram || '',
        authorFacebook: (post as any).authorFacebook || '',
        authorTwitter: (post as any).authorTwitter || '',
        authorTelegram: (post as any).authorTelegram || '',
        authorYoutube: (post as any).authorYoutube || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        image: post.image || '',
        video: post.video || '',
        audio: post.audio || '',
        pdf: (post as { pdf?: string }).pdf || '',
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
    // Check permissions
    if (!userPermissions.can_delete) {
      setMessage({ type: 'error', text: 'شما اجازه حذف پست ندارید' })
      return
    }

    if (!confirm(t('confirmDelete'))) {
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

  const handleUploadFile = async (file: File, type: 'image' | 'video' | 'audio' | 'pdf') => {
    if (!file) return null

    try {
      // Check file size (100MB videos, 20MB PDFs, 50MB others)
      const maxSize = type === 'video' ? 100 * 1024 * 1024 : type === 'pdf' ? 20 * 1024 * 1024 : 50 * 1024 * 1024
      if (file.size > maxSize) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2)
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0)
        const errorMsg = type === 'video' 
          ? t('videoTooLarge').replace('{size}', sizeMB).replace('{maxSize}', maxSizeMB)
          : t('fileTooLarge').replace('{size}', sizeMB).replace('{maxSize}', maxSizeMB)
        setMessage({ type: 'error', text: errorMsg })
        return null
      }

      console.log('Uploading file:', { name: file.name, type: file.type, size: file.size, uploadType: type })

      // Process images before upload (resize and optimize)
      let fileToUpload = file
      if (type === 'image' && file.type.startsWith('image/')) {
        try {
          const { processImageClient } = await import('@/lib/image-processor')
          const processed = await processImageClient(file, 1920, 1920, 0.85)
          fileToUpload = processed.file
          console.log('Image processed:', {
            original: `${(processed.originalSize / 1024 / 1024).toFixed(2)}MB`,
            new: `${(processed.newSize / 1024 / 1024).toFixed(2)}MB`,
            reduction: `${((1 - processed.newSize / processed.originalSize) * 100).toFixed(1)}%`,
            dimensions: `${processed.width}x${processed.height}`
          })
        } catch (error) {
          console.warn('Image processing failed, using original:', error)
          // Continue with original file if processing fails
        }
      }

      // For large files (videos, PDFs), upload directly to Supabase
      // This bypasses Vercel's 4.5MB serverless function limit
      if (fileToUpload.size > 4 * 1024 * 1024 || type === 'pdf') {
        const { uploadFileDirect } = await import('@/lib/upload-direct')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase configuration missing')
        }

        const result = await uploadFileDirect(fileToUpload, type, supabaseUrl, supabaseAnonKey)
        console.log('Direct upload successful:', result.url)
        return result.url
      }

      // For smaller files, use API route
      const formData = new FormData()
      formData.append('file', fileToUpload)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload response error:', response.status, errorText)
        
        // Try to parse as JSON if possible
        let errorMessage = 'Upload failed'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = errorText || `Upload failed with status ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

      // Parse JSON response
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Unexpected response type:', contentType, text.substring(0, 100))
        throw new Error('Server returned invalid response format')
      }

      const data = await response.json()
      
      if (data.success && data.url) {
        console.log('Upload successful:', data.url)
        return data.url
      }
      
      throw new Error(data.error || 'Upload failed')
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error.message || 'Upload failed'
      setMessage({ type: 'error', text: `هەڵە لە upload: ${errorMessage}` })
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

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    }
  }

  // User Management Functions
  const handleCreateUser = async () => {
    if (!userFormData.username || !userFormData.password) {
      setMessage({ type: 'error', text: 'نام کاربری و رمز عبور الزامی است' })
      return
    }

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFormData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'کاربر با موفقیت ایجاد شد' })
        setUserFormData({
          username: '',
          password: '',
          can_create: false,
          can_edit: false,
          can_delete: false,
        })
        loadUsers()
      } else {
        setMessage({ type: 'error', text: data.error || 'هەڵە لە دروستکردنی بەکارهێنەر' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'هەڵەیەک ڕوویدا' })
    }
  }

  const handleUpdateUser = async (userId: string) => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const updateData: any = {
        username: userFormData.username,
        can_create: userFormData.can_create,
        can_edit: userFormData.can_edit,
        can_delete: userFormData.can_delete,
      }
      
      // Only include password if it's provided
      if (userFormData.password) {
        updateData.password = userFormData.password
      }

      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'کاربر با موفقیت به‌روزرسانی شد' })
        setEditingUserId(null)
        setUserFormData({
          username: '',
          password: '',
          can_create: false,
          can_edit: false,
          can_delete: false,
        })
        loadUsers()
      } else {
        setMessage({ type: 'error', text: data.error || 'هەڵە لە نوێکردنەوەی بەکارهێنەر' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'هەڵەیەک ڕوویدا' })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('confirmDeleteUser'))) {
      return
    }

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'کاربر با موفقیت حذف شد' })
        loadUsers()
      } else {
        setMessage({ type: 'error', text: data.error || 'هەڵە لە سڕینەوەی بەکارهێنەر' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'هەڵەیەک ڕوویدا' })
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUserId(user.id)
    setUserFormData({
      username: user.username,
      password: '', // Don't show password
      can_create: user.can_create,
      can_edit: user.can_edit,
      can_delete: user.can_delete,
    })
  }

  const handleSubmit = async () => {
    // Check permissions
    if (!userPermissions.can_create && !editingSlug) {
      setMessage({ type: 'error', text: 'شما اجازه ایجاد پست ندارید' })
      return
    }
    if (!userPermissions.can_edit && editingSlug) {
      setMessage({ type: 'error', text: 'شما اجازه ویرایش پست ندارید' })
      return
    }

    // Validate: Current language fields must be provided
    const currentTitle = locale === 'fa' ? formData.titleFa : locale === 'ku' ? formData.titleKu : formData.titleEn
    const currentContent = locale === 'fa' ? formData.contentFa : locale === 'ku' ? formData.contentKu : formData.contentEn
    
    if (!currentTitle || !currentContent) {
      setMessage({ 
        type: 'error', 
        text: locale === 'fa' 
          ? t('farsiFieldsRequired')
          : locale === 'ku'
          ? t('kurdishFieldsRequired')
          : t('englishFieldsRequired')
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // Upload files first if exists
      let imageUrl = formData.image
      let videoUrl = formData.video
      let audioUrl = formData.audio
      let pdfUrl = formData.pdf

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

      if (pdfFile) {
        pdfUrl = await handleUploadFile(pdfFile, 'pdf')
        if (!pdfUrl) {
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
          // Only send data for the current language
          titleFa: locale === 'fa' ? formData.titleFa : '',
          titleKu: locale === 'ku' ? formData.titleKu : '',
          titleEn: locale === 'en' ? formData.titleEn : '',
          contentFa: locale === 'fa' ? formData.contentFa : '',
          contentKu: locale === 'ku' ? formData.contentKu : '',
          contentEn: locale === 'en' ? formData.contentEn : '',
          // Common fields
          category: formData.category,
          section: formData.section,
          author: formData.author,
          authorInstagram: formData.authorInstagram,
          authorFacebook: formData.authorFacebook,
          authorTwitter: formData.authorTwitter,
          authorTelegram: formData.authorTelegram,
          authorYoutube: formData.authorYoutube,
          tags: formData.tags,
          date: formData.date,
          slug: editingSlug || undefined,
          image: imageUrl || formData.image,
          video: videoUrl || formData.video,
          audio: audioUrl || formData.audio,
          pdf: pdfUrl || formData.pdf || null,
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
        setMessage({ type: 'error', text: errorMessage })
        setIsSubmitting(false)
        return
      }

      const data = await response.json()
      console.log('Submit response:', data)

      if (data.success) {
        setMessage({ type: 'success', text: editingSlug ? 'پۆست بە سەرکەوتووی نوێ کرا!' : 'پۆست بە سەرکەوتووی زیاد کرا!' })
        // Reset form
        setFormData({
          titleFa: '',
          titleKu: '',
          titleEn: '',
          contentFa: '',
          contentKu: '',
          contentEn: '',
          category: 'social',
          section: 'general',
          author: 'کۆدەنگ',
          authorInstagram: '',
          authorFacebook: '',
          authorTwitter: '',
          authorTelegram: '',
          authorYoutube: '',
          tags: '',
          image: '',
          video: '',
          audio: '',
          pdf: '',
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
    const slug = generateSlug(formData.titleFa || formData.titleKu || formData.titleEn)
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
          content: formData.contentKu,
        },
        fa: {
          title: formData.titleFa,
          content: formData.contentFa,
        },
        en: {
          title: formData.titleEn,
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
                {t('username')}
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
                {t('password')}
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
              {t('loginButton')}
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
              <h1 className="text-3xl font-bold text-slate-900">{t('postManagement')}</h1>
              <p className="text-slate-600 mt-2">{t('postList')}</p>
              <p className="text-sm text-slate-500 mt-1 font-semibold">
                {locale === 'fa' && '📝 فقط پست‌های فارسی نمایش داده می‌شوند'}
                {locale === 'ku' && '📝 تەنها پۆستە کوردییەکان پیشان دەدرێن'}
                {locale === 'en' && '📝 Only English posts are displayed'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                <Lock className="h-5 w-5" />
                {t('logout')}
              </button>
              <button
                onClick={() => setMode('users')}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                <Users className="h-5 w-5" />
                {t('users')}
              </button>
              {userPermissions.can_create && (
                <button
                  onClick={() => {
                    setMode('add')
                    setEditingSlug(null)
                  setFormData({
                    titleKu: '',
                    titleFa: '',
                    titleEn: '',
                    contentKu: '',
                    contentFa: '',
                    contentEn: '',
                    category: 'social',
                    section: 'general',
            author: 'کۆدەنگ',
            authorInstagram: '',
            authorFacebook: '',
            authorTwitter: '',
            authorTelegram: '',
            authorYoutube: '',
            tags: '',
                    image: '',
                    video: '',
                    audio: '',
                    pdf: '',
                    date: new Date().toISOString().split('T')[0],
                  })
                  setPdfFile(null)
                  }}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  <Plus className="h-5 w-5" />
                  {t('addPost')}
                </button>
              )}
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
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views || 0} {t('views')}
                      </span>
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
                    {userPermissions.can_edit && (
                      <button
                        onClick={() => handleEdit(item.slug)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        aria-label="دەستکاری"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    )}
                    {userPermissions.can_delete && (
                      <button
                        onClick={() => handleDelete(item.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        aria-label="سڕینەوە"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // User Management Mode
  if (mode === 'users') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">بەڕێوەبردنی بەکارهێنەران</h1>
              <p className="text-slate-600 mt-2">دروستکردن و بەڕێوەبردنی بەکارهێنەران</p>
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
                onClick={() => setMode('list')}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                <List className="h-5 w-5" />
                {t('posts')}
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

          {/* User Form */}
          <div className="bg-slate-50 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              {editingUserId ? 'دەستکاریکردنی بەکارهێنەر' : 'دروستکردنی بەکارهێنەری نوێ'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('username')}
                </label>
                <input
                  type="text"
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={t('username')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('password')} {editingUserId && `(${locale === 'fa' ? 'خالی بگذارید برای عدم تغییر' : locale === 'ku' ? 'بەجێی بهێڵە بۆ نەگۆڕین' : 'Leave empty to keep unchanged'})`}
                </label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={t('password')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  {locale === 'fa' ? 'دسترسی‌ها' : locale === 'ku' ? 'دەسەڵاتەکان' : 'Permissions'}
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userFormData.can_create}
                      onChange={(e) => setUserFormData({ ...userFormData, can_create: e.target.checked })}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-slate-700">{locale === 'fa' ? 'ایجاد پست' : locale === 'ku' ? 'زیادکردنی پۆست' : 'Create Post'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userFormData.can_edit}
                      onChange={(e) => setUserFormData({ ...userFormData, can_edit: e.target.checked })}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-slate-700">{locale === 'fa' ? 'ویرایش پست' : locale === 'ku' ? 'دەستکاریکردنی پۆست' : 'Edit Post'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userFormData.can_delete}
                      onChange={(e) => setUserFormData({ ...userFormData, can_delete: e.target.checked })}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-slate-700">{locale === 'fa' ? 'حذف پست' : locale === 'ku' ? 'سڕینەوەی پۆست' : 'Delete Post'}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={editingUserId ? () => handleUpdateUser(editingUserId) : handleCreateUser}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                <Save className="h-5 w-5" />
                {editingUserId ? t('save') : t('createUser')}
              </button>
              {editingUserId && (
                <button
                  onClick={() => {
                    setEditingUserId(null)
                    setUserFormData({
                      username: '',
                      password: '',
                      can_create: false,
                      can_edit: false,
                      can_delete: false,
                    })
                  }}
                  className="flex items-center gap-2 bg-slate-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                  {t('cancel')}
                </button>
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">{locale === 'fa' ? 'لیست کاربران' : locale === 'ku' ? 'لیستی بەکارهێنەران' : 'Users List'}</h2>
            <div className="grid gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2">{user.username}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className={user.can_create ? 'text-green-600' : 'text-slate-400'}>
                        ایجاد: {user.can_create ? '✓' : '✗'}
                      </span>
                      <span className={user.can_edit ? 'text-green-600' : 'text-slate-400'}>
                        ویرایش: {user.can_edit ? '✓' : '✗'}
                      </span>
                      <span className={user.can_delete ? 'text-green-600' : 'text-slate-400'}>
                        حذف: {user.can_delete ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      aria-label={t('edit')}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      aria-label={t('delete')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  {locale === 'fa' ? 'هیچ کاربری وجود ندارد' : locale === 'ku' ? 'هیچ بەکارهێنەرێک نیە' : 'No users found'}
                </div>
              )}
            </div>
          </div>
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
              {editingSlug ? t('editPost') : t('addPost')}
            </h1>
            <p className="text-slate-600 mt-2">
              {editingSlug ? (locale === 'fa' ? 'پست را ویرایش کنید' : locale === 'ku' ? 'پۆستەکە دەستکاری بکە' : 'Edit the post') : (locale === 'fa' ? 'فرم ساده برای افزودن پست جدید' : locale === 'ku' ? 'فۆرمێکی سادە بۆ زیادکردنی پۆستی نوێ' : 'Simple form to add a new post')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              <Lock className="h-5 w-5" />
              {t('logout')}
            </button>
            <button
              onClick={() => {
                setMode('list')
                setEditingSlug(null)
              }}
              className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition"
            >
              <List className="h-5 w-5" />
              {t('posts')}
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t('category')}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="social">{tCategories('social')}</option>
              <option value="politics">{tCategories('politics')}</option>
              <option value="culture">{tCategories('culture')}</option>
              <option value="health">{tCategories('health')}</option>
              <option value="women">{tCategories('women')}</option>
              <option value="workers">{tCategories('workers')}</option>
              <option value="kolbar">{tCategories('kolbar')}</option>
              <option value="children">{tCategories('children')}</option>
              <option value="arrest">{tCategories('arrest')}</option>
              <option value="students">{tCategories('students')}</option>
              <option value="suicide">{tCategories('suicide')}</option>
            </select>
          </div>

          {/* Section/Position */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t('postSection')}
            </label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="general">{t('generalSection')}</option>
              <option value="hero">{t('heroSection')}</option>
              <option value="breaking">{t('breakingSection')}</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              {t('postSectionDesc')}
            </p>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t('author')}
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="کۆدەنگ"
            />
          </div>

          {/* Author Social Media Links */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              {t('authorSocialMedia')} ({t('optional')})
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('instagram')}</label>
                <input
                  type="url"
                  value={formData.authorInstagram}
                  onChange={(e) => setFormData({ ...formData, authorInstagram: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('facebook')}</label>
                <input
                  type="url"
                  value={formData.authorFacebook}
                  onChange={(e) => setFormData({ ...formData, authorFacebook: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('twitter')}</label>
                <input
                  type="url"
                  value={formData.authorTwitter}
                  onChange={(e) => setFormData({ ...formData, authorTwitter: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('telegram')}</label>
                <input
                  type="url"
                  value={formData.authorTelegram}
                  onChange={(e) => setFormData({ ...formData, authorTelegram: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://t.me/username"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">{t('youtube')}</label>
                <input
                  type="url"
                  value={formData.authorYoutube}
                  onChange={(e) => setFormData({ ...formData, authorYoutube: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://youtube.com/@username"
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t('date')}
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
              {t('imageLink')}
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
            {t('image')} ({t('upload')})
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition">
              <ImageIcon className="h-5 w-5" />
              <span>{t('selectImage')}</span>
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
            {t('video')} ({t('upload')} {t('orLink')})
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.video}
              onChange={(e) => setFormData({ ...formData, video: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder={t('videoLink')}
            />
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition w-fit">
              <Video className="h-5 w-5" />
              <span>{t('selectVideo')}</span>
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

        {/* PDF - بەشی فایلی PDF (دیار بە border سوور) */}
        <div className="border-2 border-red-400 bg-red-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-red-800 mb-2">
            📄 PDF — فایلی PDF ({t('upload')} {t('orLink')})
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.pdf}
              onChange={(e) => setFormData({ ...formData, pdf: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="لینکی PDF یان بەڕێکەوت فایل upload بکە"
            />
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200 transition w-fit">
              <FileText className="h-5 w-5" />
              <span>PDF هەڵبژێرە</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
              />
            </label>
            {pdfFile && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText className="h-4 w-4" />
                <span>{pdfFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPdfFile(null)
                    setFormData({ ...formData, pdf: '' })
                  }}
                  className="text-red-500 hover:text-red-700"
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
            {t('tags')} ({locale === 'fa' ? 'با کاما جدا کنید' : locale === 'ku' ? 'بە کۆما جیا بکەرەوە' : 'separate with comma'})
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="کۆدەنگ, کورد, کوردستان"
          />
        </div>

        {/* Persian - Only show if locale is 'fa' */}
        {locale === 'fa' && (
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {t('farsi')} <span className="text-red-500 text-sm">({t('required')})</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('title')} ({t('farsi')})
              </label>
              <input
                type="text"
                value={formData.titleFa}
                onChange={(e) => setFormData({ ...formData, titleFa: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`${t('title')} (${t('farsi')})`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('content')} ({t('farsi')})
              </label>
              <textarea
                value={formData.contentFa}
                onChange={(e) => setFormData({ ...formData, contentFa: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`${t('content')} (${t('farsi')})`}
                rows={6}
              />
            </div>
          </div>
        </div>
        )}

        {/* Kurdish - Only show if locale is 'ku' */}
        {locale === 'ku' && (
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {t('kurdish')} <span className="text-red-500 text-sm">({t('required')})</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('title')} ({t('kurdish')})
              </label>
              <input
                type="text"
                value={formData.titleKu}
                onChange={(e) => setFormData({ ...formData, titleKu: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`${t('title')} (${t('kurdish')})`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('content')} ({t('kurdish')})
              </label>
              <textarea
                value={formData.contentKu}
                onChange={(e) => setFormData({ ...formData, contentKu: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`${t('content')} (${t('kurdish')})`}
                rows={6}
              />
            </div>
          </div>
        </div>
        )}

        {/* English - Only show if locale is 'en' */}
        {locale === 'en' && (
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            {t('english')} <span className="text-red-500 text-sm">({t('required')})</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('title')} ({t('english')})
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`${t('title')} (${t('english')})`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t('content')} ({t('english')})
              </label>
              <textarea
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={`${t('content')} (${t('english')})`}
                rows={6}
              />
            </div>
          </div>
        </div>
        )}

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
          <p className="font-semibold mb-2">{t('instructions')}</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>{t('instruction1')}</li>
            <li>{t('instruction2')}</li>
            <li>{t('instruction3')}</li>
            <li>{t('instruction4')}</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

