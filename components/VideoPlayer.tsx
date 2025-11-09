'use client'

interface VideoPlayerProps {
  videoUrl: string
  title: string
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed')) {
      return url
    }
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    return url
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  return (
    <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

