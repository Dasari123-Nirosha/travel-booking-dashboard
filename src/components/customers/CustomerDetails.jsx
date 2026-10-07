import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Plane,
  Wallet,
  X,
} from "lucide-react";

import {
  formatCurrency,
  formatDate,
} from "../../utils/formatters";

import StatusBadge from "../common/StatusBadge";

function CustomerDetails({
  customer,
  onClose,
}) {
  if (!customer) {
    return null;
  }

  const initials =
    customer.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CU";

  return (
    <div className="customer-details">
      {/* HEADER */}
      <div className="customer-details-header">
        <div className="customer-details-profile">
          <div className="customer-avatar extra-large">
            {initials}
          </div>

          <div className="customer-details-heading">
            <span className="details-label">
              CUSTOMER PROFILE
            </span>

            <h2>{customer.name}</h2>

            <span className="customer-id-text">
              Customer ID #{customer.id}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="details-close-button"
          onClick={onClose}
          title="Close"
          aria-label="Close customer details"
        >
          <X size={20} />
        </button>
      </div>

      {/* STATUS */}
      <div className="customer-details-status">
        <div>
          <span className="status-title">
            Account Status
          </span>

          <small>
            Current customer account status
          </small>
        </div>

        <StatusBadge
          status={
            customer.status || "Active"
          }
        />
      </div>

      {/* CUSTOMER INFORMATION */}
      <div className="customer-details-section">
        <div className="customer-details-section-heading">
          <div>
            <h3>Contact Information</h3>
            <p>
              Customer contact and profile
              details
            </p>
          </div>
        </div>

        <div className="customer-details-grid">
          <div className="details-info-card">
            <div className="details-icon">
              <Mail size={19} />
            </div>

            <div className="details-info-content">
              <span>Email Address</span>

              <strong>
                {customer.email || "-"}
              </strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <Phone size={19} />
            </div>

            <div className="details-info-content">
              <span>Phone Number</span>

              <strong>
                {customer.phone || "-"}
              </strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <MapPin size={19} />
            </div>

            <div className="details-info-content">
              <span>Location</span>

              <strong>
                {customer.location || "-"}
              </strong>
            </div>
          </div>

          <div className="details-info-card">
            <div className="details-icon">
              <CalendarDays size={19} />
            </div>

            <div className="details-info-content">
              <span>Joined Date</span>

              <strong>
                {customer.joinedDate
                  ? formatDate(
                      customer.joinedDate
                    )
                  : "-"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOMER ACTIVITY */}
      <div className="customer-details-section">
        <div className="customer-details-section-heading">
          <div>
            <h3>Customer Activity</h3>
            <p>
              Booking and spending
              overview
            </p>
          </div>
        </div>

        <div className="customer-details-summary">
          <div className="summary-item">
            <div className="summary-icon">
              <Plane size={20} />
            </div>

            <div className="summary-content">
              <span>Total Bookings</span>

              <strong>
                {Number(
                  customer.bookings || 0
                )}
              </strong>

              <small>
                Travel bookings
              </small>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon">
              <Wallet size={20} />
            </div>

            <div className="summary-content">
              <span>Total Spent</span>

              <strong>
                {formatCurrency(
                  Number(
                    customer.totalSpent ||
                      0
                  )
                )}
              </strong>

              <small>
                Total customer spending
              </small>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon">
              <User size={20} />
            </div>

            <div className="summary-content">
              <span>Customer ID</span>

              <strong>
                #{customer.id}
              </strong>

              <small>
                Registered customer
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="customer-details-footer">
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

export default CustomerDetails;