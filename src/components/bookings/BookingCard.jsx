import {
  Eye,
  Edit,
  Trash2,
  User,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

function BookingTable({
  bookings,
  onView,
  onEdit,
  onDelete,
}) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="empty-table-state">
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table booking-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Travel Date</th>
            <th>Travelers</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <div className="booking-id-cell">
                  <strong>{booking.bookingId}</strong>
                  <span>
                    {formatDate(booking.bookingDate)}
                  </span>
                </div>
              </td>

              <td>
                <div className="booking-customer-cell">
                  <div className="customer-avatar">
                    {booking.customerName
                      .split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>{booking.customerName}</strong>
                    <span>{booking.email || "Customer"}</span>
                  </div>
                </div>
              </td>

              <td>
                <div className="destination-cell">
                  <MapPin size={15} />
                  {booking.destination}
                </div>
              </td>

              <td>
                <div className="date-cell">
                  <CalendarDays size={15} />
                  {formatDate(booking.travelDate)}
                </div>
              </td>

              <td>
                <div className="traveler-cell">
                  <User size={15} />
                  {booking.travelers}
                </div>
              </td>

              <td>
                <strong>{formatCurrency(booking.amount)}</strong>
              </td>

              <td>
                <StatusBadge status={booking.paymentStatus} />
              </td>

              <td>
                <StatusBadge status={booking.status} />
              </td>

              <td>
                <div className="table-actions">
                  <button
                    className="table-action view"
                    onClick={() => onView(booking)}
                    title="View booking"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    className="table-action edit"
                    onClick={() => onEdit(booking)}
                    title="Edit booking"
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    className="table-action delete"
                    onClick={() => onDelete(booking)}
                    title="Delete booking"
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

export default BookingTable;