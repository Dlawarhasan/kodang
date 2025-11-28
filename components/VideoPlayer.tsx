'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  autoplay?: boolean
  thumbnail?: string
}

export default function VideoPlayer({ videoUrl, title, autoplay = false, thumbnail }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const [shouldAutoplay, setShouldAutoplay] = useState(autoplay)
  const [isPlaying, setIsPlaying] = useState(autoplay)

  useEffect(() => {
    // Check if URL has #video hash (user clicked play button)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#video') {
        setShouldAutoplay(true)
        setIsPlaying(true)
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

  const handlePlay = () => {
    setIsPlaying(true)
    setShouldAutoplay(true)
    // Update URL hash to #video
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#video')
    }
  }

  return (
    <div ref={videoRef} id="video" className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm relative">
      {!isPlaying && thumbnail ? (
        // Show thumbnail with play button
        <div className="relative w-full h-full cursor-pointer" onClick={handlePlay}>
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
            <div className="bg-red-600 rounded-full p-6 shadow-lg hover:scale-110 transition-transform">
              <Play className="h-10 w-10 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      ) : !isPlaying && !thumbnail ? (
        // Show placeholder with play button when no thumbnail
        <div className="relative w-full h-full bg-gray-800 cursor-pointer" onClick={handlePlay}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-6 shadow-lg hover:scale-110 transition-transform">
              <Play className="h-10 w-10 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      ) : isDirectVideo ? (
        <video
          src={videoUrl}
          controls
          autoPlay={shouldAutoplay}
          className="w-full h-full object-contain bg-black"
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

