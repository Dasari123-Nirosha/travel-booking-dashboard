import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import bookingsData from "../data/bookings";

const BookingContext = createContext(null);

const BOOKINGS_STORAGE_KEY = "travel-bookings";
const NOTIFICATIONS_STORAGE_KEY = "travel-notifications";

/* =========================================
   LOAD BOOKINGS
========================================= */

function loadBookings() {
  try {
    const savedBookings = localStorage.getItem(
      BOOKINGS_STORAGE_KEY
    );

    /*
      If there are no saved bookings,
      use bookings.js directly.
    */
    if (!savedBookings) {
      return bookingsData;
    }

    const parsedBookings = JSON.parse(
      savedBookings
    );

    if (!Array.isArray(parsedBookings)) {
      return bookingsData;
    }

    /*
      Restore the original Booking IDs
      from bookings.js for existing customers.
    */
    const normalizedBookings =
      parsedBookings.map((booking) => {
        const originalBooking =
          bookingsData.find(
            (item) =>
              item.customer ===
                booking.customer ||
              item.email === booking.email
          );

        if (originalBooking) {
          return {
            ...booking,

            id: originalBooking.id,

            bookingId:
              originalBooking.bookingId,
          };
        }

        /*
          New bookings keep their existing data.
        */
        return booking;
      });

    /*
      Make sure all original bookings
      from bookings.js are present.
    */
    const existingCustomers =
      new Set(
        normalizedBookings.map(
          (booking) => booking.customer
        )
      );

    const missingBookings =
      bookingsData.filter(
        (booking) =>
          !existingCustomers.has(
            booking.customer
          )
      );

    return [
      ...normalizedBookings,
      ...missingBookings,
    ];
  } catch (error) {
    console.error(
      "Unable to load bookings:",
      error
    );

    return bookingsData;
  }
}

/* =========================================
   LOAD NOTIFICATIONS
========================================= */

function loadNotifications() {
  try {
    const savedNotifications =
      localStorage.getItem(
        NOTIFICATIONS_STORAGE_KEY
      );

    if (!savedNotifications) {
      return [];
    }

    const parsedNotifications =
      JSON.parse(savedNotifications);

    if (!Array.isArray(parsedNotifications)) {
      return [];
    }

    return parsedNotifications;
  } catch (error) {
    console.error(
      "Unable to load notifications:",
      error
    );

    return [];
  }
}

/* =========================================
   BOOKING PROVIDER
========================================= */

