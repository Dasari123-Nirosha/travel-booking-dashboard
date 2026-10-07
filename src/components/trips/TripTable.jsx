import {
  Edit,
  Trash2,
  Eye,
  MapPin,
  CalendarDays,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
} from "../../utils/formatters";

import StatusBadge from "../common/StatusBadge";

function TripTable({
  trips,
  onView,
  onEdit,
  onDelete,
}) {
  if (!Array.isArray(trips) || trips.length === 0) {
    return (
      <div className="empty-table-state">
        <CalendarDays size={32} />

        <h3>No trips found</h3>

        <p>
          There are no trips matching your
          search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Trip</th>
              <th>Destination</th>
              <th>Travel Date</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Guide</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip, index) => {
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

              const tripId =
                trip?.tripId ||
                `TR-${String(index + 1).padStart(4, "0")}`;

              const destination =
                trip?.destination ||
                "Unknown Destination";

              const country =
                trip?.country ||
                "Unknown Country";

              const guide =
                trip?.guide ||
                "Not assigned";

              const duration =
                trip?.duration ||
                "Duration not specified";

              const price =
                Number(
                  trip?.price ??
                    trip?.amount ??
                    0
                ) || 0;

              const startDate =
                trip?.startDate ||
                trip?.tripDate ||
                trip?.date ||
                "";

              const endDate =
                trip?.endDate || "";

              const status =
                trip?.status ||
                "Upcoming";

              const tripKey =
                trip?.id ||
                trip?.tripId ||
                `trip-${index}`;

              return (
                <tr key={tripKey}>
                  {/* TRIP */}
                  <td>
                    <div className="table-trip-cell">
                      <strong>
                        {tripId}
                      </strong>

                      <span>
                        {duration}
                      </span>
                    </div>
                  </td>

                  {/* DESTINATION */}
                  <td>
                    <div className="table-destination-cell">
                      <div className="table-destination-icon">
                        <MapPin size={17} />
                      </div>

                      <div>
                        <strong>
                          {destination}
                        </strong>

                        <span>
                          {country}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* TRAVEL DATE */}
                  <td>
                    <div className="table-date-cell">
                      <CalendarDays size={16} />

                      <div className="table-date-range">
                        <span>
                          {startDate
                            ? formatDate(startDate)
                            : "Not set"}
                        </span>

                        {endDate && (
                          <small>
                            to{" "}
                            {formatDate(endDate)}
                          </small>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td>
                    <strong>
                      {formatCurrency(price)}
                    </strong>

                    <span className="table-muted-text">
                      per person
                    </span>
                  </td>

                  {/* SEATS */}
                  <td>
                    <span className="seat-count">
                      {availableSeats}/
                      {totalSeats}
                    </span>

                    <span className="table-muted-text">
                      available
                    </span>
                  </td>

                  {/* GUIDE */}
                  <td>
                    <span className="table-guide-name">
                      {guide}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <StatusBadge
                      status={status}
                    />
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="table-action-button"
                        title="View trip"
                        aria-label={`View ${destination} trip`}
                        onClick={() =>
                          onView?.(trip)
                        }
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        className="table-action-button edit"
                        title="Edit trip"
                        aria-label={`Edit ${destination} trip`}
                        onClick={() =>
                          onEdit?.(trip)
                        }
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        className="table-action-button delete"
                        title="Delete trip"
                        aria-label={`Delete ${destination} trip`}
                        onClick={() =>
                          onDelete?.(trip)
                        }
                      >
                        <Trash2 size={17} />
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

export default TripTable;