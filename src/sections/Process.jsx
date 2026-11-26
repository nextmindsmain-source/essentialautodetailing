import { CalendarCheck, Truck, ShieldCheck } from 'lucide-react'
import { STEPS } from '../data.js'
import SplitText from '../components/reactbits/SplitText.jsx'

const ICONS = [CalendarCheck, Truck, ShieldCheck]

export default function Process() {
  return (
    <section id="process" className="section bg-white overflow-clip">
      <div className="blob bg-ead-sky/25 h-96 w-96 -right-20 top-10" data-parallax="0.3" />
      <div className="wrap grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <p className="label eyebrow-gap">Clear scheduling &amp; communication</p>
          <h2 className="display text-[clamp(2.2rem,4.6vw,3.8rem)]">
            <SplitText text="Three steps. Zero hassle." tag="span" textAlign="left" splitType="words" effect="rise" delay={60} />
          </h2>
          <p className="mt-6 text-mute text-lg max-w-sm">You always know what is happening and when. No guessing, no surprises.</p>
        </div>
        <ol className="divide-y divide-ink/10 border-y border-ink/10">
          {STEPS.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <li key={s.n} data-reveal="up" data-cursor className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 py-9 md:py-11">
                <span className="numeral text-[5.5rem] md:text-[8rem] group-hover:[-webkit-text-stroke-color:#e72629] transition-all duration-500">{s.n}</span>
                <div>
                  <h3 className="display text-2xl md:text-3xl mb-2">{s.t}</h3>
                  <p className="text-mute leading-relaxed max-w-md">{s.d}</p>
                </div>
                <span className="icon-chip !h-14 !w-14 max-sm:!hidden"><Icon className="h-6 w-6" /></span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
