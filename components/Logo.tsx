type LogoSize = 'default' | 'small' | 'large'
type LogoVariant = 'stacked' | 'inline'

interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
}

export default function Logo({ size = 'default', variant = 'stacked' }: LogoProps) {
  const sizeClasses: Record<LogoSize, { kd: string; kodang: string; kurdish: string }> = {
    small: { kd: 'text-4xl', kodang: 'text-base', kurdish: 'text-sm' },
    default: { kd: 'text-6xl', kodang: 'text-xl', kurdish: 'text-base' },
    large: { kd: 'text-8xl', kodang: 'text-3xl', kurdish: 'text-xl' },
  }
  
  const sizes = sizeClasses[size]
  const isInline = variant === 'inline'
  
  return (
    <div className={isInline ? 'flex items-center gap-2' : 'flex flex-col items-center justify-center'}>
      <div className={isInline ? 'flex items-center justify-center' : 'flex items-center justify-center mb-1'}>
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
      
      <div className={isInline ? 'flex flex-col leading-tight' : 'text-center'}>
        <div 
          className={`${sizes.kodang} font-bold text-white ${isInline ? '' : 'mb-0.5'}`}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          KODANG
        </div>
        <div 
          className={`${sizes.kurdish} font-semibold text-blue-400`}
          style={{
            fontFamily: 'Vazirmatn, Tahoma, Arial, system-ui, sans-serif',
          }}
        >
          کۆدەنگ
        </div>
      </div>
    </div>
  )
}

