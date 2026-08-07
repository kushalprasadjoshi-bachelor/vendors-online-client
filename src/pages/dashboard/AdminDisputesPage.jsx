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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Edit Dispute</h2>
                <p className="mt-1 text-sm text-slate-500">Adjust the dispute details and save changes.</p>
              </div>
              <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" type="button" onClick={() => setEditingDispute(null)} aria-label="Close dispute form">×</button>
            </div>
            <form className="grid gap-4" onSubmit={handleSave}>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Reason
                <input name="reason" defaultValue={editingDispute.reason} required className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Amount
                <input name="amount" type="number" min="0" defaultValue={editingDispute.amount || 0} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Priority
                  <select name="priority" defaultValue={editingDispute.priority || 'medium'} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Status
                  <select name="status" defaultValue={editingDispute.status || 'open'} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200">
                    <option value="open">Open</option>
                    <option value="under_review">Under Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Description
                <textarea name="description" rows={3} defaultValue={editingDispute.description} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Admin Note
                <textarea name="adminNote" rows={3} defaultValue={editingDispute.adminNote} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
              </label>
              <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Dispute'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDisputesPage
