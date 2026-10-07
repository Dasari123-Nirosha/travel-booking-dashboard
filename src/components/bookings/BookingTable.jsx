import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
} from "../../utils/formatters";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function BookingTable({
  bookings,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="booking-table-wrapper">
      <div className="table-wrapper">
        <table className="data-table booking-table">

          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Destination</th>
              <th>Travel Date</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => {

              const customerName =
                booking.customerName ||
                booking.customer ||
                "Unknown Customer";

              const travelDate =
                booking.travelDate ||
                booking.tripDate ||
                booking.date ||
                "";

              const bookingStatus =
                booking.status ||
                booking.bookingStatus ||
                "Pending";

              const amount =
                Number(booking.amount || 0);

              return (
                <tr key={booking.id}>

                  {/* BOOKING ID */}

                  <td>
                    <strong className="booking-id">
                      {booking.bookingId}
                    </strong>
                  </td>

                  {/* CUSTOMER */}

                  <td>
                    <div className="customer-cell">

                      <div className="customer-avatar">
                        {getInitials(
                          customerName
                        )}
                      </div>

                      <div className="customer-info">

                        <strong>
                          {customerName}
                        </strong>

                        <span>
                          {booking.email || "-"}
                        </span>

                      </div>

                    </div>
                  </td>

                  {/* DESTINATION */}

                  <td>
                    <div className="booking-destination">

                      <strong>
                        {booking.destination ||
                          "-"}
                      </strong>

                      {booking.tripName && (
                        <span>
                          {booking.tripName}
                        </span>
                      )}

                    </div>
                  </td>

                  {/* TRAVEL DATE */}

                  <td>
                    <span className="booking-date">
                      {travelDate
                        ? formatDate(
                            travelDate
                          )
                        : "-"}
                    </span>
                  </td>

                  {/* AMOUNT */}

                  <td>
                    <strong className="booking-amount">
                      {formatCurrency(amount)}
                    </strong>
                  </td>

                  {/* PAYMENT */}

                  <td>
                    <span
                      className={`status-badge ${
                        booking.paymentStatus
                          ?.toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          ) || ""
                      }`}
                    >
                      {booking.paymentStatus ||
                        "Pending"}
                    </span>
                  </td>

                  {/* BOOKING STATUS */}

                  <td>
                    <span
                      className={`status-badge ${
                        bookingStatus
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )
                      }`}
                    >
                      {bookingStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <div className="table-actions">

                      <button
                        type="button"
                        className="table-action-button"
                        title="View booking"
                        onClick={() =>
                          onView(booking)
                        }
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        className="table-action-button"
                        title="Edit booking"
                        onClick={() =>
                          onEdit(booking)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="table-action-button delete"
                        title="Delete booking"
                        onClick={() =>
                          onDelete(booking)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default BookingTable;