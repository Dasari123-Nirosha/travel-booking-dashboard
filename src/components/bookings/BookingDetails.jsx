import {
  X,
  User,
  MapPin,
  CalendarDays,
  Users,
  Wallet,
  CreditCard,
  Hash,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

function BookingDetails({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="booking-details">
      <div className="booking-details-header">
        <div>
          <span className="details-label">BOOKING DETAILS</span>
          <h2>{booking.bookingId}</h2>
          <p>
            Created on {formatDate(booking.bookingDate)}
          </p>
        </div>

        <button
          className="details-close-button"
          onClick={onClose}
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="booking-details-status-row">
        <div>
          <span>Booking Status</span>
          <StatusBadge
  status={
    booking.status ||
    booking.bookingStatus ||
    "Pending"
  }
/>
        </div>

        <div>
          <span>Payment Status</span>
          <StatusBadge status={booking.paymentStatus} />
        </div>
      </div>

      <div className="booking-details-section">
        <h3>Customer Information</h3>

        <div className="details-info-grid">
          <div className="details-info-card">
            <div className="details-icon">
              <User size={19} />
            </div>

            <div>
              <span>Customer</span>
              <strong>{booking.customerName}</strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <Hash size={19} />
            </div>

            <div>
              <span>Booking ID</span>
              <strong>{booking.bookingId}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-details-section">
        <h3>Trip Information</h3>

        <div className="details-info-grid">
          <div className="details-info-card">
            <div className="details-icon">
              <MapPin size={19} />
            </div>

            <div>
              <span>Destination</span>
              <strong>{booking.destination}</strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>Travel Date</span>
              <strong>{formatDate(booking.travelDate)}</strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <Users size={19} />
            </div>

            <div>
              <span>Travelers</span>
              <strong>{booking.travelers}</strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <Wallet size={19} />
            </div>

            <div>
              <span>Total Amount</span>
              <strong>{formatCurrency(booking.amount)}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-details-payment">
        <div className="payment-icon">
          <CreditCard size={21} />
        </div>

        <div>
          <span>Payment</span>
          <strong>{formatCurrency(booking.amount)}</strong>
        </div>

        <StatusBadge status={booking.paymentStatus} />
      </div>

      <div className="booking-details-footer">
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;