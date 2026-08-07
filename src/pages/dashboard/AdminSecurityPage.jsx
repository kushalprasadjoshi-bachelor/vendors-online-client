import { KeyRound, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { useAuth } from '../../plugins/authContext'
import { apiClient } from '../../services/apiClient'
import { storage } from '../../utils/storage'

const auditKey = 'vendors_online_audit_log'

const AdminSecurityPage = () => {
  const { logout, user } = useAuth()
  const [auditLog, setAuditLog] = useState(() => storage.get(auditKey, []))
  const token = storage.get('vendors_online_token')

  const pushAudit = (message) => {
    const next = [{ message, createdAt: new Date().toISOString() }, ...auditLog].slice(0, 10)
    setAuditLog(next)
    storage.set(auditKey, next)
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    const confirmPassword = form.get('confirmPassword')

    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    try {
      await apiClient.patch(`/user/${user.id}`, { password })
      pushAudit('Admin password changed')
      event.currentTarget.reset()
      alert('Password changed successfully.')
    } catch (error) {
      alert(error.message || 'Failed to change password')
    }
  }

  const handleEndSession = () => {
    pushAudit('Admin session ended')
    logout()
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Security</h2>
            <span>Password, sessions, and audit activity.</span>
          </div>
          <StatusBadge value="admin" />
        </div>
        <div className="security-grid">
          <form className="form-grid single-column" onSubmit={handlePasswordChange}>
            <h3><KeyRound size={18} />Change Admin Password</h3>
            <label>New Password<input name="password" type="password" minLength={6} required /></label>
            <label>Confirm Password<input name="confirmPassword" type="password" minLength={6} required /></label>
            <button className="btn btn-dark" type="submit">Update Password</button>
          </form>

          <div className="security-card">
            <h3><ShieldCheck size={18} />Active Session</h3>
            <p>{user?.email}</p>
            <span>{token ? `${token.slice(0, 14)}...` : 'No token found'}</span>
            <button className="pill-link" type="button" onClick={handleEndSession}><LogOut size={18} />End Session</button>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Audit Log</h2>
            <span>Recent local administrative security events.</span>
          </div>
        </div>
        <div className="audit-list">
          {auditLog.map((item) => (
            <div key={`${item.message}-${item.createdAt}`}>
              <strong>{item.message}</strong>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
          ))}
          {auditLog.length === 0 && <p className="muted-line">No security events recorded yet.</p>}
        </div>
      </section>
    </div>
  )
}

export default AdminSecurityPage
