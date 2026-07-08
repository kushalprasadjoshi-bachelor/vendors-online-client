import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const Breadcrumbs = ({ items }) => (
  <nav className="breadcrumbs" aria-label="Breadcrumbs">
    {items.map((item, index) => (
      <span key={`${item.label}-${index}`}>
        {item.path ? <Link to={item.path}>{item.label}</Link> : <strong>{item.label}</strong>}
        {index < items.length - 1 && <ChevronRight size={16} aria-hidden="true" />}
      </span>
    ))}
  </nav>
)

export default Breadcrumbs

