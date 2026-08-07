import { Edit3, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const AdminDisputesPage = () => {
  const [disputesList, setDisputesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingDispute, setEditingDispute] = useState(null)
  const [saving, setSaving] = useState(false)

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
      fetchDisputes()
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!editingDispute) return
    const form = new FormData(event.currentTarget)
    setSaving(true)
    try {
      await orderService.updateDispute(editingDispute.id || editingDispute._id, {
        reason: form.get('reason'),
        description: form.get('description'),
        priority: form.get('priority'),
        status: form.get('status'),
        amount: Number(form.get('amount')),
        adminNote: form.get('adminNote'),
      })
      setEditingDispute(null)
      fetchDisputes()
    } catch (error) {
      alert(error.message || 'Failed to save dispute')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm('Delete this dispute?')) return
    try {
      await orderService.deleteDispute(row.id || row._id)
      fetchDisputes()
    } catch (error) {
      alert(error.message || 'Failed to delete dispute')
    }
  }

  const columns = [
    { key: 'id', label: 'Case', render: (row) => row.id || row._id },
    { key: 'orderId', label: 'Order' },
    { key: 'openedBy', label: 'Opened By', render: (row) => row.openedByName || row.openedBy },
    { key: 'reason', label: 'Reason' },
    { key: 'priority', label: 'Priority', render: (row) => <StatusBadge value={row.priority} /> },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'createdAt', label: 'Opened', render: (row) => dateLabel(row.createdAt) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="table-actions">
          {row.status !== 'resolved' && (
            <>
              <button type="button" aria-label="Resolve dispute" onClick={() => handleUpdateStatus(row.id || row._id, 'resolved')}>R</button>
              <button type="button" aria-label="Review dispute" onClick={() => handleUpdateStatus(row.id || row._id, 'under_review')}>V</button>
            </>
          )}
          <button type="button" aria-label="Edit dispute" onClick={() => setEditingDispute(row)}><Edit3 size={17} /></button>
          <button type="button" aria-label="Delete dispute" onClick={() => handleDelete(row)}><Trash2 size={17} /></button>
        </span>
      ),
    },
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

      {editingDispute && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Edit dispute">
            <div className="modal-heading">
              <h2>Edit Dispute</h2>
              <button className="icon-button" type="button" onClick={() => setEditingDispute(null)} aria-label="Close dispute form">x</button>
            </div>
            <form className="form-grid single-column" onSubmit={handleSave}>
              <label>Reason<input name="reason" defaultValue={editingDispute.reason} required /></label>
              <label>Amount<input name="amount" type="number" min="0" defaultValue={editingDispute.amount || 0} /></label>
              <label>
                Priority
                <select name="priority" defaultValue={editingDispute.priority || 'medium'}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label>
                Status
                <select name="status" defaultValue={editingDispute.status || 'open'}>
                  <option value="open">Open</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                </select>
              </label>
              <label className="full">Description<textarea name="description" rows={3} defaultValue={editingDispute.description} /></label>
              <label className="full">Admin Note<textarea name="adminNote" rows={3} defaultValue={editingDispute.adminNote} /></label>
              <button className="btn btn-dark" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Dispute'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDisputesPage
