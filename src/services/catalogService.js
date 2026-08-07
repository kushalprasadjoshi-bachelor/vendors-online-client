import { apiClient } from "./apiClient";
import { createStoreDto } from "../dtos/store.dto";
import { createProductDto } from "../dtos/product.dto";

const mapShop = (item) =>
  createStoreDto({
    id: item._id || item.id,
    name: item.name,
    ownerId: item.vendorId,
    slug: item._id || item.id,
    description: item.description,
    categories: [item.category],
    bannerUrl: item.banner,
    imageUrl: item.banner,
    location: item.location || "",
    city: item.location || "",
    rating: item.reviews?.length
      ? item.reviews.reduce((s, r) => s + r.rating, 0) / item.reviews.length
      : 0,
    reviewCount: item.reviews?.length || 0,
    createdAt: item.createdAt,
  });

const normalizeReview = (item) => ({
  id: item._id || item.id,
  userId: item.userId,
  name: item.authorName || item.name || item.author || "Anonymous",
  authorName: item.authorName || item.name || item.author || "Anonymous",
  authorRole: item.authorRole || "",
  rating: Number(item.rating || 0),
  comment: item.comment || "",
  createdAt: item.createdAt || new Date().toISOString(),
});

const mapProduct = (item) =>
  createProductDto({
    id: item._id || item.id,
    storeId: item.shopId,
    storeSlug: item.shopId,
    name: item.name,
    slug: item._id || item.id,
    category: item.category || "General",
    description: item.description,
    price: item.discountPrice || item.price,
    originalPrice: item.price,
    discountPrice: item.discountPrice || null,
    compareAtPrice: item.discountPrice ? item.price : null,
    discountPercent: item.discountPrice
      ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
      : 0,
    onSale: item.onSale || !!item.discountPrice,
    stock: item.stock,
    colors: item.colors || [],
    sizes: item.sizes || [],
    images: item.images || [],
    imageUrl: item.images?.[0] || "",
    rating: item.reviews?.length
      ? item.reviews.reduce((s, r) => s + r.rating, 0) / item.reviews.length
      : 0,
    reviewCount: item.reviews?.length || 0,
    createdAt: item.createdAt,
  });

export const catalogService = {
  async getStores(params = {}) {
    const query = new URLSearchParams(params).toString();
    const list = await apiClient.get(`/shop${query ? `?${query}` : ""}`);
    return list.map(mapShop);
  },

  async getVendorStores(vendorId) {
    const list = await apiClient.get(`/shop/vendor/${vendorId}`);
    return list.map(mapShop);
  },

  async getCategories() {
    return apiClient.get("/shop/categories");
  },

  async getStats() {
    return apiClient.get("/shop/stats");
  },

  async getStoreBySlug(slug) {
    const item = await apiClient.get(`/shop/${slug}`);
    return mapShop(item);
  },

  async getProducts(storeSlug = null, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = storeSlug
      ? `/shop/product/shop/${storeSlug}${query ? `?${query}` : ""}`
      : `/shop/product${query ? `?${query}` : ""}`;
    const list = await apiClient.get(url);
    return list.map(mapProduct);
  },

  async getProductBySlug(productSlug) {
    const item = await apiClient.get(`/shop/product/${productSlug}`);
    return mapProduct(item);
  },

  async getProductReviews(productId) {
    try {
      const reviews = await apiClient.get(`/review/product/${productId}`);
      return reviews.map(normalizeReview);
    } catch {
      return [];
    }
  },

  async addProductReview(productId, dto) {
    return apiClient.post(`/review/product/${productId}`, dto);
  },

  async getShopReviews(shopId) {
    try {
      const reviews = await apiClient.get(`/review/shop/${shopId}`);
      return reviews.map(normalizeReview);
    } catch {
      return [];
    }
  },

  async addShopReview(shopId, dto) {
    return apiClient.post(`/review/shop/${shopId}`, dto);
  },

  async getWebsiteReviews() {
    try {
      const reviews = await apiClient.get("/review/website");
      return reviews.map(normalizeReview);
    } catch {
      return [];
    }
  },

  async addWebsiteReview(dto) {
    return apiClient.post("/review/website", dto);
  },
};
