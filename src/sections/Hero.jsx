import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import SplitText from '../components/reactbits/SplitText.jsx'
import Magnet from '../components/reactbits/Magnet.jsx'
import { BIZ } from '../data.js'

const VIDEO = '/hero.mp4'
const POSTER = '/hero-poster.jpg'

// trapezoid: 0 -> 1 between a..b, hold to c, 1 -> 0 between c..d
const beat = (p, a, b, c, d) => (p < a ? 0 : p < b ? (p - a) / (b - a) : p < c ? 1 : p < d ? 1 - (p - c) / (d - c) : 0)

// A film you scroll: the video plays forward as you scroll down and backward as you scroll up.
export default function Hero() {
  const wrap = useRef()
  const vid = useRef()
  const bar = useRef()
  const A = useRef()
  const B = useRef()
  const C = useRef()
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

  return (
    <section id="top" data-pose="0" ref={wrap} className="relative bg-[#e6e6ee]" style={{ height: canScrub ? '380vh' : '100svh' }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* full-bleed, untouched footage */}
        <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-center" style={{ opacity: ready ? 0 : 1 }} />
        <video ref={vid} muted playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />

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
