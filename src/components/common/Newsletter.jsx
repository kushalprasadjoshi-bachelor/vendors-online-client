import { Mail } from 'lucide-react'

const Newsletter = () => (
  <section className="newsletter">
    <h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
    <form className="newsletter-form">
      <label>
        <Mail size={20} aria-hidden="true" />
        <input type="email" placeholder="Enter your email address" />
      </label>
      <button type="submit">Subscribe to Newsletter</button>
    </form>
  </section>
)

export default Newsletter

