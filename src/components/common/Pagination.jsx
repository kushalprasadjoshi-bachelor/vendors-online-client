import { ArrowLeft, ArrowRight } from 'lucide-react'

const Pagination = () => (
  <nav className="pagination-row" aria-label="Pagination">
    <button type="button"><ArrowLeft size={18} />Previous</button>
    <div>
      {[1, 2, 3].map((page) => (
        <button className={page === 1 ? 'active' : ''} type="button" key={page}>{page}</button>
      ))}
      <span>...</span>
      {[8, 9, 10].map((page) => (
        <button type="button" key={page}>{page}</button>
      ))}
    </div>
    <button type="button">Next<ArrowRight size={18} /></button>
  </nav>
)

export default Pagination

