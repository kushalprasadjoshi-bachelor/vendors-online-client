import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orders } from '../../data/mockData'
import { currency, dateLabel } from '../../utils/formatters'

const VendorOrdersPage = () => {
  const columns = [
    { key: 'id', label: 'Order' },
    { key: 'createdAt', label: 'Date', render: (row) => dateLabel(row.createdAt) },
    { key: 'items', label: 'Items', render: (row) => row.items.map((item) => item.name).join(', ') },
    { key: 'total', label: 'Total', render: (row) => currency(row.total) },
    { key: 'deliveryStatus', label: 'Delivery', render: (row) => <StatusBadge value={row.deliveryStatus} /> },
    { key: 'paymentStatus', label: 'Escrow', render: (row) => <StatusBadge value={row.paymentStatus} /> },
  ]

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Order Management</h2>
            <span>Track delivery states and escrow release readiness.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={orders} />
      </section>
    </div>
  )
}

export default VendorOrdersPage

