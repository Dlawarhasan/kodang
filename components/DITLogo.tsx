'use client'

interface DITLogoProps {
  size?: 'small' | 'medium' | 'large'
  showTagline?: boolean
}

export default function DITLogo({ size = 'medium', showTagline = false }: DITLogoProps) {
  const sizeClasses = {
    small: 'h-5',
    medium: 'h-7',
    large: 'h-10'
  }

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg'
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {/* Main Logo: D.IT - Order: D icon + dot + IT */}
      <div className={`flex items-center gap-1 ${sizeClasses[size]} direction-ltr`}>
        {/* Stylized D icon with circuit traces */}
        <svg
          viewBox="0 0 50 70"
          className={`${sizeClasses[size]} text-white flex-shrink-0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left vertical bar of D */}
          <line x1="8" y1="8" x2="8" y2="62" />
          
          {/* Curved right side of D */}
          <path d="M 8 8 Q 32 8, 32 35 Q 32 62, 8 62" />
          
          {/* Three main horizontal circuit traces from left bar */}
          <line x1="8" y1="22" x2="20" y2="22" />
          <circle cx="20" cy="22" r="2.5" fill="currentColor" />
          
          <line x1="8" y1="35" x2="20" y2="35" />
          <circle cx="20" cy="35" r="2.5" fill="currentColor" />
          
          <line x1="8" y1="48" x2="20" y2="48" />
          <circle cx="20" cy="48" r="2.5" fill="currentColor" />
          
          {/* Additional shorter lines branching off */}
          <line x1="8" y1="15" x2="15" y2="15" />
          <circle cx="15" cy="15" r="2" fill="currentColor" />
          
          <line x1="8" y1="55" x2="15" y2="55" />
          <circle cx="15" cy="55" r="2" fill="currentColor" />
        </svg>
        
        {/* .IT Text - D + dot + IT = D.IT */}
        <div className={`flex items-baseline gap-0.5 font-bold ${textSizes[size]} text-white leading-none direction-ltr`}>
          <span className="w-1 h-1 rounded-full bg-white mt-0.5 flex-shrink-0" />
          <span className="font-bold">IT</span>
        </div>
      </div>
      
      {/* Tagline */}
      {showTagline && (
        <div className="text-[8px] text-white/80 font-mono tracking-wider">
          FOR TECH AND TECH
        </div>
      )}
    </div>
  )
}

