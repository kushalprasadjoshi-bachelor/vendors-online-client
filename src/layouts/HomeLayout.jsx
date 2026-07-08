import { Outlet } from 'react-router-dom'
import Navbar from '../components/partials/Navbar'
import Footer from '../components/partials/Footer'

const HomeLayout = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default HomeLayout
