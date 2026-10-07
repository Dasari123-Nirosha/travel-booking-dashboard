import { useState } from "react";
import { X } from "lucide-react";

const defaultTrip = {
  tripId: "",
  destination: "",
  country: "",
  image: "",
  startDate: "",
  endDate: "",
  duration: "",
  price: "",
  availableSeats: "",
  totalSeats: "",
  status: "Upcoming",
  guide: "",
};

const validStatuses = [
  "Upcoming",
  "Active",
  "Completed",
  "Cancelled",
];

function TripForm({
  trip,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] =
    useState({
      ...defaultTrip,
      ...(trip || {}),
    });

  const [errors, setErrors] =
    useState({});

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => {
      const updatedData = {
        ...previous,
        [name]: value,
      };

      /*
       * If total seats are reduced below
       * available seats, keep available
       * seats valid automatically.
       */
      if (
        name === "totalSeats" &&
        value !== ""
      ) {
        const total =
          Number(value);

        const available =
          Number(
            previous.availableSeats
          );

        if (
          Number.isInteger(total) &&
          Number.isInteger(
            available
          ) &&
          available > total
        ) {
          updatedData.availableSeats =
            value;
        }
      }

      /*
       * If start date changes and the
       * existing end date is earlier,
       * clear the end date so the user
       * selects a valid one.
       */
      if (
        name === "startDate" &&
        previous.endDate &&
        value &&
        new Date(
          previous.endDate
        ) <
          new Date(value)
      ) {
        updatedData.endDate = "";
      }

      return updatedData;
    });

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    /*
     * Clear related seat error when
     * either seat field changes.
     */
    if (
      name === "totalSeats" ||
      name === "availableSeats"
    ) {
      setErrors((previous) => ({
        ...previous,
        totalSeats: "",
        availableSeats: "",
      }));
    }

    /*
     * Clear date-related errors when
     * either date changes.
     */
    if (
      name === "startDate" ||
      name === "endDate"
    ) {
      setErrors((previous) => ({
        ...previous,
        startDate: "",
        endDate: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const destination =
      formData.destination
        .trim();

    const country =
      formData.country
        .trim();

    const guide =
      formData.guide
        .trim();

    const duration =
      formData.duration
        .trim();

    const image =
      formData.image
        .trim();

    const price =
      Number(formData.price);

    const totalSeats =
      Number(
        formData.totalSeats
      );

    const availableSeats =
      Number(
        formData.availableSeats
      );

    /*
     * DESTINATION
     */

    if (!destination) {
      newErrors.destination =
        "Destination is required";
    } else if (
      destination.length < 2
    ) {
      newErrors.destination =
        "Enter a valid destination";
    }

    /*
     * COUNTRY
     */

    if (!country) {
      newErrors.country =
        "Country is required";
    } else if (
      country.length < 2
    ) {
      newErrors.country =
        "Enter a valid country";
    }

    /*
     * GUIDE
     */

    if (!guide) {
      newErrors.guide =
        "Trip guide is required";
    } else if (
      guide.length < 2
    ) {
      newErrors.guide =
        "Enter a valid guide name";
    }

    /*
     * IMAGE
     */

    if (image) {
      try {
        const imageUrl =
          new URL(image);

        if (
          imageUrl.protocol !==
            "http:" &&
          imageUrl.protocol !==
            "https:"
        ) {
          newErrors.image =
            "Enter a valid image URL";
        }
      } catch {
        newErrors.image =
          "Enter a valid image URL";
      }
    }

    /*
     * START DATE
     */

    if (!formData.startDate) {
      newErrors.startDate =
        "Start date is required";
    }

    /*
     * END DATE
     */

    if (!formData.endDate) {
      newErrors.endDate =
        "End date is required";
    }

    /*
     * DATE ORDER
     */

    if (
      formData.startDate &&
      formData.endDate
    ) {
      const startDate =
        new Date(
          formData.startDate
        );

      const endDate =
        new Date(
          formData.endDate
        );

      startDate.setHours(
        0,
        0,
        0,
        0
      );

      endDate.setHours(
        0,
        0,
        0,
        0
      );

      if (
        endDate <= startDate
      ) {
        newErrors.endDate =
          "End date must be after start date";
      }
    }

    /*
     * PREVENT PAST START DATE
     *
     * Only apply this when creating
     * a new trip. Existing trips can
     * still be edited.
     */

    if (
      !trip &&
      formData.startDate
    ) {
      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const selectedStartDate =
        new Date(
          formData.startDate
        );

      selectedStartDate.setHours(
        0,
        0,
        0,
        0
      );

      if (
        selectedStartDate <
        today
      ) {
        newErrors.startDate =
          "Start date cannot be in the past";
      }
    }

    /*
     * DURATION
     */

    if (!duration) {
      newErrors.duration =
        "Duration is required";
    } else if (
      duration.length < 2
    ) {
      newErrors.duration =
        "Enter a valid duration";
    }

    /*
     * PRICE
     */

    if (
      formData.price === "" ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      newErrors.price =
        "Enter a valid price";
    }

    /*
     * TOTAL SEATS
     */

    if (
      formData.totalSeats === "" ||
      !Number.isInteger(
        totalSeats
      ) ||
      totalSeats <= 0
    ) {
      newErrors.totalSeats =
        "Enter a valid number of total seats";
    }

    /*
     * AVAILABLE SEATS
     */

    if (
      formData.availableSeats ===
        "" ||
      !Number.isInteger(
        availableSeats
      ) ||
      availableSeats < 0
    ) {
      newErrors.availableSeats =
        "Enter a valid number of available seats";
    }

    /*
     * AVAILABLE CANNOT EXCEED TOTAL
     */

    if (
      Number.isInteger(
        totalSeats
      ) &&
      Number.isInteger(
        availableSeats
      ) &&
      availableSeats >
        totalSeats
    ) {
      newErrors.availableSeats =
        "Available seats cannot exceed total seats";
    }

    /*
     * STATUS
     */

    if (
      !validStatuses.includes(
        formData.status
      )
    ) {
      newErrors.status =
        "Select a valid status";
    }

    return newErrors;
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      setErrors(
        validationErrors
      );
      return;
    }

    const cleanedData = {
      ...formData,

      id: trip?.id,

      tripId:
        formData.tripId
          .trim(),

      destination:
        formData.destination
          .trim(),

      country:
        formData.country
          .trim(),

      image:
        formData.image
          .trim(),

      guide:
        formData.guide
          .trim(),

      duration:
        formData.duration
          .trim(),

      price:
        Number(formData.price),

      availableSeats:
        Number(
          formData.availableSeats
        ),

      totalSeats:
        Number(
          formData.totalSeats
        ),
    };

    onSubmit?.(
      cleanedData
    );
  };

  return (
    <div className="form-modal">
      {/* HEADER */}

      <div className="form-modal-header">
        <div>
          <h3>
            {trip
              ? "Edit Trip"
              : "Create New Trip"}
          </h3>

          <p>
            {trip
              ? "Update the trip information."
              : "Add a new trip to your travel schedule."}
          </p>
        </div>

        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close trip form"
        >
          <X size={20} />
        </button>
      </div>

      <form
        className="trip-form"
        onSubmit={
          handleSubmit
        }
        noValidate
      >
        <div className="form-grid">
          {/* TRIP ID */}

          <div className="form-group">
            <label htmlFor="tripId">
              Trip ID
            </label>

            <input
              id="tripId"
              name="tripId"
              value={
                formData.tripId
              }
              onChange={
                handleChange
              }
              placeholder="TR-1007"
              disabled={Boolean(
                trip
              )}
            />

            {!trip && (
              <small className="form-help">
                Leave blank to generate
                the Trip ID automatically.
              </small>
            )}
          </div>

          {/* DESTINATION */}

          <div className="form-group">
            <label htmlFor="destination">
              Destination *
            </label>

            <input
              id="destination"
              name="destination"
              value={
                formData.destination
              }
              onChange={
                handleChange
              }
              placeholder="Paris"
              autoComplete="off"
            />

            {errors.destination && (
              <small className="form-error">
                {
                  errors.destination
                }
              </small>
            )}
          </div>

          {/* COUNTRY */}

          <div className="form-group">
            <label htmlFor="country">
              Country *
            </label>

            <input
              id="country"
              name="country"
              value={
                formData.country
              }
              onChange={
                handleChange
              }
              placeholder="France"
              autoComplete="off"
            />

            {errors.country && (
              <small className="form-error">
                {errors.country}
              </small>
            )}
          </div>

          {/* GUIDE */}

          <div className="form-group">
            <label htmlFor="guide">
              Trip Guide *
            </label>

            <input
              id="guide"
              name="guide"
              value={
                formData.guide
              }
              onChange={
                handleChange
              }
              placeholder="Guide name"
              autoComplete="off"
            />

            {errors.guide && (
              <small className="form-error">
                {errors.guide}
              </small>
            )}
          </div>

          {/* IMAGE */}

          <div className="form-group full-width">
            <label htmlFor="image">
              Trip Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              value={
                formData.image
              }
              onChange={
                handleChange
              }
              placeholder="https://example.com/trip-image.jpg"
            />

            {errors.image && (
              <small className="form-error">
                {errors.image}
              </small>
            )}

            {formData.image && (
              <div className="trip-image-preview">
                <img
                  src={
                    formData.image
                  }
                  alt={
                    formData.destination ||
                    "Trip preview"
                  }
                  onError={(
                    event
                  ) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* START DATE */}

          <div className="form-group">
            <label htmlFor="startDate">
              Start Date *
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={
                formData.startDate
              }
              min={
                !trip
                  ? new Date()
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              onChange={
                handleChange
              }
            />

            {errors.startDate && (
              <small className="form-error">
                {
                  errors.startDate
                }
              </small>
            )}
          </div>

          {/* END DATE */}

          <div className="form-group">
            <label htmlFor="endDate">
              End Date *
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              min={
                formData.startDate ||
                undefined
              }
              value={
                formData.endDate
              }
              onChange={
                handleChange
              }
            />

            {errors.endDate && (
              <small className="form-error">
                {errors.endDate}
              </small>
            )}
          </div>

          {/* DURATION */}

          <div className="form-group">
            <label htmlFor="duration">
              Duration *
            </label>

            <input
              id="duration"
              name="duration"
              value={
                formData.duration
              }
              onChange={
                handleChange
              }
              placeholder="5 Days / 4 Nights"
            />

            {errors.duration && (
              <small className="form-error">
                {
                  errors.duration
                }
              </small>
            )}
          </div>

          {/* PRICE */}

          <div className="form-group">
            <label htmlFor="price">
              Price *
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              step="0.01"
              value={
                formData.price
              }
              onChange={
                handleChange
              }
              placeholder="2500"
            />

            {errors.price && (
              <small className="form-error">
                {errors.price}
              </small>
            )}
          </div>

          {/* TOTAL SEATS */}

          <div className="form-group">
            <label htmlFor="totalSeats">
              Total Seats *
            </label>

            <input
              id="totalSeats"
              name="totalSeats"
              type="number"
              min="1"
              step="1"
              value={
                formData.totalSeats
              }
              onChange={
                handleChange
              }
              placeholder="30"
            />

            {errors.totalSeats && (
              <small className="form-error">
                {
                  errors.totalSeats
                }
              </small>
            )}
          </div>

          {/* AVAILABLE SEATS */}

          <div className="form-group">
            <label htmlFor="availableSeats">
              Available Seats *
            </label>

            <input
              id="availableSeats"
              name="availableSeats"
              type="number"
              min="0"
              step="1"
              max={
                formData.totalSeats ||
                undefined
              }
              value={
                formData.availableSeats
              }
              onChange={
                handleChange
              }
              placeholder="20"
            />

            {errors.availableSeats && (
              <small className="form-error">
                {
                  errors.availableSeats
                }
              </small>
            )}
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
            >
              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            {errors.status && (
              <small className="form-error">
                {errors.status}
              </small>
            )}
          </div>
        </div>

        {/* ACTIONS */}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            {trip
              ? "Update Trip"
              : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TripForm;