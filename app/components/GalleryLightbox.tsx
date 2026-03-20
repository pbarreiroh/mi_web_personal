'use client'

import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryLightboxProps {
  images: { src: string; alt: string }[]
  initialIndex: number
  onClose: () => void
}

export default function GalleryLightbox({ images, initialIndex, onClose }: GalleryLightboxProps) {
  const [current, setCurrent] = useState(initialIndex)

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <button onClick={onClose} className="absolute top-5 right-5 z-10 text-white/50 hover:text-white transition-colors">
        <X size={22} strokeWidth={1.5} />
      </button>

      <button onClick={prev} className="absolute left-4 z-10 text-white/50 hover:text-white transition-colors p-2">
        <ChevronLeft size={28} strokeWidth={1.5} />
      </button>

      <div className="relative z-10 max-w-3xl max-h-[80vh] w-full px-16">
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="w-full h-full object-contain max-h-[80vh] rounded-lg"
        />
        <p className="text-center text-white/30 text-xs font-mono mt-4">{images[current].alt}</p>
      </div>

      <button onClick={next} className="absolute right-4 z-10 text-white/50 hover:text-white transition-colors p-2">
        <ChevronRight size={28} strokeWidth={1.5} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${i === current ? 'bg-white' : 'bg-white/25'}`}
          />
        ))}
      </div>
    </div>
  )
}
