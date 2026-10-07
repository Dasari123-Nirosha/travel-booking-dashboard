import {
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
}) {
  if (!customers || customers.length === 0) {
    return (
      <div className="empty-table-state">
        <p>No customers found.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Bookings</th>
            <th>Total Spent</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customer-table-profile">
                  <div className="customer-avatar">
                    {customer.name
                      .split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>{customer.name}</strong>
                    <span>Customer #{customer.id}</span>
                  </div>
                </div>
              </td>

              <td>
                <div className="customer-contact">
                  <span>
                    <Mail size={14} />
                    {customer.email}
                  </span>

                  <span>
                    <Phone size={14} />
                    {customer.phone}
                  </span>
                </div>
              </td>

              <td>
                <div className="location-cell">
                  <MapPin size={15} />
                  {customer.location}
                </div>
              </td>

              <td>
                <strong>{customer.bookings}</strong>
              </td>

              <td>
                <strong>{formatCurrency(customer.totalSpent)}</strong>
              </td>

              <td>
                <StatusBadge status={customer.status} />
              </td>

              <td>{formatDate(customer.joinedDate)}</td>

              <td>
                <div className="table-actions">
                  <button
                    className="table-action view"
                    onClick={() => onView(customer)}
                    title="View customer"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    className="table-action edit"
                    onClick={() => onEdit(customer)}
                    title="Edit customer"
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    className="table-action delete"
                    onClick={() => onDelete(customer)}
                    title="Delete customer"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;