import { useEffect, useState } from 'react'
import { Phone, Menu, X } from 'lucide-react'
import Magnet from '../components/reactbits/Magnet.jsx'
import { NAV, BIZ } from '../data.js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${open ? 'bg-white' : scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(11,14,36,.06)]' : 'bg-white/35 backdrop-blur-md'}`}>
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
        <a href="#top" aria-label="Essential Auto Detailing home">
          <img src="/ead-logo.svg" alt="Essential Auto Detailing" className="h-10 md:h-12 w-auto" />
        </a>
        <nav className="hidden lg:flex items-center gap-8 glass px-8 py-3 text-sm font-semibold text-ink/80">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-ead-blue transition-colors">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href={`tel:${BIZ.tel}`} className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-ink/80 hover:text-ead-blue">
            <Phone className="h-4 w-4" /> {BIZ.phone}
          </a>
          <Magnet padding={60} magnetStrength={3}>
            <a href={BIZ.book} className="btn-red text-sm !py-3 !px-5">Book now</a>
          </Magnet>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white border border-ink/10 text-ink">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="lg:hidden border-t border-ink/10 bg-white px-5 pb-6 pt-2 shadow-[0_30px_40px_-25px_rgba(11,14,36,.35)]">
          {NAV.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-ink/5 py-3.5 text-lg font-bold text-ink">
              {l} <span className="text-ead-red">→</span>
            </a>
          ))}
          <a href={`tel:${BIZ.tel}`} className="mt-5 inline-flex items-center gap-2 font-bold text-ink">
            <Phone className="h-5 w-5 text-ead-red" /> {BIZ.phone}
          </a>
        </nav>
      )}
    </header>
  )
}
