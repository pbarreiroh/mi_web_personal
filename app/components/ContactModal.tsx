'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type ContactType = 'email' | 'message'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [type, setType] = useState<ContactType>('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name, email, subject, content }),
    })

    if (res.ok) {
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setContent('')
    } else {
      setStatus('error')
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:border-white/20 transition-colors duration-300 text-sm"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0d0d0d] border border-white/[0.08] rounded-2xl p-8 z-10">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-600 hover:text-white transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <h2 className="text-white font-serif text-2xl font-semibold mb-2 tracking-tight">Contacto</h2>

        {/* Toggle */}
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-6">
          <button
            onClick={() => setType('email')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${type === 'email'
                ? 'bg-white text-black'
                : 'text-neutral-500 hover:text-white'
              }`}
          >
            Email
          </button>
          <button
            onClick={() => setType('message')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${type === 'message'
                ? 'bg-white text-black'
                : 'text-neutral-500 hover:text-white'
              }`}
          >
            Mensaje anónimo
          </button>
        </div>

        {/* Subtítulo contextual */}
        <p className="text-neutral-600 text-xs leading-relaxed mb-6">
          {type === 'email'
            ? 'Estoy abierto a nuevas propuestas y colaboraciones. Si crees que podemos crear algo interesante juntos, házmelo saber.'
            : 'Si quieres contarme algo de forma anónima o simplemente necesitas algo de mí, escríbelo aquí.'}
        </p>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-white text-lg font-medium mb-2">Mensaje enviado</div>
            <p className="text-neutral-500 text-sm">Gracias por escribir.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'email' && (
              <>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={inputClass}
                  required
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
                <input
                  type="text"
                  placeholder="Asunto"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className={inputClass}
                  required
                />
              </>
            )}

            <textarea
              placeholder={type === 'email' ? 'Tu mensaje...' : 'Escribe aquí...'}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              required
            />

            {status === 'error' && (
              <p className="text-red-400 text-xs">Algo salió mal. Inténtalo de nuevo.</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white text-black py-3 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-40"
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
