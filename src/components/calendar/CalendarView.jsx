import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import CalendarEvent from "./CalendarEvent";

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function CalendarView({
  currentDate,
  bookings = [],
  onPreviousMonth,
  onNextMonth,
  onToday,
  onEventClick,
}) {
  /* =========================================
     CREATE 42 CALENDAR DAYS
  ========================================= */

  const calendarDays = useMemo(() => {
    const year =
      currentDate.getFullYear();

    const month =
      currentDate.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    );

    const lastDay = new Date(
      year,
      month + 1,
      0
    );

    const startDay =
      firstDay.getDay();

    const daysInMonth =
      lastDay.getDate();

    const previousMonthLastDay =
      new Date(
        year,
        month,
        0
      ).getDate();

    const days = [];

    /* Previous month */

    for (
      let index = startDay - 1;
      index >= 0;
      index -= 1
    ) {
      days.push({
        date: new Date(
          year,
          month - 1,
          previousMonthLastDay -
            index
        ),
        currentMonth: false,
      });
    }

    /* Current month */

    for (
      let day = 1;
      day <= daysInMonth;
      day += 1
    ) {
      days.push({
        date: new Date(
          year,
          month,
          day
        ),
        currentMonth: true,
      });
    }

    /* Next month */

    let nextDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(
          year,
          month + 1,
          nextDay
        ),
        currentMonth: false,
      });

      nextDay += 1;
    }

    return days;
  }, [currentDate]);

  /* =========================================
     DATE KEY
  ========================================= */

  const getDateKey = (date) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =========================================
     NORMALIZE DATE
     
     Supports:
     travelDate
     tripDate
     date
  ========================================= */

  const getBookingDate = (booking) => {
    return (
      booking.travelDate ||
      booking.tripDate ||
      booking.date ||
      ""
    );
  };

  /* =========================================
     GROUP BOOKINGS BY DATE
  ========================================= */

  const bookingsByDate = useMemo(() => {
    const grouped = {};

    bookings.forEach((booking) => {
      const bookingDate =
        getBookingDate(booking);

      if (!bookingDate) {
        return;
      }

      const parsedDate = new Date(
        `${bookingDate}T00:00:00`
      );

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return;
      }

      const key =
        getDateKey(parsedDate);

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(booking);
    });

    return grouped;
  }, [bookings]);

  /* =========================================
     TODAY
  ========================================= */

  const today = new Date();

  const isToday = (date) => {
    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  };

  /* =========================================
     MONTH TITLE
  ========================================= */

  const monthTitle =
    currentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  /* =========================================
     CLICK DATE
     
     If multiple bookings exist on a date,
     open the first booking. Individual
     booking cards still open their own
     exact customer details.
  ========================================= */

  const handleDateClick = (
    date,
    dayBookings
  ) => {
    if (
      !dayBookings ||
      dayBookings.length === 0
    ) {
      return;
    }

    onEventClick?.(
      dayBookings[0]
    );
  };

  return (
    <div className="calendar-view">

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="calendar-toolbar">

        <div className="calendar-toolbar-left">

          <div className="calendar-icon-box">
            <CalendarDays size={20} />
          </div>

          <div className="calendar-navigation">

            <button
              type="button"
              className="calendar-nav-button"
              onClick={
                onPreviousMonth
              }
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="calendar-today-button"
              onClick={onToday}
            >
              Today
            </button>

            <button
              type="button"
              className="calendar-nav-button"
              onClick={
                onNextMonth
              }
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>

          </div>

        </div>

        <h2 className="calendar-month-title">
          {monthTitle}
        </h2>

      </div>

      {/* =====================================
          WEEK DAYS
      ===================================== */}

      <div className="calendar-grid">

        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="calendar-weekday"
          >
            {day}
          </div>
        ))}

        {/* ===================================
            DAYS
        =================================== */}

        {calendarDays.map(
          ({ date, currentMonth }) => {
            const dateKey =
              getDateKey(date);

            const dayBookings =
              bookingsByDate[
                dateKey
              ] || [];

            const hasBookings =
              dayBookings.length > 0;

            return (
              <div
                key={dateKey}
                className={[
                  "calendar-day",
                  currentMonth
                    ? "current-month"
                    : "other-month",
                  isToday(date)
                    ? "today"
                    : "",
                  hasBookings
                    ? "has-bookings"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  handleDateClick(
                    date,
                    dayBookings
                  )
                }
                role={
                  hasBookings
                    ? "button"
                    : undefined
                }
                tabIndex={
                  hasBookings
                    ? 0
                    : undefined
                }
                onKeyDown={(event) => {
                  if (
                    hasBookings &&
                    (event.key ===
                      "Enter" ||
                      event.key ===
                        " ")
                  ) {
                    event.preventDefault();

                    handleDateClick(
                      date,
                      dayBookings
                    );
                  }
                }}
                title={
                  hasBookings
                    ? `View ${dayBookings.length} booking${
                        dayBookings.length !==
                        1
                          ? "s"
                          : ""
                      }`
                    : undefined
                }
              >

                {/* DAY HEADER */}

                <div className="calendar-day-header">

                  <span
                    className="calendar-day-number"
                  >
                    {date.getDate()}
                  </span>

                  {hasBookings && (
                    <span className="calendar-booking-count">
                      {dayBookings.length}
                    </span>
                  )}

                </div>

                {/* BOOKINGS */}

                <div
                  className="calendar-day-events"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >

                  {dayBookings.map(
                    (booking) => (
                      <CalendarEvent
                        key={
                          booking.bookingId ||
                          booking.id
                        }
                        booking={booking}
                        onClick={
                          onEventClick
                        }
                      />
                    )
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default CalendarView;