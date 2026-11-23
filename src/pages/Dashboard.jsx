import { useState } from 'react'
import { BriefcaseBusiness, FileText, Globe, Plus, Sparkles } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import PortfolioCard from '../components/dashboard/PortfolioCard'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/useAuth'
import { usePortfolios } from '../hooks/usePortfolios'
import { notify } from '../utils/notifications'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const { portfolios, loading, error, addPortfolio, removePortfolio } = usePortfolios()
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [formError, setFormError] = useState('')
  const publishedCount = portfolios.filter(portfolio => portfolio.status === 'published').length

  async function handleCreate(event) {
    event.preventDefault()
    if (!title.trim()) {
      setFormError('Please enter a portfolio name.')
      notify.error('Please enter a portfolio name.')
      return
    }
    setCreating(true)
    setFormError('')
    try {
      await addPortfolio({ title: title.trim(), category, description, templateId: 'minimal' })
      setTitle('')
      setCategory('')
      setDescription('')
      setShowModal(false)
      notify.success('Portfolio created successfully.')
    } catch (err) {
      setFormError(err.message || 'Could not create portfolio.')
      notify.error(err.message || 'Could not create portfolio.')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(portfolio) {
    if (!window.confirm(`Are you sure you want to delete “${portfolio.title}”?`)) return
    setDeletingId(portfolio.id)
    try {
      await removePortfolio(portfolio.id)
      notify.success('Portfolio deleted.')
    } catch (err) {
      notify.error(err.message || 'Could not delete portfolio.')
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading) return <div className="auth-loading">Getting your workspace ready…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header onCreate={() => { setFormError(''); setShowModal(true) }} />
        <main className="dashboard-main">
          <section className="dashboard-welcome">
            <div><div className="eyebrow">YOUR CREATIVE CORNER</div><h2>Good to see you again.</h2><p>Manage your portfolios and make room for what’s next.</p></div>
            <span className="welcome-sparkle"><Sparkles size={29} /></span>
          </section>

          <section className="dashboard-stat-grid" aria-label="Portfolio statistics">
            <StatCard icon={<BriefcaseBusiness size={18} />} title="Total portfolios" value={portfolios.length} />
            <StatCard icon={<Globe size={18} />} title="Published" value={publishedCount} />
            <StatCard icon={<FileText size={18} />} title="Drafts" value={portfolios.length - publishedCount} />
          </section>

          <section className="dashboard-portfolios" id="portfolios">
            <div className="dashboard-section-heading"><div><div className="eyebrow">YOUR WORK, ALL IN ONE PLACE</div><h2>My portfolios</h2></div><span>{portfolios.length} total</span></div>
            {error && <div className="dashboard-error" role="alert">{error}</div>}
            {loading ? <div className="dashboard-empty">Loading portfolios…</div> : portfolios.length === 0 ? (
              <div className="dashboard-empty dashboard-empty-state"><div className="empty-icon"><BriefcaseBusiness size={24} /></div><h3>Your portfolio journey starts here</h3><p>Create your first portfolio, choose a design, and publish your personal website.</p><button className="button button-dark" onClick={() => { setFormError(''); setShowModal(true) }}><Plus size={16} /> Create your first portfolio</button></div>
            ) : (
              <div className="dashboard-card-grid">{portfolios.map(portfolio => <div className="dashboard-card-wrap" key={portfolio.id}><PortfolioCard portfolio={portfolio} onDelete={handleDelete} deleting={deletingId === portfolio.id} />{deletingId === portfolio.id && <div className="deleting-overlay">Deleting portfolio…</div>}</div>)}</div>
            )}
          </section>
        </main>
      </div>

      {showModal && <div className="portfolio-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setShowModal(false) }}><section className="portfolio-modal" role="dialog" aria-modal="true" aria-labelledby="create-portfolio-heading"><div className="modal-heading"><div><div className="eyebrow">A NEW PLACE FOR YOUR WORK</div><h2 id="create-portfolio-heading">Create portfolio</h2></div><button type="button" className="modal-close" aria-label="Close" onClick={() => setShowModal(false)}>×</button></div><form onSubmit={handleCreate} className="portfolio-form"><label>Portfolio name<input value={title} onChange={event => setTitle(event.target.value)} placeholder="My creative portfolio" required autoFocus /></label><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option value="">Select a category</option><option>Web Developer</option><option>UI/UX Designer</option><option>Frontend Developer</option><option>Backend Developer</option><option>Full Stack Developer</option><option>Other</option></select></label><label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="A short introduction to your portfolio…" rows={3} /></label>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="button button-dark" disabled={creating}>{creating ? 'Creating…' : <><Plus size={16} /> Create portfolio</>}</button></div></form></section></div>}
    </div>
  )
}

function StatCard({ icon, title, value }) {
  return <article className="dashboard-stat-card"><span>{icon}</span><div><p>{title}</p><strong>{value}</strong></div></article>
}
