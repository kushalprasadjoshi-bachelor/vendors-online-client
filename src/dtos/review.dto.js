export const createReviewDto = ({
  id = '',
  productId = '',
  userId = '',
  name = '',
  rating = 5,
  comment = '',
  verified = true,
  createdAt = new Date().toISOString(),
} = {}) => ({
  id,
  productId,
  userId,
  name,
  rating,
  comment,
  verified,
  createdAt,
})

