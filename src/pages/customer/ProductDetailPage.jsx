import { CheckCircle, Minus, Plus, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import ProductCard from '../../components/common/ProductCard'
import SectionHeader from '../../components/common/SectionHeader'
import Stars from '../../components/common/Stars'
import { routes, storePath } from '../../config/routes'
import { useAuth } from '../../plugins/authContext'
import { useCart } from '../../plugins/cartContext'
import { catalogService } from '../../services/catalogService'
import { currency, dateLabel } from '../../utils/formatters'

const averageRating = (reviews) => (
  reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0
)

const ProductDetailPage = () => {
  const { storeSlug, productSlug } = useParams()
  const [product, setProduct] = useState(null)
  const [store, setStore] = useState(null)
  const [productReviews, setProductReviews] = useState([])
  const [related, setRelated] = useState([])
  const [image, setImage] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const { user } = useAuth()
  const { addToCart } = useCart()

  const refreshReviews = async (productId) => {
    const reviews = await catalogService.getProductReviews(productId)
    setProductReviews(reviews)
    setProduct((current) => current ? {
      ...current,
      rating: averageRating(reviews),
      reviewCount: reviews.length,
    } : current)
  }

  useEffect(() => {
    if (productSlug && storeSlug) {
      catalogService.getProductBySlug(productSlug)
        .then((prod) => {
          setProduct(prod)
          setImage(prod.images[0] || prod.imageUrl || '')

          const colorsList = prod.colors && prod.colors.length ? prod.colors : ['#000000', '#2563EB', '#EF4444']
          const sizesList = prod.sizes && prod.sizes.length ? prod.sizes : ['S', 'M', 'L', 'XL']
          setColor(colorsList[0])
          setSize(sizesList[1] || sizesList[0])

          refreshReviews(prod.id).catch(console.error)

          catalogService.getProducts().then((allProds) => {
            setRelated(allProds.filter((item) => item.id !== prod.id).slice(0, 4))
          }).catch(console.error)
        })
        .catch(console.error)

      catalogService.getStoreBySlug(storeSlug).then(setStore).catch(console.error)
    }
  }, [productSlug, storeSlug])

  const discountLabel = useMemo(() => {
    if (!product || !product.discountPercent) return null
    return `-${product.discountPercent}%`
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      productId: product.id,
      storeId: product.storeId,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] || product.imageUrl,
      color,
      size,
      quantity,
    })
  }

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    if (!user) {
      alert('Please login to write a product review.')
      return
    }

    const form = new FormData(event.currentTarget)
    setReviewSubmitting(true)
    try {
      await catalogService.addProductReview(product.id, {
        rating: Number(form.get('rating')),
        comment: form.get('comment'),
      })
      setReviewOpen(false)
      event.currentTarget.reset()
      await refreshReviews(product.id)
    } catch (error) {
      alert(error.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (!product || !store) {
    return (
      <section className="container-shell product-detail-page">
        <p>Loading product...</p>
      </section>
    )
  }

  const colorsList = product.colors && product.colors.length ? product.colors : ['#000000', '#2563EB', '#EF4444']
  const sizesList = product.sizes && product.sizes.length ? product.sizes : ['S', 'M', 'L', 'XL']

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
              {colorsList.map((item) => (
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
              {sizesList.map((item) => (
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
          title={`All Reviews (${productReviews.length})`}
          action={(
            <div className="review-actions">
              <button className="icon-button" type="button" aria-label="Filter reviews"><SlidersHorizontal size={18} /></button>
              <button className="sort-button" type="button">Latest</button>
              <button className="btn btn-dark" type="button" onClick={() => setReviewOpen(true)}>Write a Review</button>
            </div>
          )}
        />
        <div className="reviews-grid">
          {productReviews.map((review) => (
            <article className="review-card" key={review.id}>
              <Stars rating={review.rating} showValue={false} />
              <h3>{review.authorName || review.name} <CheckCircle size={16} /></h3>
              <p>"{review.comment}"</p>
              <span>Posted on {dateLabel(review.createdAt)}</span>
            </article>
          ))}
          {productReviews.length === 0 && <p className="muted-line">No product reviews yet.</p>}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader title="You might also like" />
        <div className="product-grid compact-grid">
          {related.map((item) => <ProductCard product={item} key={item.id} />)}
        </div>
      </section>

      {reviewOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Write product review">
            <div className="modal-heading">
              <h2>Review {product.name}</h2>
              <button className="icon-button" type="button" onClick={() => setReviewOpen(false)} aria-label="Close review form">x</button>
            </div>
            <form className="form-grid single-column" onSubmit={handleReviewSubmit}>
              <label>
                Rating
                <select name="rating" defaultValue="5" required>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option value={rating} key={rating}>{rating} stars</option>
                  ))}
                </select>
              </label>
              <label className="full">
                Comment
                <textarea name="comment" rows={4} required placeholder="Share your experience" />
              </label>
              <button className="btn btn-dark" type="submit" disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetailPage
