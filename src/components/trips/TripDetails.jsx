import {
  X,
  MapPin,
  CalendarDays,
  Users,
  DollarSign,
  UserRound,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
} from "../../utils/formatters";

import StatusBadge from "../common/StatusBadge";

function TripDetails({
  trip,
  onClose,
}) {
  if (!trip) {
    return null;
  }

  const destination =
    trip.destination ||
    "Unknown Destination";

  const country =
    trip.country ||
    "Unknown Country";

  const tripId =
    trip.tripId ||
    "TR-0000";

  const duration =
    trip.duration ||
    "Duration not specified";

  const guide =
    trip.guide ||
    "Not assigned";

  const price =
    Number(
      trip.price ??
        trip.amount ??
        0
    ) || 0;

  const totalSeats = Math.max(
    0,
    Number(trip.totalSeats) || 0
  );

  const availableSeats = Math.min(
    totalSeats,
    Math.max(
      0,
      Number(trip.availableSeats) || 0
    )
  );

  const bookedSeats =
    Math.max(
      0,
      totalSeats - availableSeats
    );

  const startDate =
    trip.startDate ||
    trip.tripDate ||
    trip.date ||
    "";

  const endDate =
    trip.endDate || "";

  const status =
    trip.status ||
    "Upcoming";

  const formattedStartDate =
    startDate
      ? formatDate(startDate)
      : "Not set";

  const formattedEndDate =
    endDate
      ? formatDate(endDate)
      : "Not set";

  return (
    <div className="details-modal">
      {/* HEADER */}
      <div className="details-modal-header">
        <div>
          <span className="details-label">
            Trip Details
          </span>

          <h3>{destination}</h3>

          <p>{tripId}</p>
        </div>

        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close trip details"
          title="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* DESTINATION BANNER */}
      <div className="trip-details-banner">
        <div className="trip-details-icon">
          <MapPin size={30} />
        </div>

        <div>
          <h4>{destination}</h4>

          <p>{country}</p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* DETAILS */}
      <div className="details-grid">
        {/* TRAVEL DATES */}
        <div className="details-item">
          <div className="details-item-icon">
            <CalendarDays size={19} />
          </div>

          <div>
            <span>Travel Dates</span>

            <strong>
              {formattedStartDate}
              {" - "}
              {formattedEndDate}
            </strong>
          </div>
        </div>

        {/* PRICE */}
        <div className="details-item">
          <div className="details-item-icon">
            <DollarSign size={19} />
          </div>

          <div>
            <span>Trip Price</span>

            <strong>
              {formatCurrency(price)}
            </strong>

            <small>
              per person
            </small>
          </div>
        </div>

        {/* SEATS */}
        <div className="details-item">
          <div className="details-item-icon">
            <Users size={19} />
          </div>

          <div>
            <span>
              Available Seats
            </span>

            <strong>
              {availableSeats} of{" "}
              {totalSeats}
            </strong>

            <small>
              {bookedSeats} booked
            </small>
          </div>
        </div>

        {/* GUIDE */}
        <div className="details-item">
          <div className="details-item-icon">
            <UserRound size={19} />
          </div>

          <div>
            <span>Trip Guide</span>

            <strong>
              {guide}
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="trip-details-footer">
        <div>
          <span>Duration</span>

          <strong>
            {duration}
          </strong>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TripDetails;