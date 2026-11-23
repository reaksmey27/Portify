import { ArrowRight, Check, Crown, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { plans } from '../data/plans'
import { useAuth } from '../context/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { notify } from '../utils/notifications'

export default function Pricing() {
  const { user } = useAuth()
  const { plan: currentPlan, loading, error } = useSubscription()

  function handleProClick() {
    notify.info('Pro checkout is coming in a future update. No payment will be taken.')
  }

  return <main className="pricing-page">
    <div className="pricing-page-inner">
      <Link to="/" className="pricing-brand"><span className="brand-mark">p</span>portify</Link>
      <div className="pricing-page-heading"><div className="eyebrow">MADE TO GROW WITH YOU</div><h1>Simple pricing for<br />your <em>next step.</em></h1><p>Start free. Upgrade when you need a little more room.</p></div>
      {error && <p className="pricing-subscription-error">We couldn’t load your current plan. The plan details below are still available.</p>}
      <div className="saas-plans-grid">{plans.map(plan => {
        const isCurrent = Boolean(user) && !loading && !error && currentPlan.id === plan.id
        return <article className={`saas-plan-card ${plan.id === 'pro' ? 'saas-plan-pro' : ''}`} key={plan.id}>
          {plan.id === 'pro' && <span className="saas-plan-ribbon"><Sparkles size={12} /> FOR WHAT’S NEXT</span>}
          <div className="saas-plan-name-row"><div><span className="eyebrow">{plan.id === 'pro' ? 'MORE ROOM TO GROW' : 'A GOOD PLACE TO BEGIN'}</span><h2>{plan.name}</h2></div>{plan.id === 'pro' && <span className="saas-plan-crown"><Crown size={18} /></span>}</div>
          <p className="saas-plan-description">{plan.description}</p>
          <div className="saas-plan-price"><strong>${plan.price}</strong><span>{plan.interval === 'forever' ? 'forever' : `/ ${plan.interval}`}</span></div>
          <div className="saas-plan-limit">{plan.limits.portfolios} {plan.limits.portfolios === 1 ? 'portfolio' : 'portfolios'} · {plan.limits.templates} templates</div>
          {plan.id === 'free' ? <Link to={user ? '/dashboard' : '/register'} className={`saas-plan-action ${isCurrent ? 'saas-plan-action-current' : ''}`}>{isCurrent ? 'Your current plan' : user ? 'Go to your dashboard' : 'Start for free'}{!isCurrent && <ArrowRight size={15} />}</Link> : <button type="button" className="saas-plan-action saas-plan-action-pro" onClick={handleProClick}>Pro checkout coming soon <ArrowRight size={15} /></button>}
          <div className="saas-plan-divider" /><p className="saas-plan-includes">WHAT’S INCLUDED</p><ul>{plan.features.map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
        </article>
      })}</div>
      <p className="pricing-page-note">Pro is a suggested price of $8 USD per month. Checkout is not enabled, and no payment will be taken.</p>
      <Link className="pricing-back-link" to={user ? '/dashboard' : '/'}><ArrowRight size={13} /> {user ? 'Back to dashboard' : 'Back to Portify'}</Link>
    </div>
  </main>
}
