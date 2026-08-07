import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import ShopReviewSection from '../../components/common/ShopReviewSection'
import { routes, storePath } from '../../config/routes'
import { catalogService } from '../../services/catalogService'

const PAGE_SIZE = 12

const StoreProductsPage = () => {
  const { storeSlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [store, setStore] = useState(null)
  const [storeProducts, setStoreProducts] = useState([])
  const [page, setPage] = useState(1)
  const sort = searchParams.get('sort') || 'latest'

  useEffect(() => {
    if (storeSlug) {
      catalogService.getStoreBySlug(storeSlug).then(setStore).catch(console.error)
    }
  }, [storeSlug])

  useEffect(() => {
    if (storeSlug) {
      catalogService.getProducts(storeSlug, { sort }).then(setStoreProducts).catch(console.error)
      setPage(1)
    }
  }, [sort, storeSlug])

  const setSort = (value) => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', value)
    setSearchParams(next)
  }

  if (!store) {
    return (
      <section className="container-shell catalog-page">
        <p>Loading store...</p>
      </section>
    )
  }

  const totalPages = Math.max(1, Math.ceil(storeProducts.length / PAGE_SIZE))
  const visibleProducts = storeProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const showingFrom = storeProducts.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const showingTo = Math.min(page * PAGE_SIZE, storeProducts.length)

  return (
    <section className="container-shell catalog-page">
      <Breadcrumbs
        items={[
          { label: 'Home', path: routes.home },
          { label: 'Stores', path: routes.stores },
          { label: store.name, path: storePath(store.slug) },
        ]}
      />
      <div className="store-banner">
        <img src={store.bannerUrl || store.imageUrl} alt={store.name} />
        <div>
          <h1>{store.name}</h1>
          <p>{store.description}</p>
          <span>{store.city || 'Online'}, {store.country}</span>
        </div>
      </div>
      <SectionHeader
        title="Our Products"
        meta={`Showing ${showingFrom}-${showingTo} of ${storeProducts.length} Products`}
        action={(
          <label className="select-inline">
            Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="latest">Latest</option>
              <option value="cheapest">Cheapest</option>
              <option value="expensive">Most Expensive</option>
              <option value="popular">Most Popular</option>
              <option value="sale">On Sale First</option>
            </select>
          </label>
        )}
      />
      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
      {visibleProducts.length === 0 && <p className="muted-line">This store has no products yet.</p>}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      <ShopReviewSection shop={store} />
    </section>
  )
}

export default StoreProductsPage
