import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import SectionHeader from '../../components/common/SectionHeader'
import StoreCard from '../../components/common/StoreCard'
import { routes } from '../../config/routes'
import { catalogService } from '../../services/catalogService'

const PAGE_SIZE = 12

const StoresPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [stores, setStores] = useState([])
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const search = searchParams.get('query') || searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'latest'

  useEffect(() => {
    const params = { sort }
    if (category) params.category = category
    if (location) params.location = location
    if (search) params.search = search

    catalogService.getStores(params).then(setStores).catch(console.error)
    setPage(1)
  }, [category, location, search, sort])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE))
  const visibleStores = stores.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const showingFrom = stores.length ? (page - 1) * PAGE_SIZE + 1 : 0
  const showingTo = Math.min(page * PAGE_SIZE, stores.length)

  return (
    <section className="container-shell catalog-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Stores' }]} />
      <SectionHeader
        title={category || location || search ? 'Filtered Stores' : 'Our Stores'}
        meta={`Showing ${showingFrom}-${showingTo} of ${stores.length} Stores`}
        action={(
          <label className="select-inline">
            Sort by
            <select value={sort} onChange={(event) => setParam('sort', event.target.value)}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="nameAZ">Name A-Z</option>
              <option value="nameZA">Name Z-A</option>
            </select>
          </label>
        )}
      />
      {(category || location || search) && (
        <div className="active-filters">
          {category && <button type="button" onClick={() => setParam('category', '')}>Category: {category} x</button>}
          {location && <button type="button" onClick={() => setParam('location', '')}>Location: {location} x</button>}
          {search && <button type="button" onClick={() => setParam('query', '')}>Search: {search} x</button>}
        </div>
      )}
      <div className="store-grid">
        {visibleStores.map((store) => (
          <StoreCard store={store} key={store.id} />
        ))}
      </div>
      {visibleStores.length === 0 && <p className="muted-line">No stores match this filter.</p>}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  )
}

export default StoresPage
