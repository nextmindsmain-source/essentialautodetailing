import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import Magnet from '../components/reactbits/Magnet.jsx'
import { NAV, BIZ } from '../data.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(11,14,36,.06)]' : ''}`}>
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
        <a href="#top" aria-label="Essential Auto Detailing home">
          <img src="/ead-logo.svg" alt="Essential Auto Detailing" className="h-10 md:h-12 w-auto" />
        </a>
        <nav className="hidden lg:flex items-center gap-8 glass px-8 py-3 text-sm font-semibold text-ink/80">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-ead-blue transition-colors">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`tel:${BIZ.tel}`} className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-ink/80 hover:text-ead-blue">
            <Phone className="h-4 w-4" /> {BIZ.phone}
          </a>
          <Magnet padding={60} magnetStrength={3}>
            <a href={BIZ.book} className="btn-red text-sm !py-3 !px-5">Book now</a>
          </Magnet>
        </div>
      </div>
    </header>
  )
}
