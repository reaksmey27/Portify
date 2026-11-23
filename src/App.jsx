import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PortfolioEditor = lazy(() => import('./pages/PortfolioEditor'))
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio'))
const Analytics = lazy(() => import('./pages/Analytics'))

function App() {
  const fallback = <div className="auth-loading">Loading Portify…</div>
  return <BrowserRouter><AuthProvider><Routes><Route path="/" element={<Suspense fallback={fallback}><Landing /></Suspense>} /><Route path="/login" element={<Suspense fallback={fallback}><Login /></Suspense>} /><Route path="/register" element={<Suspense fallback={fallback}><Register /></Suspense>} /><Route path="/dashboard" element={<Suspense fallback={fallback}><Dashboard /></Suspense>} /><Route path="/dashboard/analytics" element={<Suspense fallback={<div className="auth-loading">Loading analytics page…</div>}><Analytics /></Suspense>} /><Route path="/dashboard/portfolios/:id/edit" element={<Suspense fallback={fallback}><PortfolioEditor /></Suspense>} /><Route path="/p/:slug" element={<Suspense fallback={fallback}><PublicPortfolio /></Suspense>} /></Routes></AuthProvider></BrowserRouter>
}

export default App
