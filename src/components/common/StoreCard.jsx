import { Link } from 'react-router-dom'
import { storePath } from '../../config/routes'
import Stars from './Stars'

const StoreCard = ({ store }) => (
  <article className="store-card">
    <Link to={storePath(store.slug)} className="store-card-media">
      <img src={store.imageUrl} alt={store.name} loading="lazy" />
    </Link>
    <Link className="item-title" to={storePath(store.slug)}>
      {store.name}
    </Link>
    <p>{store.city}, {store.country}</p>
    <Stars rating={store.rating} />
  </article>
)

export default StoreCard

