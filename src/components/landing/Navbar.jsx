import { ArrowUpRight, Menu } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Portify home"><span className="brand-mark">p</span>portify</a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#features">Features</a><a href="#templates">Templates</a><a href="#how-it-works">How it works</a><a href="#pricing">Free forever</a>
      </nav>
      <div className="nav-actions"><a className="sign-in" href="/login">Sign in</a><a className="button button-dark button-small" href="/register">Get started <ArrowUpRight size={15} /></a></div>
      <button className="mobile-menu" aria-label="Open menu"><Menu size={22} /></button>
    </header>
  )
}
