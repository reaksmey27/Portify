import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    const { error: authError } = await signIn(email, password)
    setBusy(false)
    if (authError) setError(authError.message)
    else navigate('/dashboard')
  }

  return <main className="auth-page"><section className="auth-form-panel"><Link to="/" className="brand"><span className="brand-mark">p</span>portify</Link><div className="auth-form-wrap"><Link to="/" className="back-link"><ArrowLeft size={14} /> Back home</Link><div className="eyebrow">GOOD TO HAVE YOU BACK</div><h1>Pick up where<br />you <span>left off.</span></h1><p className="auth-intro">Sign in to keep making a little room for what’s next.</p><form onSubmit={handleSubmit}><label>Email address<input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark auth-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button></form><p className="auth-switch">New around here? <Link to="/register">Create an account</Link></p></div><small className="auth-legal">© 2025 Portify · Made for the work only you can do.</small></section><aside className="auth-art"><span className="auth-art-label">A GOOD PLACE TO BEGIN</span><div className="auth-art-copy">Your work<br />deserves a<br /><em>little spotlight.</em></div><div className="auth-art-shape" /><div className="auth-art-note">A PORTFOLIO THAT FEELS LIKE YOU ✳</div></aside></main>
}
