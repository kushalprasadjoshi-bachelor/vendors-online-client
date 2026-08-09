import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../config/routes";
import { catalogService } from "../../services/catalogService";
import { numberCompact } from "../../utils/formatters";
import happyCoupleImage from "../../assets/happy-couple-after-successful-shopping.jpg";

const Herosection = () => {
  const [stats, setStats] = useState({ vendors: 0, products: 0, customers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    catalogService.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>FIND YOUR BEST MATCHES FROM HOME</h1>
        <p>
          Browse through diverse range of vendors connected with us and their
          products, designed to bring out your daily needs down to your doorstep
          just in a single click.
        </p>
        <div className="hero-buttons" style={{ marginTop: "2rem" }}>
          <button
            type="button"
            className="btn btn-dark flex items-center justify-center text-center"
            onClick={() => navigate(routes.products)}
          >
            Shop Now
          </button>
          <button
            type="button"
            className="btn btn-dark flex items-center justify-center text-center"
            onClick={() => navigate(routes.stores)}
          >
            Stores
          </button>
        </div>
        <div className="hero-stats" aria-label="Marketplace statistics">
          <span>
            <strong>{numberCompact(stats.vendors)}</strong> National Vendors
          </span>
          <span>
            <strong>{numberCompact(stats.products)}</strong> High-Quality
            Products
          </span>
          <span>
            <strong>{numberCompact(stats.customers)}</strong> Happy Customers
          </span>
        </div>
      </div>

      <div className="hero-media">
        <img
          src={happyCoupleImage}
          alt="Happy customers after successful shopping"
        />
      </div>
    </section>
  );
};

export default Herosection;
