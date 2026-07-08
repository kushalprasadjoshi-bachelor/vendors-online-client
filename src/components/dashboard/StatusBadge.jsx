const StatusBadge = ({ value }) => (
  <span className={`status-badge ${value.replaceAll('_', '-')}`}>
    {value.replaceAll('_', ' ')}
  </span>
)

export default StatusBadge

