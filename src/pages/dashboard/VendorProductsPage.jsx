import { Edit3, Plus, Trash2 } from 'lucide-react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { products } from '../../data/mockData'
import { currency } from '../../utils/formatters'

const VendorProductsPage = () => {
  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (row) => (
        <span className="table-product">
          <img src={row.images[0]} alt="" />
          {row.name}
        </span>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (row) => currency(row.price) },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <span className="table-actions">
          <button type="button" aria-label="Edit product"><Edit3 size={17} /></button>
          <button type="button" aria-label="Delete product"><Trash2 size={17} /></button>
        </span>
      ),
    },
  ]

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Product Listings</h2>
            <span>Add, update, and remove vendor products.</span>
          </div>
          <button className="btn btn-dark" type="button"><Plus size={18} />Add Product</button>
        </div>
        <DataTable columns={columns} rows={products} />
      </section>
    </div>
  )
}

export default VendorProductsPage

