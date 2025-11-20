import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string || 'image'

    if (!file) {
      return NextResponse.json({ error: 'هیچ فایلێک نەدراوە' }, { status: 400 })
    }

    const supabase = createServerClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    // Determine bucket based on file type
    let bucket = 'images'
    let folder = 'news'
    
    if (fileType === 'video') {
      bucket = 'videos'
      folder = 'news'
    } else if (fileType === 'audio') {
      bucket = 'audio'
      folder = 'news'
    }
    
    const filePath = `${folder}/${fileName}`

    console.log('Uploading file:', { bucket, filePath, fileType, fileName })

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    console.log('Available buckets:', buckets?.map(b => b.name))
    
    if (listError) {
      console.error('Error listing buckets:', listError)
    }
    
    const bucketExists = buckets?.some(b => b.name === bucket)
    if (!bucketExists) {
      console.error(`Bucket "${bucket}" not found. Available buckets:`, buckets?.map(b => b.name))
      throw new Error(`Bucket "${bucket}" not found. Please create the bucket in Supabase Dashboard → Storage.`)
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

