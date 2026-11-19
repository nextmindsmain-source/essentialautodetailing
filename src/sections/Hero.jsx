import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import SplitText from '../components/reactbits/SplitText.jsx'
import Magnet from '../components/reactbits/Magnet.jsx'
import { BIZ } from '../data.js'

const VIDEO = '/hero.mp4'
const POSTER = '/hero-poster.jpg'

// trapezoid: 0 -> 1 between a..b, hold to c, 1 -> 0 between c..d
const beat = (p, a, b, c, d) => (p < a ? 0 : p < b ? (p - a) / (b - a) : p < c ? 1 : p < d ? 1 - (p - c) / (d - c) : 0)

// Where the glints twinkle on the car (vw, vh), roughly the hood, windscreen, headlight and roof line.
const GLINTS = [[47, 58], [56, 42], [66, 50], [78, 60], [61, 33]]
const SEGMENTS = [[0.02, 0.4], [0.52, 0.95]]

// A film you scroll: the video plays forward as you scroll down and backward as you scroll up.
export default function Hero() {
  const wrap = useRef()
  const vid = useRef()
  const bar = useRef()
  const A = useRef()
  const B = useRef()
  const C = useRef()
  const shine = useRef()
  const glints = useRef([])
  const canScrub = useRef(typeof window !== 'undefined' && window.innerWidth >= 900 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canScrub) return
    let alive = true
    let url
    let raf
    fetch(VIDEO)
      .then((r) => r.blob())
      .then((b) => {
        if (!alive) return
        url = URL.createObjectURL(b)
        const v = vid.current
        v.src = url
        v.onloadedmetadata = () => {
          setReady(true)
          let cur = 0
          let seeking = false
          let last = -1
          let lp = -1
          v.addEventListener('seeked', () => (seeking = false))
          const loop = () => {
            const r = wrap.current.getBoundingClientRect()
            const max = r.height - window.innerHeight
            const p = Math.min(1, Math.max(0, -r.top / max))
            cur += (p * (v.duration - 0.05) - cur) * 0.14
            if (!seeking && Math.abs(cur - last) > 0.003) {
              seeking = true
              last = cur
              v.currentTime = cur
            }
            if (Math.abs(p - lp) > 0.0005) {
              lp = p
              const a = beat(p, -1, 0, 0.14, 0.3)
              const b = beat(p, 0.34, 0.46, 0.62, 0.74)
              const c = beat(p, 0.8, 0.9, 2, 3)
              A.current.style.cssText = `opacity:${a};transform:translateY(${(1 - a) * -40}px);pointer-events:${a > 0.5 ? 'auto' : 'none'}`
              B.current.style.cssText = `opacity:${b};transform:translateY(${(1 - b) * 50}px)`
              C.current.style.cssText = `opacity:${c};transform:translateY(${(1 - c) * 50}px);pointer-events:${c > 0.5 ? 'auto' : 'none'}`
              bar.current.style.transform = `scaleY(${p})`
            }
            raf = requestAnimationFrame(loop)
          }
          loop()
        }
      })
      .catch(() => {})
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      if (url) URL.revokeObjectURL(url)
    }
  }, [canScrub])

  // The shine. Idle: it glides across the car every few seconds. Scrolling: it follows your scroll.
  useEffect(() => {
    if (!canScrub) return
    let raf
    let lastP = -1
    let lastMove = performance.now()
    const CYCLE = 4600 // ms between idle sweeps
    const SWEEP = 2000 // ms one idle sweep takes
    const paint = (sx, op) => {
      if (!shine.current) return
      shine.current.style.opacity = op
      shine.current.style.transform = `translateX(${sx}vw) skewX(-20deg)`
      const centre = sx + 17
      glints.current.forEach((g, i) => {
        if (!g) return
        const k = op > 0 ? Math.max(0, 1 - Math.abs(centre - GLINTS[i][0]) / 10) : 0
        g.style.opacity = k
        g.style.transform = `translate(-50%, -50%) scale(${0.3 + k * 1.1}) rotate(${k * 90}deg)`
      })
    }
    const tick = (now) => {
      const r = wrap.current.getBoundingClientRect()
      const max = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / max))
      if (Math.abs(p - lastP) > 0.0004) {
        lastP = p
        lastMove = now
      }
      let sx = -100
      let op = 0
      if (now - lastMove < 600) {
        // scroll-driven
        for (const [a0, b0] of SEGMENTS) {
          if (p > a0 && p < b0) {
            const t = (p - a0) / (b0 - a0)
            sx = -40 + t * 150
            op = Math.min(1, Math.sin(Math.PI * t) * 1.8)
          }
        }
      } else if (r.bottom > window.innerHeight) {
        // idle: an automatic sweep, only while the hero is pinned on screen
        const t = ((now - lastMove) % CYCLE) / SWEEP
        if (t < 1) {
          sx = -40 + t * 150
          op = Math.min(1, Math.sin(Math.PI * t) * 1.8)
        }
      }
      paint(sx, op)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [canScrub])

  return (
    <section id="top" data-pose="0" ref={wrap} className="relative bg-[#e6e6ee]" style={{ height: canScrub ? '380vh' : '100svh' }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* full-bleed, untouched footage */}
        <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-center" style={{ opacity: ready ? 0 : 1 }} />
        <video ref={vid} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />

        {/* shine layer: only brightens the car, invisible on the white studio */}
        <div className="pointer-events-none absolute inset-0 z-[5] hidden md:block" style={{ WebkitMaskImage: 'radial-gradient(ellipse 34% 30% at 62% 55%, #000 55%, transparent 100%)', maskImage: 'radial-gradient(ellipse 34% 30% at 62% 55%, #000 55%, transparent 100%)' }}>
          <div ref={shine} className="absolute inset-y-0 left-0" style={{ width: '34vw', opacity: 0, mixBlendMode: 'screen', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 30%, rgba(255,255,255,.9) 50%, rgba(255,255,255,.18) 70%, transparent 100%)' }} />
        </div>
        {GLINTS.map(([x, y], i) => (
          <svg key={i} ref={(el) => (glints.current[i] = el)} className="pointer-events-none absolute z-[6] hidden md:block" style={{ left: x + 'vw', top: y + 'vh', width: 46, height: 46, opacity: 0, filter: 'drop-shadow(0 0 8px rgba(255,255,255,.95))' }} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        ))}

        {/* beat 1: the promise */}
        <div ref={A} className="absolute inset-0 z-10 flex items-start px-6 pt-28 md:pt-[17vh]">
          <div className="wrap">
            <div className="max-w-xl md:max-w-[26rem]">
              <p className="label mb-6">Mobile detailing · Welland &amp; Niagara</p>
              <h1 className="display text-[clamp(2.5rem,4.6vw,4.2rem)]">
                <SplitText text="Shine on" tag="span" textAlign="left" splitType="chars" effect="flip" delay={35} trigger="load" rootMargin="0px" className="block" />
                <span className="block text-ead-red">
                  <SplitText text="every mile." tag="span" textAlign="left" splitType="chars" effect="flip" delay={35} trigger="load" rootMargin="0px" />
                </span>
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnet padding={70} magnetStrength={3}>
                  <a href={BIZ.book} className="btn-red">Book online now <ArrowRight className="h-4 w-4" /></a>
                </Magnet>
                <a href={`tel:${BIZ.tel}`} className="btn-ghost"><Phone className="h-4 w-4" />{BIZ.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* beat 2: how it works, in one line */}
        <div ref={B} className="absolute left-0 top-[17vh] z-10 px-6 opacity-0 hidden md:block">
          <div className="wrap" style={{ paddingLeft: 'max(0px, calc((100vw - 78rem) / 2))' }}>
            <p className="label mb-4">01 · We come to you</p>
            <p className="display text-[clamp(2rem,4vw,3.6rem)] max-w-xl">We come to your driveway.</p>
          </div>
        </div>

        {/* beat 3: the invitation */}
        <div ref={C} className="absolute left-0 top-[17vh] z-10 px-6 opacity-0 hidden md:block">
          <div className="wrap" style={{ paddingLeft: 'max(0px, calc((100vw - 78rem) / 2))' }}>
            <p className="label mb-4">02 · Drive away shining</p>
            <p className="display text-[clamp(2rem,4vw,3.6rem)] max-w-xl mb-8">Book your detail today.</p>
            <a href={BIZ.book} className="btn-red">Book online now <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>

        {/* progress line */}
        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 h-40 w-[2px] bg-ink/10 z-10">
          <div ref={bar} className="h-full w-full bg-ead-red origin-top" style={{ transform: 'scaleY(0)' }} />
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 label opacity-70 hidden md:block z-10">Scroll</div>
      </div>
    </section>
  )
}
