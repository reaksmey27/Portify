import { ArrowUpRight, BriefcaseBusiness, LayoutDashboard, LogOut, Settings, TrendingUp, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function Sidebar() {
  const { user, signOut } = useAuth()
  return <aside className="dashboard-sidebar"><a className="brand" href="/"><span className="brand-mark">p</span>portify</a><div className="workspace-label">WORKSPACE</div><nav className="dashboard-nav"><NavLink to="/dashboard" end><LayoutDashboard size={17} /> Overview</NavLink><a href="/dashboard#portfolios"><BriefcaseBusiness size={17} /> My portfolios</a><NavLink to="/dashboard/analytics"><TrendingUp size={17} /> Analytics</NavLink><a href="/dashboard#profile"><UserRound size={17} /> Profile</a><a href="/dashboard#settings"><Settings size={17} /> Settings</a></nav><div className="sidebar-bottom"><a className="upgrade-card" href="/#pricing"><span>Ready for more?</span><small>Explore Portify Plus <ArrowUpRight size={13} /></small></a><div className="sidebar-user"><span className="user-avatar">{user?.email?.[0]?.toUpperCase() ?? 'U'}</span><span className="user-email">{user?.email ?? 'Your account'}</span><button aria-label="Sign out" onClick={signOut}><LogOut size={16} /></button></div></div></aside>
}
