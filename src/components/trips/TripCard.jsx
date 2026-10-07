import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Clock3,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
} from "../../utils/formatters";

import StatusBadge from "../common/StatusBadge";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80";

function TripCard({
  trip,
  onView,
  onEdit,
  onDelete,
}) {
  const totalSeats = Math.max(
    0,
    Number(trip?.totalSeats) || 0
  );

  const availableSeats = Math.min(
    totalSeats,
    Math.max(
      0,
      Number(trip?.availableSeats) || 0
    )
  );

  const bookedSeats = Math.max(
    0,
    totalSeats - availableSeats
  );

  const seatsPercentage =
    totalSeats > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (bookedSeats / totalSeats) *
              100
          )
        )
      : 0;

  const destination =
    trip?.destination ||
    "Travel Destination";

  const country =
    trip?.country ||
    "Unknown Country";

  const guide =
    trip?.guide ||
    "Not assigned";

  const tripId =
    trip?.tripId ||
    "TR-0000";

  const startDate =
    trip?.startDate ||
    trip?.tripDate ||
    trip?.date ||
    "";

  const endDate =
    trip?.endDate || "";

  const duration =
    trip?.duration ||
    "Duration not specified";

  const price =
    Number(
      trip?.price ??
        trip?.amount ??
        0
    ) || 0;

  const status =
    trip?.status ||
    "Upcoming";

  const image =
    trip?.image ||
    FALLBACK_IMAGE;

  const formattedStartDate =
    startDate
      ? formatDate(startDate)
      : "Not set";

  const formattedEndDate =
    endDate
      ? formatDate(endDate)
      : "Not set";

  const handleImageError = (
    event
  ) => {
    if (
      event.currentTarget.src !==
      FALLBACK_IMAGE
    ) {
      event.currentTarget.src =
        FALLBACK_IMAGE;
    }
  };

  return (
    <article className="trip-card">
      {/* TRIP IMAGE */}

      <div className="trip-card-image">
        <img
          src={image}
          alt={`${destination} trip`}
          loading="lazy"
          onError={
            handleImageError
          }
        />

        <div className="trip-card-image-overlay">
          <span className="trip-id">
            {tripId}
          </span>

          <StatusBadge
            status={status}
          />
        </div>
      </div>

      {/* TRIP CONTENT */}

      <div className="trip-card-content">
        <div className="trip-card-title">
          <h3>
            {destination}
          </h3>

          <p className="trip-country">
            <MapPin size={15} />

            <span>
              {country}
            </span>
          </p>
        </div>

        {/* TRIP INFORMATION */}

        <div className="trip-info-list">
          <div>
            <CalendarDays
              size={17}
            />

            <span>
              {formattedStartDate}
              {" - "}
              {formattedEndDate}
            </span>
          </div>

          <div>
            <Clock3
              size={17}
            />

            <span>
              {duration}
            </span>
          </div>

          <div>
            <Users
              size={17}
            />

            <span>
              {availableSeats}{" "}
              {availableSeats ===
              1
                ? "seat"
                : "seats"}{" "}
              available
            </span>
          </div>

          <div>
            <DollarSign
              size={17}
            />

            <span>
              {formatCurrency(
                price
              )}{" "}
              per person
            </span>
          </div>
        </div>

        {/* SEAT AVAILABILITY */}

        <div className="trip-seats">
          <div className="trip-seats-header">
            <span>
              Seat Availability
            </span>

            <strong>
              {bookedSeats}/
              {totalSeats}
            </strong>
          </div>

          <div
            className="trip-progress"
            aria-label={`Booked ${bookedSeats} of ${totalSeats} seats`}
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax={
              totalSeats
            }
            aria-valuenow={
              bookedSeats
            }
          >
            <div
              className="trip-progress-bar"
              style={{
                width: `${seatsPercentage}%`,
              }}
            />
          </div>

          <div className="trip-seats-count">
            <span>
              {bookedSeats} booked
            </span>

            <span>
              {availableSeats}{" "}
              available
            </span>
          </div>
        </div>

        {/* GUIDE */}

        <div className="trip-guide">
          <span>
            Trip Guide
          </span>

          <strong>
            {guide}
          </strong>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="trip-card-footer">
        <button
          className="small-outline-button"
          type="button"
          onClick={() =>
            onView?.(trip)
          }
          aria-label={`View ${destination} trip`}
          title={`View ${destination} trip`}
        >
          <Eye size={15} />

          <span>
            View
          </span>
        </button>

        <button
          className="small-outline-button"
          type="button"
          onClick={() =>
            onEdit?.(trip)
          }
          aria-label={`Edit ${destination} trip`}
          title={`Edit ${destination} trip`}
        >
          <Edit size={15} />

          <span>
            Edit
          </span>
        </button>

        <button
          className="small-danger-button"
          type="button"
          onClick={() =>
            onDelete?.(trip)
          }
          aria-label={`Delete ${destination} trip`}
          title={`Delete ${destination} trip`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}

export default TripCard;