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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" role="presentation">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10" role="dialog" aria-modal="true" aria-label="Write shop review">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Review {shop.name}</h2>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200" type="button" onClick={() => setModalOpen(false)} aria-label="Close review form">x</button>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  name="rating"
                  defaultValue="5"
                  required
                  className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option value={rating} key={rating}>{rating} stars</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  name="comment"
                  rows={4}
                  required
                  placeholder="Share your experience"
                  className="mt-2 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                className="inline-flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                type="submit"
                disabled={submitting}
              >
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
