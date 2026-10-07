import {
  CalendarCheck,
  Plus,
  Download,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardStats from "../../components/dashboard/DashboardStats";
import RevenueChart from "../../components/dashboard/RevenueChart";
import BookingChart from "../../components/dashboard/BookingChart";
import RecentBookings from "../../components/dashboard/RecentBookings";
import PopularDestinations from "../../components/dashboard/PopularDestinations";
import { useBookings } from "../../context/BookingContext";

function Dashboard() {
  const navigate = useNavigate();
  const { bookings } = useBookings();

  const handleNewBooking = () => {
    navigate("/bookings");
  };

  const handleExportReport = () => {
    const headers = [
      "Booking ID",
      "Customer",
      "Email",
      "Destination",
      "Trip",
      "Date",
      "Guests",
      "Amount",
      "Payment Status",
      "Booking Status",
    ];

    const rows = bookings.map((booking) => [
      booking.id || "",
      booking.customer || "",
      booking.email || "",
      booking.destination || "",
      booking.trip || "",
      booking.date || "",
      booking.guests || "",
      booking.amount || "",
      booking.paymentStatus || "",
      booking.bookingStatus || "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "travel-booking-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="page-breadcrumb">Home / Dashboard</p>

          <h2>Welcome back, Dasari Nirosha 👋</h2>

          <p className="page-description">
            Here's what's happening with your travel business today.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={handleExportReport}
          >
            <Download size={18} />
            Export Report
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={handleNewBooking}
          >
            <Plus size={18} />
            New Booking
          </button>
        </div>
      </div>

      <DashboardStats />

      <div className="dashboard-section-header">
        <div>
          <h3>Business Overview</h3>
          <p>Track your revenue and booking performance.</p>
        </div>

        <button className="period-button" type="button">
          <CalendarCheck size={17} />
          This Year
        </button>
      </div>

      <div className="charts-grid">
        <RevenueChart />
        <BookingChart />
      </div>

      <div className="dashboard-bottom-grid">
        <RecentBookings />
        <PopularDestinations />
      </div>

      <div className="quick-actions-card">
        <div className="quick-actions-content">
          <div className="quick-actions-icon">
            <CalendarCheck size={24} />
          </div>

          <div>
            <h3>Manage your bookings</h3>

            <p>
              Review reservations, update booking statuses, and manage
              customer trips from one place.
            </p>
          </div>
        </div>

        <button
          className="outline-button"
          type="button"
          onClick={() => navigate("/bookings")}
        >
          View Bookings
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

export default Dashboard;