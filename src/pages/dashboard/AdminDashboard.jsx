import { BadgeDollarSign, CircleHelp, Store, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DataTable from '../../components/dashboard/DataTable'
import StatCard from '../../components/dashboard/StatCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { catalogService } from '../../services/catalogService'
import { orderService } from '../../services/orderService'
import { apiClient } from '../../services/apiClient'
import { currency } from '../../utils/formatters'

const AdminDashboard = () => {
  const [usersList, setUsersList] = useState([])
  const [storesList, setStoresList] = useState([])
  const [transactionsList, setTransactionsList] = useState([])
  const [disputesList, setDisputesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, stores, txs, disputes] = await Promise.all([
          apiClient.get('/user'),
          catalogService.getStores(),
          orderService.getEscrowTransactions(),
          orderService.getDisputes(),
        ])
        setUsersList(users)
        setStoresList(stores)
        setTransactionsList(txs)
        setDisputesList(disputes)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const columns = [
    { key: 'id', label: 'Dispute', render: (row) => row.id || row._id },
    { key: 'orderId', label: 'Order' },
    { key: 'openedBy', label: 'Opened By' },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]

  const escrowVolume = transactionsList.reduce((total, item) => total + item.amount, 0)

  const chartData = [
    { month: 'Jan', orders: 0 },
    { month: 'Feb', orders: 0 },
    { month: 'Mar', orders: 0 },
    { month: 'Apr', orders: 0 },
    { month: 'May', orders: 0 },
    { month: 'Jun', orders: transactionsList.length || 10 },
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading dashboard...</p></div>
  }

  return (
    <div className="dashboard-content">
      <div className="stat-grid">
        <StatCard label="Users" value={String(usersList.length)} caption="Customers, vendors, admins" icon={Users} />
        <StatCard label="Active Shops" value={String(storesList.length)} caption="Across Nepal" icon={Store} />
        <StatCard label="Escrow Volume" value={currency(escrowVolume)} caption="Simulated payments" icon={BadgeDollarSign} />
        <StatCard label="Open Disputes" value={String(disputesList.filter(d => d.status === 'open').length)} caption="Needs review" icon={CircleHelp} />
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h2>Marketplace Activity</h2>
          <span>Performance Overview</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#111111" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h2>Dispute Queue</h2>
          <span>Admin intervention for exceptional delivery cases</span>
        </div>
        <DataTable columns={columns} rows={disputesList} />
      </section>
    </div>
  )
}

export default AdminDashboard


