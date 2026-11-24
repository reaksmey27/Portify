import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 48 48" className="social-auth-google-mark"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.73 7.18l7.62 5.91c4.45-4.11 7.19-10.17 7.19-17.56Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.27-8.28 2.27-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>
}

function GitHubMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="social-auth-github-mark"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.43 7.87 10.96.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.47.12-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.64 1.59.24 2.76.12 3.06.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.68.41.36.77 1.06.77 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
}

export default function SocialAuthButtons() {
  const { signInWithOAuth } = useAuth()
  const [searchParams] = useSearchParams()
  const [busyProvider, setBusyProvider] = useState('')
  const [error, setError] = useState('')

  async function handleOAuth(provider) {
    setError('')
    setBusyProvider(provider)
    try {
      const requestedPath = searchParams.get('next')
      const redirectPath = requestedPath?.startsWith('/dashboard') ? requestedPath : '/dashboard'
      const { error: authError } = await signInWithOAuth(provider, redirectPath)
      if (authError) setError(authError.message)
    } catch (authError) {
      setError(authError.message || 'Could not start sign-in.')
    } finally {
      setBusyProvider('')
    }
  }

  return <div className="social-auth">
    <div className="social-auth-buttons">
      <button type="button" className="social-auth-button" onClick={() => handleOAuth('google')} disabled={Boolean(busyProvider)}>
        <GoogleMark />{busyProvider === 'google' ? 'Connecting…' : 'Google'}
      </button>
      <button type="button" className="social-auth-button" onClick={() => handleOAuth('github')} disabled={Boolean(busyProvider)}>
        <GitHubMark />{busyProvider === 'github' ? 'Connecting…' : 'GitHub'}
      </button>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="social-auth-divider"><span>or continue with email</span></div>
  </div>
}
