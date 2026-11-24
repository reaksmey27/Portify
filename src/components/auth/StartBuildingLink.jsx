import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

const portfolioPath = '/dashboard/portfolios'
const loginPath = `/login?next=${encodeURIComponent(portfolioPath)}`

export default function StartBuildingLink({ children, ...props }) {
  const { user, loading } = useAuth()
  const to = loading ? loginPath : user ? portfolioPath : loginPath
  return <Link to={to} {...props}>{children}</Link>
}
