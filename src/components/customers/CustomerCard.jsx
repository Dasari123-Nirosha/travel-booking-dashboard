import {
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Plane,
  Wallet,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

function CustomerCard({
  customer,
  onView,
  onEdit,
  onDelete,
}) {
  const initials = customer.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="customer-card">
      <div className="customer-card-header">
        <div className="customer-card-profile">
          <div className="customer-avatar large">
            {initials}
          </div>

          <div>
            <h3>{customer.name}</h3>
            <p>Customer #{customer.id}</p>
          </div>
        </div>

        <StatusBadge status={customer.status} />
      </div>

      <div className="customer-card-info">
        <div className="customer-info-item">
          <Mail size={17} />
          <span>{customer.email}</span>
        </div>

        <div className="customer-info-item">
          <Phone size={17} />
          <span>{customer.phone}</span>
        </div>

        <div className="customer-info-item">
          <MapPin size={17} />
          <span>{customer.location}</span>
        </div>

        <div className="customer-info-item">
          <CalendarDays size={17} />
          <span>Joined {formatDate(customer.joinedDate)}</span>
        </div>
      </div>

      <div className="customer-card-stats">
        <div className="customer-stat">
          <Plane size={18} />
          <div>
            <span>Bookings</span>
            <strong>{customer.bookings}</strong>
          </div>
        </div>

        <div className="customer-stat">
          <Wallet size={18} />
          <div>
            <span>Total Spent</span>
            <strong>{formatCurrency(customer.totalSpent)}</strong>
          </div>
        </div>
      </div>

      <div className="customer-card-actions">
        <button
          className="customer-action primary"
          onClick={() => onView(customer)}
        >
          <Eye size={17} />
          View
        </button>

        <button
          className="customer-action"
          onClick={() => onEdit(customer)}
        >
          <Edit size={17} />
          Edit
        </button>

        <button
          className="customer-action danger"
          onClick={() => onDelete(customer)}
          title="Delete customer"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}

export default CustomerCard;