import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../../config/routes'
import { catalogService } from '../../services/catalogService'
import { numberCompact } from '../../utils/formatters'

const Herosection = () => {
  const [stats, setStats] = useState({ vendors: 0, products: 0, customers: 0 })

  useEffect(() => {
    catalogService.getStats().then(setStats).catch(console.error)
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>FIND YOUR BEST MATCHES FROM HOME</h1>
        <p>
          Browse through diverse range of vendors connected with us and their products,
          designed to bring out your daily needs down to your doorstep just in a single click.
        </p>
        <div className="hero-buttons">
          <Link className="btn btn-dark" to={routes.products}>Shop Now</Link>
          <Link className="btn btn-dark" to={routes.stores}>Stores</Link>
        </div>
        <div className="hero-stats" aria-label="Marketplace statistics">
          <span><strong>{numberCompact(stats.vendors)}</strong> National Vendors</span>
          <span><strong>{numberCompact(stats.products)}</strong> High-Quality Products</span>
          <span><strong>{numberCompact(stats.customers)}</strong> Happy Customers</span>
        </div>
      </div>

      <div className="hero-media">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
          alt="Customers shopping in a storefront"
        />
      </div>
    </section>
  )
}

export default Herosection
