import { ChevronDown } from 'lucide-react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import Pagination from '../../components/common/Pagination'
import SectionHeader from '../../components/common/SectionHeader'
import StoreCard from '../../components/common/StoreCard'
import { routes } from '../../config/routes'
import { stores } from '../../data/mockData'

const repeatedStores = Array.from({ length: 3 }, () => stores).flat()

const StoresPage = () => (
  <section className="container-shell catalog-page">
    <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Stores' }]} />
    <SectionHeader
      title="Our Stores"
      meta="Showing 1-12 of 100 Stores"
      action={<button className="sort-button" type="button">Sort by: <strong>Most Popular</strong><ChevronDown size={18} /></button>}
    />
    <div className="store-grid">
      {repeatedStores.map((store, index) => (
        <StoreCard store={store} key={`${store.id}-${index}`} />
      ))}
    </div>
    <Pagination />
  </section>
)

export default StoresPage

