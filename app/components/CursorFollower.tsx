'use client'

import { useEffect } from 'react'

export default function CursorFollower() {
  useEffect(() => {
    // No hacer nada en dispositivos táctiles
    if (window.matchMedia('(hover: none)').matches) return

    let cx = 0, cy = 0, tx = 0, ty = 0
    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX - 4
      ty = e.clientY - 4

      const target = e.target as Element
      const isClickable = target.closest('a, button, input, textarea, .hoverable')
      const el = document.getElementById('cursor')
      if (el) {
        if (isClickable && !isHovering) {
          el.style.transform = 'scale(2)'
          isHovering = true
        } else if (!isClickable && isHovering) {
          el.style.transform = 'scale(1)'
          isHovering = false
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove)

    let rafId: number
    const loop = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      const el = document.getElementById('cursor')
      if (el) {
        el.style.left = cx + 'px'
        el.style.top = cy + 'px'
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      id="cursor"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        mixBlendMode: 'difference',
        zIndex: 9999,
        borderRadius: '50%',
        background: 'white',
        width: '8px',
        height: '8px',
        left: '-10px',
        top: '-10px',
        transition: 'transform 0.15s ease-out',
        display: typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches ? 'none' : 'block',
      }}
    />
  )
}
