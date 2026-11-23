import { useState } from 'react'
import { ArrowLeft, Eye, Plus, Save, Trash2 } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import PortfolioTemplate from '../components/portfolio/PortfolioTemplate'
import { useAuth } from '../context/useAuth'
import { usePortfolios } from '../hooks/usePortfolios'
import { templates } from '../data/templates'

const emptyForm = {
  title: '', role: '', name: '', email: '', location: '', website: '', bio: '',
  projects: [], experience: [],
}

export default function PortfolioEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { portfolios, loading, error, editPortfolio } = usePortfolios()
  const portfolio = portfolios.find(item => item.id === id)

  if (authLoading) return <div className="auth-loading">Getting your workspace ready…</div>
  if (!user) return <Navigate to="/login" replace />
  if (loading) return <div className="auth-loading">Loading portfolio editor…</div>
  if (!portfolio) return <div className="editor-not-found"><h1>Portfolio not found</h1><p>{error || 'It may have been deleted or belong to another account.'}</p><Link className="button button-dark" to="/dashboard">Back to dashboard</Link></div>

  return <PortfolioEditorForm key={portfolio.id} portfolio={portfolio} error={error} onBack={() => navigate('/dashboard')} savePortfolio={editPortfolio} />
}

function PortfolioEditorForm({ portfolio, error, onBack, savePortfolio }) {
  const content = portfolio.content || {}
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...content,
    title: portfolio.title || '',
    projects: Array.isArray(content.projects) ? content.projects : [],
    experience: Array.isArray(content.experience) ? content.experience : [],
  }))
  const [skillsText, setSkillsText] = useState(() => Array.isArray(content.skills) ? content.skills.join(', ') : '')
  const [selectedTemplate, setSelectedTemplate] = useState(portfolio.template_id || 'minimal')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function updateField(field, value) {
    setForm(current => ({ ...current, [field]: value }))
    setMessage('')
  }

  function updateListItem(listName, index, field, value) {
    setForm(current => ({
      ...current,
      [listName]: current[listName].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    }))
    setMessage('')
  }

  function addProject() {
    setForm(current => ({ ...current, projects: [...current.projects, { title: '', description: '', link: '' }] }))
  }

  function addExperience() {
    setForm(current => ({ ...current, experience: [...current.experience, { position: '', company: '', duration: '', description: '' }] }))
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      setMessage('Please enter a portfolio title.')
      return
    }
    setSaving(true)
    setMessage('')
    const content = {
      name: form.name.trim(),
      role: form.role.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      website: form.website.trim(),
      bio: form.bio,
      skills: skillsText.split(',').map(skill => skill.trim()).filter(Boolean),
      projects: form.projects,
      experience: form.experience,
    }
    try {
      await savePortfolio(portfolio.id, { title: form.title.trim(), template_id: selectedTemplate, content })
      setMessage('Portfolio saved successfully.')
    } catch (err) {
      setMessage(err.message || 'Failed to save portfolio.')
    } finally {
      setSaving(false)
    }
  }

  const skills = skillsText.split(',').map(skill => skill.trim()).filter(Boolean)

  return <div className="dashboard-layout editor-layout">
    <Sidebar />
    <div className="dashboard-content">
      <Header title="Portfolio editor" />
      <main className="dashboard-main editor-main">
        <button type="button" className="editor-back" onClick={onBack}><ArrowLeft size={15} /> Back to dashboard</button>
        <div className="editor-page-heading"><div><div className="eyebrow">MAKE THIS SPACE YOURS</div><h2>Edit your portfolio</h2><p>Update your details and see the preview change as you work.</p></div><button form="portfolio-editor-form" type="submit" className="button button-dark editor-save" disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save changes'}</button></div>
        {message && <div className={`editor-message ${message.includes('successfully') ? 'editor-message-success' : 'editor-message-error'}`} role="status">{message}</div>}
        {error && <div className="dashboard-error" role="alert">{error}</div>}

        <form id="portfolio-editor-form" onSubmit={handleSave}>
          <div className="editor-columns">
            <div className="editor-fields">
              <section className="editor-panel">
                <div className="editor-panel-heading"><div><span className="editor-step">00</span><div><h3>Choose a template</h3><p>Pick a design for your portfolio preview.</p></div></div></div>
                <div className="template-choice-grid">{templates.map(template => <button type="button" key={template.id} onClick={() => { setSelectedTemplate(template.id); setMessage('') }} className={`template-choice ${selectedTemplate === template.id ? 'template-choice-selected' : ''}`} aria-pressed={selectedTemplate === template.id}><div className={`template-choice-art template-choice-${template.id}`}><span /><i /><b /></div><strong>{template.name}</strong><small>{template.category}</small><p>{template.description}</p>{selectedTemplate === template.id && <em>Selected</em>}</button>)}</div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel-heading"><div><span className="editor-step">01</span><div><h3>Personal information</h3><p>Introduce yourself in your own words.</p></div></div></div>
                <div className="editor-field-grid">
                  <Field label="Portfolio title" wide><input className="editor-input" required value={form.title} onChange={event => updateField('title', event.target.value)} placeholder="My portfolio" /></Field>
                  <Field label="Your name"><input className="editor-input" value={form.name} onChange={event => updateField('name', event.target.value)} placeholder="Your name" /></Field>
                  <Field label="Professional role"><input className="editor-input" value={form.role} onChange={event => updateField('role', event.target.value)} placeholder="Product designer" /></Field>
                  <Field label="Email"><input type="email" className="editor-input" value={form.email} onChange={event => updateField('email', event.target.value)} placeholder="you@example.com" /></Field>
                  <Field label="Location"><input className="editor-input" value={form.location} onChange={event => updateField('location', event.target.value)} placeholder="Phnom Penh, Cambodia" /></Field>
                  <Field label="Website" wide><input type="url" className="editor-input" value={form.website} onChange={event => updateField('website', event.target.value)} placeholder="https://yourwebsite.com" /></Field>
                  <Field label="About me" wide><textarea className="editor-input" rows={4} value={form.bio} onChange={event => updateField('bio', event.target.value)} placeholder="A short introduction about you and your work…" /></Field>
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel-heading"><div><span className="editor-step">02</span><div><h3>Skills</h3><p>Separate each skill with a comma.</p></div></div></div>
                <Field label="Your skills"><input className="editor-input" value={skillsText} onChange={event => { setSkillsText(event.target.value); setMessage('') }} placeholder="React, JavaScript, Figma" /></Field>
                {skills.length > 0 && <div className="editor-skill-chips">{skills.map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}</div>}
              </section>

              <section className="editor-panel">
                <div className="editor-panel-heading editor-panel-heading-action"><div><span className="editor-step">03</span><div><h3>Projects</h3><p>Show a few examples of your work.</p></div></div><button type="button" className="editor-add-button" onClick={addProject}><Plus size={15} /> Add project</button></div>
                {form.projects.map((project, index) => <div className="editor-list-card" key={`project-${index}`}><div className="editor-list-card-title"><strong>Project {index + 1}</strong><button type="button" aria-label={`Remove project ${index + 1}`} onClick={() => updateField('projects', form.projects.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button></div><Field label="Project name"><input className="editor-input" value={project.title || ''} onChange={event => updateListItem('projects', index, 'title', event.target.value)} placeholder="Project title" /></Field><Field label="Description"><textarea className="editor-input" rows={2} value={project.description || ''} onChange={event => updateListItem('projects', index, 'description', event.target.value)} placeholder="What did you make?" /></Field><Field label="Project link"><input type="url" className="editor-input" value={project.link || ''} onChange={event => updateListItem('projects', index, 'link', event.target.value)} placeholder="https://" /></Field></div>)}
                {form.projects.length === 0 && <p className="editor-empty-list">No projects added yet.</p>}
              </section>

              <section className="editor-panel">
                <div className="editor-panel-heading editor-panel-heading-action"><div><span className="editor-step">04</span><div><h3>Experience</h3><p>Add roles and experience you want to highlight.</p></div></div><button type="button" className="editor-add-button" onClick={addExperience}><Plus size={15} /> Add experience</button></div>
                {form.experience.map((item, index) => <div className="editor-list-card" key={`experience-${index}`}><div className="editor-list-card-title"><strong>Experience {index + 1}</strong><button type="button" aria-label={`Remove experience ${index + 1}`} onClick={() => updateField('experience', form.experience.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button></div><Field label="Position"><input className="editor-input" value={item.position || ''} onChange={event => updateListItem('experience', index, 'position', event.target.value)} placeholder="Job title" /></Field><Field label="Company"><input className="editor-input" value={item.company || ''} onChange={event => updateListItem('experience', index, 'company', event.target.value)} placeholder="Company" /></Field><Field label="Duration"><input className="editor-input" value={item.duration || ''} onChange={event => updateListItem('experience', index, 'duration', event.target.value)} placeholder="2023 – Present" /></Field><Field label="Description"><textarea className="editor-input" rows={2} value={item.description || ''} onChange={event => updateListItem('experience', index, 'description', event.target.value)} placeholder="What did you work on?" /></Field></div>)}
                {form.experience.length === 0 && <p className="editor-empty-list">No experience added yet.</p>}
              </section>
            </div>

            <aside className="editor-preview-panel">
              <div className="preview-heading"><div><span><Eye size={15} /></span><div><h3>Live preview</h3><p>Changes appear as you type.</p></div></div><span className="preview-badge">{selectedTemplate} template</span></div>
              <div className="portfolio-template-frame"><PortfolioTemplate templateId={selectedTemplate} portfolio={{ ...portfolio, title: form.title, content: { ...form, skills } }} /></div>
            </aside>
          </div>
          <div className="editor-bottom-save"><span>Remember to save your changes.</span><button type="submit" className="button button-dark" disabled={saving}><Save size={15} />{saving ? 'Saving…' : 'Save changes'}</button></div>
        </form>
      </main>
    </div>
  </div>
}

function Field({ label, wide = false, children }) {
  return <label className={`editor-field ${wide ? 'editor-field-wide' : ''}`}><span>{label}</span>{children}</label>
}
