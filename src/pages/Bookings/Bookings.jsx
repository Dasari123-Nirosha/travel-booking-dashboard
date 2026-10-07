import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  CalendarCheck,
  CheckCircle,
  Clock3,
  Wallet,
} from "lucide-react";

import { useSearchParams } from "react-router-dom";

import BookingTable from "../../components/bookings/BookingTable";
import BookingCard from "../../components/bookings/BookingCard";
import BookingForm from "../../components/bookings/BookingForm";
import BookingDetails from "../../components/bookings/BookingDetails";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";

import { useToast } from "../../context/ToastContext";
import { useBooking } from "../../context/BookingContext";
import { formatCurrency } from "../../utils/formatters";

function Bookings() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const destinationFromSearch =
    searchParams.get("destination") || "";

  /* =========================================
     BOOKING CONTEXT
  ========================================= */

  const {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
  } = useBooking();

  const [searchTerm, setSearchTerm] =
    useState(destinationFromSearch);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [paymentFilter, setPaymentFilter] =
    useState("All");

  const [viewMode, setViewMode] =
    useState("table");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingBooking, setEditingBooking] =
    useState(null);

  const { toast, showToast, hideToast } =
    useToast();

  /* =========================================
     FILTER BOOKINGS
  ========================================= */

  const filteredBookings = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesSearch =
        !search ||
        String(booking.bookingId || "")
          .toLowerCase()
          .includes(search) ||
        String(
          booking.customer ||
            booking.customerName ||
            ""
        )
          .toLowerCase()
          .includes(search) ||
        String(booking.email || "")
          .toLowerCase()
          .includes(search) ||
        String(booking.destination || "")
          .toLowerCase()
          .includes(search);

      const bookingStatus =
        booking.bookingStatus ||
        booking.status ||
        "Pending";

      const matchesStatus =
        statusFilter === "All" ||
        bookingStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        booking.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    bookings,
    searchTerm,
    statusFilter,
    paymentFilter,
  ]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalBookings = bookings.length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        (booking.bookingStatus ||
          booking.status) === "Confirmed"
    ).length;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        (booking.bookingStatus ||
          booking.status) === "Pending"
    ).length;

  const totalRevenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.amount || 0),
    0
  );

  /* =========================================
     VIEW BOOKING
  ========================================= */

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  /* =========================================
     EDIT BOOKING
  ========================================= */

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setShowForm(true);
  };

  /* =========================================
     DELETE BOOKING
  ========================================= */

  const handleDelete = (booking) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete booking ${booking.bookingId}?`
    );

    if (!confirmed) {
      return;
    }

    deleteBooking(
      booking.id || booking.bookingId
    );

    if (
      selectedBooking?.id === booking.id
    ) {
      setSelectedBooking(null);
      setShowDetails(false);
    }

    showToast(
      `Booking ${booking.bookingId} deleted successfully.`,
      "success"
    );
  };

  /* =========================================
     ADD BOOKING
  ========================================= */

  const handleAddBooking = () => {
    setEditingBooking(null);
    setShowForm(true);
  };

  /* =========================================
     FORM SUBMIT
  ========================================= */

  const handleFormSubmit = (formData) => {
    /* =====================================
       UPDATE EXISTING BOOKING
    ===================================== */

    if (editingBooking) {
      updateBooking(
        editingBooking.id ||
          editingBooking.bookingId,
        {
          ...formData,
          bookingId:
            editingBooking.bookingId,
        }
      );

      showToast(
        `Booking ${editingBooking.bookingId} updated successfully.`,
        "success"
      );
    }

    /* =====================================
       CREATE NEW BOOKING
    ===================================== */

    else {
      /*
        IMPORTANT:
        Do not create bookingId here.

        BookingContext.addBooking() is
        responsible for generating the
        next booking ID, saving the booking,
        and updating the bookings state.
      */

      const newBooking =
        addBooking(formData);

      /*
        addBooking() returns the newly
        created booking, so we can safely
        show its actual generated ID.
      */

      if (newBooking) {
        showToast(
          `Booking ${newBooking.bookingId} created successfully.`,
          "success"
        );
      } else {
        showToast(
          "Booking created successfully.",
          "success"
        );
      }
    }

    /* =====================================
       CLOSE FORM
    ===================================== */

    setShowForm(false);
    setEditingBooking(null);
  };

  /* =========================================
     CLOSE FORM
  ========================================= */

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBooking(null);
  };

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setSearchParams({});
  };

  /* =========================================
     REMOVE DESTINATION FILTER
  ========================================= */

  const clearDestinationFilter = () => {
    setSearchTerm("");
    setSearchParams({});
  };

  return (
    <div className="page bookings-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header">

        <div>

          <span className="page-eyebrow">
            BOOKING MANAGEMENT
          </span>

          <h1>Bookings</h1>

          <p>
            Manage customer reservations,
            payments, and travel bookings.
          </p>

        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleAddBooking}
        >
          New Booking
        </Button>

      </div>

      {/* =====================================
          SELECTED DESTINATION
      ===================================== */}

      {destinationFromSearch && (
        <div className="selected-destination-filter">

          <div>
            <strong>
              Showing bookings for:
            </strong>

            <span>
              {destinationFromSearch}
            </span>
          </div>

          <button
            type="button"
            onClick={
              clearDestinationFilter
            }
          >
            <span>Clear</span>
            <span>×</span>
          </button>

        </div>
      )}

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="stats-grid booking-stats">

        <div className="stat-card">

          <div className="stat-card-icon">
            <CalendarCheck size={22} />
          </div>

          <div className="stat-card-content">

            <span>Total Bookings</span>

            <strong>
              {totalBookings}
            </strong>

            <small>
              {destinationFromSearch
                ? `${destinationFromSearch} bookings`
                : "All reservations"}
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-icon">
            <CheckCircle size={22} />
          </div>

          <div className="stat-card-content">

            <span>Confirmed</span>

            <strong>
              {confirmedBookings}
            </strong>

            <small>
              Confirmed bookings
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-icon">
            <Clock3 size={22} />
          </div>

          <div className="stat-card-content">

            <span>Pending</span>

            <strong>
              {pendingBookings}
            </strong>

            <small>
              Awaiting confirmation
            </small>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-icon">
            <Wallet size={22} />
          </div>

          <div className="stat-card-content">

            <span>Total Revenue</span>

            <strong>
              {formatCurrency(totalRevenue)}
            </strong>

            <small>
              Booking revenue
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          BOOKING CONTENT
      ===================================== */}

      <div className="content-card">

        <div className="content-card-header">

          <div>

            <h2>
              {destinationFromSearch
                ? `${destinationFromSearch} Bookings`
                : "All Bookings"}
            </h2>

            <p>
              {filteredBookings.length} booking
              {filteredBookings.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

          <div className="view-toggle">

            <button
              type="button"
              className={
                viewMode === "table"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setViewMode("table")
              }
              title="Table view"
              aria-label="Table view"
            >
              <List size={18} />
            </button>

            <button
              type="button"
              className={
                viewMode === "grid"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setViewMode("grid")
              }
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
            </button>

          </div>

        </div>

        {/* =====================================
            FILTERS
        ===================================== */}

        <div className="booking-filters">

          <div className="search-input-wrapper">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search booking, customer, destination..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(
                  event.target.value
                );

                if (
                  destinationFromSearch
                ) {
                  setSearchParams({});
                }
              }}
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Booking Status
            </option>

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

          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Payment Status
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>

            <option value="Refunded">
              Refunded
            </option>
          </select>

        </div>

        {/* =====================================
            RESULTS
        ===================================== */}

        {filteredBookings.length === 0 ? (

          <div className="empty-state">

            <CalendarCheck size={42} />

            <h3>
              No bookings found
            </h3>

            <p>
              No bookings are available for{" "}
              {destinationFromSearch ||
                "the selected filters"}.
            </p>

            <Button
              variant="secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>

          </div>

        ) : viewMode === "table" ? (

          <BookingTable
            bookings={filteredBookings}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        ) : (

          <div className="bookings-grid">

            {filteredBookings.map(
              (booking) => (
                <BookingCard
                  key={
                    booking.id ||
                    booking.bookingId
                  }
                  booking={booking}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            )}

          </div>

        )}

      </div>

      {/* =====================================
          BOOKING DETAILS
      ===================================== */}

      <Modal
        isOpen={showDetails}
        onClose={() =>
          setShowDetails(false)
        }
        title=""
        size="large"
      >
        <BookingDetails
          booking={selectedBooking}
          onClose={() =>
            setShowDetails(false)
          }
        />
      </Modal>

      {/* =====================================
          BOOKING FORM
      ===================================== */}

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title=""
        size="large"
      >
        <BookingForm
          booking={editingBooking}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      </Modal>

      {/* =====================================
          TOAST
      ===================================== */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

    </div>
  );
}

export default Bookings;