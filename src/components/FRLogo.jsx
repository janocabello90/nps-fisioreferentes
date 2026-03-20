import { BarChart3 } from 'lucide-react'

// FisioReferentes branded logo component
// To use the real logo image, replace LOGO_URL with the actual URL
const LOGO_URL = '/fr-logo.png'

export default function FRLogo({ size = 'md', variant = 'full', className = '' }) {
  const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', img: 'h-5', gap: 'gap-1.5' },
    md: { icon: 'w-5 h-5', text: 'text-sm', img: 'h-6', gap: 'gap-2' },
    lg: { icon: 'w-6 h-6', text: 'text-base', img: 'h-8', gap: 'gap-2' },
    xl: { icon: 'w-8 h-8', text: 'text-xl', img: 'h-10', gap: 'gap-3' }
  }

  const s = sizes[size] || sizes.md

  // variant: 'full' = icon + NPSFisio + by FisioReferentes
  //          'compact' = icon + NPSFisio
  //          'badge' = small "by FisioReferentes" text
  //          'icon' = just the icon

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center ${s.gap} text-gray-400 ${s.text} ${className}`}>
        <BarChart3 className={s.icon} />
        <span>by <span className="font-semibold text-gray-500">FisioReferentes</span></span>
      </span>
    )
  }

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {LOGO_URL ? (
        <img src={LOGO_URL} alt="FisioReferentes" className={`${s.img} object-contain`} />
      ) : (
        <div className="bg-brand-600 rounded-lg p-1.5 flex items-center justify-center">
          <BarChart3 className={`${s.icon} text-white`} />
        </div>
      )}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold text-gray-800 ${s.text}`}>
            NPS<span className="text-brand-600">Fisio</span>
          </span>
          {variant === 'full' && (
            <span className="text-[10px] text-gray-400 -mt-0.5">by FisioReferentes</span>
          )}
        </div>
      )}
    </div>
  )
}
