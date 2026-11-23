import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Eye, Globe, UserRound } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import Sidebar from '../components/dashboard/Sidebar'
import { useAuth } from '../context/useAuth'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService'
import { notify } from '../utils/notifications'

const iconByType = { portfolio_view: Eye, portfolio_published: Globe, profile_updated: UserRound }

export default function Notifications() {
  const { user, loading: authLoading } = useAuth()
  const [result, setResult] = useState({ userId: null, retryCount: -1, notifications: [], error: '', loaded: false })
  const [retryCount, setRetryCount] = useState(0)
  const [busy, setBusy] = useState(false)
  const notifications = result.userId === user?.id ? result.notifications : []
  const error = result.userId === user?.id ? result.error : ''
  const loading = authLoading || !user || result.userId !== user.id || result.retryCount !== retryCount || !result.loaded

  useEffect(() => {
    if (!user?.id) return undefined
    let active = true
    getNotifications(user.id)
      .then(data => {
        if (active) setResult({ userId: user.id, retryCount, notifications: data, error: '', loaded: true })
      })
      .catch(loadError => {
        if (active) setResult({ userId: user.id, retryCount, notifications: [], error: loadError.message || 'Could not load notifications.', loaded: true })
      })
    return () => { active = false }
  }, [user?.id, retryCount])

  if (authLoading) return <div className="auth-loading">Getting your notifications…</div>
  if (!user) return <Navigate to="/login" replace />

  const unreadCount = notifications.filter(item => !item.is_read).length

  async function handleRead(id) {
    try {
      await markNotificationRead(user.id, id)
      setResult(current => current.userId === user.id ? { ...current, notifications: current.notifications.map(item => item.id === id ? { ...item, is_read: true } : item) } : current)
    } catch (readError) {
      notify.error(readError.message || 'Could not update notification.')
    }
  }

  async function handleReadAll() {
    setBusy(true)
    try {
      await markAllNotificationsRead(user.id)
      setResult(current => current.userId === user.id ? { ...current, notifications: current.notifications.map(item => ({ ...item, is_read: true })) } : current)
      notify.success('All notifications marked as read.')
    } catch (readError) {
      notify.error(readError.message || 'Could not update notifications.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="dashboard-layout">
    <Sidebar />
    <div className="dashboard-content">
      <Header title="Notifications" />
      <main className="dashboard-main notifications-main">
        <div className="notifications-heading"><div><div className="eyebrow">ACTIVITY IN YOUR WORKSPACE</div><h2>Your notifications</h2><p>{unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}.</p></div>{unreadCount > 0 && <button type="button" className="notifications-mark-all" onClick={handleReadAll} disabled={busy}><CheckCheck size={15} />{busy ? 'Updating…' : 'Mark all read'}</button>}</div>

        <section className="notifications-list" aria-label="Notifications">
          {loading ? <p className="notifications-state">Loading notifications…</p> : error ? <div className="notifications-state notifications-error" role="alert"><p>{error}</p><button type="button" onClick={() => setRetryCount(count => count + 1)}>Try again</button></div> : notifications.length === 0 ? <div className="notifications-empty"><span><Bell size={23} /></span><h3>No notifications yet</h3><p>Portfolio views, publishing, and profile updates will show up here.</p></div> : notifications.map(item => {
            const Icon = iconByType[item.type] || Bell
            return <article className={`notification-item ${item.is_read ? '' : 'notification-item-unread'}`} key={item.id}>
              <span className="notification-item-icon"><Icon size={17} /></span>
              <div className="notification-item-copy"><div className="notification-item-title"><h3>{item.title}</h3>{!item.is_read && <span aria-label="Unread" />}</div><p>{item.message}</p><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></div>
              {!item.is_read && <button type="button" className="notification-read-button" onClick={() => handleRead(item.id)}>Mark read</button>}
            </article>
          })}
        </section>
      </main>
    </div>
  </div>
}
