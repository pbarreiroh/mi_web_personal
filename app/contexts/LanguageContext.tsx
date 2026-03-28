'use client'
import { createContext, useContext, useState } from 'react'
import React from 'react'

type Language = 'en' | 'es'

const translations = {
  es: {
    'nav.welcome': 'Bienvenido a mi web',
    'nav.tools': 'Herramientas',
    'nav.projects': 'Proyectos',
    'nav.gallery': 'Galería',
    'nav.contact': 'Contacto',
    'hero.phrase.0': 'Tecnología',
    'hero.phrase.1': 'Aprendizaje',
    'hero.phrase.2': 'Ciberseguridad',
    'hero.phrase.3': 'Desarrollo',
    'hero.bio': 'Me llamo Pablo, soy estudiante de primero de Ingeniería Informática. Esta web nace con la idea de mostrar un poco más de mí y de compartir proyectos, certificados y aprendizajes que vaya adquiriendo a lo largo de la carrera. Mi enfoque se basa en solucionar problemas reales, por eso tengo en desarrollo dos herramientas de IA que pueden ser útiles en tu día a día. ¡Échales un vistazo!',

    'hero.btn.contact': 'Contáctame',

    'section.gallery': 'Galería',
    'section.tools': 'Herramientas',
    'section.projects': 'Proyectos',

    'tools.soon': 'Próximamente',
    'tools.wip.desc': 'Un ecosistema de productividad y bienestar impulsado por IA.',
    'tools.wip.badge': 'wip',
    'project.indifit.desc': 'Herramienta de IA empezada durante el HackUDC26 que no llegó a terminarse',
    'project.terminal.name': 'Terminal Personal',
    'project.terminal.desc': 'Emulador de terminal en el navegador web con comandos reales ejecutables y sistema de archivos.',
    'project.linux.name': 'Personalizacion de Terminal en Linux',
    'project.linux.desc': 'Script para personalizar la terminal de Linux',
    'project.pbfocus.desc1': 'Si necesitas ayuda para organizar tu día y gestionar tu tiempo, te presento pbfocus',
    'project.pbfocus.desc2': 'Un ecosistema de productividad y bienestar impulsado por IA.',
    'project.pbfocus.btn': '¡Pruébalo ahora!',
    'project.wip.title': 'En desarrollo',
    'project.wip.btn': 'Disponible el día 1 de Julio',
    'footer.copy': 'pablo barreiro',
  },
  en: {
    'nav.welcome': 'Welcome to my site',
    'nav.tools': 'Tools',
    'nav.projects': 'Projects',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'hero.phrase.0': 'Technology',
    'hero.phrase.1': 'Learning',
    'hero.phrase.2': 'Cybersecurity',
    'hero.phrase.3': 'Development',
    'hero.bio': 'My name is Pablo, I am a first-year Computer Engineering student. This site was born with the idea of showing a bit more about myself and sharing projects, certificates, and learnings I acquire throughout my degree. My focus is on solving real problems, which is why I have two AI tools in development that can be useful in your day-to-day. Check them out!',

    'hero.btn.contact': 'Contact me',

    'section.gallery': 'Gallery',
    'section.tools': 'Tools',
    'section.projects': 'Projects',

    'tools.soon': 'Coming July 1st',
    'tools.wip.desc': 'If you need help organizing your day and managing your time, let me introduce pbfocus — an AI-powered productivity and wellbeing ecosystem.',
    'tools.wip.badge': 'wip',
    'project.indifit.desc': 'AI tool started during HackUDC26 that was not finished',
    'project.terminal.name': 'Personal Terminal',
    'project.terminal.desc': 'Browser-based terminal emulator with real executable commands and a file system.',
    'project.linux.name': 'Linux Terminal Customization',
    'project.linux.desc': 'Script to customize the Linux terminal.',
    'project.pbfocus.desc1': 'If you need help organizing your day and managing your time, let me introduce pbfocus',
    'project.pbfocus.desc2': 'An AI-powered productivity and wellbeing ecosystem.',
    'project.pbfocus.btn': 'Try it now!',
    'project.wip.title': 'In development',
    'project.wip.btn': 'Available July 1st',
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
