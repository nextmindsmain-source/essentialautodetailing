import { ShieldCheck, Leaf } from 'lucide-react'
import SplitText from '../components/reactbits/SplitText.jsx'
import RippleImage from '../components/RippleImage.jsx'

export default function About() {
  return (
    <section id="about" className="section bg-canvas">
      <div className="wrap grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div data-reveal="left" data-cursor className="relative h-[26rem] lg:h-[40rem] rounded-[2rem] overflow-hidden shadow-[0_40px_90px_-40px_rgba(61,65,154,.55)]">
          <RippleImage src="/img/about.jpg" className="absolute inset-0" />
          <span className="max-md:!hidden absolute left-5 bottom-5 glass !bg-white/85 px-4 py-2 label">Move your mouse over the water</span>
        </div>
        <div>
          <p className="label eyebrow-gap">Driven by passion, defined by quality</p>
          <h2 className="display text-[clamp(2.1rem,4.4vw,3.6rem)] mb-8">
            <SplitText text="Meticulous car detailing, done by family." tag="span" textAlign="left" splitType="words" effect="blur" delay={60} />
          </h2>
          <div className="space-y-5 text-lg text-mute leading-relaxed max-w-xl">
            <p>Essential Auto Detailing is family-owned, with more than a decade of experience behind every job. Cory Kitchen treats every car like a VIP guest.</p>
            <p>Ontario weather is hard on paint. Regular care keeps the elements off all year, and we use eco-friendly products wherever we can.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-5 max-w-xl">
            <div data-reveal="up" className="glass p-6">
              <span className="icon-chip mb-4"><ShieldCheck className="h-6 w-6" /></span>
              <div className="display text-lg text-ead-red mb-1">Reliable Care</div>
              <p className="text-sm text-mute">Dependable service, every single session.</p>
            </div>
            <div data-reveal="up" className="glass p-6">
              <span className="icon-chip mb-4"><Leaf className="h-6 w-6" /></span>
              <div className="display text-lg text-ead-blue mb-1">Worth Protecting</div>
              <p className="text-sm text-mute">Regular cleaning guards your car against the seasons.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
