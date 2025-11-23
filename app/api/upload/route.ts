import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Increase timeout for large video uploads
export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string || 'image'

    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          error: 'هیچ فایلێک نەدراوە' 
        }, 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Check file size (100MB limit for videos, 50MB for others)
    const maxSize = fileType === 'video' ? 100 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2)
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0)
      return NextResponse.json(
        { 
          success: false,
          error: fileType === 'video' 
            ? `قەبارەی ڤیدیۆ (${sizeMB}MB) زۆر گەورەیە. تکایە فایلی بچووکتر هەڵبژێرە (کەمتر لە ${maxSizeMB}MB)`
            : `قەبارەی فایل (${sizeMB}MB) زۆر گەورەیە. تکایە فایلی بچووکتر هەڵبژێرە (کەمتر لە ${maxSizeMB}MB)`
        }, 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    console.log('File upload request:', { 
      name: file.name, 
      type: file.type, 
      size: file.size, 
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
      uploadType: fileType 
    })

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
      return NextResponse.json(
        { 
          success: false,
          error: error.message || 'Upload failed',
          details: error 
        }, 
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Upload failed: No data returned'
        }, 
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('Upload successful:', { bucket, filePath, url: urlData.publicUrl })

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error: any) {
    console.error('Upload route error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Upload failed',
        details: error.toString()
      }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

