import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const AdminDisputesPage = () => {
  const [disputesList, setDisputesList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDisputes = () => {
    orderService.getDisputes()
      .then((data) => {
        setDisputesList(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const handleUpdateStatus = async (disputeId, newStatus) => {
    try {
      await orderService.updateDisputeStatus(disputeId, newStatus)
      alert(`Dispute status updated to ${newStatus}`)
      fetchDisputes()
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  const columns = [
    { key: 'id', label: 'Case', render: (row) => row.id || row._id },
    { key: 'orderId', label: 'Order' },
    { key: 'reason', label: 'Reason' },
    { key: 'priority', label: 'Priority', render: (row) => <StatusBadge value={row.priority} /> },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'createdAt', label: 'Opened', render: (row) => dateLabel(row.createdAt) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        row.status !== 'resolved' ? (
          <span className="table-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-dark" style={{ padding: '2px 8px', fontSize: '0.75rem' }} type="button" onClick={() => handleUpdateStatus(row.id || row._id, 'resolved')}>
              Resolve
            </button>
            <button className="btn" style={{ padding: '2px 8px', fontSize: '0.75rem', border: '1px solid #ddd' }} type="button" onClick={() => handleUpdateStatus(row.id || row._id, 'under_review')}>
              Review
            </button>
          </span>
        ) : (
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Resolved</span>
        )
      )
    }
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading disputes...</p></div>
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Delivery Disputes</h2>
            <span>Resolve OTP failures, false claims, and escrow exceptions.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={disputesList} />
      </section>
    </div>
  )
}

export default AdminDisputesPage


