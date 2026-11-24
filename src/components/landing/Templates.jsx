import { ArrowUpRight } from 'lucide-react'

const templates = [
  { name: 'Editorial', kind: 'For the storytellers', color: 'editorial', initials: 'STUDIO', title: 'Stories worth\nstaying for.', foot: 'WORDS THAT MAKE YOU FEEL.' },
  { name: 'Studio', kind: 'For visual creators', color: 'studio', initials: 'MIRA KIM', title: 'Color outside\nthe ordinary.', foot: 'ART DIRECTION · 2026' },
  { name: 'Minimal', kind: 'For the big-picture people', color: 'minimal', initials: 'NORTH®', title: 'Clear thinking.\nGood work.', foot: 'INDEPENDENT CREATIVE STUDIO' },
  { name: 'Developer', kind: 'For builders and engineers', color: 'developer', initials: 'DEV / 01', title: 'Built with care.\nMade to work.', foot: 'CODE · SYSTEMS · PRODUCTS' },
  { name: 'Creative', kind: 'For bold ideas', color: 'creative', initials: 'COLOR CLUB', title: 'Make room\nfor the unusual.', foot: 'INDEPENDENT CREATIVE' },
  { name: 'Dark', kind: 'For a modern, focused look', color: 'dark', initials: 'AFTER HOURS', title: 'A little less\nordinary.', foot: 'DESIGN · DIGITAL · CULTURE' },
]

export default function Templates() {
  return <section className="section templates-section" id="templates"><div className="section-heading"><div><div className="eyebrow">A GOOD PLACE TO START</div><h2>A look that feels<br /><span>like you.</span></h2></div><a href="/register" className="text-link">See all templates <ArrowUpRight size={16} /></a></div><div className="template-grid">{templates.map(item => <a href="/register" className="template-card" key={item.name}><div className={`template-preview ${item.color}`}><div className="template-top"><b>{item.initials}</b><span>WORK&nbsp;&nbsp;&nbsp; ABOUT&nbsp;&nbsp;&nbsp; CONTACT</span></div><div className="template-title">{item.title.split('\n').map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</div><div className="template-decoration" /><div className="template-foot">{item.foot}</div></div><div className="template-meta"><span><b>{item.name}</b><small>{item.kind}</small></span><span className="template-arrow"><ArrowUpRight size={17} /></span></div></a>)}</div></section>
}
