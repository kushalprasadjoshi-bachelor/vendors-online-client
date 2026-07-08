const Herosection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>FIND YOUR BEST MATCHES FROM HOME</h1>
        <p>
          Browse through diverse range of vendors connected with us and their products,
          designed to bring out your daily needs down to your doorstep just in a single click.
        </p>
        <div className="hero-buttons">
          <a className="btn btn-dark" href="/stores/sagarmatha-store">Shop Now</a>
          <a className="btn btn-dark" href="/stores">Stores</a>
        </div>
        <div className="hero-stats" aria-label="Marketplace statistics">
          <span><strong>200+</strong> National Vendors</span>
          <span><strong>2,000+</strong> High-Quality Products</span>
          <span><strong>30,000+</strong> Happy Customers</span>
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
