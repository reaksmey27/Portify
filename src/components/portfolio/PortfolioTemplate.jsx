import { ExternalLink, Mail, MapPin } from 'lucide-react'

export default function PortfolioTemplate({ templateId = 'minimal', portfolio }) {
  const content = portfolio?.content || {}
  const data = {
    title: portfolio?.title || 'My Portfolio',
    name: content.name || 'Your Name',
    role: content.role || 'Your Professional Role',
    bio: content.bio || 'Write something about yourself.',
    email: content.email || '',
    location: content.location || '',
    website: content.website || '',
    avatar: content.avatar || '',
    github: content.github || '',
    linkedin: content.linkedin || '',
    accentColor: content.accentColor || '#7c3aed',
    skills: Array.isArray(content.skills) ? content.skills : [],
    projects: Array.isArray(content.projects) ? content.projects : [],
    experience: Array.isArray(content.experience) ? content.experience : [],
  }
  const theme = ['minimal', 'dark', 'creative'].includes(templateId) ? templateId : 'minimal'

  return <div className={`public-portfolio-template theme-${theme}`}>
    <header className="portfolio-template-header">
      <a href="#template-home" className="template-brand">{data.name}</a>
      <nav aria-label="Portfolio sections"><a href="#template-about">About</a><a href="#template-skills">Skills</a><a href="#template-projects">Projects</a><a href="#template-experience">Experience</a></nav>
      <a className="template-contact-link" href={data.email ? `mailto:${data.email}` : '#template-contact'}>Let’s talk <span>↗</span></a>
    </header>

    <div className="portfolio-template-main">
      <section id="template-home" className="template-hero">
        <div className="template-hero-kicker"><span /> PORTFOLIO / {new Date().getFullYear()}</div>
        {data.avatar && <img className="template-avatar" src={data.avatar} alt={data.name} />}
        <p className="template-role" style={{ color: data.accentColor }}>{data.role}</p>
        <h1>{theme === 'creative' ? <>Hello, I’m<br /><em>{data.name}.</em></> : <>I’m {data.name}<span className="template-period">.</span></>}</h1>
        <p className="template-bio">{data.bio}</p>
        <div className="template-hero-actions">
          {data.email && <a href={`mailto:${data.email}`} className="template-primary-action"><Mail size={15} /> Contact me</a>}
          {data.website && <a href={data.website} target="_blank" rel="noreferrer" className="template-secondary-action">Visit my website <ExternalLink size={14} /></a>}
          {data.github && <a href={data.github} target="_blank" rel="noreferrer" className="template-secondary-action">GitHub <ExternalLink size={14} /></a>}
          {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="template-secondary-action">LinkedIn <ExternalLink size={14} /></a>}
        </div>
        {data.location && <p className="template-location"><MapPin size={14} />{data.location}</p>}
        <a className="template-scroll" href="#template-about">SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section className="template-section" id="template-about"><div className="template-section-index">01 / ABOUT</div><div><h2>A little about me.</h2><p className="template-section-copy">{data.bio}</p></div></section>
      <section className="template-section" id="template-skills"><div className="template-section-index">02 / TOOLKIT</div><div><h2>Things I do well.</h2><div className="template-skill-list">{data.skills.length ? data.skills.map((skill, index) => <span key={`${skill}-${index}`} style={{ backgroundColor: `${data.accentColor}18`, color: data.accentColor }}>{skill}</span>) : <p>Add your skills in the editor to show them here.</p>}</div></div></section>
      <section className="template-section template-projects-section" id="template-projects"><div className="template-section-index">03 / SELECTED WORK</div><div><h2>Some things I’ve made.</h2><div className="template-project-grid">{data.projects.length ? data.projects.map((project, index) => <article className="template-project" key={`${project.title}-${index}`}>{project.image ? <img className="template-project-image" src={project.image} alt={project.title || 'Project'} /> : <div className="template-project-art"><span>0{index + 1}</span><i /></div>}<h3>{project.title || 'Untitled project'}</h3><p>{project.description}</p>{project.link && <a href={project.link} target="_blank" rel="noreferrer">View project <ExternalLink size={13} /></a>}</article>) : <p>Add projects in the editor to feature your work here.</p>}</div></div></section>
      <section className="template-section" id="template-experience"><div className="template-section-index">04 / EXPERIENCE</div><div><h2>Where I’ve been.</h2><div className="template-experience-list">{data.experience.length ? data.experience.map((item, index) => <article key={`${item.position}-${index}`}><div><h3>{item.position || 'Position'}</h3><p>{item.company}</p><small>{item.description}</small></div><span>{item.duration}</span></article>) : <p>Add experience in the editor to show it here.</p>}</div></div></section>
      <section className="template-contact" id="template-contact"><p>HAVE A GOOD ONE IN MIND?</p><h2>Let’s make it happen.</h2>{data.email && <a href={`mailto:${data.email}`}>{data.email} <ExternalLink size={14} /></a>}</section>
    </div>

    <footer className="portfolio-template-footer"><span>© {new Date().getFullYear()} {data.name}</span><span>MADE WITH PORTIFY <i>✳</i></span></footer>
  </div>
}
