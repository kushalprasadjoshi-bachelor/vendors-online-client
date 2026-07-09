import { env } from '../config/env'
import { disputes, escrowTransactions, orders } from '../data/mockData'
import { apiClient } from './apiClient'

export const orderService = {
  async getOrders() {
    if (env.enableMocks) return orders
    return apiClient.get('/orders')
  },
  async createOrder(dto) {
    if (env.enableMocks) {
      return {
        ...dto,
        id: `VO-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentStatus: 'escrow_held',
        deliveryStatus: 'processing',
        otpCode: String(Math.floor(100000 + Math.random() * 900000)),
      }
    }

    return apiClient.post('/orders', dto)
  },
  async confirmDelivery(orderId, otpCode) {
    if (env.enableMocks) {
      return { orderId, otpCode, deliveryStatus: 'delivered', paymentStatus: 'released' }
    }

    return apiClient.post(`/orders/${orderId}/confirm-delivery`, { otpCode })
  },
  async getEscrowTransactions() {
    if (env.enableMocks) return escrowTransactions
    return apiClient.get('/escrow')
  },
  async getDisputes() {
    if (env.enableMocks) return disputes
    return apiClient.get('/disputes')
  },
}

