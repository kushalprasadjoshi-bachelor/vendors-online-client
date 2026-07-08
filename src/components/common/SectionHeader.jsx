const SectionHeader = ({ title, meta, action }) => (
  <div className="section-header">
    <h2>{title}</h2>
    <div className="section-actions">
      {meta && <span>{meta}</span>}
      {action}
    </div>
  </div>
)

export default SectionHeader

