import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import PortfolioTemplate from '../components/portfolio/PortfolioTemplate'
import { getPublicPortfolio } from '../services/publicPortfolioService'

export default function PublicPortfolio() {
  const { slug } = useParams()
  const [result, setResult] = useState({ slug: null, portfolio: null, error: '' })
  const loading = result.slug !== slug
  const portfolio = result.slug === slug ? result.portfolio : null
  const error = result.slug === slug ? result.error : ''

  useEffect(() => {
    let active = true
    getPublicPortfolio(slug)
      .then(data => {
        if (active) setResult({ slug, portfolio: data, error: '' })
      })
      .catch(() => {
        if (active) setResult({ slug, portfolio: null, error: 'We couldn’t load this portfolio.' })
      })
    return () => { active = false }
  }, [slug])

  if (loading) return <div className="public-portfolio-state">Loading portfolio…</div>
  if (error || !portfolio) return <div className="public-portfolio-state public-portfolio-not-found"><span>404 / NOT FOUND</span><h1>Portfolio not found</h1><p>This portfolio may be unavailable or unpublished.</p><Link to="/">Back to Portify</Link></div>

  const name = portfolio.content?.name || portfolio.title
  const role = portfolio.content?.role || 'Professional Portfolio'
  const description = (portfolio.content?.bio || `View ${name}’s portfolio.`).slice(0, 160)

  return <>
    <Helmet>
      <title>{name} | {role}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${name} | ${role}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
    </Helmet>
    <PortfolioTemplate templateId={portfolio.template_id} portfolio={portfolio} />
  </>
}
