import { useEffect, useState } from 'react'
import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orderService } from '../../services/orderService'
import { currency, dateLabel } from '../../utils/formatters'

const AdminTransactionsPage = () => {
  const [transactionsList, setTransactionsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getEscrowTransactions()
      .then((data) => {
        setTransactionsList(data)
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const columns = [
    { key: 'id', label: 'Transaction', render: (row) => row.id || row._id },
    { key: 'orderId', label: 'Order' },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'releaseCondition', label: 'Release Condition', render: (row) => row.releaseCondition || 'OTP Confirmation' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'createdAt', label: 'Created', render: (row) => dateLabel(row.createdAt) },
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading transactions...</p></div>
  }

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Escrow Transactions</h2>
            <span>Monitor held and released payment records.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={transactionsList} />
      </section>
    </div>
  )
}

export default AdminTransactionsPage


