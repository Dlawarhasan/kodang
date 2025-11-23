// Direct upload to Supabase Storage from client
// This bypasses Next.js API route to avoid Vercel payload limits

import { createClient } from '@supabase/supabase-js'

export async function uploadFileDirect(
  file: File,
  fileType: 'image' | 'video' | 'audio',
  supabaseUrl: string,
  supabaseAnonKey: string
): Promise<{ url: string; path: string }> {
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Determine bucket
  const bucket = fileType === 'video' ? 'videos' : fileType === 'audio' ? 'audio' : 'images'
  const folder = 'news'
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  console.log('Uploading file directly to Supabase:', {
    bucket,
    filePath,
    fileName,
    size: file.size,
    sizeMB: (file.size / 1024 / 1024).toFixed(2)
  })

  // Upload file directly to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: '3600'
    })

  if (error) {
    console.error('Direct upload error:', error)
    throw new Error(error.message || 'Upload failed')
  }

  if (!data) {
    throw new Error('Upload failed: No data returned')
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  console.log('Direct upload successful:', urlData.publicUrl)

  return {
    url: urlData.publicUrl,
    path: filePath
  }
}

