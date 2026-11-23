import { useEffect, useState } from 'react'
import { KeyRound, Mail, Save, UserRound } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/useAuth'
import { getMyProfile, updateMyEmail, updateMyPassword, updateMyProfile } from '../services/profileService'
import { notify } from '../utils/notifications'

const emptyProfile = { full_name: '', bio: '', website: '', location: '', avatar_url: '' }

export default function AccountSettings() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState(emptyProfile)
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (!user?.id) return undefined
    let active = true
    getMyProfile(user.id)
      .then(data => {
        if (active && data) setProfile({
          full_name: data.full_name || '',
          bio: data.bio || '',
          website: data.website || '',
          location: data.location || '',
          avatar_url: data.avatar_url || '',
        })
      })
      .catch(error => {
        if (active) notify.error(error.message || 'Could not load your profile.')
      })
      .finally(() => { if (active) setLoadingProfile(false) })
    return () => { active = false }
  }, [user?.id])

  if (authLoading) return <div className="auth-loading">Getting your account ready…</div>
  if (!user) return <Navigate to="/login" replace />

  async function handleProfileSave(event) {
    event.preventDefault()
    setSavingProfile(true)
    try {
      const saved = await updateMyProfile(user.id, profile)
      setProfile({ ...emptyProfile, ...saved })
      notify.success('Profile updated successfully.')
    } catch (error) {
      notify.error(error.message || 'Could not save your profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleEmailSave(event) {
    event.preventDefault()
    if (!email.trim() || email.trim() === user.email) {
      notify.info('Enter a new email address to update it.')
      return
    }
    setSavingEmail(true)
    try {
      await updateMyEmail(email)
      notify.success('Check your inbox to confirm the new email address.')
    } catch (error) {
      notify.error(error.message || 'Could not update your email.')
    } finally {
      setSavingEmail(false)
    }
  }

  async function handlePasswordSave(event) {
    event.preventDefault()
    if (password.length < 6) {
      notify.error('Password must be at least 6 characters.')
      return
    }
    setSavingPassword(true)
    try {
      await updateMyPassword(password)
      setPassword('')
      notify.success('Password updated successfully.')
    } catch (error) {
      notify.error(error.message || 'Could not update your password.')
    } finally {
      setSavingPassword(false)
    }
  }

  function updateField(field, value) {
    setProfile(current => ({ ...current, [field]: value }))
  }

  return <div className="dashboard-layout">
    <Sidebar />
    <div className="dashboard-content">
      <Header title="Account settings" />
      <main className="dashboard-main account-settings-main">
        <section className="account-settings-heading"><div className="eyebrow">YOUR ACCOUNT, YOUR DETAILS</div><h1>Account settings</h1><p>Manage your profile information and sign-in details.</p></section>

        <form className="account-settings-card" onSubmit={handleProfileSave}>
          <div className="account-settings-card-heading"><span><UserRound size={17} /></span><div><h2>Personal information</h2><p>Details shown on your Portify profile.</p></div></div>
          {loadingProfile ? <div className="account-settings-loading">Loading your profile…</div> : <div className="account-settings-fields">
            <label className="account-settings-field">Full name<input className="editor-input" autoComplete="name" value={profile.full_name} onChange={event => updateField('full_name', event.target.value)} placeholder="Your name" /></label>
            <label className="account-settings-field">Location<input className="editor-input" autoComplete="address-level2" value={profile.location} onChange={event => updateField('location', event.target.value)} placeholder="Phnom Penh, Cambodia" /></label>
            <label className="account-settings-field account-settings-field-wide">Website<input className="editor-input" type="url" autoComplete="url" value={profile.website} onChange={event => updateField('website', event.target.value)} placeholder="https://example.com" /></label>
            <label className="account-settings-field account-settings-field-wide">Avatar URL<input className="editor-input" type="url" value={profile.avatar_url} onChange={event => updateField('avatar_url', event.target.value)} placeholder="https://example.com/avatar.jpg" /></label>
            <label className="account-settings-field account-settings-field-wide">Bio<textarea className="editor-input" rows={4} value={profile.bio} onChange={event => updateField('bio', event.target.value)} placeholder="A few words about you and your work…" /></label>
          </div>}
          <div className="account-settings-actions"><button className="button button-dark" disabled={loadingProfile || savingProfile}><Save size={15} />{savingProfile ? 'Saving…' : 'Save profile'}</button></div>
        </form>

        <form className="account-settings-card" onSubmit={handleEmailSave}>
          <div className="account-settings-card-heading"><span><Mail size={17} /></span><div><h2>Email address</h2><p>Supabase may ask you to confirm the new address.</p></div></div>
          <label className="account-settings-field">Email address<input className="editor-input" type="email" autoComplete="email" required value={email || user.email || ''} onChange={event => setEmail(event.target.value)} /></label>
          <div className="account-settings-actions"><button type="submit" className="button button-outline" disabled={savingEmail}>{savingEmail ? 'Updating…' : 'Update email'}</button></div>
        </form>

        <form className="account-settings-card" onSubmit={handlePasswordSave}>
          <div className="account-settings-card-heading"><span><KeyRound size={17} /></span><div><h2>Change password</h2><p>Choose a new password for your account.</p></div></div>
          <label className="account-settings-field">New password<input className="editor-input" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>
          <div className="account-settings-actions"><button type="submit" className="button button-dark" disabled={savingPassword}>{savingPassword ? 'Updating…' : 'Update password'}</button></div>
        </form>
      </main>
    </div>
  </div>
}
