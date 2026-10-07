import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Destinations from "./pages/Destinations/Destinations";
import Trips from "./pages/Trips/Trips";
import Customers from "./pages/Customers/Customers";
import Bookings from "./pages/Bookings/Bookings";
import BookingDetailsPage from "./pages/BookingDetails/BookingDetailsPage";
import Calendar from "./pages/Calendar/Calendar";
import Login from "./pages/Login/Login";

import { BookingProvider } from "./context/BookingContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";


/* =========================================
   AUTH PROTECTION
========================================= */

function RequireAuth({ children }) {
  const isLoggedIn = Boolean(
    localStorage.getItem("travel-user")
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


/* =========================================
   APP
========================================= */

function App() {

  /* =========================================
     SETTINGS STATE
  ========================================= */

  const [email, setEmail] = useState(
    "dnirosha0505@gmail.com"
  );

  const [notifications, setNotifications] = useState(true);


  /* =========================================
     EMAIL
  ========================================= */

  const handleEditEmail = () => {

    const newEmail = window.prompt(
      "Enter your new email address:",
      email
    );

    if (!newEmail || !newEmail.trim()) {
      return;
    }

    setEmail(newEmail.trim());

    window.alert(
      "Email updated successfully."
    );
  };


  /* =========================================
     PASSWORD
  ========================================= */

  const handleChangePassword = () => {

    const newPassword = window.prompt(
      "Enter your new password:"
    );

    if (!newPassword || !newPassword.trim()) {
      return;
    }

    window.alert(
      "Password changed successfully."
    );
  };


  /* =========================================
     NOTIFICATIONS
  ========================================= */

  const handleNotifications = () => {

    const newStatus = !notifications;

    setNotifications(newStatus);

    window.alert(
      newStatus
        ? "Notifications enabled."
        : "Notifications disabled."
    );
  };


  return (
    <ThemeProvider>

      <ToastProvider>

        <BookingProvider>

          <BrowserRouter>

            <Routes>


              {/* =================================
                  LOGIN
              ================================= */}

              <Route
                path="/login"
                element={
                  localStorage.getItem("travel-user") ? (
                    <Navigate
                      to="/"
                      replace
                    />
                  ) : (
                    <Login />
                  )
                }
              />


              {/* =================================
                  DASHBOARD
              ================================= */}

              <Route
                path="/"
                element={
                  <RequireAuth>

                    <Layout>
                      <Dashboard />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  DESTINATIONS
              ================================= */}

              <Route
                path="/destinations"
                element={
                  <RequireAuth>

                    <Layout>
                      <Destinations />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  TRIPS
              ================================= */}

              <Route
                path="/trips"
                element={
                  <RequireAuth>

                    <Layout>
                      <Trips />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  CUSTOMERS
              ================================= */}

              <Route
                path="/customers"
                element={
                  <RequireAuth>

                    <Layout>
                      <Customers />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  BOOKINGS
              ================================= */}

              <Route
                path="/bookings"
                element={
                  <RequireAuth>

                    <Layout>
                      <Bookings />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  BOOKING DETAILS
              ================================= */}

              <Route
                path="/bookings/:id"
                element={
                  <RequireAuth>

                    <Layout>
                      <BookingDetailsPage />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  CALENDAR
              ================================= */}

              <Route
                path="/calendar"
                element={
                  <RequireAuth>

                    <Layout>
                      <Calendar />
                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  SETTINGS
              ================================= */}

              <Route
                path="/settings"
                element={
                  <RequireAuth>

                    <Layout>

                      <div className="settings-page">


                        {/* PAGE HEADER */}

                        <div className="page-header">

                          <div>

                            <p className="page-breadcrumb">
                              Home / Settings
                            </p>

                            <h2>
                              Settings
                            </h2>

                            <p className="page-description">
                              Manage your TravelGo account
                              and application preferences.
                            </p>

                          </div>

                        </div>


                        {/* SETTINGS CARD */}

                        <div className="settings-card">


                          <h3>
                            Account Settings
                          </h3>


                          {/* =================================
                              PROFILE
                          ================================= */}

                          <div className="settings-profile">

                            <div className="settings-avatar">
                              DN
                            </div>

                            <div className="settings-profile-info">

                              <strong>
                                Dasari Nirosha
                              </strong>

                              <span>
                                Travel Admin
                              </span>

                            </div>

                          </div>


                          {/* =================================
                              EMAIL
                          ================================= */}

                          <div className="settings-item">

                            <div className="settings-item-content">

                              <strong>
                                Email
                              </strong>

                              <span>
                                {email}
                              </span>

                            </div>

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={handleEditEmail}
                            >
                              Edit
                            </button>

                          </div>


                          {/* =================================
                              PASSWORD
                          ================================= */}

                          <div className="settings-item">

                            <div className="settings-item-content">

                              <strong>
                                Password
                              </strong>

                              <span>
                                Update your account password.
                              </span>

                            </div>

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={handleChangePassword}
                            >
                              Change
                            </button>

                          </div>


                          {/* =================================
                              NOTIFICATIONS
                          ================================= */}

                          <div className="settings-item">

                            <div className="settings-item-content">

                              <strong>
                                Notifications
                              </strong>

                              <span>
                                {notifications
                                  ? "Booking notifications are currently enabled."
                                  : "Booking notifications are currently disabled."
                                }
                              </span>

                            </div>

                            <button
                              type="button"
                              className="secondary-button"
                              onClick={handleNotifications}
                            >
                              {notifications
                                ? "Disable"
                                : "Enable"
                              }
                            </button>

                          </div>


                        </div>

                      </div>

                    </Layout>

                  </RequireAuth>
                }
              />


              {/* =================================
                  UNKNOWN URL
              ================================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />


            </Routes>

          </BrowserRouter>

        </BookingProvider>

      </ToastProvider>

    </ThemeProvider>
  );
}

export default App;