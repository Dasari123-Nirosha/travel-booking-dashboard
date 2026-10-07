import {
  MapPin,
  User,
  CalendarDays,
  CreditCard,
} from "lucide-react";

import { formatDate } from "../../utils/formatters";

function CalendarEvent({ booking, onClick }) {
  if (!booking) return null;

  const bookingId =
    booking.bookingId ||
    booking.id ||
    "N/A";

  const customer =
    booking.customer ||
    booking.customerName ||
    "Unknown Customer";

  const destination =
    booking.destination ||
    "Unknown Destination";

  const travelDate =
    booking.travelDate ||
    booking.tripDate ||
    booking.date ||
    "";

  const travelers =
    Number(booking.travelers) || 1;

  const bookingStatus =
    booking.bookingStatus ||
    booking.status ||
    "Pending";

  const paymentStatus =
    booking.paymentStatus ||
    "Pending";

  const statusClass = String(
    bookingStatus
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  const paymentClass = String(
    paymentStatus
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  const handleClick = (event) => {
    event.stopPropagation();
    onClick?.(booking);
  };

  return (
    <button
      type="button"
      className={`calendar-event ${statusClass}`}
      onClick={handleClick}
      title={`View booking ${bookingId}`}
    >
      {/* BOOKING HEADER */}

      <div className="calendar-event-top">
        <span className="calendar-event-id">
          {bookingId}
        </span>

        <span
          className={`calendar-event-status ${statusClass}`}
        >
          {bookingStatus}
        </span>
      </div>

      {/* DESTINATION */}

      <strong className="calendar-event-destination">
        {destination}
      </strong>

      {/* CUSTOMER */}

      <div className="calendar-event-info">

        <span className="calendar-event-customer">
          <User size={13} />
          <span>{customer}</span>
        </span>

        <span>
          <MapPin size={13} />
          {travelers} traveler
          {travelers !== 1 ? "s" : ""}
        </span>

      </div>

      {/* DATE + PAYMENT */}

      <div className="calendar-event-bottom">

        <span className="calendar-event-date">
          <CalendarDays size={13} />

          {travelDate
            ? formatDate(travelDate)
            : "Date not set"}
        </span>

        <span
          className={`calendar-event-payment ${paymentClass}`}
        >
          <CreditCard size={12} />
          {paymentStatus}
        </span>

      </div>
    </button>
  );
}

export default CalendarEvent;