import DataTable from '../../components/dashboard/DataTable'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { escrowTransactions } from '../../data/mockData'
import { currency, dateLabel } from '../../utils/formatters'

const AdminTransactionsPage = () => {
  const columns = [
    { key: 'id', label: 'Transaction' },
    { key: 'orderId', label: 'Order' },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'releaseCondition', label: 'Release Condition' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'createdAt', label: 'Created', render: (row) => dateLabel(row.createdAt) },
  ]

  return (
    <div className="dashboard-content">
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Escrow Transactions</h2>
            <span>Monitor held and released payment records.</span>
          </div>
        </div>
        <DataTable columns={columns} rows={escrowTransactions} />
      </section>
    </div>
  )
}

export default AdminTransactionsPage

