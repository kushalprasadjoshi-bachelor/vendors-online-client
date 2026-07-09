export const createDisputeDto = ({
  id = '',
  orderId = '',
  openedBy = '',
  reason = '',
  status = 'open',
  priority = 'medium',
  amount = 0,
  createdAt = new Date().toISOString(),
} = {}) => ({
  id,
  orderId,
  openedBy,
  reason,
  status,
  priority,
  amount,
  createdAt,
})

