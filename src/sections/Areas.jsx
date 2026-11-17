import { ArrowUpRight } from 'lucide-react'
import { AREAS } from '../data.js'

// Big type list: the name slides, the arrow arrives.
export default function Areas() {
  return (
    <section id="areas" className="section bg-white">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="label eyebrow-gap">Service areas</p>
            <h2 className="display text-[clamp(2rem,4.2vw,3.4rem)]">We come to you across Niagara.</h2>
          </div>
          <p className="text-mute max-w-xs">Not sure we cover your street? Send a message and we will tell you.</p>
        </div>
        <ul className="border-t border-ink/10">
          {AREAS.map((a, i) => (
            <li key={a} data-reveal="up" data-cursor className="group flex items-center justify-between gap-6 border-b border-ink/10 py-5 md:py-7 transition-colors hover:bg-canvas px-2 md:px-4">
              <span className="label !text-mute w-10">0{i + 1}</span>
              <span className="display flex-1 text-[clamp(1.6rem,4.6vw,3.8rem)] transition-transform duration-500 group-hover:translate-x-4 group-hover:text-ead-red">{a}</span>
              <ArrowUpRight className="h-8 w-8 text-ead-red opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
