import { Edit3, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { apiClient } from '../../services/apiClient'
import { dateLabel } from '../../utils/formatters'

const AdminUsersPage = () => {
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadUsers = () => {
    apiClient.get('/user')
      .then((data) => {
        setUsersList(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleEdit = async (event) => {
    event.preventDefault()
    if (!editingUser) return
    const form = new FormData(event.currentTarget)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      phone: form.get('phone'),
      role: form.get('role'),
      status: form.get('status'),
    }
    const password = form.get('password')
    if (password) payload.password = password

    setSaving(true)
    try {
      await apiClient.patch(`/user/${editingUser.id || editingUser._id}`, payload)
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      alert(error.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.name}?`)) return
    try {
      await apiClient.delete(`/user/${row.id || row._id}`)
      loadUsers()
    } catch (error) {
      alert(error.message || 'Failed to delete user')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (row) => <StatusBadge value={row.role} /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status || 'active'} /> },
    { key: 'createdAt', label: 'Joined', render: (row) => dateLabel(row.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="table-actions">
          <button type="button" aria-label="Edit user" onClick={() => setEditingUser(row)}><Edit3 size={17} /></button>
          <button type="button" aria-label="Delete user" onClick={() => handleDelete(row)}><Trash2 size={17} /></button>
        </span>
      ),
    },
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

      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" role="presentation">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-lg shadow-lg overflow-hidden" role="dialog" aria-modal="true" aria-label="Edit user">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Edit User</h2>
              <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" type="button" onClick={() => setEditingUser(null)} aria-label="Close user form">×</button>
            </div>
            <form className="px-6 py-5 grid gap-4" onSubmit={handleEdit}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
                <input name="name" defaultValue={editingUser.name} required className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                <input name="email" type="email" defaultValue={editingUser.email} required className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
                <input name="phone" defaultValue={editingUser.phone} required className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none" />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</span>
                <select name="role" defaultValue={editingUser.role} className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                <select name="status" defaultValue={editingUser.status || 'active'} className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</span>
                <input name="password" type="password" placeholder="Leave blank to keep current password" className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none" />
              </label>

              <div className="pt-2">
                <button className="inline-flex items-center justify-center rounded-md bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-60" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
