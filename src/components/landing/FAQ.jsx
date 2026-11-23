import { useState } from 'react'
import { Plus } from 'lucide-react'

const questions = [{ question: 'Do I need to know how to code?', answer: 'Not at all. Portify is made for creatives, not developers. Pick a template, add your work, and publish when you’re ready.' }, { question: 'Is Portify really free?', answer: 'Yes. Every feature is available to every user, with no payment or subscription required.' }, { question: 'Can I change my template later?', answer: 'Absolutely. Your projects stay yours, so you can explore a new look whenever inspiration strikes.' }, { question: 'Can I create more than one portfolio?', answer: 'Yes. You can create as many portfolios as you need.' }]

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return <section className="section faq-section" id="faq"><div className="faq-heading"><div className="eyebrow">A FEW THINGS YOU MIGHT WONDER</div><h2>Good questions.<br /><span>Clear answers.</span></h2><p>Still curious? We’re a real bunch of humans at <a href="mailto:hello@portify.studio">hello@portify.studio</a>.</p></div><div className="faq-list">{questions.map((item, index) => <article className={`faq-item ${open === index ? 'faq-open' : ''}`} key={item.question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{item.question}</span><Plus size={18} /></button>{open === index && <p>{item.answer}</p>}</article>)}</div></section>
}
