// Client-side image processing using Canvas API
// Used for direct uploads when files are too large for API route

export interface ProcessedImage {
  file: File
  width: number
  height: number
  originalSize: number
  newSize: number
}

/**
 * Resize and optimize image on client side
 * @param file Original image file
 * @param maxWidth Maximum width (default: 1920)
 * @param maxHeight Maximum height (default: 1920)
 * @param quality JPEG quality 0-1 (default: 0.85)
 * @returns Processed image file
 */
export async function processImageClient(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.85
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'))
              return
            }
            
            // Create new file with same name but potentially different extension
            const fileExt = file.name.split('.').pop()?.toLowerCase()
            const mimeType = fileExt === 'png' ? 'image/png' : 'image/jpeg'
            const newFileName = file.name.replace(/\.[^.]+$/, fileExt === 'png' ? '.png' : '.jpg')
            
            const processedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now()
            })
            
            resolve({
              file: processedFile,
              width: Math.round(width),
              height: Math.round(height),
              originalSize: file.size,
              newSize: processedFile.size
            })
          },
          file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg',
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

