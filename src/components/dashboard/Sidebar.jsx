import { Bell, BriefcaseBusiness, LayoutDashboard, LogOut, TrendingUp, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { getMyProfile } from '../../services/profileService'

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatar, setAvatar] = useState({ userId: null, url: '' })

  useEffect(() => {
    if (!user?.id) return undefined
    let active = true
    const loadAvatar = () => {
      getMyProfile(user.id)
        .then(profile => {
          if (active) setAvatar({ userId: user.id, url: profile?.avatar_url || '' })
        })
        .catch(() => {
          if (active) setAvatar({ userId: user.id, url: '' })
        })
    }
    loadAvatar()
    window.addEventListener('portify:profile-changed', loadAvatar)
    return () => {
      active = false
      window.removeEventListener('portify:profile-changed', loadAvatar)
    }
  }, [user?.id])

  useEffect(() => {
    const toggleDrawer = () => setMobileOpen(open => !open)
    window.addEventListener('portify:toggle-sidebar', toggleDrawer)
    return () => window.removeEventListener('portify:toggle-sidebar', toggleDrawer)
  }, [])

  const closeDrawer = () => setMobileOpen(false)
  const handleSignOut = () => { closeDrawer(); signOut() }

  return <>
    <button type="button" className={`sidebar-backdrop ${mobileOpen ? 'sidebar-backdrop-open' : ''}`} onClick={closeDrawer} aria-label="Close navigation" tabIndex={mobileOpen ? 0 : -1} />
    <aside className={`dashboard-sidebar ${mobileOpen ? 'dashboard-sidebar-open' : ''}`}>
      <a className="brand" href="/" onClick={closeDrawer}><span className="brand-mark">p</span>portify</a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="dashboard-nav" aria-label="Dashboard navigation">
        <NavLink to="/dashboard" end onClick={closeDrawer}><LayoutDashboard size={17} /> Overview</NavLink>
        <a href="/dashboard#portfolios" onClick={closeDrawer}><BriefcaseBusiness size={17} /> My portfolios</a>
        <NavLink to="/dashboard/analytics" onClick={closeDrawer}><TrendingUp size={17} /> Analytics</NavLink>
        <NavLink to="/dashboard/notifications" onClick={closeDrawer}><Bell size={17} /> Notifications</NavLink>
        <NavLink to="/dashboard/settings" onClick={closeDrawer}><UserRound size={17} /> Account settings</NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-user">{avatar.userId === user?.id && avatar.url ? <img className="user-avatar" src={avatar.url} alt="" onError={() => setAvatar({ userId: user.id, url: '' })} /> : <span className="user-avatar">{user?.email?.[0]?.toUpperCase() ?? 'U'}</span>}<span className="user-email">{user?.email ?? 'Your account'}</span><button aria-label="Sign out" onClick={handleSignOut}><LogOut size={16} /></button></div></div>
    </aside>
  </>
}
