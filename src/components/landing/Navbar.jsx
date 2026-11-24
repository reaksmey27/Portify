import { ArrowUpRight, Bell, Check, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import StartBuildingLink from '../auth/StartBuildingLink'
import { useAuth } from '../../context/useAuth'
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications'
import { getNotifications, markNotificationRead } from '../../services/notificationService'

export default function Navbar() {
  const { user, loading } = useAuth()
  const unreadCount = useUnreadNotifications()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const notificationRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Profile'

  useEffect(() => {
    if (!notificationsOpen || !user?.id) return undefined
    let active = true
    setNotificationsLoading(true)
    getNotifications(user.id)
      .then(items => { if (active) setNotifications(items.slice(0, 5)) })
      .catch(() => { if (active) setNotifications([]) })
      .finally(() => { if (active) setNotificationsLoading(false) })
    return () => { active = false }
  }, [notificationsOpen, user?.id])

  useEffect(() => {
    if (!notificationsOpen) return undefined
    const closeOnOutsideClick = event => {
      if (!notificationRef.current?.contains(event.target)) setNotificationsOpen(false)
    }
    const closeOnEscape = event => { if (event.key === 'Escape') setNotificationsOpen(false) }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [notificationsOpen])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const closeMenu = event => {
      if (event.key === 'Escape' || !mobileMenuRef.current?.contains(event.target)) setMobileOpen(false)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [mobileOpen])

  async function handleMarkRead(id) {
    try {
      await markNotificationRead(user.id, id)
      setNotifications(items => items.map(item => item.id === id ? { ...item, is_read: true } : item))
    } catch {
      // Keep the popover open; the dashboard notifications page has the full error details.
    }
  }

  return (
    <header className="site-header" ref={mobileMenuRef}>
      <a className="brand" href="#top" aria-label="Portify home"><span className="brand-mark">p</span>portify</a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#features">Features</a><a href="#templates">Templates</a><a href="#how-it-works">How it works</a><a href="#pricing">Free forever</a>
      </nav>
      <div className="nav-actions">{!loading && (user
        ? <><div className="nav-notification-wrap" ref={notificationRef}><button type="button" className="icon-button notification-bell-link nav-notification-link" aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'} aria-expanded={notificationsOpen} aria-haspopup="dialog" onClick={() => setNotificationsOpen(open => !open)}><Bell size={17} />{unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}</button>{notificationsOpen && <section className="nav-notification-popover" role="dialog" aria-label="Recent notifications"><div className="nav-notification-heading"><strong>Notifications</strong><span>{unreadCount} unread</span></div>{notificationsLoading ? <p className="nav-notification-empty">Loading notifications…</p> : notifications.length === 0 ? <p className="nav-notification-empty">You’re all caught up.</p> : <div className="nav-notification-list">{notifications.map(item => <article className={`nav-notification-item ${item.is_read ? '' : 'nav-notification-unread'}`} key={item.id}><div><strong>{item.title}</strong><p>{item.message}</p><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></div>{!item.is_read && <button type="button" aria-label={`Mark ${item.title} as read`} onClick={() => handleMarkRead(item.id)}><Check size={14} /></button>}</article>)}</div>}</section>}</div><Link className="nav-profile" to="/dashboard/settings" aria-label={`Open profile for ${name}`}>
            <span className="nav-profile-avatar">{avatar ? <img src={avatar} alt="" referrerPolicy="no-referrer" onError={event => { event.currentTarget.parentElement.textContent = name[0]?.toUpperCase() || 'P' }} /> : name[0]?.toUpperCase()}</span>
            <span>Profile</span>
          </Link></>
        : <><Link className="sign-in" to="/login">Sign in</Link><StartBuildingLink className="button button-dark button-small">Get started <ArrowUpRight size={15} /></StartBuildingLink></>)}</div>
      <button type="button" className="mobile-menu" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} aria-controls="mobile-site-navigation" onClick={() => setMobileOpen(open => !open)}>{mobileOpen ? <X size={20} /> : <Menu size={22} />}</button>
      <nav className={`mobile-nav-panel ${mobileOpen ? 'mobile-nav-panel-open' : ''}`} id="mobile-site-navigation" aria-label="Mobile navigation" aria-hidden={!mobileOpen}>
        <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
        <a href="#templates" onClick={() => setMobileOpen(false)}>Templates</a>
        <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>Free forever</a>
      </nav>
    </header>
  )
}
