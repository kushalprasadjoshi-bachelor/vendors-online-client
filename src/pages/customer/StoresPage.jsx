import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import SectionHeader from '../../components/common/SectionHeader'
import StoreCard from '../../components/common/StoreCard'
import { routes } from '../../config/routes'
import { catalogService } from '../../services/catalogService'

const StoresPage = () => {
  const [stores, setStores] = useState([])

  useEffect(() => {
    catalogService.getStores().then(setStores).catch(console.error)
  }, [])

  return (
    <section className="container-shell catalog-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Stores' }]} />
      <SectionHeader
        title="Our Stores"
        meta={`Showing 1-${stores.length} of ${stores.length} Stores`}
        action={<button className="sort-button" type="button">Sort by: <strong>Most Popular</strong><ChevronDown size={18} /></button>}
      />
      <div className="store-grid">
        {stores.map((store) => (
          <StoreCard store={store} key={store.id} />
        ))}
      </div>
      <Pagination />
    </section>
  )
}

export default StoresPage


