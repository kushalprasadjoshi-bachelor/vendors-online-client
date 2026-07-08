import { ArrowRight, Minus, Plus, Tag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/common/Breadcrumbs'
import { routes } from '../../config/routes'
import { useCart } from '../../plugins/cartContext'
import { currency } from '../../utils/formatters'

const CartPage = () => {
  const { items, lineKey, removeFromCart, summary, updateQuantity } = useCart()

  return (
    <section className="container-shell cart-page">
      <Breadcrumbs items={[{ label: 'Home', path: routes.home }, { label: 'Cart' }]} />
      <h1>Your cart</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Browse local vendors and add products before checkout.</p>
          <Link className="btn btn-dark" to={routes.stores}>Browse Stores</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const key = lineKey(item)

              return (
                <article className="cart-item" key={key}>
                  <img src={item.imageUrl} alt={item.name} />
                  <div>
                    <h2>{item.name}</h2>
                    <span>Size: {item.size}</span>
                    <span>Color: {item.color}</span>
                    <strong>{currency(item.price)}</strong>
                  </div>
                  <button className="delete-button" type="button" onClick={() => removeFromCart(key)} aria-label={`Remove ${item.name}`}>
                    <Trash2 size={22} />
                  </button>
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(key, item.quantity - 1)} aria-label="Decrease quantity">
                      <Minus size={18} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(key, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={18} />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="summary-card">
            <h2>Order Summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{currency(summary.subtotal)}</dd></div>
              <div><dt>Discount (-{summary.discountPercent}%)</dt><dd className="danger">-{currency(summary.discount)}</dd></div>
              <div><dt>Delivery Fee</dt><dd>{currency(summary.deliveryFee)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{currency(summary.total)}</dd></div>
            </dl>
            <div className="promo-input">
              <Tag size={20} />
              <input placeholder="Add promo code" />
              <button type="button">Apply</button>
            </div>
            <Link className="btn btn-dark wide" to={routes.checkout}>
              Go to Checkout <ArrowRight size={20} />
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}

export default CartPage

