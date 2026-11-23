import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PortfolioEditor from './pages/PortfolioEditor'
import PublicPortfolio from './pages/PublicPortfolio'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return <BrowserRouter><AuthProvider><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/dashboard/portfolios/:id/edit" element={<PortfolioEditor />} /><Route path="/p/:slug" element={<PublicPortfolio />} /></Routes></AuthProvider></BrowserRouter>
}

export default App
