import { Aperture, Layers3, MousePointer2, WandSparkles } from 'lucide-react'

const features = [
  { icon: WandSparkles, title: 'Looks like you', text: 'Start with a thoughtfully designed template, then make every detail your own.' },
  { icon: Layers3, title: 'All your work, one place', text: 'Projects, case studies, and the little details that make your work matter.' },
  { icon: MousePointer2, title: 'Easy to make, easy to share', text: 'No code, no fuss. Publish a polished portfolio and share it anywhere.' },
  { icon: Aperture, title: 'Ready for what’s next', text: 'A custom domain and a great experience on every screen come standard.' },
]

export default function Features() {
  return <section className="section features-section" id="features"><div className="section-heading"><div><div className="eyebrow">THE PORTIFY DIFFERENCE</div><h2>Good work deserves<br />a <span>great home.</span></h2></div><p>Everything you need to show the world what you do best, without getting in your own way.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, text }, index) => <article className="feature-card" key={title}><div className={`feature-icon feature-icon-${index}`}><Icon size={21} strokeWidth={1.8} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
}
