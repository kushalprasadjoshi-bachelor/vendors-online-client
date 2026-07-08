import { BadgeDollarSign, CircleHelp, Store, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DataTable from '../../components/dashboard/DataTable'
import StatCard from '../../components/dashboard/StatCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { disputes, escrowTransactions, salesSeries, stores, users } from '../../data/mockData'
import { currency } from '../../utils/formatters'

const AdminDashboard = () => {
  const columns = [
    { key: 'id', label: 'Dispute' },
    { key: 'orderId', label: 'Order' },
    { key: 'openedBy', label: 'Opened By' },
    { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]

  return (
    <div className="dashboard-content">
      <div className="stat-grid">
        <StatCard label="Users" value={users.length} caption="Customers, vendors, admins" icon={Users} />
        <StatCard label="Active Shops" value={stores.length} caption="Across Nepal" icon={Store} />
        <StatCard label="Escrow Volume" value={currency(escrowTransactions.reduce((total, item) => total + item.amount, 0))} caption="Simulated payments" icon={BadgeDollarSign} />
        <StatCard label="Open Disputes" value={disputes.length} caption="Needs review" icon={CircleHelp} />
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h2>Marketplace Activity</h2>
          <span>Orders by month</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={salesSeries}>
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
        <DataTable columns={columns} rows={disputes} />
      </section>
    </div>
  )
}

export default AdminDashboard

