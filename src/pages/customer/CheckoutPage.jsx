import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { routes } from '../../config/routes'
import { createOrderDto } from '../../dtos'
import { useCart } from '../../plugins/cartContext'
import { orderService } from '../../services/orderService'
import { currency } from '../../utils/formatters'

const CheckoutPage = () => {
  const { clearCart, items, summary } = useCart()
  const [createdOrder, setCreatedOrder] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const order = await orderService.createOrder(createOrderDto({
      customerId: 'user_customer_001',
      storeId: items[0]?.storeId || 'store_001',
      items,
      ...summary,
      deliveryAddress: {
        name: form.get('name'),
        phone: form.get('phone'),
        city: form.get('city'),
        area: form.get('area'),
      },
    }))

    setCreatedOrder(order)
    clearCart()
  }

  if (createdOrder) {
    return (
      <section className="container-shell checkout-page">
        <div className="success-panel">
          <ShieldCheck size={42} />
          <h1>Order placed in escrow</h1>
          <p>Order {createdOrder.id} is waiting for vendor processing. Delivery OTP: <strong>{createdOrder.otpCode}</strong></p>
          <Link className="btn btn-dark" to={routes.orders}>View Orders</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="container-shell checkout-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Cart', path: routes.cart }, { label: 'Checkout' }]} />
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <form className="form-panel" onSubmit={handleSubmit}>
          <h2>Delivery Details</h2>
          <label>Name<input name="name" required placeholder="Your name" /></label>
          <label>Phone<input name="phone" required placeholder="98XXXXXXXX" /></label>
          <label>City<input name="city" required placeholder="Kathmandu" /></label>
          <label>Area<input name="area" required placeholder="Sitapaila" /></label>
          <div className="escrow-note">
            <ShieldCheck size={22} />
            <span>Payment is held in escrow and released only after OTP delivery confirmation.</span>
          </div>
          <button className="btn btn-dark wide" type="submit" disabled={items.length === 0}>
            Place Order
          </button>
        </form>
        <aside className="summary-card">
          <h2>Payment Preview</h2>
          <dl>
            <div><dt>Items</dt><dd>{items.length}</dd></div>
            <div><dt>Subtotal</dt><dd>{currency(summary.subtotal)}</dd></div>
            <div><dt>Discount</dt><dd className="danger">-{currency(summary.discount)}</dd></div>
            <div className="total"><dt>Escrow Hold</dt><dd>{currency(summary.total)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  )
}

export default CheckoutPage

