import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedPath = searchParams.get('next')
  const returnPath = requestedPath?.startsWith('/dashboard') ? requestedPath : '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setMessage(''); setBusy(true)
    const { data, error: authError } = await signUp(email, password)
    setBusy(false)
    if (authError) setError(authError.message)
    else if (data.session) navigate(returnPath)
    else setMessage('Check your email to confirm your account, then come back to sign in.')
  }

  return <main className="auth-page"><section className="auth-form-panel"><Link to="/" className="brand"><span className="brand-mark">p</span>portify</Link><div className="auth-form-wrap"><Link to="/" className="back-link"><ArrowLeft size={14} /> Back home</Link><div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h1>Let’s make it<br /><span>official.</span></h1><p className="auth-intro">Create your free account. Your future portfolio is waiting.</p><SocialAuthButtons /><form onSubmit={handleSubmit}><label>Email address<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>{error && <p className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}<button className="button button-dark auth-submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <ArrowRight size={16} /></button></form><p className="auth-switch">Already have an account? <Link to={`/login?next=${encodeURIComponent(returnPath)}`}>Sign in</Link></p></div><small className="auth-legal">© 2025 Portify · Made for the work only you can do.</small></section><aside className="auth-art"><span className="auth-art-label">A GOOD PLACE TO BEGIN</span><div className="auth-art-copy">Your work<br />deserves a<br /><em>little spotlight.</em></div><div className="auth-art-shape" /><div className="auth-art-note">A PORTFOLIO THAT FEELS LIKE YOU ✳</div></aside></main>
}
