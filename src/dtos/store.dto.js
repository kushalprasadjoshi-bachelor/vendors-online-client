import { slugify } from '../utils/slug'

export const createStoreDto = ({
  id = '',
  name = '',
  ownerId = '',
  slug = '',
  city = '',
  country = 'Nepal',
  description = '',
  rating = 0,
  reviewCount = 0,
  imageUrl = '',
  bannerUrl = '',
  categories = [],
  status = 'active',
  createdAt = new Date().toISOString(),
} = {}) => ({
  id,
  name: name.trim(),
  ownerId,
  slug: slug || slugify(name),
  city,
  country,
  description,
  rating,
  reviewCount,
  imageUrl,
  bannerUrl,
  categories,
  status,
  createdAt,
})

