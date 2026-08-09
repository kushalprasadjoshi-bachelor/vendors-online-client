import { Star } from "lucide-react";
import { ratingToStars } from "../../utils/rating";
import { formatRating } from "../../utils/formatters";

const Stars = ({ rating, showValue = true }) => (
  <span className="rating-row" aria-label={`${rating} out of 5 stars`}>
    <span
      className="stars"
      style={{ display: "inline-flex", gap: "0.25rem", alignItems: "center" }}
    >
      {ratingToStars(rating).map((state, index) => (
        <Star
          key={`${state}-${index}`}
          size={17}
          className={`star ${state}`}
          style={{ color: state === "empty" ? "#ccc" : "#f5c518" }}
          fill="currentColor"
          aria-hidden="true"
        />
      ))}
    </span>
    {showValue && (
      <span className="rating-value">{formatRating(rating)}/5</span>
    )}
  </span>
);

export default Stars;
