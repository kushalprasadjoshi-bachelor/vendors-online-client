import { Save } from 'lucide-react'
import { stores } from '../../data/mockData'

const VendorStorePage = () => {
  const store = stores[0]

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel store-editor">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Storefront Settings</h2>
            <span>Shop information and branding details for customers.</span>
          </div>
        </div>
        <form className="form-grid">
          <label>Store Name<input defaultValue={store.name} /></label>
          <label>City<input defaultValue={store.city} /></label>
          <label>Categories<input defaultValue={store.categories.join(', ')} /></label>
          <label>Status<select defaultValue={store.status}><option>active</option><option>paused</option></select></label>
          <label className="full">Description<textarea defaultValue={store.description} rows={5} /></label>
          <label className="full">Banner URL<input defaultValue={store.bannerUrl} /></label>
          <button className="btn btn-dark" type="button"><Save size={18} />Save Storefront</button>
        </form>
      </section>
    </div>
  )
}

export default VendorStorePage

