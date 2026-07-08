import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { users } from '../../data/mockData'
import { dateLabel } from '../../utils/formatters'

const AdminUsersPage = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'createdAt', label: 'Joined', render: (row) => dateLabel(row.createdAt) },
  ]

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>User Management</h2>
            <span>Manage customer, vendor, and administrator accounts.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={users} />
      </section>
    </div>
  )
}

export default AdminUsersPage

