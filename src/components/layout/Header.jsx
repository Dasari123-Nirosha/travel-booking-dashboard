import { useEffect, useState } from "react";

import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Check,
  X,
  CalendarCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";

import bookingsData from "../../data/bookings";
import destinationsData from "../../data/destinations";
import tripsData from "../../data/trips";

const DESTINATIONS_STORAGE_KEY = "travel-destinations";
const TRIPS_STORAGE_KEY = "travel-trips";

function getSavedData(storageKey, defaultData) {
  try {
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      const parsedData = JSON.parse(savedData);

      if (Array.isArray(parsedData)) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error(
      `Unable to load ${storageKey}:`,
      error
    );
  }

  return defaultData;
}

function Header({
  darkMode,
  setDarkMode,
  onMenuClick,
}) {
  const navigate = useNavigate();

  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearNotifications,
  } = useBooking();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  /* =========================================
     SEARCH DATA
  ========================================= */

  const [destinations, setDestinations] =
    useState(() =>
      getSavedData(
        DESTINATIONS_STORAGE_KEY,
        destinationsData
      )
    );

  const [trips, setTrips] =
    useState(() =>
      getSavedData(
        TRIPS_STORAGE_KEY,
        tripsData
      )
    );

  /* =========================================
     UPDATE SEARCH DATA
  ========================================= */

  useEffect(() => {
    const updateSearchData = () => {
      setDestinations(
        getSavedData(
          DESTINATIONS_STORAGE_KEY,
          destinationsData
        )
      );

      setTrips(
        getSavedData(
          TRIPS_STORAGE_KEY,
          tripsData
        )
      );
    };

    window.addEventListener(
      "travel-destinations-updated",
      updateSearchData
    );

    window.addEventListener(
      "travel-trips-updated",
      updateSearchData
    );

    window.addEventListener(
      "storage",
      updateSearchData
    );

    return () => {
      window.removeEventListener(
        "travel-destinations-updated",
        updateSearchData
      );

      window.removeEventListener(
        "travel-trips-updated",
        updateSearchData
      );

      window.removeEventListener(
        "storage",
        updateSearchData
      );
    };
  }, []);

  /* =========================================
     SEARCH
  ========================================= */

  const searchValue =
    searchText.trim().toLowerCase();

  const bookingResults = searchValue
    ? bookingsData.filter((booking) =>
        [
          booking.bookingId,
          booking.customer,
          booking.email,
          booking.destination,
          booking.bookingStatus,
          booking.paymentStatus,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          )
      )
    : [];

  const destinationResults = searchValue
    ? destinations.filter((destination) =>
        [
          destination.name,
          destination.country,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          )
      )
    : [];

  const tripResults = searchValue
    ? trips.filter((trip) =>
        [
          trip.name,
          trip.destination,
          trip.country,
          trip.description,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          )
      )
    : [];

  const totalSearchResults =
    bookingResults.length +
    destinationResults.length +
    tripResults.length;

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  /* =========================================
     BOOKING SEARCH RESULT
  ========================================= */

  const handleBookingSearchResult = (
    booking
  ) => {
    clearSearch();

    const bookingId =
      booking.id || booking.bookingId;

    navigate(`/bookings/${bookingId}`);
  };

  /* =========================================
     DESTINATION SEARCH RESULT
  ========================================= */

  const handleDestinationSearchResult = (
    destination
  ) => {
    clearSearch();

    navigate(
      `/bookings?destination=${encodeURIComponent(
        destination.name
      )}`
    );
  };

  /* =========================================
     TRIP SEARCH RESULT
  ========================================= */

  const handleTripSearchResult = () => {
    clearSearch();
    navigate("/trips");
  };

  /* =========================================
     NOTIFICATION ICON
  ========================================= */

  const getNotificationIcon = (type) => {
    if (type === "new-booking") {
      return <CalendarCheck size={18} />;
    }

    if (type === "status-update") {
      return <CheckCircle size={18} />;
    }

    if (type === "cancelled") {
      return <XCircle size={18} />;
    }

    return <AlertCircle size={18} />;
  };

  /* =========================================
     NOTIFICATION CLICK
  ========================================= */

  const handleNotificationClick = (
    notification
  ) => {
    markNotificationAsRead(
      notification.id
    );

    setShowNotifications(false);

    if (notification.bookingId) {
      navigate(
        `/bookings/${notification.bookingId}`
      );
    } else {
      navigate("/bookings");
    }
  };

  /* =========================================
     MARK ALL READ
  ========================================= */

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  };

  /* =========================================
     CLEAR NOTIFICATIONS
  ========================================= */

  const handleClearNotifications = () => {
    clearNotifications();
    setShowNotifications(false);
  };

  /* =========================================
     FORMAT NOTIFICATION TIME
  ========================================= */

  const formatNotificationTime = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const notificationDate =
      new Date(date);

    const now = new Date();

    const difference = Math.floor(
      (now - notificationDate) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      return `${Math.floor(
        difference / 60
      )} min ago`;
    }

    if (difference < 86400) {
      return `${Math.floor(
        difference / 3600
      )} hr ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <header className="header">

      {/* =====================================
          LEFT SIDE
      ===================================== */}

      <div className="header-left">

        {/* MENU */}

        <button
          type="button"
          className="menu-button"
          onClick={onMenuClick}
          title="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* SEARCH */}

        <div className="header-search-wrapper">

          <div className="header-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search bookings, trips, destinations..."
              value={searchText}
              onChange={handleSearch}
            />

            {searchText && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}

          </div>

          {/* =================================
              SEARCH RESULTS
          ================================= */}

          {searchValue && (
            <div className="header-search-results">

              {totalSearchResults === 0 ? (

                <div className="search-no-results">

                  <Search size={20} />

                  <strong>
                    No results found
                  </strong>

                  <span>
                    Try another booking, trip
                    or destination.
                  </span>

                </div>

              ) : (

                <>

                  {/* =========================
                      BOOKINGS
                  ========================= */}

                  {bookingResults.length > 0 && (
                    <div className="search-result-section">

                      <div className="search-result-title">
                        Bookings
                      </div>

                      {bookingResults
                        .slice(0, 5)
                        .map((booking) => (

                          <button
                            type="button"
                            className="search-result-item"
                            key={
                              booking.id ||
                              booking.bookingId
                            }
                            onClick={() =>
                              handleBookingSearchResult(
                                booking
                              )
                            }
                          >

                            <div className="search-result-icon">
                              <CalendarCheck
                                size={17}
                              />
                            </div>

                            <div className="search-result-info">

                              <strong>
                                {booking.customer ||
                                  "Customer"}
                              </strong>

                              <span>
                                {booking.destination ||
                                  "Destination"}{" "}
                                •{" "}
                                {booking.bookingId ||
                                  booking.id}
                              </span>

                            </div>

                          </button>

                        ))}

                    </div>
                  )}

                  {/* =========================
                      DESTINATIONS
                  ========================= */}

                  {destinationResults.length > 0 && (
                    <div className="search-result-section">

                      <div className="search-result-title">
                        Destinations
                      </div>

                      {destinationResults
                        .slice(0, 5)
                        .map((destination) => (

                          <button
                            type="button"
                            className="search-result-item"
                            key={destination.id}
                            onClick={() =>
                              handleDestinationSearchResult(
                                destination
                              )
                            }
                          >

                            <div className="search-result-icon">
                              <Search size={17} />
                            </div>

                            <div className="search-result-info">

                              <strong>
                                {destination.name}
                              </strong>

                              <span>
                                {destination.country}
                              </span>

                            </div>

                          </button>

                        ))}

                    </div>
                  )}

                  {/* =========================
                      TRIPS
                  ========================= */}

                  {tripResults.length > 0 && (
                    <div className="search-result-section">

                      <div className="search-result-title">
                        Trips
                      </div>

                      {tripResults
                        .slice(0, 5)
                        .map((trip) => (

                          <button
                            type="button"
                            className="search-result-item"
                            key={
                              trip.id ||
                              trip.tripId ||
                              trip.destination
                            }
                            onClick={
                              handleTripSearchResult
                            }
                          >

                            <div className="search-result-icon">
                              <CalendarCheck
                                size={17}
                              />
                            </div>

                            <div className="search-result-info">

                              <strong>
                                {trip.name ||
                                  trip.destination}
                              </strong>

                              <span>
                                {trip.destination ||
                                  trip.country ||
                                  "Trip"}
                              </span>

                            </div>

                          </button>

                        ))}

                    </div>
                  )}

                </>

              )}

            </div>
          )}

        </div>

      </div>

      {/* =====================================
          RIGHT SIDE
      ===================================== */}

      <div className="header-right">

        {/* DARK MODE */}

        <button
          type="button"
          className="header-icon-button"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          title={
            darkMode
              ? "Light mode"
              : "Dark mode"
          }
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* ===================================
            NOTIFICATIONS
        =================================== */}

        <div className="notification-wrapper">

          <button
            type="button"
            className="header-icon-button notification-button"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            title="Notifications"
          >

            <Bell size={20} />

            {unreadNotificationCount > 0 && (
              <span className="notification-count">
                {unreadNotificationCount > 99
                  ? "99+"
                  : unreadNotificationCount}
              </span>
            )}

          </button>

          {showNotifications && (

            <div className="notification-panel">

              <div className="notification-panel-header">

                <div>

                  <h3>
                    Notifications
                  </h3>

                  <span>
                    {unreadNotificationCount} unread
                  </span>

                </div>

                <button
                  type="button"
                  className="notification-close"
                  onClick={() =>
                    setShowNotifications(
                      false
                    )
                  }
                >
                  <X size={18} />
                </button>

              </div>

              {notifications.length > 0 && (

                <div className="notification-actions">

                  {unreadNotificationCount > 0 && (

                    <button
                      type="button"
                      onClick={
                        handleMarkAllRead
                      }
                    >
                      <Check size={14} />
                      Mark all as read
                    </button>

                  )}

                  <button
                    type="button"
                    onClick={
                      handleClearNotifications
                    }
                  >
                    Clear all
                  </button>

                </div>

              )}

              <div className="notification-list">

                {notifications.length === 0 ? (

                  <div className="notification-empty">

                    <Bell size={30} />

                    <strong>
                      No notifications
                    </strong>

                    <span>
                      New booking updates will
                      appear here.
                    </span>

                  </div>

                ) : (

                  notifications.map(
                    (notification) => (

                      <div
                        key={
                          notification.id
                        }
                        className={`notification-item ${
                          notification.read
                            ? "read"
                            : "unread"
                        }`}
                      >

                        <button
                          type="button"
                          className="notification-content"
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                        >

                          <div className="notification-icon">
                            {getNotificationIcon(
                              notification.type
                            )}
                          </div>

                          <div className="notification-text">

                            <strong>
                              {notification.title}
                            </strong>

                            <p>
                              {notification.message}
                            </p>

                            <span>
                              {formatNotificationTime(
                                notification.createdAt
                              )}
                            </span>

                          </div>

                        </button>

                        <button
                          type="button"
                          className="notification-delete"
                          onClick={() =>
                            deleteNotification(
                              notification.id
                            )
                          }
                          title="Delete notification"
                        >
                          <X size={15} />
                        </button>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          )}

        </div>

        {/* =====================================
            PROFILE
        ===================================== */}

        <div className="header-profile-wrapper">

          <button
            type="button"
            className="header-profile"
            onClick={() =>
              setShowProfile(
                !showProfile
              )
            }
          >

            <div className="header-avatar">
              DN
            </div>

            <div className="header-profile-info">

              <strong>
                Dasari Nirosha
              </strong>

              <span>
                Travel Admin
              </span>

            </div>

            <ChevronDown size={16} />

          </button>

          {showProfile && (

            <div className="profile-dropdown">

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/settings");
                }}
              >
                Settings
              </button>

              <button
                type="button"
                onClick={() => {

                  localStorage.removeItem(
                    "travel-user"
                  );

                  localStorage.removeItem(
                    "travel-bookings"
                  );

                  window.location.href =
                    "/login";

                }}
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Header;