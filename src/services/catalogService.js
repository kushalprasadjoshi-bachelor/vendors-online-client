import { apiClient } from './apiClient'
import { createStoreDto } from '../dtos/store.dto'
import { createProductDto } from '../dtos/product.dto'

export const catalogService = {
  async getStores() {
    const list = await apiClient.get('/shop')
    return list.map(item => createStoreDto({
      id: item._id,
      name: item.name,
      ownerId: item.vendorId,
      slug: item._id,
      description: item.description,
      categories: [item.category],
      bannerUrl: item.banner,
    }))
  },

  async getStoreBySlug(slug) {
    const item = await apiClient.get(`/shop/${slug}`)
    return createStoreDto({
      id: item._id,
      name: item.name,
      ownerId: item.vendorId,
      slug: item._id,
      description: item.description,
      categories: [item.category],
      bannerUrl: item.banner,
    })
  },

  async getProducts(storeSlug = null) {
    const url = storeSlug ? `/shop/product/shop/${storeSlug}` : '/shop/product'
    const list = await apiClient.get(url)
    return list.map(item => createProductDto({
      id: item._id,
      storeId: item.shopId,
      storeSlug: item.shopId,
      name: item.name,
      slug: item._id,
      description: item.description,
      price: item.price,
      stock: item.stock,
      images: item.images,
    }))
  },

  async getProductBySlug(productSlug) {
    const item = await apiClient.get(`/shop/product/${productSlug}`)
    return createProductDto({
      id: item._id,
      storeId: item.shopId,
      storeSlug: item.shopId,
      name: item.name,
      slug: item._id,
      description: item.description,
      price: item.price,
      stock: item.stock,
      images: item.images,
    })
  },

  async getProductReviews(productId) {
    // Reviews are not stored in database, so we return realistic mock data
    return [
      {
        id: `rev_1_${productId}`,
        productId,
        author: 'Prashant Subedi',
        rating: 5,
        comment: 'Excellent product! Extremely satisfied with the quality.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: `rev_2_${productId}`,
        productId,
        author: 'Sita Devkota',
        rating: 4,
        comment: 'Good product. Decent shipping time.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      }
    ]
  },
}
