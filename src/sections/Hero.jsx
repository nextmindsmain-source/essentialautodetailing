import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import SplitText from '../components/reactbits/SplitText.jsx'
import Magnet from '../components/reactbits/Magnet.jsx'
import { BIZ } from '../data.js'

const VIDEO = '/hero.mp4'
const POSTER = '/hero-poster.jpg'
const POSTER_END = '/hero-end.jpg'

// Where the car sits in the frame as the film plays: [progress, centre x in vw, centre y in vh].
// The shine and glints follow it so they always land on the paint.
const CAR = [
  [0, 40, 56],
  [0.4, 46, 56],
  [0.6, 52, 57],
  [0.8, 61, 58],
  [1, 62, 57],
]
// Glints around the car centre (dx in vw, dy in vh): windscreen, bonnet, headlight, door, roofline.
const GLINTS = [[-10, -6], [2, -4], [9, 4], [-12, 6], [-4, -12]]
const SEGMENTS = [[0.04, 0.38], [0.5, 0.92]]

const lerp = (a, b, t) => a + (b - a) * t
const carAt = (p) => {
  for (let i = 0; i < CAR.length - 1; i++) {
    const [p0, x0, y0] = CAR[i]
    const [p1, x1, y1] = CAR[i + 1]
    if (p <= p1) {
      const t = (p - p0) / (p1 - p0)
      return [lerp(x0, x1, t), lerp(y0, y1, t)]
    }
  }
  return [CAR[CAR.length - 1][1], CAR[CAR.length - 1][2]]
}
// trapezoid: 0 -> 1 between a..b, hold to c, 1 -> 0 between c..d
const beat = (p, a, b, c, d) => (p < a ? 0 : p < b ? (p - a) / (b - a) : p < c ? 1 : p < d ? 1 - (p - c) / (d - c) : 0)

