import { ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const VendorOrdersPage = () => {
  const [ordersList, setOrdersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [disputeOrder, setDisputeOrder] = useState(null)
  const [submittingDispute, setSubmittingDispute] = useState(false)

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

  const handleDisputeSubmit = async (event) => {
    event.preventDefault()
    if (!disputeOrder) return
    const form = new FormData(event.currentTarget)
    setSubmittingDispute(true)
    try {
      await orderService.createDispute({
        orderId: disputeOrder.id,
        reason: form.get('reason'),
        description: form.get('description'),
        priority: form.get('priority'),
        amount: disputeOrder.total,
      })
      alert('Dispute opened successfully.')
      setDisputeOrder(null)
    } catch (error) {
      alert(error.message || 'Failed to open dispute')
    } finally {
      setSubmittingDispute(false)
    }
  }

  const columns = [
    { key: 'id', label: 'Order' },
    { key: 'customerName', label: 'Customer', render: (row) => row.customerName || 'Customer' },
    { key: 'createdAt', label: 'Date', render: (row) => dateLabel(row.createdAt) },
    { key: 'items', label: 'Items', render: (row) => row.items ? row.items.map((item) => item.name).join(', ') : '' },
    { key: 'total', label: 'Total', render: (row) => currency(row.total) },
    { key: 'deliveryStatus', label: 'Delivery', render: (row) => <StatusBadge value={row.deliveryStatus} /> },
    { key: 'paymentStatus', label: 'Escrow', render: (row) => <StatusBadge value={row.paymentStatus} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="table-actions">
          <button type="button" aria-label="Open dispute" onClick={() => setDisputeOrder(row)}><ShieldAlert size={17} /></button>
        </span>
      ),
    },
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

      {disputeOrder && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Open dispute">
            <div className="modal-heading">
              <h2>Open Dispute</h2>
              <button className="icon-button" type="button" onClick={() => setDisputeOrder(null)} aria-label="Close dispute form">x</button>
            </div>
            <form className="form-grid single-column" onSubmit={handleDisputeSubmit}>
              <label>Reason<input name="reason" required placeholder="Delivery or payment concern" /></label>
              <label>
                Priority
                <select name="priority" defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="full">Description<textarea name="description" rows={4} required placeholder="Describe the issue" /></label>
              <button className="btn btn-dark" type="submit" disabled={submittingDispute}>
                {submittingDispute ? 'Opening...' : 'Open Dispute'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorOrdersPage
