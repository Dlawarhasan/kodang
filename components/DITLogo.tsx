'use client'

interface DITLogoProps {
  size?: 'small' | 'medium' | 'large'
  showTagline?: boolean
}

export default function DITLogo({ size = 'medium', showTagline = false }: DITLogoProps) {
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-12'
  }

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      {/* Main Logo: D.IT */}
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        {/* Stylized D with circuit traces */}
        <svg
          viewBox="0 0 60 80"
          className={`${sizeClasses[size]} text-white`}
          fill="currentColor"
        >
          {/* Left vertical bar of D */}
          <line x1="10" y1="10" x2="10" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          
          {/* Curved right side of D */}
          <path
            d="M 10 10 Q 40 10, 40 40 Q 40 70, 10 70"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Three horizontal circuit traces from left bar */}
          <line x1="10" y1="25" x2="25" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="25" cy="25" r="3" fill="currentColor" />
          
          <line x1="10" y1="40" x2="25" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="25" cy="40" r="3" fill="currentColor" />
          
          <line x1="10" y1="55" x2="25" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="25" cy="55" r="3" fill="currentColor" />
          
          {/* Two circles on curved side */}
          <circle cx="35" cy="25" r="3" fill="currentColor" />
          <circle cx="35" cy="55" r="3" fill="currentColor" />
        </svg>
        
        {/* .IT Text */}
        <div className={`flex items-baseline gap-0.5 font-bold ${textSizes[size]} text-white`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
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

