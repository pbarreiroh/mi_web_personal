'use client'
import { createContext, useContext, useState } from 'react'
import React from 'react'

type Language = 'en' | 'es'

const translations = {
  en: {
    'nav.welcome': 'Bienvenido a mi web',
    'nav.tools': 'Herramientas',
    'nav.projects': 'Proyectos',
    'nav.gallery': 'Galería',
    'nav.contact': 'Contacto',
    'hero.phrase.0': 'Tecnología',
    'hero.phrase.1': 'Aprendizaje',
    'hero.phrase.2': 'Ciberseguridad',
    'hero.phrase.3': 'Desarrollo',
    'hero.bio': 'Me llamo Pablo, soy estudiante de Ingeniería Informática. Hago esta web para mostrar un poco más de mí y para subir proyectos que vaya creando a lo largo de la carrera. Además, te proporciono dos herramientas de IA desarrolladas por mi que pueden ser útiles en tu día a día.',
    'hero.btn.tools': 'Explorar herramientas',
    'hero.btn.projects': 'Ver proyectos',
    'hero.btn.contact': 'Contáctame',
    'section.lately': 'Últimamente',
    'section.gallery': 'Galería',
    'section.tools': 'Herramientas',
    'section.projects': 'Proyectos',
    'linkedin.readmore': 'Leer publicación completa →',
    'linkedin.bio': 'Estudiante de Ingeniería Informática',
    'linkedin.post': 'Hace dos semanas tuve la oportunidad de participar en mi primer hackathon en HackUDC, una experiencia intensa de 36 horas construyendo una solución de inteligencia artificial desde cero.',
    'tools.soon': 'In development',
    'tools.wip.desc': 'An AI-powered productivity and wellbeing ecosystem.',
    'tools.wip.badge': 'wip',
    'project.indifit.desc': 'Herramienta de IA empezada durante el HackUDC26 que no llegó a terminarse',
    'project.terminal.name': 'Terminal Personal',
    'project.terminal.desc': 'Emulador de terminal en el navegador web con comandos reales ejecutables y sistema de archivos.',
    'project.linux.name': 'Personalizacion de Terminal en Linux',
    'project.linux.desc': 'Script para personalizar la terminal de Linux',
    'footer.copy': 'pablo barreiro',
  },
  es: {
    'nav.welcome': 'Welcome to my site',
    'nav.tools': 'Tools',
    'nav.projects': 'Projects',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'hero.phrase.0': 'Technology',
    'hero.phrase.1': 'Learning',
    'hero.phrase.2': 'Cybersecurity',
    'hero.phrase.3': 'Development',
    'hero.bio': 'My name is Pablo, I am a Computer Engineering student. I built this site to share a bit more about myself and to showcase projects I create throughout my degree. I also provide two AI tools I developed that might be useful in your day to day.',
    'hero.btn.tools': 'Explore tools',
    'hero.btn.projects': 'View projects',
    'hero.btn.contact': 'Contact me',
    'section.lately': 'Lately',
    'section.gallery': 'Gallery',
    'section.tools': 'Tools',
    'section.projects': 'Projects',
    'linkedin.readmore': 'Read full post →',
    'linkedin.bio': 'Computer Engineering student',
    'linkedin.post': 'Two weeks ago I had the opportunity to participate in my first hackathon at HackUDC, an intense 36-hour experience building an artificial intelligence solution from scratch.',
    'tools.soon': 'Coming soon',
    'tools.wip.desc': 'Tool under development.',
    'tools.wip.badge': 'wip',
    'project.indifit.desc': 'AI tool started during HackUDC26 that was not finished',
    'project.terminal.name': 'Personal Terminal',
    'project.terminal.desc': 'Browser-based terminal emulator with real executable commands and a file system.',
    'project.linux.name': 'Linux Terminal Customization',
    'project.linux.desc': 'Script to customize the Linux terminal.',
    'footer.copy': 'pablo barreiro',
  },
}

const LanguageContext = createContext<{
  language: Language
  setLanguage: (l: Language) => void
  t: (key: keyof typeof translations.es) => string
} | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'en') {
        setLanguage('en')
      }
    }
  }, [])

  const t = (key: keyof typeof translations.es): string =>
    translations[language][key] ?? key
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
