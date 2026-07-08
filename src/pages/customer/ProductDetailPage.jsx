import { CheckCircle, Minus, Plus, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import Stars from '../../components/common/Stars'
import { routes, storePath } from '../../config/routes'
import { products, reviews, stores } from '../../data/mockData'
import { useCart } from '../../plugins/cartContext'
import { currency, dateLabel } from '../../utils/formatters'

const ProductDetailPage = () => {
  const { storeSlug, productSlug } = useParams()
  const product = products.find((item) => item.slug === productSlug) || products[0]
  const store = stores.find((item) => item.slug === storeSlug) || stores[0]
  const productReviews = reviews.filter((review) => review.productId === product.id)
  const related = products.filter((item) => item.id !== product.id).slice(0, 4)
  const [image, setImage] = useState(product.images[0])
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState(product.sizes[2] || product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const discountLabel = useMemo(() => {
    if (!product.discountPercent) return null
    return `-${product.discountPercent}%`
  }, [product.discountPercent])

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0],
      color,
      size,
      quantity,
    })
  }

  return (
    <section className="container-shell product-detail-page">
      <Breadcrumbs
        items={[
          { label: 'Home', path: routes.home },
          { label: 'Store', path: routes.stores },
          { label: store.name, path: storePath(store.slug) },
          { label: product.name },
        ]}
      />

      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className="thumbnail-column">
            {product.images.map((imageUrl) => (
              <button
                className={imageUrl === image ? 'active' : ''}
                type="button"
                key={imageUrl}
                onClick={() => setImage(imageUrl)}
              >
                <img src={imageUrl} alt="" />
              </button>
            ))}
          </div>
          <div className="main-product-image">
            <img src={image} alt={product.name} />
          </div>
        </div>

        <div className="product-info-panel">
          <h1>{product.name}</h1>
          <Stars rating={product.rating} />
          <div className="detail-price-row">
            <strong>{currency(product.price)}</strong>
            {product.compareAtPrice && <span>{currency(product.compareAtPrice)}</span>}
            {discountLabel && <small>{discountLabel}</small>}
          </div>
          <p>{product.description}</p>

          <div className="product-option-block">
            <span>Select Colors</span>
            <div className="swatch-row">
              {product.colors.map((item) => (
                <button
                  className={item === color ? 'active' : ''}
                  style={{ backgroundColor: item }}
                  type="button"
                  key={item}
                  onClick={() => setColor(item)}
                  aria-label={`Select color ${item}`}
                >
                  {item === color && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option-block">
            <span>Choose Size</span>
            <div className="size-row">
              {product.sizes.map((item) => (
                <button
                  className={item === size ? 'active' : ''}
                  type="button"
                  key={item}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="purchase-row">
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                <Minus size={18} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                <Plus size={18} />
              </button>
            </div>
            <button className="btn btn-dark wide" type="button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="product-tabs" role="tablist" aria-label="Product content">
        <button type="button">Product Details</button>
        <button className="active" type="button">Rating & Reviews</button>
        <button type="button">FAQs</button>
      </div>

      <section className="reviews-section">
        <SectionHeader
          title={`All Reviews (${product.reviewCount})`}
          action={(
            <div className="review-actions">
              <button className="icon-button" type="button" aria-label="Filter reviews"><SlidersHorizontal size={18} /></button>
              <button className="sort-button" type="button">Latest</button>
              <button className="btn btn-dark" type="button">Write a Review</button>
            </div>
          )}
        />
        <div className="reviews-grid">
          {productReviews.map((review) => (
            <article className="review-card" key={review.id}>
              <Stars rating={review.rating} showValue={false} />
              <h3>{review.name} <CheckCircle size={16} /></h3>
              <p>“{review.comment}”</p>
              <span>Posted on {dateLabel(review.createdAt)}</span>
            </article>
          ))}
        </div>
        <button className="pill-link centered" type="button">Load More Reviews</button>
      </section>

      <section className="page-section">
        <SectionHeader title="You might also like" />
        <div className="product-grid compact-grid">
          {related.map((item) => <ProductCard product={item} key={item.id} />)}
        </div>
      </section>
    </section>
  )
}

export default ProductDetailPage

