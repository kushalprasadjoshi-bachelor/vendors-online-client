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
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Edit user">
            <div className="modal-heading">
              <h2>Edit User</h2>
              <button className="icon-button" type="button" onClick={() => setEditingUser(null)} aria-label="Close user form">x</button>
            </div>
            <form className="form-grid single-column" onSubmit={handleEdit}>
              <label>Name<input name="name" defaultValue={editingUser.name} required /></label>
              <label>Email<input name="email" type="email" defaultValue={editingUser.email} required /></label>
              <label>Phone<input name="phone" defaultValue={editingUser.phone} required /></label>
              <label>
                Role
                <select name="role" defaultValue={editingUser.role}>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>
                Status
                <select name="status" defaultValue={editingUser.status || 'active'}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </label>
              <label>New Password<input name="password" type="password" placeholder="Leave blank to keep current password" /></label>
              <button className="btn btn-dark" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save User'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage
