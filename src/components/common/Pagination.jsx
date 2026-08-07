import { ArrowLeft, ArrowRight } from 'lucide-react'

const pageWindow = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
  if (currentPage <= 3) {
    pages.add(2)
    pages.add(3)
    pages.add(4)
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1)
    pages.add(totalPages - 2)
    pages.add(totalPages - 3)
  }

  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b)
    .reduce((items, page, index, pagesList) => {
      if (index > 0 && page - pagesList[index - 1] > 1) items.push('ellipsis')
      items.push(page)
      return items
    }, [])
}

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange = () => {} }) => {
  if (totalPages <= 1) return null

  const goTo = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <nav className="pagination-row" aria-label="Pagination">
      <button type="button" disabled={currentPage === 1} onClick={() => goTo(currentPage - 1)}>
        <ArrowLeft size={18} />Previous
      </button>
      <div>
        {pageWindow(currentPage, totalPages).map((page, index) => (
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <button
              className={page === currentPage ? 'active' : ''}
              type="button"
              key={page}
              onClick={() => goTo(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>
      <button type="button" disabled={currentPage === totalPages} onClick={() => goTo(currentPage + 1)}>
        Next<ArrowRight size={18} />
      </button>
    </nav>
  )
}

export default Pagination
