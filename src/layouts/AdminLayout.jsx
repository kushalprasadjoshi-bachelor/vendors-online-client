import { useNavigate } from 'react-router-dom'
import DashboardShell from '../components/dashboard/DashboardShell'
import { adminNav } from '../config/navigation'
import { routes } from '../config/routes'
import { useAuth } from '../plugins/authContext'

const AdminLayout = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(routes.login)
  }

  return (
    <DashboardShell
      navItems={adminNav}
      title="Admin Panel"
      eyebrow="Platform control"
      user={user}
      onLogout={handleLogout}
    />
  )
}

export default AdminLayout

