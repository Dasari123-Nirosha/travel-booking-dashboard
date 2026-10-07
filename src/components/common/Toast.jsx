import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function Toast({
  message,
  type = "success",
  onClose,
}) {
  const Icon = icons[type] || CheckCircle2;

  return (
    <div className={`toast toast-${type}`}>
      <Icon size={20} />

      <span>{message}</span>

      <button type="button" onClick={onClose}>
        <X size={17} />
      </button>
    </div>
  );
}

export default Toast;