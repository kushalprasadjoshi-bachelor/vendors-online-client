import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/partials/Navbar'
import Footer from '../components/partials/Footer'

const HomeLayout = () => {
  return (
    <div class='dynamic-x-padding'>
      <header>
        <Navbar />
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default HomeLayout