// A film you scroll: the car drives down the street as you scroll down, and parks at the end.
// Scroll back up and it reverses.
export default function Hero() {
  const wrap = useRef()
  const stage = useRef()
  const media = useRef()
  const vid = useRef()
  const bar = useRef()
  const A = useRef()
  const B = useRef()
  const C = useRef()
  const shineWrap = useRef()
  const shine = useRef()
  const glints = useRef([])
  const progress = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })
  const canScrub = useRef(typeof window !== 'undefined' && window.innerWidth >= 900 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const [ready, setReady] = useState(false)

  // Load the film as a blob, then scrub it from scroll.
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
          v.addEventListener('seeked', () => (seeking = false))
          const loop = () => {
            cur += (progress.current * (v.duration - 0.05) - cur) * 0.14
            if (!seeking && Math.abs(cur - last) > 0.003) {
              seeking = true
              last = cur
              v.currentTime = cur
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

  // Everything that reacts to scroll and mouse: captions, parallax, exit transition, shine.
  useEffect(() => {
    if (!canScrub) return
    let raf
    let lp = -1
    let lastMove = performance.now()
    let mx = 0
    let my = 0
    const CYCLE = 4800
    const SWEEP = 2000
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    const tick = (now) => {
      const r = wrap.current.getBoundingClientRect()
      const max = r.height - window.innerHeight
      const p = Math.min(1, Math.max(0, -r.top / max))
      progress.current = p

      // mouse parallax on the footage (eased)
      mx += (mouse.current.x - mx) * 0.06
      my += (mouse.current.y - my) * 0.06
      const zoom = 1.06
      media.current.style.transform = `translate3d(${mx * -16}px, ${my * -9}px, 0) scale(${zoom})`

      if (Math.abs(p - lp) > 0.0004) {
        lp = p
        lastMove = now
        const a = beat(p, -1, 0, 0.16, 0.3)
        const b = beat(p, 0.34, 0.46, 0.64, 0.76)
        const c = beat(p, 0.82, 0.92, 2, 3)
        A.current.style.cssText = `opacity:${a};transform:translateY(${(1 - a) * -40}px);pointer-events:${a > 0.5 ? 'auto' : 'none'}`
        B.current.style.cssText = `opacity:${b};transform:translateY(${(1 - b) * 50}px)`
        C.current.style.cssText = `opacity:${c};transform:translateY(${(1 - c) * 50}px);pointer-events:${c > 0.5 ? 'auto' : 'none'}`
        bar.current.style.transform = `scaleY(${p})`
      }

      // the shine: follows the car; plays by itself when idle, follows the scroll while scrolling
      const [cx, cy] = carAt(p)
      let t = -1
      if (now - lastMove < 600) {
        for (const [a0, b0] of SEGMENTS) if (p > a0 && p < b0) t = (p - a0) / (b0 - a0)
      } else if (r.bottom > window.innerHeight) {
        const tt = ((now - lastMove) % CYCLE) / SWEEP
        if (tt < 1) t = tt
      }
      const op = t < 0 ? 0 : Math.min(1, Math.sin(Math.PI * t) * 1.8)
      const centre = t < 0 ? -100 : cx - 24 + t * 48
      shineWrap.current.style.setProperty('--cx', cx + 'vw')
      shineWrap.current.style.setProperty('--cy', cy + 'vh')
      shine.current.style.opacity = op
      shine.current.style.transform = `translateX(${centre - 17}vw) skewX(-20deg)`
      glints.current.forEach((g, i) => {
        if (!g) return
        const k = op > 0 ? Math.max(0, 1 - Math.abs(centre - (cx + GLINTS[i][0])) / 9) : 0
        g.style.left = cx + GLINTS[i][0] + 'vw'
        g.style.top = cy + GLINTS[i][1] + 'vh'
        g.style.opacity = k
        g.style.transform = `translate(-50%, -50%) scale(${0.3 + k * 1.2}) rotate(${k * 90}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [canScrub])

  const shadow = { textShadow: '0 2px 28px rgba(0,0,0,.45), 0 1px 3px rgba(0,0,0,.35)' }

  return (
    <section id="top" ref={wrap} className="relative bg-[#0b0e24]" style={{ height: canScrub ? '420vh' : '100svh' }}>
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden">
        {/* footage, slightly oversized so the mouse parallax never shows an edge */}
        <div ref={media} className="absolute inset-0 will-change-transform">
          <img src={POSTER} alt="" className="absolute inset-0 hidden md:block h-full w-full object-cover" style={{ opacity: ready ? 0 : 1 }} />
          <img src={POSTER_END} alt="" className="absolute inset-0 md:hidden h-full w-full object-cover object-[70%_center]" />
          <video ref={vid} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        </div>

        {/* soft light grade so white text always reads, without washing the car */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0e24]/35 via-transparent to-[#0b0e24]/20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#0b0e24]/55 to-transparent md:hidden" />

        {/* shine layer: tracks the car and only brightens the paint area */}
        <div
          ref={shineWrap}
          className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
          style={{
            '--cx': '28vw',
            '--cy': '60vh',
            WebkitMaskImage: 'radial-gradient(ellipse 24vw 20vh at var(--cx) var(--cy), #000 45%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 24vw 20vh at var(--cx) var(--cy), #000 45%, transparent 100%)',
          }}
        >
          <div ref={shine} className="absolute inset-y-0 left-0" style={{ width: '34vw', opacity: 0, mixBlendMode: 'screen', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 30%, rgba(255,255,255,.9) 50%, rgba(255,255,255,.18) 70%, transparent 100%)' }} />
        </div>
        {GLINTS.map((_, i) => (
          <svg key={i} ref={(el) => (glints.current[i] = el)} className="pointer-events-none absolute z-[6] hidden md:block" style={{ left: '30vw', top: '60vh', width: 46, height: 46, opacity: 0, filter: 'drop-shadow(0 0 8px rgba(255,255,255,.95))' }} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#fff" d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
          </svg>
        ))}

        {/* beat 1: the promise (on the empty road at the right) */}
        <div ref={A} className="absolute inset-0 z-10 hidden md:flex items-start pt-[22vh] px-6">
          <div className="wrap">
            <div className="max-w-xl md:ml-auto md:max-w-[24rem] text-white" style={shadow}>
              <p className="label !text-white/85 mb-6">Mobile detailing · Welland &amp; Niagara</p>
              <h1 className="display text-[clamp(2.3rem,4.1vw,3.8rem)]">
                <SplitText text="Shine on" tag="span" textAlign="left" splitType="chars" effect="flip" delay={35} trigger="load" rootMargin="0px" className="block" />
                <span className="block text-[#ff5558]">
                  <SplitText text="every mile." tag="span" textAlign="left" splitType="chars" effect="flip" delay={35} trigger="load" rootMargin="0px" />
                </span>
              </h1>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnet padding={70} magnetStrength={3}>
                  <a href={BIZ.book} className="btn-red">Book online now <ArrowRight className="h-4 w-4" /></a>
                </Magnet>
                <a href={`tel:${BIZ.tel}`} className="btn-ghost !text-white !border-white/50 !bg-white/10 backdrop-blur"><Phone className="h-4 w-4" />{BIZ.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* beat 2 */}
        <div ref={B} className="absolute inset-x-0 top-[13vh] z-10 px-6 opacity-0 hidden md:block text-white" style={shadow}>
          <div className="wrap flex justify-end">
            <div className="max-w-sm">
              <p className="label !text-white/85 mb-4">We come to you</p>
              <p className="display text-[clamp(2rem,3.6vw,3.3rem)]">Clean, polished and on time.</p>
            </div>
          </div>
        </div>

        {/* beat 3 */}
        <div ref={C} className="absolute inset-0 z-10 px-6 opacity-0 hidden md:flex items-center text-white" style={shadow}>
          <div className="wrap">
            <div className="max-w-[24rem] text-left">
              <p className="label !text-white/85 mb-4">Parked and gleaming</p>
              <p className="display text-[clamp(2rem,4vw,3.6rem)] mb-8">Book your detail today.</p>
              <a href={BIZ.book} className="btn-red">Book online now <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        {/* progress line */}
        <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 h-40 w-[2px] bg-white/25 z-10">
          <div ref={bar} className="h-full w-full bg-ead-red origin-top" style={{ transform: 'scaleY(0)' }} />
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 label !text-white/80 opacity-80 hidden md:block z-10">Scroll</div>

        {/* phone: the still, with the headline above it */}
        <div className="md:hidden absolute inset-0 z-10 flex items-start px-6 pt-28 text-white" style={shadow}>
          <div>
            <p className="label !text-white/85 mb-4">Mobile detailing · Welland &amp; Niagara</p>
            <h1 className="display text-[2.6rem]">Shine on<br /><span className="text-[#ff5558]">every mile.</span></h1>
            <div className="mt-7 flex flex-col items-start gap-3">
              <a href={BIZ.book} className="btn-red">Book online now <ArrowRight className="h-4 w-4" /></a>
              <a href={`tel:${BIZ.tel}`} className="btn-ghost !text-white !border-white/50 !bg-white/10"><Phone className="h-4 w-4" />{BIZ.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
