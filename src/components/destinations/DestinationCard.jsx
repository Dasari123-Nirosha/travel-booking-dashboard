import {
  MapPin,
  Star,
  Users,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { formatCurrency, formatDate } from "../../utils/formatters";

function DestinationCard({
  destination,
  onEdit,
  onDelete,
}) {
  /*
    Support both `price` and `amount`.

    This is important because if you entered
    $3400 in the Destination form as amount,
    the card should display that saved value.
  */
  const destinationAmount =
    destination.price ??
    destination.amount ??
    0;

  /*
    Support the saved duration.
  */
  const destinationDuration =
    destination.duration ||
    destination.days ||
    destination.nights ||
    "-";

  /*
    Travel dates.
  */
  const startDate =
    destination.startDate ||
    destination.travelStartDate ||
    destination.fromDate ||
    "";

  const endDate =
    destination.endDate ||
    destination.travelEndDate ||
    destination.toDate ||
    "";

  /*
    Format dates safely.
  */
  const formattedStartDate = startDate
    ? formatDate(startDate)
    : "-";

  const formattedEndDate = endDate
    ? formatDate(endDate)
    : "-";

  /*
    Image fallback.
  */
  const image =
    destination.image ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="destination-card">

      {/* DESTINATION IMAGE */}
      <div className="destination-card-image">
        <img
          src={image}
          alt={destination.name || "Destination"}
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        <span className="destination-status">
          {destination.status || "Active"}
        </span>
      </div>

      {/* DESTINATION CONTENT */}
      <div className="destination-card-content">

        {/* TITLE + RATING */}
        <div className="destination-card-title">

          <div className="destination-card-heading">

            <h3>
              {destination.name}
            </h3>

            <p>
              <MapPin size={14} />
              {destination.country}
            </p>

          </div>

          <div className="destination-rating">
            <Star size={15} />

            <span>
              {destination.rating || "-"}
            </span>
          </div>

        </div>

        {/* DESCRIPTION */}
        <p className="destination-description">
          {destination.description ||
            "Explore this beautiful destination."}
        </p>

        {/* PRICE + DURATION */}
        <div className="destination-card-details">

          <div>
            <span>Starting from</span>

            <strong>
              {formatCurrency(
                Number(destinationAmount) || 0
              )}
            </strong>
          </div>

          <div>
            <span>Duration</span>

            <strong>
              {destinationDuration}
            </strong>
          </div>

        </div>

        {/* TRAVEL DATES */}
        <div className="destination-travel-dates">

          <div className="destination-date-item">

            <div className="destination-date-icon">
              <CalendarDays size={15} />
            </div>

            <div>
              <span>Start Date</span>

              <strong>
                {formattedStartDate}
              </strong>
            </div>

          </div>

          <div className="destination-date-item">

            <div className="destination-date-icon">
              <CalendarDays size={15} />
            </div>

            <div>
              <span>End Date</span>

              <strong>
                {formattedEndDate}
              </strong>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="destination-card-footer">

          <span className="destination-bookings">
            <Users size={16} />

            {destination.bookings || 0} bookings
          </span>

          <div className="destination-card-actions">

            <button
              type="button"
              className="small-outline-button"
              onClick={() =>
                onEdit?.(destination)
              }
            >
              Edit
            </button>

            <button
              type="button"
              className="small-danger-button"
              onClick={() =>
                onDelete?.(destination)
              }
            >
              Delete
            </button>

            <button
              type="button"
              className="destination-view-button"
              onClick={() => {}}
              aria-label={`View ${destination.name}`}
            >
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DestinationCard;