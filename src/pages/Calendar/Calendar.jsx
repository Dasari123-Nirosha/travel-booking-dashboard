import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  Clock3,
  CheckCircle,
  Plus,
} from "lucide-react";

import { useBooking } from "../../context/BookingContext";
import CalendarView from "../../components/calendar/CalendarView";
import BookingDetails from "../../components/bookings/BookingDetails";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { formatCurrency } from "../../utils/formatters";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 9, 1)
  );

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  /* =========================================
     USE LIVE BOOKINGS FROM BOOKING CONTEXT
  ========================================= */

  const { bookings } = useBooking();

  /* =========================================
     NORMALIZE BOOKING DATA
  ========================================= */

  const normalizedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      ...booking,

      bookingId:
        booking.bookingId ||
        booking.id ||
        "N/A",

      customer:
        booking.customer ||
        booking.customerName ||
        "Unknown Customer",

      customerName:
        booking.customerName ||
        booking.customer ||
        "Unknown Customer",

      email:
        booking.email || "",

      destination:
        booking.destination ||
        "Unknown Destination",

      travelDate:
        booking.travelDate ||
        booking.tripDate ||
        booking.date ||
        "",

      tripDate:
        booking.tripDate ||
        booking.travelDate ||
        booking.date ||
        "",

      travelers:
        Number(booking.travelers || 1),

      amount:
        Number(booking.amount || 0),

      paymentStatus:
        booking.paymentStatus ||
        "Pending",

      bookingStatus:
        booking.bookingStatus ||
        booking.status ||
        "Pending",
    }));
  }, [bookings]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalBookings =
    normalizedBookings.length;

  const confirmedBookings =
    normalizedBookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "Confirmed"
    ).length;

  const pendingBookings =
    normalizedBookings.filter(
      (booking) =>
        booking.bookingStatus ===
        "Pending"
    ).length;

  /* =========================================
     BOOKINGS FOR SELECTED MONTH
  ========================================= */

  const monthBookings = useMemo(() => {
    const currentMonth =
      currentDate.getMonth();

    const currentYear =
      currentDate.getFullYear();

    return normalizedBookings.filter(
      (booking) => {
        if (!booking.travelDate) {
          return false;
        }

        const date = new Date(
          `${booking.travelDate}T00:00:00`
        );

        if (Number.isNaN(date.getTime())) {
          return false;
        }

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    );
  }, [
    currentDate,
    normalizedBookings,
  ]);

  /* =========================================
     MONTHLY REVENUE
  ========================================= */

  const monthRevenue =
    monthBookings.reduce(
      (total, booking) =>
        total +
        Number(booking.amount || 0),
      0
    );

  /* =========================================
     PREVIOUS MONTH
  ========================================= */

  const handlePreviousMonth = () => {
    setCurrentDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1
        )
    );
  };

  /* =========================================
     NEXT MONTH
  ========================================= */

  const handleNextMonth = () => {
    setCurrentDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1
        )
    );
  };

  /* =========================================
     TODAY
  ========================================= */

  const handleToday = () => {
    const today = new Date();

    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );
  };

  /* =========================================
     OPEN BOOKING DETAILS
  ========================================= */

  const handleEventClick = (booking) => {
    if (!booking) {
      return;
    }

    const normalizedBooking =
      normalizedBookings.find(
        (item) =>
          item.id === booking.id ||
          item.bookingId ===
            booking.bookingId
      );

    setSelectedBooking(
      normalizedBooking || booking
    );

    setShowDetails(true);
  };

  /* =========================================
     CLOSE DETAILS
  ========================================= */

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedBooking(null);
  };

  /* =========================================
     NEW BOOKING
  ========================================= */

  const handleNewBooking = () => {
    window.location.href = "/bookings";
  };

  return (
    <div className="page calendar-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-header calendar-page-header">
        <div>
          <span className="page-eyebrow">
            TRAVEL SCHEDULE
          </span>

          <h1>Calendar</h1>

          <p>
            View and manage upcoming travel
            bookings by date.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleNewBooking}
        >
          New Booking
        </Button>
      </div>

      {/* =====================================
          CALENDAR STATISTICS
      ===================================== */}

      <div className="stats-grid calendar-stats">

        <div className="stat-card calendar-stat-card">
          <div className="stat-card-icon">
            <CalendarDays size={22} />
          </div>

          <div className="stat-card-content">
            <span>Total Bookings</span>

            <strong>
              {totalBookings}
            </strong>

            <small>
              All scheduled trips
            </small>
          </div>
        </div>

        <div className="stat-card calendar-stat-card">
          <div className="stat-card-icon">
            <CheckCircle size={22} />
          </div>

          <div className="stat-card-content">
            <span>Confirmed</span>

            <strong>
              {confirmedBookings}
            </strong>

            <small>
              Confirmed trips
            </small>
          </div>
        </div>

        <div className="stat-card calendar-stat-card">
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

        <div className="stat-card calendar-stat-card">
          <div className="stat-card-icon">
            <CalendarCheck size={22} />
          </div>

          <div className="stat-card-content">
            <span>This Month</span>

            <strong>
              {monthBookings.length}
            </strong>

            <small>
              Scheduled bookings
            </small>
          </div>
        </div>

      </div>

      {/* =====================================
          BOOKING CALENDAR
      ===================================== */}

      <div className="content-card calendar-card">

        <div className="content-card-header calendar-card-header">

          <div>
            <h2>
              Booking Calendar
            </h2>

            <p>
              {monthBookings.length} booking
              {monthBookings.length !== 1
                ? "s"
                : ""}{" "}
              scheduled this month
            </p>
          </div>

          <div className="calendar-month-summary">
            <span>
              Monthly Revenue
            </span>

            <strong>
              {formatCurrency(
                monthRevenue
              )}
            </strong>
          </div>

        </div>

        <CalendarView
          currentDate={currentDate}
          bookings={normalizedBookings}
          onPreviousMonth={
            handlePreviousMonth
          }
          onNextMonth={
            handleNextMonth
          }
          onToday={handleToday}
          onEventClick={
            handleEventClick
          }
        />

      </div>

      {/* =====================================
          BOOKING DETAILS MODAL
      ===================================== */}

      <Modal
        isOpen={showDetails}
        onClose={
          handleCloseDetails
        }
        title=""
        size="large"
      >
        {selectedBooking && (
          <BookingDetails
            booking={selectedBooking}
            onClose={
              handleCloseDetails
            }
          />
        )}
      </Modal>

    </div>
  );
}

export default Calendar;