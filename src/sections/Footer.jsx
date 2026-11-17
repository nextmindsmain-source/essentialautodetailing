import { BIZ } from '../data.js'

export default function Footer() {
  return (
    <footer className="relative border-t border-ink/10 bg-white/85 backdrop-blur py-10 px-5">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-mute">
        <img src="/ead-logo.svg" alt="Essential Auto Detailing" className="h-10 w-auto" />
        <p>© {new Date().getFullYear()} {BIZ.name}. Shine on every mile.</p>
        <a className="hover:text-ead-blue" href={BIZ.site}>essentialautodetailing.ca</a>
      </div>
    </footer>
  )
}
