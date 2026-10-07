function StatusBadge({ status }) {
  const statusClass = status
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge ${statusClass}`}>
      <span className="status-dot"></span>
      {status}
    </span>
  );
}

export default StatusBadge;