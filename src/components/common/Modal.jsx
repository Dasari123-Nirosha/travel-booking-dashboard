import { X } from "lucide-react";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-container ${size}`}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>

            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;