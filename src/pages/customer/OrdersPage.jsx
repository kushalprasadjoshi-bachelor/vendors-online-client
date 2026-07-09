import { CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { routes } from '../../config/routes'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const OrdersPage = () => {
  const [ordersList, setOrdersList] = useState([])
  const [confirmed, setConfirmed] = useState({})
  const [otp, setOtp] = useState('')

  const fetchOrders = () => {
    orderService.getOrders().then(setOrdersList).catch(console.error)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleConfirm = async (orderId) => {
    try {
      const result = await orderService.confirmDelivery(orderId, otp)
      setConfirmed((current) => ({ ...current, [orderId]: result }))
      setOtp('')
      fetchOrders()
    } catch (err) {
      alert(err.message || 'OTP verification failed')
    }
  }

  return (
    <section className="container-shell orders-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Orders' }]} />
      <h1>My Orders</h1>
      <div className="orders-list">
        {ordersList.map((order) => {
          const result = confirmed[order.id]
          const deliveryStatus = result?.deliveryStatus || order.deliveryStatus
          const paymentStatus = result?.paymentStatus || order.paymentStatus

          return (
            <article className="order-card" key={order.id}>
              <div>
                <span>{dateLabel(order.createdAt)}</span>
                <h2>{order.id}</h2>
                <p>{order.items ? order.items.map((item) => item.name).join(', ') : 'No items'}</p>
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
        {ordersList.length === 0 && <p>No orders found.</p>}
      </div>
    </section>
  )
}

export default OrdersPage


