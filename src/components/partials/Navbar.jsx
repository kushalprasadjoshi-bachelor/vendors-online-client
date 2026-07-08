import { TextInput } from '@mantine/core'
import { ShoppingCart, SquareUser } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  return (
    <div class='flex gap-5'>
      <section class='flex items-center gap-6'>
        <div>
            Logo
        </div>

        <div >
        
          <a href="About.html">About</a>
        </div>
        <div>
  
          <a href="ShopCart.html">ShopCart</a>
        </div>
      </section>

      <section class='flex items-center gap-6'>
        <div>
        
          <a href="Categories.html">Categories</a>
        </div>
        <div>
          <a href="Deals.html">Deals</a>

        </div>
        <div>
        
          <a href="Newitems.html">Newitems</a>
        </div>
        <div>
          <a href="Delivery.html">Delivery</a>
        </div>

      </section>

      <section class='flex items-center gap-6'>
        <div>
          <TextInput placeholder="Search Product"/>
        </div>
        <div class='flex'>
          <SquareUser />
          
          <a href="Account.html">Account</a>
        </div>
        <div class="my-2">
          <ShoppingCart />
          
          < a href="Cart.html">Cart</a>
        </div>
      </section>
    </div>
  )
}

export default Navbar
