'use client'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  return (
    <button
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="group fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-neutral-600 hover:text-white hover:border-white/15 backdrop-blur-sm transition-all duration-300 text-xs"
    >
      <Globe size={13} strokeWidth={1.5} />
      <span className="font-mono font-medium">{language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  )
}
