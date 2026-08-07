import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import ProductCard from '../../components/common/ProductCard'
import StoreCard from '../../components/common/StoreCard'
import { routes } from '../../config/routes'
import { catalogService } from '../../services/catalogService'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const query = searchParams.get('query') || ''

  useEffect(() => {
    if (!query) {
      setProducts([])
      setStores([])
      return
    }

    Promise.all([
      catalogService.getProducts(null, { search: query }),
      catalogService.getStores({ search: query }),
    ])
      .then(([productList, storeList]) => {
        setProducts(productList)
        setStores(storeList)
      })
      .catch(console.error)
  }, [query])

  const handleSearch = (event) => {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('query')?.toString().trim()
    setSearchParams(value ? { query: value } : {})
  }

  return (
    <section className="container-shell catalog-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Search' }]} />
      <div className="search-page-heading">
        <h1>Search</h1>
        <form className="search-box search-page-form" onSubmit={handleSearch}>
          <Search size={20} aria-hidden="true" />
          <input name="query" type="search" defaultValue={query} placeholder="Search shops and products" />
        </form>
      </div>

      <div className="tabs-row" role="tablist" aria-label="Search result type">
        <button className={tab === 'products' ? 'active' : ''} type="button" onClick={() => setTab('products')}>
          Products ({products.length})
        </button>
        <button className={tab === 'stores' ? 'active' : ''} type="button" onClick={() => setTab('stores')}>
          Shops ({stores.length})
        </button>
      </div>

      {tab === 'products' ? (
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((store) => <StoreCard store={store} key={store.id} />)}
        </div>
      )}
      {query && tab === 'products' && products.length === 0 && <p className="muted-line">No matching products found.</p>}
      {query && tab === 'stores' && stores.length === 0 && <p className="muted-line">No matching shops found.</p>}
      {!query && <p className="muted-line">Search for a product, shop, category, or location.</p>}
    </section>
  )
}

export default SearchPage
