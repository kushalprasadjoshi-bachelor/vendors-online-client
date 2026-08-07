import { Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../plugins/authContext'
import { apiClient } from '../../services/apiClient'
import { catalogService } from '../../services/catalogService'
import { fileToDataUrl } from '../../utils/files'

const VendorStorePage = () => {
  const { user } = useAuth()
  const [shop, setShop] = useState(null)
  const [bannerPreview, setBannerPreview] = useState('')
  const [loading, setLoading] = useState(true)

  const loadStore = async () => {
    if (!user) return
    try {
      const stores = await catalogService.getVendorStores(user.id)
      const myShop = stores[0]
      if (myShop) {
        setShop(myShop)
        setBannerPreview(myShop.bannerUrl || myShop.imageUrl || '')
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

  const handleBannerUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBannerPreview(await fileToDataUrl(file))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (!shop) return
    const form = event.currentTarget

    try {
      await apiClient.patch(`/shop/${shop.id}`, {
        name: form.elements.name.value,
        category: form.elements.category.value,
        location: form.elements.location.value,
        description: form.elements.description.value,
        banner: bannerPreview,
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
          <label>Location<input name="location" defaultValue={shop.city || ''} placeholder="Kathmandu" /></label>
          <label>Banner Image<input type="file" accept="image/*" onChange={handleBannerUpload} /></label>
          <label className="full">Description<textarea name="description" defaultValue={shop.description} rows={5} /></label>
          {bannerPreview && (
            <div className="store-banner-preview full">
              <img src={bannerPreview} alt="Store banner preview" />
            </div>
          )}
          <button className="btn btn-dark" type="submit"><Save size={18} />Save Storefront</button>
        </form>
      </section>
    </div>
  )
}

export default VendorStorePage
