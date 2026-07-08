import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { disputes } from '../../data/mockData'
import { currency, dateLabel } from '../../utils/formatters'

const AdminDisputesPage = () => {
  const columns = [
    { key: 'id', label: 'Case' },
    { key: 'orderId', label: 'Order' },
    { key: 'reason', label: 'Reason' },
    { key: 'priority', label: 'Priority', render: (row) => <StatusBadge value={row.priority} /> },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'createdAt', label: 'Opened', render: (row) => dateLabel(row.createdAt) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Delivery Disputes</h2>
            <span>Resolve OTP failures, false claims, and escrow exceptions.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={disputes} />
      </section>
    </div>
  )
}

export default AdminDisputesPage

