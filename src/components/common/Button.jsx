import { Loader2 } from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  loading = false,
  disabled = false,
  icon: Icon = null,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`common-button ${variant} ${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="button-spinner" size={18} />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}

      <span>{children}</span>
    </button>
  );
}

export default Button;