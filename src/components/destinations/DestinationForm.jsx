import { useState } from "react";
import { X } from "lucide-react";
import { validateDestination } from "../../utils/validators";

const initialForm = {
  name: "",
  country: "",
  image: "",
  description: "",
  price: "",
  duration: "",
  startDate: "",
  endDate: "",
  rating: "5",
  bookings: "0",
  category: "New",
  status: "Active",
};

function DestinationForm({
  destination,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState({
    ...initialForm,
    ...(destination || {}),
    startDate:
      destination?.startDate ||
      destination?.travelStartDate ||
      "",
    endDate:
      destination?.endDate ||
      destination?.travelEndDate ||
      "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateDestination({
      ...formData,
      price: Number(formData.price),
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit?.({
      ...formData,

      id: destination?.id,

      price: Number(formData.price),

      rating: Number(formData.rating),

      bookings: Number(formData.bookings),

      /*
        Save the actual travel dates.
      */
      startDate: formData.startDate,

      endDate: formData.endDate,

      category: formData.category,

      status: formData.status,
    });
  };

  return (
    <div className="form-modal">

      {/* HEADER */}
      <div className="form-modal-header">

        <div>
          <h3>
            {destination
              ? "Edit Destination"
              : "Add Destination"}
          </h3>

          <p>
            {destination
              ? "Update destination information."
              : "Add a new travel destination."}
          </p>
        </div>

        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
        >
          <X size={20} />
        </button>

      </div>

      {/* FORM */}
      <form
        className="destination-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          {/* NAME */}
          <div className="form-group">
            <label htmlFor="name">
              Destination Name
            </label>

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Paris"
            />

            {errors.name && (
              <small className="form-error">
                {errors.name}
              </small>
            )}
          </div>

          {/* COUNTRY */}
          <div className="form-group">
            <label htmlFor="country">
              Country
            </label>

            <input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. France"
            />

            {errors.country && (
              <small className="form-error">
                {errors.country}
              </small>
            )}
          </div>

          {/* IMAGE */}
          <div className="form-group full-width">
            <label htmlFor="image">
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/destination.jpg"
            />

            {formData.image && (
              <div className="destination-image-preview">
                <img
                  src={formData.image}
                  alt="Destination preview"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full-width">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter destination description..."
              rows="3"
            />
          </div>

          {/* PRICE */}
          <div className="form-group">
            <label htmlFor="price">
              Starting Price
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="1"
              value={formData.price}
              onChange={handleChange}
              placeholder="3400"
            />

            {errors.price && (
              <small className="form-error">
                {errors.price}
              </small>
            )}
          </div>

          {/* DURATION */}
          <div className="form-group">
            <label htmlFor="duration">
              Duration
            </label>

            <input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="2 Nights"
            />
          </div>

          {/* START DATE */}
          <div className="form-group">
            <label htmlFor="startDate">
              Start Date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          {/* END DATE */}
          <div className="form-group">
            <label htmlFor="endDate">
              End Date
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              min={formData.startDate || undefined}
              onChange={handleChange}
            />
          </div>

          {/* RATING */}
          <div className="form-group">
            <label htmlFor="rating">
              Rating
            </label>

            <input
              id="rating"
              name="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>

          {/* BOOKINGS */}
          <div className="form-group">
            <label htmlFor="bookings">
              Bookings
            </label>

            <input
              id="bookings"
              name="bookings"
              type="number"
              min="0"
              value={formData.bookings}
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Popular">
                Popular
              </option>

              <option value="Trending">
                Trending
              </option>

              <option value="Luxury">
                Luxury
              </option>

              <option value="New">
                New
              </option>
            </select>
          </div>

          {/* STATUS */}
          <div className="form-group">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
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
            {destination
              ? "Update Destination"
              : "Add Destination"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default DestinationForm;