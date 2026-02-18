import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import sharp from 'sharp'

// Increase timeout for large video uploads
export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = (formData.get('type') as string) || 'image'

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

    // Check file size (100MB videos, 100MB PDFs, 50MB others)
    const maxSize =
      fileType === 'video' ? 100 * 1024 * 1024
      : fileType === 'pdf' ? 100 * 1024 * 1024
      : 50 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2)
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0)
      return NextResponse.json(
        { 
          success: false,
          error: fileType === 'video' 
            ? `قەبارەی ڤیدیۆ (${sizeMB}MB) زۆر گەورەیە. تکایە فایلی بچووکتر هەڵبژێرە (کەمتر لە ${maxSizeMB}MB)`
            : fileType === 'pdf'
            ? `قەبارەی PDF (${sizeMB}MB) زۆر گەورەیە. تکایە فایلی بچووکتر هەڵبژێرە (کەمتر لە ${maxSizeMB}MB)`
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
    } else if (fileType === 'pdf') {
      bucket = 'documents'
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

    // Process image files: resize and optimize
    let buffer: Buffer
    let contentType = file.type
    let finalFileName = fileName
    
    if (fileType === 'image' && file.type.startsWith('image/')) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const originalBuffer = Buffer.from(arrayBuffer)
        
        // Get image metadata
        const metadata = await sharp(originalBuffer).metadata()
        const { width, height, format } = metadata
        
        console.log('Original image:', { width, height, format, size: originalBuffer.length })
        
        // Resize if image is too large (max width: 1920px, maintain aspect ratio)
        const maxWidth = 1920
        const maxHeight = 1920
        
        let processedImage = sharp(originalBuffer)
        
        // Resize if needed
        if (width && height && (width > maxWidth || height > maxHeight)) {
          processedImage = processedImage.resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          console.log('Resizing image to max', maxWidth, 'x', maxHeight)
        }
        
        // Optimize based on format
        if (format === 'jpeg' || format === 'jpg') {
          buffer = await processedImage
            .jpeg({ quality: 85, progressive: true, mozjpeg: true })
            .toBuffer()
          contentType = 'image/jpeg'
          finalFileName = fileName.replace(/\.(png|webp|gif)$/i, '.jpg')
        } else if (format === 'png') {
          buffer = await processedImage
            .png({ quality: 85, compressionLevel: 9 })
            .toBuffer()
          contentType = 'image/png'
        } else if (format === 'webp') {
          buffer = await processedImage
            .webp({ quality: 85 })
            .toBuffer()
          contentType = 'image/webp'
        } else {
          // For other formats, convert to jpeg
          buffer = await processedImage
            .jpeg({ quality: 85, progressive: true })
            .toBuffer()
          contentType = 'image/jpeg'
          finalFileName = fileName.replace(/\.[^.]+$/, '.jpg')
        }
        
        const processedMetadata = await sharp(buffer).metadata()
        console.log('Processed image:', { 
          width: processedMetadata.width, 
          height: processedMetadata.height, 
          format: processedMetadata.format,
          size: buffer.length,
          originalSize: originalBuffer.length,
          reduction: `${((1 - buffer.length / originalBuffer.length) * 100).toFixed(1)}%`
        })
      } catch (error: any) {
        console.error('Image processing error:', error)
        // Fallback to original if processing fails
        const arrayBuffer = await file.arrayBuffer()
        buffer = Buffer.from(arrayBuffer)
      }
    } else {
      // For non-image files, just convert to buffer
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    }
    
    // Update filePath with final filename
    const finalFilePath = `${folder}/${finalFileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalFilePath, buffer, {
        contentType: contentType,
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
      .getPublicUrl(finalFilePath)

    console.log('Upload successful:', { bucket, filePath: finalFilePath, url: urlData.publicUrl })

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: finalFilePath
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

