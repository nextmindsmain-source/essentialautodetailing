import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, CalendarClock, Droplets, Gem, Wind, Bike, ArrowUpRight } from 'lucide-react'
import SplitText from '../components/reactbits/SplitText.jsx'
import { SERVICES, BIZ } from '../data.js'

gsap.registerPlugin(ScrollTrigger)
const ICONS = [Sparkles, CalendarClock, Droplets, Gem, Wind, Bike]

// Desktop: the section pins and the photos glide sideways as you scroll down.
// Phone: a swipeable row.
export default function Services() {
  const sec = useRef()
  const track = useRef()

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth + 96)
      gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: sec.current, pin: true, scrub: 0.8, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true },
      })
      // each photo drifts slightly against the motion for depth
      gsap.utils.toArray('.svc-img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: sec.current, start: 'top top', end: () => '+=' + dist(), scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="services" ref={sec} className="relative bg-canvas md:h-svh md:flex md:flex-col overflow-hidden py-20 md:pt-28 md:pb-14">
      <div className="wrap px-6 flex items-end justify-between gap-8 mb-10 md:mb-20 shrink-0">
        <div>
          <p className="label eyebrow-gap">What we do</p>
          <h2 className="display text-[clamp(2rem,4vw,3.4rem)] !leading-[1.15] pb-1">
            <SplitText text="Detailing, done properly." tag="span" textAlign="left" splitType="words" effect="blur" delay={60} />
          </h2>
        </div>
        <p className="hidden md:block label opacity-70">Keep scrolling →</p>
      </div>

      <div className="hscroll-wrap md:flex-1 md:min-h-0">
        <div ref={track} className="hscroll md:h-full px-6 md:pl-[max(1.5rem,calc((100vw-78rem)/2+1.5rem))] md:pr-24">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <article key={s.n} data-cursor className="group relative shrink-0 w-[78vw] sm:w-[52vw] md:w-[27rem] h-[30rem] md:h-full md:max-h-[36rem] rounded-[1.75rem] overflow-hidden bg-white shadow-[0_30px_70px_-35px_rgba(61,65,154,.5)]">
                <img className="svc-img absolute inset-0 h-full w-[116%] max-w-none object-cover transition-transform duration-700 group-hover:scale-105" src={`/img/svc-${i}.jpg`} alt={s.t} loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-transparent opacity-90" />
                <span className="absolute left-5 top-5 label !text-white drop-shadow">{s.n}</span>
                <span className="icon-chip absolute right-5 top-5 !bg-white/90"><Icon className="h-6 w-6" /></span>
                <div className="absolute inset-x-4 bottom-4 glass !bg-white/90 p-6">
                  <h3 className="display text-xl mb-2">{s.t}</h3>
                  <p className="text-mute text-[.95rem] leading-snug">{s.d}</p>
                </div>
              </article>
            )
          })}
          <a href={BIZ.book} data-cursor className="shrink-0 w-[70vw] sm:w-[40vw] md:w-[20rem] h-[30rem] md:h-full md:max-h-[36rem] rounded-[1.75rem] bg-ead-red text-white p-8 flex flex-col justify-between">
            <ArrowUpRight className="h-12 w-12" />
            <div>
              <p className="display text-3xl mb-3">Book your detail</p>
              <p className="text-white/80">Pick a package and a time. We come to you.</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
