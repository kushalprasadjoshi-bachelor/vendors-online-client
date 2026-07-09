export const ratingToStars = (rating = 0) => {
  const rounded = Math.round(rating * 2) / 2

  return Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1

    if (rounded >= starValue) return 'full'
    if (rounded + 0.5 === starValue) return 'half'
    return 'empty'
  })
}

