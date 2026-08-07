import { AlertTriangle, CheckCircle, Download, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { routes } from '../../config/routes'
import { useAuth } from '../../plugins/authContext'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const OrdersPage = () => {
  const { user } = useAuth()
  const [ordersList, setOrdersList] = useState([])
  const [confirmed, setConfirmed] = useState({})
  const [otpByOrder, setOtpByOrder] = useState({})
  const [disputeOrder, setDisputeOrder] = useState(null)
  const [printOrderId, setPrintOrderId] = useState(null)
  const [submittingDispute, setSubmittingDispute] = useState(false)

  const fetchOrders = () => {
    orderService.getOrders().then(setOrdersList).catch(console.error)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const handleAfterPrint = () => setPrintOrderId(null)
    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [])

  const handleConfirm = async (orderId) => {
    try {
      const result = await orderService.confirmDelivery(orderId, otpByOrder[orderId])
      setConfirmed((current) => ({ ...current, [orderId]: result }))
      setOtpByOrder((current) => ({ ...current, [orderId]: '' }))
      fetchOrders()
    } catch (err) {
      alert(err.message || 'OTP verification failed')
    }
  }

  const handlePrint = (orderId) => {
    setPrintOrderId(orderId)
    window.setTimeout(() => window.print(), 50)
  }

  const handleDisputeSubmit = async (event) => {
    event.preventDefault()
    if (!disputeOrder) return
    const form = new FormData(event.currentTarget)

    setSubmittingDispute(true)
    try {
      await orderService.createDispute({
        orderId: disputeOrder.id,
        reason: form.get('reason'),
        description: form.get('description'),
        priority: form.get('priority'),
        amount: disputeOrder.total,
      })
      alert('Dispute opened successfully.')
      setDisputeOrder(null)
      event.currentTarget.reset()
    } catch (error) {
      alert(error.message || 'Failed to open dispute')
    } finally {
      setSubmittingDispute(false)
    }
  }

  return (
    <section className={`container-shell orders-page ${printOrderId ? 'printing-order' : ''}`}>
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Orders' }]} />
      <h1>My Orders</h1>
      <div className="orders-list">
        {ordersList.map((order) => {
          const result = confirmed[order.id]
          const deliveryStatus = result?.deliveryStatus || order.deliveryStatus
          const paymentStatus = result?.paymentStatus || order.paymentStatus
          const subtotal = order.subtotal || order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
          const discount = order.discount || 0
          const deliveryFee = order.deliveryFee || Math.max(0, (order.total || 0) - subtotal + discount)

          return (
            <article className={`order-card bill-card ${printOrderId === order.id ? 'print-target' : ''}`} key={order.id}>
              <div className="bill-heading">
                <div>
                  <span>{dateLabel(order.createdAt)}</span>
                  <h2>Bill #{order.id}</h2>
                  <p>{order.shopName || 'Vendor shop'}</p>
                </div>
                <div className="order-meta">
                  <strong>{currency(order.total)}</strong>
                  <StatusBadge value={deliveryStatus} />
                  <StatusBadge value={paymentStatus} />
                </div>
              </div>

              <div className="bill-grid">
                <div>
                  <strong>Customer</strong>
                  <span>{order.customerName || order.deliveryAddress?.name || user?.name || 'Customer'}</span>
                  <span>{order.deliveryAddress?.phone || user?.phone || ''}</span>
                </div>
                <div>
                  <strong>Delivery Address</strong>
                  <span>{order.deliveryAddress?.city || 'City not provided'}</span>
                  <span>{order.deliveryAddress?.area || 'Area not provided'}</span>
                </div>
              </div>

              <div className="bill-items">
                <div className="bill-items-head">
                  <span>Item</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Total</span>
                </div>
                {order.items?.map((item) => (
                  <div className="bill-item-row" key={item.id || item.productId || item.name}>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>{currency(item.price)}</span>
                    <span>{currency(item.lineTotal || item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <dl className="bill-total-list">
                <div><dt>Subtotal</dt><dd>{currency(subtotal)}</dd></div>
                <div><dt>Discount</dt><dd>-{currency(discount)}</dd></div>
                <div><dt>Delivery Fee</dt><dd>{currency(deliveryFee)}</dd></div>
                <div><dt>Total</dt><dd>{currency(order.total)}</dd></div>
              </dl>

              {deliveryStatus !== 'delivered' ? (
                <>
                  <div className="otp-alert">
                    <AlertTriangle size={18} />
                    <span>Delivery OTP: <strong>{order.otpCode}</strong></span>
                  </div>
                  <form className="otp-form" onSubmit={(event) => { event.preventDefault(); handleConfirm(order.id) }}>
                    <input
                      value={otpByOrder[order.id] || ''}
                      onChange={(event) => setOtpByOrder((current) => ({ ...current, [order.id]: event.target.value }))}
                      placeholder="Enter delivery OTP"
                    />
                    <button className="btn btn-dark" type="submit">Confirm Delivery</button>
                  </form>
                </>
              ) : (
                <div className="verified-line"><CheckCircle size={18} />Delivery confirmed</div>
              )}

              <div className="bill-actions no-print">
                <button className="pill-link" type="button" onClick={() => handlePrint(order.id)}>
                  <Download size={18} />Download Bill
                </button>
                {deliveryStatus !== 'delivered' && (
                  <button className="pill-link danger-link" type="button" onClick={() => setDisputeOrder(order)}>
                    <ShieldAlert size={18} />Open Dispute
                  </button>
                )}
              </div>
            </article>
          )
        })}
        {ordersList.length === 0 && <p>No orders found.</p>}
      </div>

      {disputeOrder && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Open dispute">
            <div className="modal-heading">
              <h2>Open Dispute</h2>
              <button className="icon-button" type="button" onClick={() => setDisputeOrder(null)} aria-label="Close dispute form">x</button>
            </div>
            <form className="form-grid single-column" onSubmit={handleDisputeSubmit}>
              <label>
                Reason
                <input name="reason" required placeholder="OTP issue, delivery issue, payment issue" />
              </label>
              <label>
                Priority
                <select name="priority" defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="full">
                Description
                <textarea name="description" rows={4} required placeholder="Describe what happened" />
              </label>
              <button className="btn btn-dark" type="submit" disabled={submittingDispute}>
                {submittingDispute ? 'Opening...' : 'Open Dispute'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default OrdersPage
