import { Inbox } from "lucide-react";

function EmptyState({
  title = "No data found",
  message = "There is nothing to display here.",
}) {
  return (
    <div className="state-container empty-state">
      <div className="state-icon">
        <Inbox size={34} />
      </div>

      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;