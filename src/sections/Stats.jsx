import { Award, Star, MessageSquareHeart, MapPin, Sparkles } from 'lucide-react'
import CountUp from '../components/reactbits/CountUp.jsx'
import { TICKER } from '../data.js'

const STATS = [
  { to: 10, suffix: '+', l: 'Years detailing', Icon: Award },
  { to: 5, suffix: '.0', l: 'Star rating', Icon: Star },
  { to: 15, suffix: '', l: 'Five-star reviews', Icon: MessageSquareHeart },
  { to: 5, suffix: '', l: 'Niagara cities served', Icon: MapPin },
]

export default function Stats() {
  const loop = [...TICKER, ...TICKER]
  return (
    <section className="relative bg-canvas">
      {/* marquee sits directly under the hero */}
      <div className="overflow-hidden border-y border-ink/10 bg-white py-5" aria-hidden>
        <div className="marquee">
          {loop.map((t, i) => (
            <span key={i} className="flex items-center gap-5 pr-10 display text-lg md:text-xl whitespace-nowrap text-ink/75">
              {t}
              <Sparkles className="h-5 w-5 text-ead-red" strokeWidth={2.2} />
            </span>
          ))}
        </div>
      </div>

      {/* room for four boxes */}
      <div className="wrap px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ to, suffix, l, Icon }) => (
            <div key={l} data-reveal className="glass p-8 group relative overflow-hidden">
              <span className="icon-chip mb-8">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <div className="display text-5xl md:text-6xl">
                <CountUp to={to} suffix={suffix} duration={2} />
              </div>
              <div className="label mt-4">{l}</div>
              <span className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-ead-red/0 transition-colors duration-500 group-hover:bg-ead-red/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
