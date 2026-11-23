import { ArrowDown, ArrowRight, Check, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> YOUR WORK, BEAUTIFULLY YOURS</div>
        <h1>Your next opportunity<br />starts with <span>your story.</span></h1>
        <p className="hero-lede">A portfolio that feels like you. Bring your best work together and make the kind of first impression that opens doors.</p>
        <div className="hero-actions"><a className="button button-dark" href="#pricing">Build your portfolio <ArrowRight size={17} /></a><a className="text-link" href="#templates">Explore templates <ArrowDown size={15} /></a></div>
        <div className="social-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>K</span></div><div><strong>Loved by 12,000+ creatives</strong><small>Designers, makers, and dreamers</small></div></div>
      </div>
      <div className="hero-visual" aria-label="Example creative portfolio preview">
        <div className="visual-sparkle"><Sparkles size={17} /></div>
        <div className="portfolio-window">
          <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>alexmorgan.design</span><span className="window-menu">•••</span></div>
          <div className="portfolio-page">
            <div className="portfolio-nav"><b>AM<span>.</span></b><span>Work&nbsp;&nbsp;&nbsp; About&nbsp;&nbsp;&nbsp; Contact</span><span className="portfolio-availability"><i /> Available for work</span></div>
            <div className="portfolio-intro"><div className="mini-label">INDEPENDENT DESIGNER · BROOKLYN, NY</div><h2>Making digital<br />feel a little more <em>human.</em></h2><p>Brand and product design for people building a better internet.</p></div>
            <div className="portfolio-art"><div className="art-sun" /><div className="art-shape art-shape-one" /><div className="art-shape art-shape-two" /><div className="art-type">A softer<br />kind of<br /><strong>bold.</strong></div><span className="art-caption">FIELD NOTES — 2025</span></div>
            <div className="portfolio-footer"><span>SELECTED WORK</span><span>01 — 04&nbsp;&nbsp; ↗</span></div>
          </div>
        </div>
        <div className="floating-card"><span className="floating-icon"><Check size={16} /></span><span><b>Looking sharp!</b><small>Your site is live</small></span><span className="live-dot" /></div>
        <div className="hero-note">DESIGNED TO GET YOU NOTICED <span>✳</span></div>
      </div>
    </section>
  )
}
