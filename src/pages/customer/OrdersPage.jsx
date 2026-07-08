import { CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { routes } from '../../config/routes'
import { orders } from '../../data/mockData'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const OrdersPage = () => {
  const [confirmed, setConfirmed] = useState({})
  const [otp, setOtp] = useState('')

  const handleConfirm = async (orderId) => {
    const result = await orderService.confirmDelivery(orderId, otp)
    setConfirmed((current) => ({ ...current, [orderId]: result }))
    setOtp('')
  }

  return (
    <section className="container-shell orders-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Orders' }]} />
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => {
          const result = confirmed[order.id]
          const deliveryStatus = result?.deliveryStatus || order.deliveryStatus
          const paymentStatus = result?.paymentStatus || order.paymentStatus

          return (
            <article className="order-card" key={order.id}>
              <div>
                <span>{dateLabel(order.createdAt)}</span>
                <h2>{order.id}</h2>
                <p>{order.items.map((item) => item.name).join(', ')}</p>
              </div>
              <div className="order-meta">
                <strong>{currency(order.total)}</strong>
                <StatusBadge value={deliveryStatus} />
                <StatusBadge value={paymentStatus} />
              </div>
              {deliveryStatus !== 'delivered' ? (
                <form className="otp-form" onSubmit={(event) => { event.preventDefault(); handleConfirm(order.id) }}>
                  <input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Delivery OTP" />
                  <button className="btn btn-dark" type="submit">Confirm Delivery</button>
                </form>
              ) : (
                <div className="verified-line"><CheckCircle size={18} />Delivery confirmed</div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default OrdersPage

