import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const VendorOrdersPage = () => {
  const [ordersList, setOrdersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getOrders()
      .then((data) => {
        setOrdersList(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const columns = [
    { key: 'id', label: 'Order' },
    { key: 'createdAt', label: 'Date', render: (row) => dateLabel(row.createdAt) },
    { key: 'items', label: 'Items', render: (row) => row.items ? row.items.map((item) => item.name).join(', ') : '' },
    { key: 'total', label: 'Total', render: (row) => currency(row.total) },
    { key: 'deliveryStatus', label: 'Delivery', render: (row) => <StatusBadge value={row.deliveryStatus} /> },
    { key: 'paymentStatus', label: 'Escrow', render: (row) => <StatusBadge value={row.paymentStatus} /> },
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading orders...</p></div>
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Order Management</h2>
            <span>Track delivery states and escrow release readiness.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={ordersList} />
      </section>
    </div>
  )
}

export default VendorOrdersPage


