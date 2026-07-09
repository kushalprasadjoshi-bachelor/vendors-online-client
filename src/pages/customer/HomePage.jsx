import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Herosection from '../../components/containers/Herosection'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import Stars from '../../components/common/Stars'
import StoreCard from '../../components/common/StoreCard'
import { routes } from '../../config/routes'
import { locations, testimonials } from '../../data/mockData'
import { catalogService } from '../../services/catalogService'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredStores, setFeaturedStores] = useState([])

  useEffect(() => {
    catalogService.getProducts().then((prods) => setFeaturedProducts(prods.slice(0, 4))).catch(console.error)
    catalogService.getStores().then((sts) => setFeaturedStores(sts.slice(0, 4))).catch(console.error)
  }, [])

  return (
    <>
      <div className="container-shell">
        <Herosection />
      </div>

      <div className="hero-divider" />

      <section className="container-shell page-section">
        <SectionHeader
          title="BUY PRODUCTS"
          action={<Link className="pill-link" to={featuredStores[0] ? `/stores/${featuredStores[0].slug}` : routes.stores}>View All</Link>}
        />
        <div className="product-grid compact-grid">
          {featuredProducts.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>

      <section className="container-shell page-section">
        <SectionHeader
          title="VISIT STORES"
          action={<Link className="pill-link" to={routes.stores}>View All</Link>}
        />
        <div className="store-grid compact-grid">
          {featuredStores.map((store) => <StoreCard store={store} key={store.id} />)}
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
}

export default HomePage


