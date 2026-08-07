import { storage } from '../utils/storage'
import { apiClient } from './apiClient'
import { catalogService } from './catalogService'

export const orderService = {
  async getOrders() {
    const user = storage.get('vendors_online_user')
    if (!user) return []

    if (user.role === 'customer') {
      return apiClient.get(`/order/customer/${user.id}`)
    } else if (user.role === 'vendor') {
      const shops = await catalogService.getVendorStores(user.id)
      const shopId = shops[0]?.id
      if (shopId) {
        return apiClient.get(`/order/shop/${shopId}`)
      }
      return []
    } else {
      // admin
      return apiClient.get('/order')
    }
  },

  async createOrder(dto) {
    // Send customerId as the logged in user id
    const user = storage.get('vendors_online_user')
    const payload = {
      ...dto,
      customerId: user ? user.id : dto.customerId,
    }
    return apiClient.post('/order', payload)
  },

  async confirmDelivery(orderId, otpCode) {
    return apiClient.post(`/order/${orderId}/confirm-delivery`, { otpCode })
  },

  async getEscrowTransactions() {
    return apiClient.get('/transaction')
  },

  async getDisputes() {
    return apiClient.get('/dispute')
  },

  async createDispute(dto) {
    return apiClient.post('/dispute', dto)
  },

  async updateDispute(disputeId, dto) {
    return apiClient.patch(`/dispute/${disputeId}`, dto)
  },

  async updateDisputeStatus(disputeId, status) {
    return apiClient.patch(`/dispute/${disputeId}`, { status })
  },

  async deleteDispute(disputeId) {
    return apiClient.delete(`/dispute/${disputeId}`)
  },

  async updateTransaction(transactionId, dto) {
    return apiClient.patch(`/transaction/${transactionId}`, dto)
  },

  async deleteTransaction(transactionId) {
    return apiClient.delete(`/transaction/${transactionId}`)
  },
}
