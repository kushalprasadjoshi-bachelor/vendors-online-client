const StatCard = ({ label, value, caption, icon: Icon }) => (
  <article className="stat-card">
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      {caption && <small>{caption}</small>}
    </div>
    {Icon && <Icon size={24} aria-hidden="true" />}
  </article>
)

export default StatCard

