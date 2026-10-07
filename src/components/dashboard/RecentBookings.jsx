import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useBookings } from "../../context/BookingContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

function RecentBookings() {
  const { bookings } = useBookings();
  const navigate = useNavigate();

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="table-card">
      <div className="table-card-header">
        <div>
          <h3>Recent Bookings</h3>
          <p>Latest customer reservations</p>
        </div>

        <button
          className="view-all-button"
          type="button"
          onClick={() => navigate("/bookings")}
        >
          View All
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <strong>{booking.id}</strong>
                </td>

                <td>
                  <div className="customer-cell">
                    <div className="customer-avatar">
                      {booking.customer
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>{booking.customer}</strong>
                      <span>{booking.email}</span>
                    </div>
                  </div>
                </td>

                <td>{booking.destination}</td>

                <td>
                  {booking.date
                    ? formatDate(booking.date)
                    : "N/A"}
                </td>

                <td>{formatCurrency(booking.amount)}</td>

                <td>
                  <StatusBadge status={booking.bookingStatus} />
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="table-action-button"
                      title="View booking"
                      type="button"
                      onClick={() =>
                        navigate(`/bookings/${booking.id}`)
                      }
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      className="table-action-button"
                      title="More options"
                      type="button"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentBookings;