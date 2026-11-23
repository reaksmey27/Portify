import { useEffect, useMemo, useState } from 'react'
import { Eye, Globe, RefreshCw, TrendingUp, Users } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Header from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/useAuth'
import { usePortfolios } from '../hooks/usePortfolios'
import { getPortfolioAnalytics } from '../services/analyticsService'

export default function Analytics() {
  const { user, loading: authLoading } = useAuth()
  const { portfolios, loading: portfoliosLoading, error: portfoliosError, refreshPortfolios } = usePortfolios()
  const portfolioIds = useMemo(() => portfolios.map(portfolio => portfolio.id), [portfolios])
  const portfolioKey = portfolioIds.join(',')
  const [result, setResult] = useState({ key: null, analytics: null, error: '' })
  const [retryCount, setRetryCount] = useState(0)
  const loading = portfoliosLoading || result.key !== portfolioKey
  const analytics = result.key === portfolioKey ? result.analytics : null
  const error = portfoliosError || (result.key === portfolioKey ? result.error : '')

  useEffect(() => {
    if (portfoliosLoading) return undefined
    let active = true
    getPortfolioAnalytics(portfolioIds)
      .then(data => {
        if (active) setResult({ key: portfolioKey, analytics: data, error: '' })
      })
      .catch(err => {
        if (active) setResult({ key: portfolioKey, analytics: null, error: err.message || 'Could not load analytics.' })
      })
    return () => { active = false }
  }, [portfolioIds, portfolioKey, portfoliosLoading, retryCount])

  if (authLoading) return <div className="auth-loading">Getting your workspace ready…</div>
  if (!user) return <Navigate to="/login" replace />
  const portfolioNames = Object.fromEntries(portfolios.map(portfolio => [portfolio.id, portfolio.title]))
  const publishedCount = portfolios.filter(portfolio => portfolio.status === 'published').length

  return <div className="dashboard-layout">
    <Sidebar />
    <div className="dashboard-content">
      <Header title="Analytics" />
      <main className="dashboard-main analytics-main">
        <div className="analytics-page-heading"><div><div className="eyebrow">YOUR AUDIENCE AT A GLANCE</div><h2>Portfolio analytics</h2><p>See how people find and explore your work.</p></div><button className="analytics-refresh" type="button" onClick={() => { refreshPortfolios(); setRetryCount(count => count + 1) }} disabled={loading}><RefreshCw size={14} /> Refresh</button></div>

        {loading ? <div className="analytics-state">Loading analytics…</div> : error ? <div className="analytics-error" role="alert"><p>{error}</p><button type="button" onClick={() => setRetryCount(count => count + 1)}>Try again</button></div> : analytics && <>
          <section className="analytics-stat-grid">
            <Stat icon={<Eye size={18} />} label="Total page views" value={analytics.totalViews} />
            <Stat icon={<Users size={18} />} label="Unique visitors" value={analytics.uniqueVisitors} />
            <Stat icon={<TrendingUp size={18} />} label="Published portfolios" value={publishedCount} />
            <Stat icon={<Globe size={18} />} label="Total portfolios" value={portfolios.length} />
          </section>

          <section className="analytics-panel analytics-chart-panel">
            <div className="analytics-panel-heading"><div><h3>Page views</h3><p>Daily views over the last seven days</p></div><span>LAST 7 DAYS</span></div>
            <div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.dailyViews} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}><CartesianGrid stroke="#eceae4" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#85837b', fontSize: 10 }} tickFormatter={value => new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#85837b', fontSize: 10 }} /><Tooltip contentStyle={{ border: '1px solid #e8e5dc', borderRadius: 8, fontSize: 11 }} labelFormatter={value => new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', timeZone: 'UTC' })} /><Bar dataKey="views" name="Views" fill="#8463a2" radius={[5, 5, 0, 0]} maxBarSize={42} /></BarChart></ResponsiveContainer></div>
          </section>

          <div className="analytics-lower-grid">
            <section className="analytics-panel"><div className="analytics-panel-heading"><div><h3>Top portfolios</h3><p>Views across your portfolios</p></div></div>{analytics.topPortfolios.length === 0 ? <p className="analytics-empty">Create a portfolio to start tracking views.</p> : <div className="analytics-ranking">{analytics.topPortfolios.map((item, index) => <article key={item.id}><span className="ranking-number">{String(index + 1).padStart(2, '0')}</span><div className="ranking-title"><strong>{portfolioNames[item.id] || 'Portfolio'}</strong><span>Portfolio views</span></div><b>{item.views.toLocaleString()}</b></article>)}</div>}</section>
            <section className="analytics-panel"><div className="analytics-panel-heading"><div><h3>Recent activity</h3><p>Latest public portfolio visits</p></div></div>{analytics.recentViews.length === 0 ? <p className="analytics-empty">Your published portfolio visits will show up here.</p> : <div className="analytics-activity-list">{analytics.recentViews.map(view => <article key={view.id}><span className="activity-dot" /><div><strong>{portfolioNames[view.portfolio_id] || 'Portfolio'}</strong><p>Portfolio viewed</p></div><time dateTime={view.viewed_at}>{formatViewedAt(view.viewed_at)}</time></article>)}</div>}</section>
          </div>
          <p className="analytics-footnote">Unique visitors are estimated with a browser ID stored on the visitor’s device.</p>
        </>}
      </main>
    </div>
  </div>
}

function Stat({ icon, label, value }) {
  return <article className="analytics-stat"><span>{icon}</span><div><p>{label}</p><strong>{value.toLocaleString()}</strong></div></article>
}

function formatViewedAt(value) {
  const date = new Date(value)
  return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`
}
