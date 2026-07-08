const Logo = ({ compact = false }) => (
  <span className={compact ? 'brand-logo compact' : 'brand-logo'}>
    <img src="/logo.png" alt="VendorsOnline" />
  </span>
)

export default Logo

