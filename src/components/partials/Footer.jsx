import { Camera, Globe2, Mail, MessageCircle } from 'lucide-react'
import { footerGroups } from '../../config/navigation'
import Newsletter from '../common/Newsletter'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container-shell">
        <Newsletter />

        <div className="footer-grid">
          <section className="footer-brand">
            <h2>VendorsOnline</h2>
            <p>
              We have best vendors that delivers best products down to your footstep.
              From grocery to electronics, breakfast to dinner.
            </p>
            <div className="social-row">
              <a className="icon-button" href="https://twitter.com" aria-label="Twitter">
                <MessageCircle size={16} />
              </a>
              <a className="icon-button filled" href="https://facebook.com" aria-label="Facebook">
                <Globe2 size={16} />
              </a>
              <a className="icon-button" href="https://instagram.com" aria-label="Instagram">
                <Camera size={16} />
              </a>
            </div>
          </section>

          {footerGroups.map((group) => (
            <section className="footer-column" key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <a href={`#${link.toLowerCase().replaceAll(' ', '-')}`} key={link}>
                  {link}
                </a>
              ))}
            </section>
          ))}
        </div>

        <div className="footer-bottom">
          <span>VendorsOnline © 2026, All Rights Reserved</span>
          <span className="footer-mail"><Mail size={15} /> support@vendorsonline.test</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
