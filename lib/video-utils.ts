// Utility functions for video handling

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null
  
  if (url.includes('youtube.com/embed')) {
    const match = url.match(/youtube\.com\/embed\/([^?&#]+)/)
    return match ? match[1] : null
  }
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }
  return null
}

/**
 * Get YouTube thumbnail URL from video URL
 * Returns null if not a YouTube video or if thumbnail is provided
 */
export function getYouTubeThumbnail(videoUrl: string, providedThumbnail?: string | null): string | null {
  // If thumbnail is already provided, use it
  if (providedThumbnail) return providedThumbnail
  
  // Try to get YouTube thumbnail
  const videoId = getYouTubeVideoId(videoUrl)
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
  
  return null
}

/**
 * Check if a URL is a YouTube video
 */
export function isYouTubeVideo(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

