import { Edit3, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { useAuth } from '../../plugins/authContext'
import { catalogService } from '../../services/catalogService'
import { apiClient } from '../../services/apiClient'
import { currency } from '../../utils/formatters'

const VendorProductsPage = () => {
  const { user } = useAuth()
  const [productsList, setProductsList] = useState([])
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    if (!user) return
    try {
      const stores = await catalogService.getStores()
      const myShop = stores.find(s => s.ownerId === user.id)
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

  const handleAddProduct = async () => {
    if (!shop) return alert('Shop not found for vendor')
    const name = prompt('Product Name:')
    if (!name) return
    const description = prompt('Description:')
    if (!description) return
    const price = parseFloat(prompt('Price:') || '0')
    const stock = parseInt(prompt('Stock:') || '0', 10)
    const imageUrl = prompt('Image URL:', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500')
    if (!imageUrl) return

    try {
      await apiClient.post('/shop/product', {
        shopId: shop.id,
        name,
        description,
        price,
        stock,
        images: [imageUrl],
      })
      alert('Product added successfully!')
      loadProducts()
    } catch (err) {
      alert(err.message || 'Failed to add product')
    }
  }

  const handleEditProduct = async (product) => {
    const name = prompt('Product Name:', product.name)
    if (!name) return
    const description = prompt('Description:', product.description)
    if (!description) return
    const price = parseFloat(prompt('Price:', String(product.price)) || '0')
    const stock = parseInt(prompt('Stock:', String(product.stock)) || '0', 10)

    try {
      await apiClient.patch(`/shop/product/${product.id}`, {
        name,
        description,
        price,
        stock,
      })
      alert('Product updated successfully!')
      loadProducts()
    } catch (err) {
      alert(err.message || 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return
    try {
      await apiClient.delete(`/shop/product/${product.id}`)
      alert('Product deleted successfully!')
      loadProducts()
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
          <img src={row.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'} alt="" />
          {row.name}
        </span>
      ),
    },
    { key: 'category', label: 'Category', render: (row) => row.category || 'General' },
    { key: 'price', label: 'Price', render: (row) => currency(row.price) },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status || 'active'} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <span className="table-actions">
          <button type="button" aria-label="Edit product" onClick={() => handleEditProduct(row)}><Edit3 size={17} /></button>
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
          <button className="btn btn-dark" type="button" onClick={handleAddProduct}><Plus size={18} />Add Product</button>
        </div>
        <DataTable columns={columns} rows={productsList} />
      </section>
    </div>
  )
}

export default VendorProductsPage


