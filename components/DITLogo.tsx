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
      {/* Main Logo: IT•LO with D icon */}
      <div className={`flex items-center gap-1.5 ${sizeClasses[size]}`}>
        {/* IT•LO Text */}
        <div className={`flex items-center gap-1 font-bold ${textSizes[size]} text-white leading-none`}>
          <span className="font-bold">IT</span>
          <span className="w-1 h-1 rounded-full bg-white" />
          <span className="font-bold">LO</span>
        </div>
        
        {/* Stylized D icon with circuit traces */}
        <svg
          viewBox="0 0 50 70"
          className={`${sizeClasses[size]} text-white`}
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
          
          {/* Three horizontal circuit traces from left bar */}
          <line x1="8" y1="22" x2="20" y2="22" />
          <circle cx="20" cy="22" r="2.5" fill="currentColor" />
          
          <line x1="8" y1="35" x2="20" y2="35" />
          <circle cx="20" cy="35" r="2.5" fill="currentColor" />
          
          <line x1="8" y1="48" x2="20" y2="48" />
          <circle cx="20" cy="48" r="2.5" fill="currentColor" />
          
          {/* Two circles on curved side */}
          <circle cx="28" cy="22" r="2.5" fill="currentColor" />
          <circle cx="28" cy="48" r="2.5" fill="currentColor" />
        </svg>
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

