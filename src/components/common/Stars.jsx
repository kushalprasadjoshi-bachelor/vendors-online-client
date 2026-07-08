import { Star } from 'lucide-react'
import { ratingToStars } from '../../utils/rating'

const Stars = ({ rating, showValue = true }) => (
  <span className="rating-row" aria-label={`${rating} out of 5 stars`}>
    <span className="stars">
      {ratingToStars(rating).map((state, index) => (
        <Star
          key={`${state}-${index}`}
          size={17}
          className={`star ${state}`}
          fill="currentColor"
          aria-hidden="true"
        />
      ))}
    </span>
    {showValue && <span className="rating-value">{rating}/5</span>}
  </span>
)

export default Stars

