import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { apiClient } from '../../services/apiClient'
import { dateLabel } from '../../utils/formatters'

const AdminUsersPage = () => {
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/user')
      .then((data) => {
        setUsersList(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status || 'active'} /> },
    { key: 'createdAt', label: 'Joined', render: (row) => dateLabel(row.createdAt) },
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading users...</p></div>
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>User Management</h2>
            <span>Manage customer, vendor, and administrator accounts.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={usersList} />
      </section>
    </div>
  )
}

export default AdminUsersPage


