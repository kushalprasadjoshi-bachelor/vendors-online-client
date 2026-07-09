export const createCartItemDto = ({
  productId = '',
  storeId = '',
  name = '',
  price = 0,
  imageUrl = '',
  color = '',
  size = '',
  quantity = 1,
} = {}) => ({
  productId,
  storeId,
  name,
  price,
  imageUrl,
  color,
  size,
  quantity: Math.max(1, Number(quantity) || 1),
})

export const createCartSummaryDto = ({ items = [], discountPercent = 20, deliveryFee = 15 } = {}) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = Math.round((subtotal * discountPercent) / 100)
  const total = subtotal - discount + deliveryFee

  return {
    subtotal,
    discount,
    discountPercent,
    deliveryFee,
    total,
  }
}

