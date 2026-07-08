import { ChevronDown } from 'lucide-react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import { routes, storePath } from '../../config/routes'
import { products, stores } from '../../data/mockData'

const StoreProductsPage = () => {
  const { storeSlug } = useParams()
  const store = stores.find((item) => item.slug === storeSlug) || stores[0]
  const storeProducts = products.filter((product) => product.storeSlug === store.slug)

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
        meta="Showing 1-12 of 100 Products"
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

