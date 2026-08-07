import { CheckCircle, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../../plugins/authContext'
import { catalogService } from '../../services/catalogService'
import { dateLabel } from '../../utils/formatters'
import SectionHeader from './SectionHeader'
import Stars from './Stars'

const ShopReviewSection = ({ shop }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = () => {
    if (!shop?.id) return
    catalogService.getShopReviews(shop.id).then(setReviews).catch(console.error)
  }

  useEffect(() => {
    loadReviews()
  }, [shop?.id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!user) {
      alert('Please login to write a shop review.')
      return
    }

    const form = new FormData(event.currentTarget)
    setSubmitting(true)
    try {
      await catalogService.addShopReview(shop.id, {
        rating: Number(form.get('rating')),
        comment: form.get('comment'),
      })
      setModalOpen(false)
      event.currentTarget.reset()
      loadReviews()
    } catch (error) {
      alert(error.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!shop) return null

  return (
    <section className="reviews-section shop-reviews-section">
      <SectionHeader
        title={`Shop Reviews (${reviews.length})`}
        action={(
          <div className="review-actions">
            <button className="icon-button" type="button" aria-label="Filter shop reviews">
              <SlidersHorizontal size={18} />
            </button>
            <button className="btn btn-dark" type="button" onClick={() => setModalOpen(true)}>
              Write a Review
            </button>
          </div>
        )}
      />
      <div className="reviews-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.id}>
            <Stars rating={review.rating} showValue={false} />
            <h3>{review.authorName || review.name} <CheckCircle size={16} /></h3>
            <p>"{review.comment}"</p>
            <span>Posted on {dateLabel(review.createdAt)}</span>
          </article>
        ))}
        {reviews.length === 0 && <p className="muted-line">No shop reviews yet.</p>}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Write shop review">
            <div className="modal-heading">
              <h2>Review {shop.name}</h2>
              <button className="icon-button" type="button" onClick={() => setModalOpen(false)} aria-label="Close review form">x</button>
            </div>
            <form className="form-grid single-column" onSubmit={handleSubmit}>
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
              <button className="btn btn-dark" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ShopReviewSection
