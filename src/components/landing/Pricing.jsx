import { ArrowRight, Check } from 'lucide-react'

const features = [
  'Unlimited portfolio creation',
  'Every portfolio template',
  'Portfolio customization',
  'Profile and project image uploads',
  'Public portfolio links',
  'Portfolio analytics',
  'Portfolio editing and publishing',
]

export default function Pricing() {
  return <section className="section pricing-section" id="pricing">
    <div className="pricing-heading"><div className="eyebrow">EVERYTHING INCLUDED</div><h2>Free, <span>forever.</span></h2><p>Build, publish, and grow your portfolio. No payment required.</p></div>
    <div className="pricing-grid free-plan-grid"><article className="price-card price-card-featured">
      <div className="plan-name">Portify</div><div className="plan-price">$0<small>forever</small></div><p className="plan-description">A complete portfolio builder, open to everyone.</p>
      <a href="/register" className="button button-dark">Start building <ArrowRight size={15} /></a>
      <div className="plan-divider" /><div className="includes-label">EVERYTHING IS INCLUDED</div>
      <ul>{features.map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
    </article></div>
  </section>
}
