type LogoSize = 'default' | 'small' | 'large'
type LogoVariant = 'stacked' | 'inline'

interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
}

export default function Logo({ size = 'default', variant = 'stacked' }: LogoProps) {
  const sizeClasses: Record<LogoSize, { kd: string; kodang: string; kurdish: string }> = {
    small: { kd: 'text-4xl', kodang: 'text-lg', kurdish: 'text-xs' },
    default: { kd: 'text-5xl', kodang: 'text-2xl', kurdish: 'text-xl' },
    large: { kd: 'text-7xl', kodang: 'text-4xl', kurdish: 'text-2xl' },
  }
  
  const sizes = sizeClasses[size]
  const isInline = variant === 'inline'
  
  return (
    <div className={isInline ? 'flex items-center gap-2' : 'flex flex-col items-center justify-center'}>
      <div 
        className={`${sizes.kurdish} font-bold text-white`}
        style={{
          fontFamily: 'Vazirmatn, Tahoma, Arial, system-ui, sans-serif',
        }}
      >
        کۆدەنگ
      </div>
    </div>
  )
}

