import { Quote, Star } from 'lucide-react'
import { REVIEWS } from '../data.js'
import SplitText from '../components/reactbits/SplitText.jsx'

export default function Reviews() {
  return (
    <section id="reviews" className="section bg-ink text-white overflow-hidden">
      <div className="blob bg-ead-red/30 h-[28rem] w-[28rem] -left-24 -top-24" data-parallax="0.3" />
      <div className="blob bg-ead-blue/50 h-[30rem] w-[30rem] right-0 bottom-0" data-parallax="0.2" />
      <div className="wrap relative">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <p className="label eyebrow-gap !text-ead-sky">5.0 from 15 reviews</p>
            <h2 className="display text-[clamp(2.2rem,5vw,4.2rem)]">
              <SplitText text="Neighbours say it best." tag="span" textAlign="left" splitType="words" effect="rise" delay={80} />
            </h2>
          </div>
          <div className="flex gap-1 text-ead-red">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-7 w-7 fill-current" />)}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {REVIEWS.map((r) => (
            <figure key={r.name} data-reveal="up" className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.06] backdrop-blur p-9 md:p-11">
              <Quote className="absolute right-8 top-8 h-12 w-12 text-white/10" />
              <blockquote className="display text-[clamp(1.4rem,2.4vw,2rem)] !leading-tight mb-10">“{r.q}”</blockquote>
              <figcaption className="label !text-white/70">{r.name} · {r.place}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
