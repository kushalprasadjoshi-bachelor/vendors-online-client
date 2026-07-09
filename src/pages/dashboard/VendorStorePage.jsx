import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../plugins/authContext'
import { catalogService } from '../../services/catalogService'
import { apiClient } from '../../services/apiClient'

const VendorStorePage = () => {
  const { user } = useAuth()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStore = async () => {
    if (!user) return
    try {
      const stores = await catalogService.getStores()
      const myShop = stores.find(s => s.ownerId === user.id)
      if (myShop) {
        setShop(myShop)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStore()
  }, [user])

  const handleSave = async (event) => {
    event.preventDefault()
    if (!shop) return
    const form = event.currentTarget

    const name = form.elements.name.value
    const category = form.elements.category.value
    const description = form.elements.description.value
    const banner = form.elements.banner.value

    try {
      await apiClient.patch(`/shop/${shop.id}`, {
        name,
        category,
        description,
        banner,
      })
      alert('Storefront updated successfully!')
      loadStore()
    } catch (err) {
      alert(err.message || 'Failed to save store')
    }
  }

  if (loading) {
    return <div className="dashboard-content"><p>Loading store settings...</p></div>
  }

  if (!shop) {
    return <div className="dashboard-content"><p>No store found. Try registering a new vendor account.</p></div>
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel store-editor">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Storefront Settings</h2>
            <span>Shop information and branding details for customers.</span>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSave}>
          <label>Store Name<input name="name" defaultValue={shop.name} required /></label>
          <label>Category<input name="category" defaultValue={shop.categories ? shop.categories[0] : ''} required /></label>
          <label className="full">Description<textarea name="description" defaultValue={shop.description} rows={5} /></label>
          <label className="full">Banner URL<input name="banner" defaultValue={shop.bannerUrl} required /></label>
          <button className="btn btn-dark" type="submit"><Save size={18} />Save Storefront</button>
        </form>
      </section>
    </div>
  )
}

export default VendorStorePage


