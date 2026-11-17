import { useEffect, useRef, useState } from 'react'

// A short film-title opener: the number climbs, then the curtain lifts.
// Driven by plain timers and CSS so a busy page can never leave it stuck on screen.
export default function Preloader() {
  const num = useRef()
  const [phase, setPhase] = useState('run') // run -> lift -> gone

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const start = performance.now()
    const DURATION = 1400
    const iv = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / DURATION)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      if (num.current) num.current.textContent = String(Math.round(eased * 100)).padStart(3, '0')
      if (t >= 1) clearInterval(iv)
    }, 40)
    const lift = setTimeout(() => setPhase('lift'), DURATION + 150)
    const gone = setTimeout(() => {
      setPhase('gone')
      document.body.style.overflow = ''
    }, DURATION + 1100)
    return () => {
      clearInterval(iv)
      clearTimeout(lift)
      clearTimeout(gone)
      document.body.style.overflow = ''
    }
  }, [])

  if (phase === 'gone') return null
  return (
    <div
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
      style={{
        transform: phase === 'lift' ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform .9s cubic-bezier(.76,0,.24,1)',
      }}
    >
      <div className="flex flex-col items-center gap-8" style={{ opacity: phase === 'lift' ? 0 : 1, transition: 'opacity .3s' }}>
        <img className="h-16 w-auto" src="/ead-logo.svg" alt="Essential Auto Detailing" />
        <div className="display text-6xl text-ink tabular-nums"><span ref={num}>000</span></div>
        <div className="label">Shine on every mile</div>
      </div>
    </div>
  )
}
