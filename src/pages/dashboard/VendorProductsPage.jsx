import { Edit3, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { useAuth } from '../../plugins/authContext'
import { apiClient } from '../../services/apiClient'
import { catalogService } from '../../services/catalogService'
import { filesToDataUrls } from '../../utils/files'
import { currency } from '../../utils/formatters'

const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  stock: '',
  category: 'General',
  onSale: false,
  colors: '',
  sizes: '',
  images: [],
}

const VendorProductsPage = () => {
  const { user } = useAuth()
  const [productsList, setProductsList] = useState([])
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadProducts = async () => {
    if (!user) return
    try {
      const stores = await catalogService.getVendorStores(user.id)
      const myShop = stores[0]
      if (myShop) {
        setShop(myShop)
        const prods = await catalogService.getProducts(myShop.id)
        setProductsList(prods)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [user])

  const openAddModal = () => {
    setEditingProduct(null)
    setProductForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.originalPrice || product.compareAtPrice || product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      category: product.category || 'General',
      onSale: Boolean(product.onSale),
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      images: product.images || [],
    })
    setModalOpen(true)
  }

  const updateForm = (field, value) => {
    setProductForm((current) => ({ ...current, [field]: value }))
  }

  const handleImageUpload = async (event) => {
    const images = await filesToDataUrls(event.target.files)
    if (images.length) updateForm('images', images)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!shop) {
      alert('Shop not found for vendor')
      return
    }

    const payload = {
      shopId: shop.id,
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      stock: Number(productForm.stock),
      category: productForm.category || 'General',
      onSale: productForm.onSale || Boolean(productForm.discountPrice),
      colors: productForm.colors.split(',').map((item) => item.trim()).filter(Boolean),
      sizes: productForm.sizes.split(',').map((item) => item.trim()).filter(Boolean),
      images: productForm.images.length ? productForm.images : [fallbackImage],
    }

    setSaving(true)
    try {
      if (editingProduct) {
        await apiClient.patch(`/shop/product/${editingProduct.id}`, payload)
      } else {
        await apiClient.post('/shop/product', payload)
      }
      setModalOpen(false)
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return
    try {
      await apiClient.delete(`/shop/product/${product.id}`)
      await loadProducts()
    } catch (err) {
      alert(err.message || 'Failed to delete product')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <span className="table-product">
          <img src={row.images[0] || fallbackImage} alt="" />
          {row.name}
        </span>
      ),
    },
    { key: 'category', label: 'Category', render: (row) => row.category || 'General' },
    { key: 'price', label: 'Price', render: (row) => currency(row.price) },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.onSale ? 'on sale' : row.status || 'active'} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="table-actions">
          <button type="button" aria-label="Edit product" onClick={() => openEditModal(row)}><Edit3 size={17} /></button>
          <button type="button" aria-label="Delete product" onClick={() => handleDeleteProduct(row)}><Trash2 size={17} /></button>
        </span>
      ),
    },
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading products...</p></div>
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Product Listings</h2>
            <span>Add, update, and remove vendor products.</span>
          </div>
          <button className="btn btn-dark" type="button" onClick={openAddModal}><Plus size={18} />Add Product</button>
        </div>
        <DataTable columns={columns} rows={productsList} />
      </section>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel wide-modal" role="dialog" aria-modal="true" aria-label="Product form">
            <div className="modal-heading">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="icon-button" type="button" onClick={() => setModalOpen(false)} aria-label="Close product form">x</button>
            </div>
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>Name<input value={productForm.name} onChange={(event) => updateForm('name', event.target.value)} required /></label>
              <label>Category<input value={productForm.category} onChange={(event) => updateForm('category', event.target.value)} required /></label>
              <label>Price<input value={productForm.price} type="number" min="0" onChange={(event) => updateForm('price', event.target.value)} required /></label>
              <label>Discount Price<input value={productForm.discountPrice} type="number" min="0" onChange={(event) => updateForm('discountPrice', event.target.value)} /></label>
              <label>Stock<input value={productForm.stock} type="number" min="0" onChange={(event) => updateForm('stock', event.target.value)} required /></label>
              <label className="toggle-line form-toggle">
                <input checked={productForm.onSale} type="checkbox" onChange={(event) => updateForm('onSale', event.target.checked)} />
                On sale
              </label>
              <label>Colors<input value={productForm.colors} onChange={(event) => updateForm('colors', event.target.value)} placeholder="#111111, #2563EB" /></label>
              <label>Sizes<input value={productForm.sizes} onChange={(event) => updateForm('sizes', event.target.value)} placeholder="S, M, L, XL" /></label>
              <label className="full">Description<textarea value={productForm.description} onChange={(event) => updateForm('description', event.target.value)} rows={4} required /></label>
              <label className="full">Images<input type="file" accept="image/*" multiple onChange={handleImageUpload} /></label>
              {productForm.images.length > 0 && (
                <div className="image-preview-row full">
                  {productForm.images.map((imageUrl) => <img src={imageUrl} alt="" key={imageUrl} />)}
                </div>
              )}
              <button className="btn btn-dark" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorProductsPage
