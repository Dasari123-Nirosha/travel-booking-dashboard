import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested information.",
  onRetry,
}) {
  return (
    <div className="state-container error-state">
      <div className="state-icon">
        <AlertCircle size={34} />
      </div>

      <h3>{title}</h3>
      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="retry-button"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;