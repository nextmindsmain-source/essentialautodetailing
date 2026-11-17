import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// A soft ring that follows the mouse and grows over anything clickable.
export default function Cursor() {
  const ring = useRef()
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ring.current
    el.style.opacity = '1'
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e) => {
      x(e.clientX)
      y(e.clientY)
      const hot = e.target.closest && e.target.closest('a, button, input, select, textarea, [data-cursor]')
      el.dataset.hot = hot ? '1' : '0'
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <div ref={ring} className="cursor-ring" aria-hidden="true" style={{ opacity: 0 }} />
}
