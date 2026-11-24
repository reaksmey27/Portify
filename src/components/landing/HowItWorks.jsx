import { ArrowRight, Check, Image, Type } from 'lucide-react'
import StartBuildingLink from '../auth/StartBuildingLink'

const steps = [{ number: '01', title: 'Pick your starting point', text: 'Choose a design that gives your work room to shine.', icon: 'template' }, { number: '02', title: 'Make it yours', text: 'Add your projects, your words, and all the details that feel like you.', icon: 'edit' }, { number: '03', title: 'Put yourself out there', text: 'Publish in a click and share your new favorite link with the world.', icon: 'launch' }]

export default function HowItWorks() {
  return <section className="section how-section" id="how-it-works"><div className="how-intro"><div className="eyebrow">THREE LITTLE STEPS</div><h2>From “someday”<br />to <span>“send the link.”</span></h2><p>Getting your portfolio out into the world can be the easy part.</p><StartBuildingLink className="button button-dark">Make yours <ArrowRight size={16} /></StartBuildingLink></div><div className="steps-list">{steps.map((step, index) => <article className="step-row" key={step.number}><div className="step-number">{step.number}</div><div className="step-content"><h3>{step.title}</h3><p>{step.text}</p></div><div className={`step-illustration step-illustration-${index}`}>{step.icon === 'template' ? <div className="mini-templates"><i /><i /><i /></div> : step.icon === 'edit' ? <div className="mini-editor"><Type size={16} /><span /><span /><Image size={17} /></div> : <div className="mini-published"><span><Check size={16} /></span> Your site is live</div>}</div></article>)}</div></section>
}
