export default function Logo({ size = 'default' }: { size?: 'default' | 'small' | 'large' }) {
  const sizeClasses = {
    small: { kd: 'text-3xl', kodang: 'text-lg', kurdish: 'text-base' },
    default: { kd: 'text-5xl', kodang: 'text-2xl', kurdish: 'text-xl' },
    large: { kd: 'text-7xl', kodang: 'text-4xl', kurdish: 'text-2xl' },
  }
  
  const sizes = sizeClasses[size]
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* KD Logo */}
      <div className="flex items-center justify-center mb-1">
        <div className="relative">
          <span 
            className={`${sizes.kd} font-bold text-red-600 leading-none`}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.05em',
            }}
          >
            KD
          </span>
        </div>
      </div>
      
      {/* KODANG Text */}
      <div className="text-center">
        <div 
          className={`${sizes.kodang} font-bold text-black mb-0.5`}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          KODANG
        </div>
        
        {/* کۆدەنگ Text */}
        <div 
          className={`${sizes.kurdish} font-semibold text-blue-700`}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          کۆدەنگ
        </div>
      </div>
    </div>
  )
}

