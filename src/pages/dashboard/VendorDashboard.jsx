import { BadgeDollarSign, Clock, PackageCheck, ShoppingBag } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DataTable from '../../components/dashboard/DataTable'
import StatCard from '../../components/dashboard/StatCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { orders, products, salesSeries } from '../../data/mockData'
import { currency } from '../../utils/formatters'

const VendorDashboard = () => {
  const columns = [
    { key: 'id', label: 'Order' },
    { key: 'items', label: 'Products', render: (row) => row.items.length },
    { key: 'total', label: 'Total', render: (row) => currency(row.total) },
    { key: 'deliveryStatus', label: 'Delivery', render: (row) => <StatusBadge value={row.deliveryStatus} /> },
    { key: 'paymentStatus', label: 'Payment', render: (row) => <StatusBadge value={row.paymentStatus} /> },
  ]

  return (
    <div className="dashboard-content">
      <div className="stat-grid">
        <StatCard label="Total Sales" value={currency(2480)} caption="+18% this month" icon={BadgeDollarSign} />
        <StatCard label="Orders" value="68" caption="12 pending" icon={ShoppingBag} />
        <StatCard label="Products" value={products.length} caption="31 low stock" icon={PackageCheck} />
        <StatCard label="Escrow Held" value={currency(371)} caption="Awaiting OTP" icon={Clock} />
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h2>Sales Performance</h2>
          <span>Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={salesSeries}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#111111" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h2>Recent Orders</h2>
          <span>OTP verification controls release</span>
        </div>
        <DataTable columns={columns} rows={orders} />
      </section>
    </div>
  )
}

export default VendorDashboard

