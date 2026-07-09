import { BadgeDollarSign, Clock, PackageCheck, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DataTable from '../../components/dashboard/DataTable'
import StatCard from '../../components/dashboard/StatCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { useAuth } from '../../plugins/authContext'
import { catalogService } from '../../services/catalogService'
import { orderService } from '../../services/orderService'
import { currency } from '../../utils/formatters'

const VendorDashboard = () => {
  const { user } = useAuth()
  const [ordersList, setOrdersList] = useState([])
  const [productsList, setProductsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const orders = await orderService.getOrders()
          setOrdersList(orders)

          const shops = await catalogService.getStores()
          const myShop = shops.find(s => s.ownerId === user.id)
          if (myShop) {
            const products = await catalogService.getProducts(myShop.id)
            setProductsList(products)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setLoading(false)
        }
      }
      loadData()
    }
  }, [user])

  const columns = [
    { key: 'id', label: 'Order' },
    { key: 'items', label: 'Products', render: (row) => row.items ? row.items.length : 0 },
    { key: 'total', label: 'Total', render: (row) => currency(row.total) },
    { key: 'deliveryStatus', label: 'Delivery', render: (row) => <StatusBadge value={row.deliveryStatus} /> },
    { key: 'paymentStatus', label: 'Payment', render: (row) => <StatusBadge value={row.paymentStatus} /> },
  ]

  const totalSales = ordersList
    .filter(o => o.deliveryStatus === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const escrowHeld = ordersList
    .filter(o => o.paymentStatus === 'escrow_held')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingCount = ordersList.filter(o => o.deliveryStatus !== 'delivered').length

  const chartData = [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 0 },
    { month: 'Mar', sales: 0 },
    { month: 'Apr', sales: 0 },
    { month: 'May', sales: 0 },
    { month: 'Jun', sales: totalSales || 1500 },
  ]

  if (loading) {
    return <div className="dashboard-content"><p>Loading dashboard...</p></div>
  }

  return (
    <div className="dashboard-content">
      <div className="stat-grid">
        <StatCard label="Total Sales" value={currency(totalSales)} caption="Released payments" icon={BadgeDollarSign} />
        <StatCard label="Orders" value={String(ordersList.length)} caption={`${pendingCount} pending`} icon={ShoppingBag} />
        <StatCard label="Products" value={String(productsList.length)} caption="Active in catalog" icon={PackageCheck} />
        <StatCard label="Escrow Held" value={currency(escrowHeld)} caption="Awaiting OTP" icon={Clock} />
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h2>Sales Performance</h2>
          <span>Performance Overview</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
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
        <DataTable columns={columns} rows={ordersList} />
      </section>
    </div>
  )
}

export default VendorDashboard


