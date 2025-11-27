type LogoSize = 'default' | 'small' | 'large'
type LogoVariant = 'stacked' | 'inline'

interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
}

export default function Logo({ size = 'default', variant = 'stacked' }: LogoProps) {
  const sizeClasses: Record<LogoSize, string> = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
  }
  
  const textSize = sizeClasses[size]
  
  return (
    <div className="flex items-center">
      <div 
        className={`${textSize} font-bold text-white`}
        style={{
          fontFamily: 'Vazirmatn, Tahoma, Arial, system-ui, sans-serif',
        }}
      >
        کۆدەنگ
      </div>
    </div>
  )
}

