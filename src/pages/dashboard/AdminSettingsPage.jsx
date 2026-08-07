import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { storage } from '../../utils/storage'

const settingsKey = 'vendors_online_admin_settings'

const defaultSettings = {
  siteName: 'VendorsOnline',
  supportEmail: 'support@vendorsonline.test',
  defaultDeliveryFee: 15,
  maintenanceMode: false,
  orderNotifications: true,
  disputeNotifications: true,
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    setSettings(storage.get(settingsKey, defaultSettings))
  }, [])

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    storage.set(settingsKey, settings)
    alert('Settings saved successfully.')
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Platform Settings</h2>
            <span>Configure core marketplace behavior and notifications.</span>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>Site Name<input value={settings.siteName} onChange={(event) => updateSetting('siteName', event.target.value)} required /></label>
          <label>Support Email<input value={settings.supportEmail} type="email" onChange={(event) => updateSetting('supportEmail', event.target.value)} required /></label>
          <label>Default Delivery Fee<input value={settings.defaultDeliveryFee} type="number" min="0" onChange={(event) => updateSetting('defaultDeliveryFee', Number(event.target.value))} /></label>
          <label className="toggle-line form-toggle">
            <input checked={settings.maintenanceMode} type="checkbox" onChange={(event) => updateSetting('maintenanceMode', event.target.checked)} />
            Maintenance mode
          </label>
          <label className="toggle-line form-toggle">
            <input checked={settings.orderNotifications} type="checkbox" onChange={(event) => updateSetting('orderNotifications', event.target.checked)} />
            Order notifications
          </label>
          <label className="toggle-line form-toggle">
            <input checked={settings.disputeNotifications} type="checkbox" onChange={(event) => updateSetting('disputeNotifications', event.target.checked)} />
            Dispute notifications
          </label>
          <button className="btn btn-dark" type="submit"><Save size={18} />Save Settings</button>
        </form>
      </section>
    </div>
  )
}

export default AdminSettingsPage
