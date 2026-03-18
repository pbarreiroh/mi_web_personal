'use client'
import { createContext, useContext, useState } from 'react'

type Language = 'es' | 'en'

const translations = {
  es: { /* vacío por ahora */ },
  en: { /* vacío por ahora */ }
}

const LanguageContext = createContext<{
  language: Language
  setLanguage: (l: Language) => void
  t: (key: string) => string
} | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')
  const t = (key: string) => translations[language][key as keyof typeof translations['es']] || key
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
