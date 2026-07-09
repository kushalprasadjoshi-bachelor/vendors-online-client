import { env } from '../config/env'
import { products, reviews, stores } from '../data/mockData'
import { apiClient } from './apiClient'

export const catalogService = {
  async getStores() {
    if (env.enableMocks) return stores
    return apiClient.get('/stores')
  },
  async getStoreBySlug(slug) {
    if (env.enableMocks) return stores.find((store) => store.slug === slug)
    return apiClient.get(`/stores/${slug}`)
  },
  async getProducts(storeSlug = null) {
    if (env.enableMocks) {
      return storeSlug
        ? products.filter((product) => product.storeSlug === storeSlug)
        : products
    }

    return apiClient.get(storeSlug ? `/stores/${storeSlug}/products` : '/products')
  },
  async getProductBySlug(productSlug) {
    if (env.enableMocks) return products.find((product) => product.slug === productSlug)
    return apiClient.get(`/products/${productSlug}`)
  },
  async getProductReviews(productId) {
    if (env.enableMocks) return reviews.filter((review) => review.productId === productId)
    return apiClient.get(`/products/${productId}/reviews`)
  },
}

