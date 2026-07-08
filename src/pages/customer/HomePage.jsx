import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Herosection from '../../components/containers/Herosection'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import Stars from '../../components/common/Stars'
import StoreCard from '../../components/common/StoreCard'
import { routes } from '../../config/routes'
import { locations, products, stores, testimonials } from '../../data/mockData'

const HomePage = () => (
  <>
    <div className="container-shell">
      <Herosection />
    </div>

    <div className="hero-divider" />

    <section className="container-shell page-section">
      <SectionHeader
        title="BUY PRODUCTS"
        action={<Link className="pill-link" to={`/stores/${stores[0].slug}`}>View All</Link>}
      />
      <div className="product-grid compact-grid">
        {products.slice(4, 8).map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    </section>

    <section className="container-shell page-section">
      <SectionHeader
        title="VISIT STORES"
        action={<Link className="pill-link" to={routes.stores}>View All</Link>}
      />
      <div className="store-grid compact-grid">
        {stores.map((store) => <StoreCard store={store} key={store.id} />)}
      </div>
    </section>

    <section className="container-shell page-section">
      <div className="location-panel">
        <h2>BROWSE BY LOCATION</h2>
        <div className="location-grid">
          {locations.map((location, index) => (
            <Link className={`location-tile tile-${index + 1}`} to={routes.stores} key={location.name}>
              <img src={location.imageUrl} alt={location.name} loading="lazy" />
              <span>{location.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="container-shell page-section">
      <SectionHeader
        title="OUR HAPPY CUSTOMERS"
        action={(
          <div className="arrow-actions" aria-label="Testimonials navigation">
            <button type="button" aria-label="Previous testimonial">←</button>
            <button type="button" aria-label="Next testimonial">→</button>
          </div>
        )}
      />
      <div className="testimonial-row">
        {testimonials.map((testimonial) => (
          <article className="review-card" key={testimonial.id}>
            <Stars rating={testimonial.rating} showValue={false} />
            <h3>{testimonial.name}</h3>
            <p>“{testimonial.comment}”</p>
          </article>
        ))}
        <Link className="review-card testimonial-link" to={routes.stores}>
          <span>Explore stores</span>
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  </>
)

export default HomePage

