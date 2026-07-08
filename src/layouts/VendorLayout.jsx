import { useNavigate } from 'react-router-dom'
import DashboardShell from '../components/dashboard/DashboardShell'
import { vendorNav } from '../config/navigation'
import { routes } from '../config/routes'
import { useAuth } from '../plugins/authContext'

const VendorLayout = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(routes.login)
  }

  return (
    <DashboardShell
      navItems={vendorNav}
      title="Shop Panel"
      eyebrow="Vendor workspace"
      user={user}
      onLogout={handleLogout}
    />
  )
}

export default VendorLayout

