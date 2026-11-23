import { Bell, Menu, Plus, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications'

export default function Header({ title = 'Overview', onCreate }) {
  const unreadCount = useUnreadNotifications()
  return <header className="dashboard-header"><div><div className="dashboard-breadcrumb">WORKSPACE <span>/</span> {title.toUpperCase()}</div><h1>{title}</h1></div><div className="dashboard-header-actions"><button type="button" className="dashboard-menu-trigger" aria-label="Toggle navigation" onClick={() => window.dispatchEvent(new Event('portify:toggle-sidebar'))}><Menu size={19} /></button><label className="dashboard-search"><Search size={16} /><input placeholder="Search" aria-label="Search" /></label><NavLink to="/dashboard/notifications" className="icon-button notification-bell-link" aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}><Bell size={17} />{unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}</NavLink>{onCreate && <button className="button button-dark" onClick={onCreate} type="button"><Plus size={16} /> New portfolio</button>}</div></header>
}
