import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  User,
  Users,
  Wallet,
  CheckCircle,
  Clock3,
  Mail,
  Plane,
} from "lucide-react";

import { useBookings } from "../../context/BookingContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";

function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { bookings } = useBookings();

  const booking = bookings.find(
    (item) => String(item.id) === String(id)
  );

  if (!booking) {
    return (
      <div className="page booking-details-page">
        <div className="empty-state">
          <CalendarDays size={48} />

          <h2>Booking Not Found</h2>

          <p>
            The booking you are looking for does not exist.
          </p>

          <Button
            variant="primary"
            icon={ArrowLeft}
            onClick={() => navigate("/bookings")}
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const bookingId = booking.id;
  const customerName = booking.customer || "N/A";
  const email = booking.email || "N/A";
  const destination = booking.destination || "N/A";
  const trip = booking.trip || "N/A";
  const travelDate = booking.date;
  const travelers = booking.guests || 0;
  const amount = booking.amount || 0;
  const paymentStatus = booking.paymentStatus || "Pending";
  const bookingStatus = booking.bookingStatus || "Pending";

  return (
    <div className="page booking-details-page">
      {/* Page Header */}

      <div className="page-header">
        <div>
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/bookings")}
          >
            <ArrowLeft size={18} />
            Back to Bookings
          </button>

          <span className="page-eyebrow">
            BOOKING DETAILS
          </span>

          <h1>{bookingId}</h1>

          <p>
            Reservation details for {customerName}
          </p>
        </div>

        <div className="details-header-status">
          <StatusBadge status={bookingStatus} />
          <StatusBadge status={paymentStatus} />
        </div>
      </div>

      {/* Booking Overview */}

      <div className="booking-overview-card">
        <div className="booking-overview-main">
          <div className="booking-overview-icon">
            <MapPin size={28} />
          </div>

          <div>
            <span>Destination</span>
            <h2>{destination}</h2>
          </div>
        </div>

        <div className="booking-overview-item">
          <CalendarDays size={20} />

          <div>
            <span>Travel Date</span>
            <strong>
              {travelDate ? formatDate(travelDate) : "N/A"}
            </strong>
          </div>
        </div>

        <div className="booking-overview-item">
          <Users size={20} />

          <div>
            <span>Travelers</span>
            <strong>{travelers}</strong>
          </div>
        </div>

        <div className="booking-overview-item">
          <Wallet size={20} />

          <div>
            <span>Total Amount</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
        </div>
      </div>

      {/* Details Layout */}

      <div className="booking-details-layout">
        <div className="booking-details-main">

          {/* Customer Information */}

          <div className="content-card">
            <div className="section-heading">
              <div className="section-heading-icon">
                <User size={20} />
              </div>

              <div>
                <h2>Customer Information</h2>
                <p>Booking customer details</p>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Customer Name</span>
                <strong>{customerName}</strong>
              </div>

              <div className="detail-item">
                <span>Email Address</span>
                <strong>{email}</strong>
              </div>

              <div className="detail-item">
                <span>Booking ID</span>
                <strong>{bookingId}</strong>
              </div>

              <div className="detail-item">
                <span>Number of Travelers</span>
                <strong>{travelers}</strong>
              </div>
            </div>
          </div>

          {/* Trip Information */}

          <div className="content-card">
            <div className="section-heading">
              <div className="section-heading-icon">
                <Plane size={20} />
              </div>

              <div>
                <h2>Trip Information</h2>
                <p>Travel and destination details</p>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Trip</span>
                <strong>{trip}</strong>
              </div>

              <div className="detail-item">
                <span>Destination</span>
                <strong>{destination}</strong>
              </div>

              <div className="detail-item">
                <span>Travel Date</span>
                <strong>
                  {travelDate ? formatDate(travelDate) : "N/A"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Booking Status</span>
                <StatusBadge status={bookingStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}

        <aside className="booking-details-sidebar">

          {/* Payment */}

          <div className="content-card payment-summary-card">
            <div className="section-heading">
              <div className="section-heading-icon">
                <CreditCard size={20} />
              </div>

              <div>
                <h2>Payment</h2>
                <p>Payment summary</p>
              </div>
            </div>

            <div className="payment-total">
              <span>Total Amount</span>
              <strong>{formatCurrency(amount)}</strong>
            </div>

            <div className="payment-status-row">
              <span>Payment Status</span>

              <StatusBadge status={paymentStatus} />
            </div>
          </div>

          {/* Booking Status */}

          <div className="content-card status-summary-card">
            <div className="section-heading">
              <div className="section-heading-icon">
                <CheckCircle size={20} />
              </div>

              <div>
                <h2>Booking Status</h2>
                <p>Current reservation status</p>
              </div>
            </div>

            <div className="status-timeline">

              {/* Created */}

              <div className="timeline-item completed">
                <div className="timeline-icon">
                  <CheckCircle size={16} />
                </div>

                <div>
                  <strong>Booking Created</strong>
                  <span>
                    Booking {bookingId}
                  </span>
                </div>
              </div>

              {/* Current Status */}

              <div
                className={`timeline-item ${
                  bookingStatus === "Confirmed"
                    ? "completed"
                    : "pending"
                }`}
              >
                <div className="timeline-icon">
                  {bookingStatus === "Confirmed" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Clock3 size={16} />
                  )}
                </div>

                <div>
                  <strong>{bookingStatus}</strong>

                  <span>
                    {bookingStatus === "Confirmed"
                      ? "Reservation confirmed"
                      : "Awaiting confirmation"}
                  </span>
                </div>
              </div>

              {/* Travel Date */}

              <div className="timeline-item pending">
                <div className="timeline-icon">
                  <CalendarDays size={16} />
                </div>

                <div>
                  <strong>Travel Date</strong>

                  <span>
                    {travelDate
                      ? formatDate(travelDate)
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Email */}

          <div className="content-card">
            <div className="section-heading">
              <div className="section-heading-icon">
                <Mail size={20} />
              </div>

              <div>
                <h2>Contact</h2>
                <p>Customer contact information</p>
              </div>
            </div>

            <div className="detail-item">
              <span>Email Address</span>
              <strong>{email}</strong>
            </div>
          </div>

          {/* Action */}

          <div className="details-page-actions">
            <Button
              variant="secondary"
              onClick={() => navigate("/bookings")}
            >
              Back to Bookings
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BookingDetailsPage;