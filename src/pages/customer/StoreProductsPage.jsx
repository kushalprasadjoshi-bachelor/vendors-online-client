import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import { routes, storePath } from '../../config/routes'
import { catalogService } from '../../services/catalogService'

const StoreProductsPage = () => {
  const { storeSlug } = useParams()
  const [store, setStore] = useState(null)
  const [storeProducts, setStoreProducts] = useState([])

  useEffect(() => {
    if (storeSlug) {
      catalogService.getStoreBySlug(storeSlug).then(setStore).catch(console.error)
      catalogService.getProducts(storeSlug).then(setStoreProducts).catch(console.error)
    }
  }, [storeSlug])

  if (!store) {
    return (
      <section className="container-shell catalog-page">
        <p>Loading store...</p>
      </section>
    )
  }

  return (
    <section className="container-shell catalog-page">
      <Breadcrumbs
        items={[
          { label: 'Home', path: routes.home },
          { label: 'Stores', path: routes.stores },
          { label: store.name, path: storePath(store.slug) },
        ]}
      />
      <SectionHeader
        title="Our Products"
        meta={`Showing 1-${storeProducts.length} of ${storeProducts.length} Products`}
        action={<button className="sort-button" type="button">Sort by: <strong>Most Popular</strong><ChevronDown size={18} /></button>}
      />
      <div className="product-grid">
        {storeProducts.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
      <Pagination />
    </section>
  )
}

export default StoreProductsPage


