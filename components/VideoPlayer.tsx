'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  autoplay?: boolean
}

export default function VideoPlayer({ videoUrl, title, autoplay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const [shouldAutoplay, setShouldAutoplay] = useState(autoplay)

  useEffect(() => {
    // Check if URL has #video hash (user clicked play button)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#video') {
        setShouldAutoplay(true)
        // Scroll to video when page loads
        setTimeout(() => {
          videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [])

  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed')) {
      // Add autoplay parameter if needed
      if (shouldAutoplay && !url.includes('autoplay=1')) {
        return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`
      }
      return url
    }
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      if (videoId) {
        return shouldAutoplay 
          ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
          : `https://www.youtube.com/embed/${videoId}`
      }
      return url
    }
    // For direct video URLs (Supabase storage), return as is
    return url
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  // Check if it's a direct video URL (not YouTube)
  const isDirectVideo = !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')

  return (
    <div ref={videoRef} id="video" className="w-full aspect-[4/5] bg-gray-900 rounded-lg overflow-hidden mb-6">
      {isDirectVideo ? (
        <video
          src={videoUrl}
          controls
          autoPlay={shouldAutoplay}
          className="w-full h-full object-cover"
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
}

