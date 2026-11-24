import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PortfolioCard({ portfolio, onDelete, deleting = false }) {
  const isPublished = portfolio.status === 'published'
  const template = portfolio.template_id || 'minimal'
  const updatedDate = portfolio.updated_at
    ? new Date(portfolio.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recently updated'

  return (
    <article className="dashboard-portfolio-card">
      <div className={`dashboard-card-art ${template}`}>
        <span className="card-art-brand">{portfolio.title?.slice(0, 2).toUpperCase() || 'P'}</span>
        <div className="card-preview-copy">
          <span className="card-art-title">{portfolio.title}</span>
          <span className="card-art-subtitle">{template} template</span>
        </div>
        <span className="card-art-circle" />
      </div>
      <div className="portfolio-card-content">
        <div className="portfolio-card-heading">
          <div>
            <h3>{portfolio.title}</h3>
            <p>{portfolio.category || 'No category'}</p>
          </div>
          <span className={`portfolio-status ${isPublished ? 'is-published' : ''}`}>
            <i />{isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="portfolio-description">{portfolio.description || 'Add a description to your portfolio.'}</p>
        <div className="portfolio-card-footer">
          <time dateTime={portfolio.updated_at}>{updatedDate}</time>
          <div className="portfolio-card-actions">
            {isPublished && <a className="portfolio-view-site" href={`/p/${portfolio.slug}`} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View site</a>}
            <Link to={`/dashboard/portfolios/${portfolio.id}/edit`} title="Edit portfolio" aria-label="Edit portfolio"><Pencil size={16} /></Link>
            <button type="button" onClick={() => onDelete(portfolio)} disabled={deleting} title="Delete portfolio" aria-label="Delete portfolio"><Trash2 size={16} /></button>
          </div>
        </div>
      </div>
    </article>
  )
}
