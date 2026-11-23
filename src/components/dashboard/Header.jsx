import { Bell, Plus, Search } from 'lucide-react'

export default function Header({ title = 'Overview', onCreate }) {
  return <header className="dashboard-header"><div><div className="dashboard-breadcrumb">WORKSPACE <span>/</span> {title.toUpperCase()}</div><h1>{title}</h1></div><div className="dashboard-header-actions"><label className="dashboard-search"><Search size={16} /><input placeholder="Search" aria-label="Search" /></label><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><button className="button button-dark" onClick={onCreate} type="button"><Plus size={16} /> New portfolio</button></div></header>
}