export function BookingProvider({ children }) {
  const [bookings, setBookings] =
    useState(loadBookings);

  const [notifications, setNotifications] =
    useState(loadNotifications);

  /* =========================================
     SAVE BOOKINGS
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      BOOKINGS_STORAGE_KEY,
      JSON.stringify(bookings)
    );
  }, [bookings]);

  /* =========================================
     SAVE NOTIFICATIONS
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(notifications)
    );
  }, [notifications]);

  /* =========================================
     ADD NOTIFICATION
  ========================================= */

  const addNotification = ({
    title,
    message,
    type = "booking",
    bookingId = null,
  }) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      title,
      message,
      type,
      bookingId,
      read: false,
      createdAt:
        new Date().toISOString(),
    };

    setNotifications((previous) => [
      newNotification,
      ...previous,
    ]);
  };

  /* =========================================
     MARK ONE NOTIFICATION AS READ
  ========================================= */

  const markNotificationAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  /* =========================================
     MARK ALL NOTIFICATIONS AS READ
  ========================================= */

  const markAllNotificationsAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /* =========================================
     DELETE NOTIFICATION
  ========================================= */

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };

  /* =========================================
     CLEAR ALL NOTIFICATIONS
  ========================================= */

  const clearNotifications = () => {
    setNotifications([]);
  };

  /* =========================================
     CREATE NEW BOOKING
  ========================================= */

  const addBooking = (booking) => {
    /*
      Find the highest existing Booking ID.
      Example:
      TB-1001
      TB-1002
      ...
      TB-1008

      Next booking = TB-1009
    */
    const highestBookingNumber =
      bookings.reduce(
        (highest, item) => {
          const bookingId =
            item.bookingId || "";

          const match =
            bookingId.match(
              /^TB-(\d+)$/
            );

          if (!match) {
            return highest;
          }

          const number = Number(
            match[1]
          );

          return Math.max(
            highest,
            number
          );
        },
        1000
      );

    const nextBookingNumber =
      highestBookingNumber + 1;

    const newBooking = {
  ...booking,

  id:
    booking.id ||
    `booking-${Date.now()}`,

  bookingId: `TB-${String(
    nextBookingNumber
  ).padStart(4, "0")}`,
};

    setBookings((previous) => [
      newBooking,
      ...previous,
    ]);

    addNotification({
      title: "New Booking",

      message: `${
        newBooking.customer ||
        newBooking.customerName ||
        "A customer"
      } created a new booking for ${
        newBooking.destination ||
        "a destination"
      }.`,

      type: "new-booking",

      bookingId:
        newBooking.bookingId,
    });

    return newBooking;
  };

  /* =========================================
     UPDATE BOOKING
  ========================================= */

  const updateBooking = (
    id,
    updates
  ) => {
    let updatedBooking = null;

    setBookings((previous) =>
      previous.map((booking) => {
        if (
          booking.id === id ||
          booking.bookingId === id
        ) {
          updatedBooking = {
            ...booking,
            ...updates,

            /*
              Never change the existing
              Booking ID while editing.
            */
            bookingId:
              booking.bookingId,
          };

          return updatedBooking;
        }

        return booking;
      })
    );

    if (updatedBooking) {
      addNotification({
        title: "Booking Updated",

        message: `Booking ${
          updatedBooking.bookingId
        } has been updated.`,

        type: "booking-update",

        bookingId:
          updatedBooking.bookingId,
      });
    }

    return updatedBooking;
  };

  /* =========================================
     UPDATE BOOKING STATUS
  ========================================= */

  const updateBookingStatus = (
    id,
    newStatus
  ) => {
    let updatedBooking = null;

    setBookings((previous) =>
      previous.map((booking) => {
        if (
          booking.id === id ||
          booking.bookingId === id
        ) {
          updatedBooking = {
            ...booking,

            bookingStatus:
              newStatus,

            /*
              Keep existing Booking ID.
            */
            bookingId:
              booking.bookingId,
          };

          return updatedBooking;
        }

        return booking;
      })
    );

    if (updatedBooking) {
      addNotification({
        title:
          "Booking Status Updated",

        message: `Booking ${
          updatedBooking.bookingId
        } is now ${newStatus}.`,

        type: "status-update",

        bookingId:
          updatedBooking.bookingId,
      });
    }

    return updatedBooking;
  };

  /* =========================================
     DELETE BOOKING
  ========================================= */

  const deleteBooking = (id) => {
    const booking = bookings.find(
      (item) =>
        item.id === id ||
        item.bookingId === id
    );

    setBookings((previous) =>
      previous.filter(
        (item) =>
          item.id !== id &&
          item.bookingId !== id
      )
    );

    if (booking) {
      addNotification({
        title: "Booking Cancelled",

        message: `Booking ${
          booking.bookingId ||
          booking.id
        } for ${
          booking.destination ||
          "the selected destination"
        } was cancelled.`,

        type: "cancelled",

        bookingId:
          booking.bookingId ||
          booking.id,
      });
    }
  };

  /* =========================================
     UNREAD NOTIFICATION COUNT
  ========================================= */

  const unreadNotificationCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  /* =========================================
     CONTEXT VALUE
  ========================================= */

  const value = {
    /* Bookings */
    bookings,
    setBookings,
    addBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,

    /* Notifications */
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearNotifications,
    unreadNotificationCount,
  };

  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <BookingContext.Provider
      value={value}
    >
      {children}
    </BookingContext.Provider>
  );
}

/* =========================================
   USE BOOKING HOOK
========================================= */

export function useBooking() {
  const context =
    useContext(BookingContext);

  if (!context) {
    throw new Error(
      "useBooking must be used inside BookingProvider"
    );
  }

  return context;
}

/* =========================================
   BACKWARD COMPATIBILITY
========================================= */

export const useBookings =
  useBooking;