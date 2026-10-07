import { useState } from "react";
import {
  X,
  User,
  Mail,
  MapPin,
  CalendarDays,
  Users,
  Clock3,
  IndianRupee,
  Plane,
  Star,
  Tag,
} from "lucide-react";

import destinationsData from "../../data/destinations";
import tripsData from "../../data/trips";

function getSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(`Unable to load ${key}:`, error);
  }

  return fallback;
}

function BookingForm({
  booking = null,
  onSubmit,
  onClose,
}) {
  const [destinations] = useState(() =>
    getSavedData(
      "travel-destinations",
      destinationsData
    )
  );

  const [trips] = useState(() =>
    getSavedData(
      "travel-trips",
      tripsData
    )
  );

  const [formData, setFormData] = useState({
    customerName:
      booking?.customerName ||
      booking?.customer ||
      "",

    email:
      booking?.email || "",

    destination:
      booking?.destination || "",

    tripId:
      booking?.tripId || "",

    travelDate:
      booking?.travelDate || "",

    travelEndDate:
      booking?.travelEndDate || "",

    travelers:
      booking?.travelers || 1,

    amount:
      booking?.amount || 0,

    paymentStatus:
      booking?.paymentStatus || "Pending",

    status:
      booking?.status ||
      booking?.bookingStatus ||
      "Confirmed",
  });

  /* =========================
     SELECTED DESTINATION
  ========================= */

  const selectedDestination = destinations.find(
    (destination) =>
      String(destination.name || "").toLowerCase() ===
      String(formData.destination || "").toLowerCase()
  );

  /* =========================
     SELECTED TRIP
  ========================= */

  const selectedTrip = trips.find(
    (trip) =>
      String(trip.tripId || "") ===
      String(formData.tripId || "")
  );

  /* =========================
     DESTINATION PRICE
  ========================= */

  const destinationPrice = Number(
    selectedDestination?.price ??
      selectedDestination?.amount ??
      0
  );

  /* =========================
     TRIP PRICE
  ========================= */

  const tripPrice = Number(
    selectedTrip?.price ??
      selectedTrip?.amount ??
      0
  );

  /*
    If trip is selected, use trip price.
    Otherwise use destination price.
  */

  const pricePerPerson = selectedTrip
    ? tripPrice
    : destinationPrice;

  const totalAmount =
    pricePerPerson *
    Number(formData.travelers || 1);

  /* =========================
     DESTINATION DATES
  ========================= */

  const destinationStartDate =
    selectedDestination?.startDate ||
    selectedDestination?.travelStartDate ||
    selectedDestination?.fromDate ||
    "";

  const destinationEndDate =
    selectedDestination?.endDate ||
    selectedDestination?.travelEndDate ||
    selectedDestination?.toDate ||
    "";

  /* =========================
     TRIP DATES
  ========================= */

  const tripStartDate =
    selectedTrip?.startDate || "";

  const tripEndDate =
    selectedTrip?.endDate || "";

  /*
    Dates are also independent.

    Trip dates are used only when
    a trip is selected.
  */

  const activeStartDate =
    selectedTrip
      ? tripStartDate
      : destinationStartDate;

  const activeEndDate =
    selectedTrip
      ? tripEndDate
      : destinationEndDate;

  /* =========================
     GENERAL CHANGE
  ========================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     DESTINATION CHANGE
  ========================= */

  const handleDestinationChange = (event) => {
    const destination =
      event.target.value;

    const selected =
      destinations.find(
        (item) =>
          String(item.name || "").toLowerCase() ===
          String(destination || "").toLowerCase()
      );

    /*
      IMPORTANT:

      We ONLY update destination fields.

      tripId is NOT changed.
    */

    setFormData((previous) => ({
      ...previous,

      destination,

      travelDate:
        selected?.startDate ||
        selected?.travelStartDate ||
        selected?.fromDate ||
        previous.travelDate,

      travelEndDate:
        selected?.endDate ||
        selected?.travelEndDate ||
        selected?.toDate ||
        previous.travelEndDate,

      amount:
        Number(
          selected?.price ??
            selected?.amount ??
            0
        ),
    }));
  };

  /* =========================
     TRIP CHANGE
  ========================= */

  const handleTripChange = (event) => {
    const tripId =
      event.target.value;

    const selected =
      trips.find(
        (item) =>
          String(item.tripId || "") ===
          String(tripId || "")
      );

    /*
      IMPORTANT:

      We ONLY update trip fields.

      destination is NOT changed.
    */

    setFormData((previous) => ({
      ...previous,

      tripId,

      travelDate:
        selected?.startDate ||
        previous.travelDate,

      travelEndDate:
        selected?.endDate ||
        previous.travelEndDate,

      amount:
        Number(
          selected?.price ??
            selected?.amount ??
            0
        ),
    }));
  };

  /* =========================
     TRAVELERS CHANGE
  ========================= */

  const handleTravelersChange = (event) => {
    const travelers =
      Number(event.target.value);

    setFormData((previous) => ({
      ...previous,

      travelers:
        travelers < 1
          ? 1
          : travelers,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter customer email.");
      return;
    }

    /*
      Destination OR Trip is required.

      A booking does NOT require both.
    */

    if (
      !formData.destination &&
      !formData.tripId
    ) {
      alert(
        "Please select a destination or trip."
      );
      return;
    }

    if (!formData.travelDate) {
      alert("Please select a travel date.");
      return;
    }

    const newBooking = {
      ...formData,

      id:
        booking?.id ||
        `booking-${Date.now()}`,

      bookingId:
        booking?.bookingId ||
        `BK-${Date.now()
          .toString()
          .slice(-6)}`,

      customer:
        formData.customerName,

      customerName:
        formData.customerName,

      status:
        formData.status,

      bookingStatus:
        formData.status,

      paymentStatus:
        formData.paymentStatus,

      travelers:
        Number(formData.travelers),

      /* =========================
         DESTINATION INFORMATION
      ========================= */

      destination:
        formData.destination,

      destinationCountry:
        selectedDestination?.country || "",

      destinationDescription:
        selectedDestination?.description || "",

      destinationCategory:
        selectedDestination?.category || "",

      destinationRating:
        selectedDestination?.rating || 0,

      destinationDuration:
        selectedDestination?.duration || "",

      destinationPrice:
        destinationPrice,

      destinationStartDate:
        destinationStartDate,

      destinationEndDate:
        destinationEndDate,

      /* =========================
         TRIP INFORMATION
      ========================= */

      tripId:
        selectedTrip?.tripId || "",

      tripName:
        selectedTrip
          ? `${selectedTrip.destination} Trip`
          : "",

      tripDestination:
        selectedTrip?.destination || "",

      country:
        selectedTrip?.country ||
        selectedDestination?.country ||
        "",

      duration:
        selectedTrip?.duration ||
        selectedDestination?.duration ||
        "",

      pricePerPerson:
        pricePerPerson,

      availableSeats:
        selectedTrip?.availableSeats || 0,

      totalSeats:
        selectedTrip?.totalSeats || 0,

      /* =========================
         AMOUNT
      ========================= */

      amount:
        totalAmount,

      /* =========================
         TRAVEL DATES
      ========================= */

      travelDate:
        formData.travelDate,

      travelEndDate:
        formData.travelEndDate ||
        activeEndDate,

      bookingDate:
        booking?.bookingDate ||
        new Date()
          .toISOString()
          .split("T")[0],
    };

    onSubmit(newBooking);
  };

  return (
    <div className="booking-form">

      {/* =========================
          HEADER
      ========================= */}

      <div className="booking-form-header">

        <div>
          <span className="details-label">
            {booking
              ? "EDIT BOOKING"
              : "NEW BOOKING"}
          </span>

          <h2>
            {booking
              ? "Edit Booking"
              : "Create New Booking"}
          </h2>

          <p>
            Enter customer and travel
            information
          </p>
        </div>

        <button
          type="button"
          className="details-close-button"
          onClick={onClose}
        >
          <X size={20} />
        </button>

      </div>

      <form
        className="booking-form-content"
        onSubmit={handleSubmit}
      >

        {/* =========================
            CUSTOMER INFORMATION
        ========================= */}

        <div className="booking-form-section">

          <h3>
            Customer Information
          </h3>

          <div className="booking-form-grid">

            <div className="form-group">

              <label>
                <User size={15} />
                Customer Name
              </label>

              <input
                type="text"
                name="customerName"
                value={
                  formData.customerName
                }
                onChange={handleChange}
                placeholder="Enter customer name"
              />

            </div>

            <div className="form-group">

              <label>
                <Mail size={15} />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={handleChange}
                placeholder="customer@example.com"
              />

            </div>

          </div>

        </div>

        {/* =========================
            TRAVEL INFORMATION
        ========================= */}

        <div className="booking-form-section">

          <h3>
            Travel Information
          </h3>

          <div className="booking-form-grid">

            {/* DESTINATION */}

            <div className="form-group">

              <label>
                <MapPin size={15} />
                Destination
              </label>

              <select
                name="destination"
                value={
                  formData.destination
                }
                onChange={
                  handleDestinationChange
                }
              >
                <option value="">
                  Select destination
                </option>

                {destinations.map(
                  (destination) => (
                    <option
                      key={
                        destination.id ||
                        destination.name
                      }
                      value={
                        destination.name
                      }
                    >
                      {destination.name}

                      {destination.country
                        ? `, ${destination.country}`
                        : ""}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* TRIP */}

            <div className="form-group">

              <label>
                <Plane size={15} />
                Trip / Package
              </label>

              <select
                name="tripId"
                value={
                  formData.tripId
                }
                onChange={
                  handleTripChange
                }
              >
                <option value="">
                  No trip selected
                </option>

                {trips.map(
                  (trip) => (
                    <option
                      key={
                        trip.tripId ||
                        trip.id
                      }
                      value={
                        trip.tripId
                      }
                    >
                      {trip.tripId} -{" "}
                      {trip.destination}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* START DATE */}

            <div className="form-group">

              <label>
                <CalendarDays size={15} />
                Start Date
              </label>

              <input
                type="date"
                name="travelDate"
                value={
                  formData.travelDate
                }
                onChange={handleChange}
                min={
                  activeStartDate ||
                  undefined
                }
                max={
                  activeEndDate ||
                  undefined
                }
              />

            </div>

            {/* END DATE */}

            <div className="form-group">

              <label>
                <CalendarDays size={15} />
                End Date
              </label>

              <input
                type="date"
                name="travelEndDate"
                value={
                  formData.travelEndDate
                }
                onChange={handleChange}
                min={
                  formData.travelDate ||
                  activeStartDate ||
                  undefined
                }
                max={
                  activeEndDate ||
                  undefined
                }
              />

            </div>

            {/* TRAVELERS */}

            <div className="form-group">

              <label>
                <Users size={15} />
                Travelers
              </label>

              <input
                type="number"
                name="travelers"
                min="1"
                max={
                  selectedTrip?.availableSeats ||
                  undefined
                }
                value={
                  formData.travelers
                }
                onChange={
                  handleTravelersChange
                }
              />

            </div>

          </div>

          {/* =========================
              SELECTED DESTINATION
          ========================= */}

          {selectedDestination && (
            <div className="selected-trip-summary">

              <div className="selected-trip-heading">

                <div>

                  <span>
                    SELECTED DESTINATION
                  </span>

                  <h4>
                    {
                      selectedDestination.name
                    }

                    {selectedDestination.country
                      ? `, ${selectedDestination.country}`
                      : ""}
                  </h4>

                </div>

                {selectedDestination.category && (
                  <span className="trip-id-badge">
                    {
                      selectedDestination.category
                    }
                  </span>
                )}

              </div>

              <div className="selected-trip-details">

                <div>
                  <Clock3 size={17} />

                  <span>
                    <small>
                      Duration
                    </small>

                    <strong>
                      {
                        selectedDestination.duration ||
                        "Not specified"
                      }
                    </strong>
                  </span>
                </div>

                <div>
                  <IndianRupee size={17} />

                  <span>
                    <small>
                      Price / Person
                    </small>

                    <strong>
                      ₹
                      {destinationPrice.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={17} />

                  <span>
                    <small>
                      Start Date
                    </small>

                    <strong>
                      {destinationStartDate ||
                        "Not set"}
                    </strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={17} />

                  <span>
                    <small>
                      End Date
                    </small>

                    <strong>
                      {destinationEndDate ||
                        "Not set"}
                    </strong>
                  </span>
                </div>

                <div>
                  <Star size={17} />

                  <span>
                    <small>
                      Rating
                    </small>

                    <strong>
                      {
                        selectedDestination.rating ||
                        "N/A"
                      }
                    </strong>
                  </span>
                </div>

                <div>
                  <Tag size={17} />

                  <span>
                    <small>
                      Category
                    </small>

                    <strong>
                      {
                        selectedDestination.category ||
                        "General"
                      }
                    </strong>
                  </span>
                </div>

              </div>

              {selectedDestination.description && (
                <div className="destination-booking-description">
                  {
                    selectedDestination.description
                  }
                </div>
              )}

            </div>
          )}

          {/* =========================
              SELECTED TRIP
          ========================= */}

          {selectedTrip && (
            <div className="selected-trip-summary">

              <div className="selected-trip-heading">

                <div>

                  <span>
                    SELECTED TRIP
                  </span>

                  <h4>
                    {
                      selectedTrip.destination
                    }

                    {selectedTrip.country
                      ? `, ${selectedTrip.country}`
                      : ""}
                  </h4>

                </div>

                <span className="trip-id-badge">
                  {selectedTrip.tripId}
                </span>

              </div>

              <div className="selected-trip-details">

                <div>
                  <Clock3 size={17} />

                  <span>
                    <small>
                      Duration
                    </small>

                    <strong>
                      {
                        selectedTrip.duration ||
                        "Not specified"
                      }
                    </strong>
                  </span>
                </div>

                <div>
                  <IndianRupee size={17} />

                  <span>
                    <small>
                      Price / Person
                    </small>

                    <strong>
                      ₹
                      {tripPrice.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </span>
                </div>

                <div>
                  <Users size={17} />

                  <span>
                    <small>
                      Available Seats
                    </small>

                    <strong>
                      {
                        selectedTrip.availableSeats ||
                        0
                      }{" "}
                      /{" "}
                      {
                        selectedTrip.totalSeats ||
                        0
                      }
                    </strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={17} />

                  <span>
                    <small>
                      Trip Dates
                    </small>

                    <strong>
                      {
                        selectedTrip.startDate ||
                        "Not set"
                      }
                      {" → "}
                      {
                        selectedTrip.endDate ||
                        "Not set"
                      }
                    </strong>
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* =========================
              TOTAL
          ========================= */}

          {(selectedDestination ||
            selectedTrip) && (
            <div className="booking-total">

              <div>

                <span>
                  {formData.travelers} traveler
                  {Number(
                    formData.travelers
                  ) !== 1
                    ? "s"
                    : ""}
                </span>

                <small>
                  ₹
                  {pricePerPerson.toLocaleString(
                    "en-IN"
                  )}{" "}
                  ×{" "}
                  {formData.travelers}
                </small>

              </div>

              <strong>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>
          )}

        </div>

        {/* =========================
            BOOKING STATUS
        ========================= */}

        <div className="booking-form-section">

          <h3>
            Booking Status
          </h3>

          <div className="booking-form-grid">

            <div className="form-group">

              <label>
                Booking Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={handleChange}
              >
                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

            </div>

            <div className="form-group">

              <label>
                Payment Status
              </label>

              <select
                name="paymentStatus"
                value={
                  formData.paymentStatus
                }
                onChange={handleChange}
              >
                <option value="Paid">
                  Paid
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Failed">
                  Failed
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="booking-form-footer">

          <button
            type="button"
            className="button secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button primary"
          >
            {booking
              ? "Update Booking"
              : "Create Booking"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default BookingForm;