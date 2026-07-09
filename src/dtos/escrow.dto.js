export const createEscrowTransactionDto = ({
  id = '',
  orderId = '',
  customerId = '',
  vendorId = '',
  amount = 0,
  status = 'held',
  releaseCondition = 'otp_delivery_confirmation',
  releasedAt = null,
  createdAt = new Date().toISOString(),
} = {}) => ({
  id,
  orderId,
  customerId,
  vendorId,
  amount,
  status,
  releaseCondition,
  releasedAt,
  createdAt,
})

