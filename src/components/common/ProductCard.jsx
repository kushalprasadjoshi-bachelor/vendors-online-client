import { Link } from 'react-router-dom'
import { productPath } from '../../config/routes'
import { currency } from '../../utils/formatters'
import Stars from './Stars'

const ProductCard = ({ product }) => (
  <article className="product-card">
    <Link to={productPath(product.storeSlug, product.slug)} className="product-card-media">
      <img src={product.images[0]} alt={product.name} loading="lazy" />
    </Link>
    <Link to={productPath(product.storeSlug, product.slug)} className="item-title">
      {product.name}
    </Link>
    <Stars rating={product.rating} />
    <div className="price-row">
      <strong>{currency(product.price)}</strong>
      {product.compareAtPrice && <span>{currency(product.compareAtPrice)}</span>}
      {product.discountPercent > 0 && <small>-{product.discountPercent}%</small>}
    </div>
  </article>
)

export default ProductCard

