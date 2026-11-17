import { useState } from 'react'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import Magnet from '../components/reactbits/Magnet.jsx'
import SplitText from '../components/reactbits/SplitText.jsx'
import RippleImage from '../components/RippleImage.jsx'
import { BIZ, SERVICES } from '../data.js'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = `Name: ${f.get('name')}\nPhone: ${f.get('phone')}\nVehicle: ${f.get('vehicle')}\nService: ${f.get('service')}\n\n${f.get('msg')}`
    // Opens the visitor's own email app, addressed to the business.
    window.location.href = `mailto:${BIZ.email}?subject=${encodeURIComponent('Detailing request')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return (
    <section id="contact" className="relative bg-canvas">
      {/* cinematic band */}
      <div className="relative h-[70vh] min-h-[28rem] overflow-hidden" data-cursor>
        <RippleImage src="/img/cta.jpg" className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/85 via-white/20 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 pointer-events-none">
          <div className="wrap">
            <p className="label eyebrow-gap">Book your detail</p>
            <h2 className="display text-[clamp(2.6rem,7vw,6rem)] max-w-3xl">
              <SplitText text="Ready for" tag="span" textAlign="left" splitType="chars" effect="flip" delay={30} className="block" />
              <span className="block text-ead-red"><SplitText text="the shine?" tag="span" textAlign="left" splitType="chars" effect="flip" delay={30} /></span>
            </h2>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="wrap grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">
          <div>
            <p className="text-lg text-mute mb-10 max-w-md">Tell us about your car and we will reply with a clear plan and time. Prefer a call? We pick up.</p>
            <ul className="space-y-5">
              <li className="flex items-center gap-4"><span className="icon-chip pulse-ring"><Phone className="h-5 w-5" /></span><a className="display text-xl hover:text-ead-red" href={`tel:${BIZ.tel}`}>{BIZ.phone}</a></li>
              <li className="flex items-center gap-4"><span className="icon-chip"><Mail className="h-5 w-5" /></span><a className="hover:text-ead-red break-all" href={`mailto:${BIZ.email}`}>{BIZ.email}</a></li>
              <li className="flex items-center gap-4"><span className="icon-chip"><MapPin className="h-5 w-5" /></span><span>{BIZ.address}</span></li>
            </ul>
          </div>
          {sent ? (
            <div className="glass p-9 self-start" role="status">
              <div className="display text-2xl mb-3">Your email app should be open.</div>
              <p className="text-mute">Press send there and your request reaches us. Prefer a call? <a className="text-ead-blue underline" href={`tel:${BIZ.tel}`}>{BIZ.phone}</a></p>
            </div>
          ) : (
            <form onSubmit={submit} className="glass p-8 md:p-10 grid gap-4 self-start">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="sr-only" htmlFor="name">Name</label>
                <input id="name" name="name" placeholder="Your name" required />
                <label className="sr-only" htmlFor="phone">Phone</label>
                <input id="phone" name="phone" placeholder="Phone" type="tel" />
              </div>
              <label className="sr-only" htmlFor="vehicle">Vehicle</label>
              <input id="vehicle" name="vehicle" placeholder="Vehicle (year, make, model)" />
              <label className="sr-only" htmlFor="service">Service</label>
              <select id="service" name="service" defaultValue={SERVICES[0].t}>
                {SERVICES.map((s) => <option key={s.n}>{s.t}</option>)}
              </select>
              <label className="sr-only" htmlFor="msg">Message</label>
              <textarea id="msg" name="msg" rows="3" placeholder="Anything we should know?" />
              <Magnet padding={60} magnetStrength={3} wrapperClassName="justify-self-start">
                <button className="btn-red" type="submit">Send request <ArrowRight className="h-4 w-4" /></button>
              </Magnet>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
