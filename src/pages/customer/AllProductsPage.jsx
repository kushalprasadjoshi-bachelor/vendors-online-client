import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import { routes } from '../../config/routes'
import { catalogService } from '../../services/catalogService'

const PAGE_SIZE = 12

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'latest'
  const onSale = searchParams.get('onSale') === 'true'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    catalogService.getCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const params = { sort }
    if (category) params.category = category
    if (onSale) params.onSale = 'true'

    catalogService.getProducts(null, params).then(setProducts).catch(console.error)
    setPage(1)
  }, [category, onSale, sort])

  const filteredProducts = useMemo(() => products.filter((product) => {
    if (minPrice && product.price < Number(minPrice)) return false
    if (maxPrice && product.price > Number(maxPrice)) return false
    return true
  }), [maxPrice, minPrice, products])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const showingFrom = filteredProducts.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const showingTo = Math.min(page * PAGE_SIZE, filteredProducts.length)

  return (
    <section className="container-shell catalog-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Products' }]} />
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="filter-title"><SlidersHorizontal size={18} /><strong>Filters</strong></div>
          <label>
            Category
            <select value={category} onChange={(event) => setParam('category', event.target.value)}>
              <option value="">All categories</option>
              {categories.map((item) => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Min price
            <input value={minPrice} type="number" min="0" onChange={(event) => setParam('minPrice', event.target.value)} />
          </label>
          <label>
            Max price
            <input value={maxPrice} type="number" min="0" onChange={(event) => setParam('maxPrice', event.target.value)} />
          </label>
          <label className="toggle-line">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(event) => setParam('onSale', event.target.checked ? 'true' : '')}
            />
            On sale only
          </label>
        </aside>

        <div>
          <SectionHeader
            title="All Products"
            meta={`Showing ${showingFrom}-${showingTo} of ${filteredProducts.length} Products`}
            action={(
              <label className="select-inline">
                Sort by
                <select value={sort} onChange={(event) => setParam('sort', event.target.value)}>
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
          {visibleProducts.length === 0 && <p className="muted-line">No products match those filters.</p>}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  )
}

export default AllProductsPage
