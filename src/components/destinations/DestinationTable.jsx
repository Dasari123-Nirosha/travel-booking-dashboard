import {
  Edit,
  Trash2,
  Star,
  MapPin,
} from "lucide-react";

import { formatCurrency } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

function DestinationTable({
  destinations,
  onEdit,
  onDelete,
}) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="empty-table-state">
        <MapPin size={32} />
        <h3>No destinations found</h3>
        <p>There are no destinations matching your search.</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Country</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Rating</th>
              <th>Bookings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {destinations.map((destination) => (
              <tr key={destination.id}>
                <td>
                  <div className="table-destination-cell">
                    <div className="table-destination-icon">
                      <MapPin size={18} />
                    </div>

                    <strong>{destination.name}</strong>
                  </div>
                </td>

                <td>{destination.country}</td>

                <td>
                  <strong>
                    {formatCurrency(destination.price)}
                  </strong>
                </td>

                <td>{destination.duration}</td>

                <td>
                  <span className="rating-cell">
                    <Star size={15} />
                    {destination.rating}
                  </span>
                </td>

                <td>{destination.bookings}</td>

                <td>
                  <StatusBadge status={destination.status} />
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      className="table-action-button edit"
                      title="Edit destination"
                      onClick={() => onEdit?.(destination)}
                    >
                      <Edit size={17} />
                    </button>

                    <button
                      className="table-action-button delete"
                      title="Delete destination"
                      onClick={() => onDelete?.(destination)}
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
    </div>
  );
}

export default DestinationTable;