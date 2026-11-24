import { ArrowUpRight } from 'lucide-react'
import StartBuildingLink from '../auth/StartBuildingLink'

export default function Footer() {
  return <footer className="site-footer" id="footer"><div className="footer-cta"><div className="eyebrow">YOUR WORK IS READY FOR THIS</div><h2>Make a little room<br />for <span>what’s next.</span></h2><StartBuildingLink className="button button-light">Build your portfolio <ArrowUpRight size={16} /></StartBuildingLink><div className="footer-sparkle">✳</div></div><div className="footer-bottom"><a className="brand footer-brand" href="#top"><span className="brand-mark">p</span>portify</a><span>Made for the work only you can do. © 2025 Portify</span><div><a href="#features">Instagram</a><a href="#features">Pinterest</a><a href="mailto:hello@portify.studio">Contact</a></div></div></footer>
}
