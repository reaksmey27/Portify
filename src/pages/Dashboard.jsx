import { ArrowLeft, BriefcaseBusiness, ExternalLink, FileText, Globe, MoveRight, Sparkles } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/useAuth'
import { usePortfolios } from '../hooks/usePortfolios'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const { portfolios, loading, error } = usePortfolios()
  const publishedPortfolios = portfolios.filter(portfolio => portfolio.status === 'published')
  const publishedCount = publishedPortfolios.length
  const featuredSite = publishedPortfolios[0]

  if (authLoading) return <div className="auth-loading">Getting your workspace ready…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header />
        <main className="dashboard-main">
          <section className="dashboard-welcome">
            <div>
              <div className="eyebrow">YOUR CREATIVE CORNER</div>
              <h2>Good to see you again.</h2>
              <p>Your workspace at a glance. Manage your portfolio sites from My portfolios.</p>
              <div className="overview-actions">
                <Link className="button button-outline overview-view-site" to="/"><ArrowLeft size={14} /> Back to website</Link>
                <Link className="button button-dark overview-manage-link" to="/dashboard/portfolios">Manage portfolios <MoveRight size={15} /></Link>
                {featuredSite
                  ? <a className="button button-outline overview-view-site" href={`/p/${featuredSite.slug}`} target="_blank" rel="noreferrer">View client site <ExternalLink size={14} /></a>
                  : <Link className="button button-outline overview-view-site" to="/dashboard/portfolios">{loading ? 'Loading site…' : 'Publish to view site'} <ExternalLink size={14} /></Link>}
              </div>
            </div>
            <span className="welcome-sparkle"><Sparkles size={29} /></span>
          </section>

          <section className="dashboard-stat-grid" aria-label="Portfolio statistics">
            <StatCard icon={<BriefcaseBusiness size={18} />} title="Total portfolios" value={loading ? '—' : portfolios.length} />
            <StatCard icon={<Globe size={18} />} title="Published sites" value={loading ? '—' : publishedCount} />
            <StatCard icon={<FileText size={18} />} title="Drafts" value={loading ? '—' : portfolios.length - publishedCount} />
          </section>

          {error && <div className="dashboard-error" role="alert">{error}</div>}
          <section className="overview-next-step">
            <div className="overview-next-step-icon"><BriefcaseBusiness size={19} /></div>
            <div><h3>Ready to work on a portfolio?</h3><p>Open My portfolios to create a site, edit your work, or visit a published portfolio.</p></div>
            <Link to="/dashboard/portfolios">Go to My portfolios <MoveRight size={14} /></Link>
          </section>
        </main>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value }) {
  return <article className="dashboard-stat-card"><span>{icon}</span><div><p>{title}</p><strong>{value}</strong></div></article>
}
