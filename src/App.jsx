import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './sections/Nav.jsx'
import Hero from './sections/Hero.jsx'
import Stats from './sections/Stats.jsx'
import Services from './sections/Services.jsx'
import Process from './sections/Process.jsx'
import About from './sections/About.jsx'
import Reviews from './sections/Reviews.jsx'
import Areas from './sections/Areas.jsx'
import Contact from './sections/Contact.jsx'
import Footer from './sections/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const FROM = { up: { y: 60 }, left: { x: -80 }, right: { x: 80 }, scale: { scale: 0.7 } }
      gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
        const kind = el.dataset.reveal || 'up'
        gsap.from(el, {
          ...(FROM[kind] || FROM.up),
          opacity: 0,
          duration: 1,
          delay: (i % 4) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })
      // Soft colour blobs drift at their own speed.
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: -60 * Number(el.dataset.parallax),
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    // Smooth, inertial scrolling (Lenis), kept in step with the scroll animations.
    let lenis
    let tick
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    // The pinned gallery changes page height, so measure again once everything has loaded.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 1800)
    return () => {
      ctx.revert()
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      if (tick) gsap.ticker.remove(tick)
      if (lenis) lenis.destroy()
    }
  }, [])

  return (
    <>
      <Preloader />
      <Cursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <Services />
        <Process />
        <About />
        <Reviews />
        <Areas />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
