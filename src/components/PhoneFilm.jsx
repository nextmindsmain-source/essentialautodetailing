import { useEffect, useRef } from 'react'

// The hero film for phones. Phone browsers seek video badly, so the film is a set of frames drawn
// to a canvas: scroll down and the car drives forward, scroll up and it reverses.
const COUNT = 96
const RATIO = 1300 / 1080
const src = (i) => `/seq/f${String(i + 1).padStart(3, '0')}.webp`

export default function PhoneFilm({ progress }) {
  const ref = useRef()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const back = document.createElement('canvas') // tiny copy, stretched = soft blurred backdrop
    const fore = document.createElement('canvas') // sharp frame with a feathered top edge
    back.width = 24
    back.height = 40
    const frames = []
    let raf
    let cur = 0
    let drawn = -1
    let alive = true

    const load = (i) => {
      if (frames[i]) return
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => (drawn = -1) // redraw once something better has arrived
      img.src = src(i)
      frames[i] = img
    }
    load(0)
    // every 8th frame first so scrubbing works early, then fill the gaps
    for (let i = 0; i < COUNT; i += 8) load(i)
    const t = setTimeout(() => alive && Array.from({ length: COUNT }, (_, i) => load(i)), 400)

    const ready = (i) => frames[i] && frames[i].complete && frames[i].naturalWidth > 0
    const nearest = (i) => {
      for (let d = 0; d < COUNT; d++) {
        if (ready(i - d)) return i - d
        if (ready(i + d)) return i + d
      }
      return -1
    }

    const draw = (img) => {
      const W = canvas.width
      const H = canvas.height
      const b = back.getContext('2d')
      // only the sky and treetops, so no ghost of the car appears behind the headline
      b.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * 0.3, 0, 0, back.width, back.height)
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(back, 0, 0, W, H)

      const w = Math.round(Math.max(W * 1.1, H * 0.46 * RATIO))
      const h = Math.round(w / RATIO)
      if (fore.width !== w || fore.height !== h) {
        fore.width = w
        fore.height = h
      }
      const f = fore.getContext('2d')
      f.globalCompositeOperation = 'source-over'
      f.clearRect(0, 0, w, h)
      f.drawImage(img, 0, 0, w, h)
      f.globalCompositeOperation = 'destination-in'
      const g = f.createLinearGradient(0, 0, 0, h * 0.28)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
      f.fillStyle = g
      f.fillRect(0, 0, w, h)
      ctx.drawImage(fore, (W - w) / 2, H - h)
    }

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      drawn = -1
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(canvas)

    const loop = () => {
      cur += (progress.current * (COUNT - 1) - cur) * 0.22
      const i = nearest(Math.round(cur))
      if (i >= 0 && i !== drawn) {
        drawn = i
        draw(frames[i])
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      alive = false
      clearTimeout(t)
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [progress])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
