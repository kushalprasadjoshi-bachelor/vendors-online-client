export const routes = {
  home: '/',
  stores: '/stores',
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  login: '/login',
  register: '/register',
  vendor: '/vendor',
  vendorProducts: '/vendor/products',
  vendorOrders: '/vendor/orders',
  vendorStore: '/vendor/store',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminDisputes: '/admin/disputes',
  adminTransactions: '/admin/transactions',
}

export const storePath = (storeSlug) => `/stores/${storeSlug}`

export const productPath = (storeSlug, productSlug) => (
  `/stores/${storeSlug}/products/${productSlug}`
)

