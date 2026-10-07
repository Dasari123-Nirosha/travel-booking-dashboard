import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";

import tripsData from "../../data/trips";

import TripCard from "../../components/trips/TripCard";
import TripTable from "../../components/trips/TripTable";
import TripForm from "../../components/trips/TripForm";
import TripDetails from "../../components/trips/TripDetails";

import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useToast } from "../../context/ToastContext";

const STORAGE_KEY = "travel-trips";
const ITEMS_PER_PAGE = 6;

/* =========================================================
   LOAD TRIPS
========================================================= */

function getSavedTrips() {
  try {
    const savedTrips =
      localStorage.getItem(STORAGE_KEY);

    if (savedTrips) {
      const parsedTrips =
        JSON.parse(savedTrips);

      if (Array.isArray(parsedTrips)) {
        return parsedTrips;
      }
    }
  } catch (error) {
    console.error(
      "Unable to load saved trips:",
      error
    );
  }

  return tripsData;
}

/* =========================================================
   TRIPS PAGE
========================================================= */

function Trips() {
  const [trips, setTrips] =
    useState(getSavedTrips);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [destinationFilter, setDestinationFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [sortBy, setSortBy] =
    useState("date-asc");

  const [viewMode, setViewMode] =
    useState("grid");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showForm, setShowForm] =
    useState(false);

  const [editingTrip, setEditingTrip] =
    useState(null);

  const [selectedTrip, setSelectedTrip] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const { showToast } = useToast();

  /* =======================================================
     SAVE TRIPS
  ======================================================= */

  const saveTrips = (updatedTrips) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedTrips)
      );

      setTrips(updatedTrips);

      window.dispatchEvent(
        new CustomEvent(
          "travel-trips-updated"
        )
      );
    } catch (error) {
      console.error(
        "Unable to save trips:",
        error
      );

      showToast(
        "Unable to save trip changes.",
        "error"
      );

      return false;
    }

    return true;
  };

  /* =======================================================
     DESTINATION OPTIONS
  ======================================================= */

  const destinationOptions = useMemo(() => {
    const destinations = trips
      .map((trip) => trip.destination)
      .filter(Boolean);

    return [...new Set(destinations)].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [trips]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredTrips = useMemo(() => {
    const search =
      searchTerm.toLowerCase().trim();

    const minimumPrice =
      minPrice === ""
        ? null
        : Number(minPrice);

    const maximumPrice =
      maxPrice === ""
        ? null
        : Number(maxPrice);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return [...trips]
      .filter((trip) => {
        const tripId =
          trip.tripId ||
          trip.id?.toString() ||
          "";

        const destination =
          trip.destination || "";

        const country =
          trip.country || "";

        const guide =
          trip.guide || "";

        const status =
          trip.status || "";

        const tripDate =
          trip.startDate ||
          trip.tripDate ||
          trip.date ||
          "";

        const price =
          Number(
            trip.price ??
              trip.amount ??
              0
          );

        /* SEARCH */

        const matchesSearch =
          !search ||
          tripId
            .toLowerCase()
            .includes(search) ||
          destination
            .toLowerCase()
            .includes(search) ||
          country
            .toLowerCase()
            .includes(search) ||
          guide
            .toLowerCase()
            .includes(search);

        /* STATUS */

        const matchesStatus =
          statusFilter === "All" ||
          status === statusFilter;

        /* DESTINATION */

        const matchesDestination =
          destinationFilter === "All" ||
          destination ===
            destinationFilter;

        /* DATE */

        let matchesDate = true;

        if (dateFilter !== "All") {
          const parsedDate = tripDate
            ? new Date(tripDate)
            : null;

          if (
            !parsedDate ||
            Number.isNaN(
              parsedDate.getTime()
            )
          ) {
            matchesDate = false;
          } else {
            parsedDate.setHours(
              0,
              0,
              0,
              0
            );

            if (
              dateFilter ===
              "upcoming"
            ) {
              matchesDate =
                parsedDate >= today;
            }

            if (
              dateFilter === "past"
            ) {
              matchesDate =
                parsedDate < today;
            }

            if (
              dateFilter ===
              "this-month"
            ) {
              matchesDate =
                parsedDate.getMonth() ===
                  today.getMonth() &&
                parsedDate.getFullYear() ===
                  today.getFullYear();
            }

            if (
              dateFilter ===
              "next-30"
            ) {
              const next30 =
                new Date(today);

              next30.setDate(
                next30.getDate() + 30
              );

              matchesDate =
                parsedDate >= today &&
                parsedDate <= next30;
            }
          }
        }

        /* PRICE */

        const matchesMinimumPrice =
          minimumPrice === null ||
          Number.isNaN(minimumPrice) ||
          price >= minimumPrice;

        const matchesMaximumPrice =
          maximumPrice === null ||
          Number.isNaN(maximumPrice) ||
          price <= maximumPrice;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDestination &&
          matchesDate &&
          matchesMinimumPrice &&
          matchesMaximumPrice
        );
      })
      .sort((a, b) => {
        const aPrice =
          Number(
            a.price ??
              a.amount ??
              0
          );

        const bPrice =
          Number(
            b.price ??
              b.amount ??
              0
          );

        const aName =
          a.destination || "";

        const bName =
          b.destination || "";

        const aDate =
          new Date(
            a.startDate ||
              a.tripDate ||
              a.date ||
              0
          ).getTime();

        const bDate =
          new Date(
            b.startDate ||
              b.tripDate ||
              b.date ||
              0
          ).getTime();

        if (
          sortBy === "date-asc"
        ) {
          return aDate - bDate;
        }

        if (
          sortBy === "date-desc"
        ) {
          return bDate - aDate;
        }

        if (
          sortBy === "price-low"
        ) {
          return aPrice - bPrice;
        }

        if (
          sortBy === "price-high"
        ) {
          return bPrice - aPrice;
        }

        if (
          sortBy === "name-asc"
        ) {
          return aName.localeCompare(
            bName
          );
        }

        if (
          sortBy === "name-desc"
        ) {
          return bName.localeCompare(
            aName
          );
        }

        return 0;
      });
  }, [
    trips,
    searchTerm,
    statusFilter,
    destinationFilter,
    dateFilter,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTrips.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedTrips =
    filteredTrips.slice(
      startIndex,
      startIndex +
        ITEMS_PER_PAGE
    );

  /* =======================================================
     FILTER UPDATES
  ======================================================= */

  const updateSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const updateStatus = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const updateDestination = (value) => {
    setDestinationFilter(value);
    setCurrentPage(1);
  };

  const updateDate = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const updateMinPrice = (value) => {
    setMinPrice(value);
    setCurrentPage(1);
  };

  const updateMaxPrice = (value) => {
    setMaxPrice(value);
    setCurrentPage(1);
  };

  const updateSort = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDestinationFilter("All");
    setDateFilter("All");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("date-asc");
    setCurrentPage(1);
  };

  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = () => {
    setEditingTrip(null);
    setShowForm(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (trip) => {
    if (!trip) {
      return;
    }

    setEditingTrip({
      ...trip,
    });

    setShowForm(true);
  };

  /* =======================================================
     VIEW
  ======================================================= */

  const handleView = (trip) => {
    setSelectedTrip(trip);
  };

  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  const handleFormSubmit = (formData) => {
    /* -----------------------------------------------------
       EDIT EXISTING TRIP
       ----------------------------------------------------- */

    if (editingTrip) {
      const updatedTrips =
        trips.map((trip) => {
          const sameId =
            editingTrip.id != null &&
            trip.id === editingTrip.id;

          const sameTripId =
            editingTrip.tripId &&
            trip.tripId ===
              editingTrip.tripId;

          if (!sameId && !sameTripId) {
            return trip;
          }

          return {
            ...trip,
            ...formData,

            id:
              trip.id ??
              editingTrip.id ??
              `trip-${Date.now()}`,

            tripId:
              trip.tripId ||
              editingTrip.tripId ||
              formData.tripId,
          };
        });

      const tripWasUpdated =
        updatedTrips.some(
          (trip, index) =>
            trip !== trips[index]
        );

      if (!tripWasUpdated) {
        showToast(
          "Unable to find the trip to update.",
          "error"
        );

        return;
      }

      const saved =
        saveTrips(updatedTrips);

      if (!saved) {
        return;
      }

      const updatedTrip =
        updatedTrips.find((trip) => {
          const sameId =
            editingTrip.id != null &&
            trip.id === editingTrip.id;

          const sameTripId =
            editingTrip.tripId &&
            trip.tripId ===
              editingTrip.tripId;

          return sameId || sameTripId;
        });

      if (updatedTrip) {
        setSelectedTrip(
          updatedTrip
        );
      }

      showToast(
        "Trip updated successfully.",
        "success"
      );

      setShowForm(false);
      setEditingTrip(null);

      return;
    }

    /* -----------------------------------------------------
       CREATE NEW TRIP
       ----------------------------------------------------- */

    const highestTripNumber =
      trips.reduce(
        (highest, trip) => {
          const match =
            trip.tripId?.match(
              /^TR-(\d+)$/
            );

          if (!match) {
            return highest;
          }

          return Math.max(
            highest,
            Number(match[1])
          );
        },
        1000
      );

    const newTrip = {
      ...formData,

      id:
        formData.id ||
        `trip-${Date.now()}`,

      tripId:
        formData.tripId ||
        `TR-${String(
          highestTripNumber + 1
        ).padStart(4, "0")}`,
    };

    const saved =
      saveTrips([
        ...trips,
        newTrip,
      ]);

    if (!saved) {
      return;
    }

    showToast(
      "Trip created successfully.",
      "success"
    );

    setShowForm(false);
    setEditingTrip(null);
  };

  /* =======================================================
     DELETE REQUEST
  ======================================================= */

  const handleDeleteRequest = (
    trip
  ) => {
    setDeleteTarget(trip);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const updatedTrips =
      trips.filter((trip) => {
        const sameId =
          deleteTarget.id != null &&
          trip.id === deleteTarget.id;

        const sameTripId =
          deleteTarget.tripId &&
          trip.tripId ===
            deleteTarget.tripId;

        return !sameId && !sameTripId;
      });

    const saved =
      saveTrips(updatedTrips);

    if (!saved) {
      return;
    }

    if (
      selectedTrip &&
      (
        selectedTrip.id ===
          deleteTarget.id ||
        selectedTrip.tripId ===
          deleteTarget.tripId
      )
    ) {
      setSelectedTrip(null);
    }

    showToast(
      "Trip deleted successfully.",
      "success"
    );

    setDeleteTarget(null);

    const remainingResults =
      filteredTrips.filter(
        (trip) => {
          const sameId =
            deleteTarget.id != null &&
            trip.id ===
              deleteTarget.id;

          const sameTripId =
            deleteTarget.tripId &&
            trip.tripId ===
              deleteTarget.tripId;

          return !sameId && !sameTripId;
        }
      ).length;

    const newTotalPages =
      Math.max(
        1,
        Math.ceil(
          remainingResults /
            ITEMS_PER_PAGE
        )
      );

    setCurrentPage((page) =>
      Math.min(
        page,
        newTotalPages
      )
    );
  };

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const closeForm = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="trips-page">

      {/* ===================================================
          PAGE HEADER
          =================================================== */}

      <div className="page-header">
        <div>
          <p className="page-breadcrumb">
            Home / Trips
          </p>

          <h2>Trips</h2>

          <p className="page-description">
            Create, manage, and track all
            your upcoming trips.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAdd}
        >
          <Plus size={18} />
          Create Trip
        </button>
      </div>

      {/* ===================================================
          SUMMARY
          =================================================== */}

      <div className="trip-summary">

        {/* TOTAL */}

        <div className="summary-item">
          <span>Total Trips</span>

          <strong>
            {trips.length}
          </strong>
        </div>

        {/* UPCOMING */}

        <div className="summary-item">
          <span>Upcoming</span>

          <strong>
            {
              trips.filter(
                (trip) =>
                  trip.status ===
                  "Upcoming"
              ).length
            }
          </strong>
        </div>

        {/* ACTIVE */}

        <div className="summary-item">
          <span>Active</span>

          <strong>
            {
              trips.filter(
                (trip) =>
                  trip.status ===
                  "Active"
              ).length
            }
          </strong>
        </div>

        {/* COMPLETED */}

        <div className="summary-item">
          <span>Completed</span>

          <strong>
            {
              trips.filter(
                (trip) =>
                  trip.status ===
                  "Completed"
              ).length
            }
          </strong>
        </div>

        {/* CANCELLED */}

        <div className="summary-item">
          <span>Cancelled</span>

          <strong>
            {
              trips.filter(
                (trip) =>
                  trip.status ===
                  "Cancelled"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* ===================================================
          FILTER TOOLBAR
          =================================================== */}

      <div className="trips-toolbar">

        <div className="destination-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search trips, destinations, guides..."
            value={searchTerm}
            onChange={(event) =>
              updateSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="trips-toolbar-right">

          {/* STATUS */}

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(event) =>
              updateStatus(
                event.target.value
              )
            }
          >
            <option value="All">
              All Status
            </option>

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

          {/* DESTINATION */}

          <select
            className="filter-select"
            value={destinationFilter}
            onChange={(event) =>
              updateDestination(
                event.target.value
              )
            }
          >
            <option value="All">
              All Destinations
            </option>

            {destinationOptions.map(
              (destination) => (
                <option
                  key={destination}
                  value={destination}
                >
                  {destination}
                </option>
              )
            )}
          </select>

          {/* DATE */}

          <select
            className="filter-select"
            value={dateFilter}
            onChange={(event) =>
              updateDate(
                event.target.value
              )
            }
          >
            <option value="All">
              All Dates
            </option>

            <option value="upcoming">
              Upcoming
            </option>

            <option value="next-30">
              Next 30 Days
            </option>

            <option value="this-month">
              This Month
            </option>

            <option value="past">
              Past Trips
            </option>
          </select>

          {/* SORT */}

          <select
            className="filter-select"
            value={sortBy}
            onChange={(event) =>
              updateSort(
                event.target.value
              )
            }
          >
            <option value="date-asc">
              Date: Earliest
            </option>

            <option value="date-desc">
              Date: Latest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name-asc">
              Destination: A-Z
            </option>

            <option value="name-desc">
              Destination: Z-A
            </option>
          </select>

        </div>
      </div>

      {/* ===================================================
          PRICE FILTER
          =================================================== */}

      <div className="trip-price-filters">

        <div className="trip-price-input">
          <label htmlFor="trip-min-price">
            Min Price
          </label>

          <input
            id="trip-min-price"
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(event) =>
              updateMinPrice(
                event.target.value
              )
            }
          />
        </div>

        <div className="trip-price-input">
          <label htmlFor="trip-max-price">
            Max Price
          </label>

          <input
            id="trip-max-price"
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(event) =>
              updateMaxPrice(
                event.target.value
              )
            }
          />
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={resetFilters}
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>

      </div>

      {/* ===================================================
          RESULT BAR
          =================================================== */}

      <div className="trips-result-bar">

        <span>
          {filteredTrips.length ===
          0
            ? "No trips found"
            : `Showing ${
                startIndex + 1
              }–${Math.min(
                startIndex +
                  ITEMS_PER_PAGE,
                filteredTrips.length
              )} of ${
                filteredTrips.length
              } trips`}
        </span>

        <div className="view-toggle">

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
            aria-label="Grid view"
            title="Grid view"
          >
            <Grid3X3 size={17} />
          </button>

          <button
            type="button"
            className={
              viewMode === "list"
                ? "active"
                : ""
            }
            onClick={() =>
              setViewMode("list")
            }
            aria-label="List view"
            title="List view"
          >
            <List size={18} />
          </button>

        </div>
      </div>

      {/* ===================================================
          RESULTS
          =================================================== */}

      {filteredTrips.length ===
      0 ? (

        <div className="empty-table-state">

          <CalendarDays size={34} />

          <h3>
            No trips found
          </h3>

          <p>
            Try changing your
            search or filter
            criteria.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={
              resetFilters
            }
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>

        </div>

      ) : viewMode === "grid" ? (

        <div className="trips-grid">

          {paginatedTrips.map(
            (trip) => (
              <TripCard
                key={
                  trip.id ||
                  trip.tripId
                }
                trip={trip}
                onView={
                  handleView
                }
                onEdit={
                  handleEdit
                }
                onDelete={
                  handleDeleteRequest
                }
              />
            )
          )}

        </div>

      ) : (

        <TripTable
          trips={
            paginatedTrips
          }
          onView={
            handleView
          }
          onEdit={
            handleEdit
          }
          onDelete={
            handleDeleteRequest
          }
        />

      )}

      {/* ===================================================
          PAGINATION
          =================================================== */}

      {filteredTrips.length >
        0 &&
        totalPages > 1 && (

        <div className="trips-pagination">

          <button
            type="button"
            className="pagination-button"
            disabled={
              safeCurrentPage ===
              1
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  Math.max(
                    1,
                    page - 1
                  )
              )
            }
            aria-label="Previous page"
          >
            <ChevronLeft
              size={17}
            />
          </button>

          {Array.from(
            {
              length:
                totalPages,
            },
            (_, index) =>
              index + 1
          ).map((page) => (

            <button
              type="button"
              key={page}
              className={`pagination-number ${
                safeCurrentPage ===
                page
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage(
                  page
                )
              }
            >
              {page}
            </button>

          ))}

          <button
            type="button"
            className="pagination-button"
            disabled={
              safeCurrentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
              )
            }
            aria-label="Next page"
          >
            <ChevronRight
              size={17}
            />
          </button>

        </div>
      )}

      {/* ===================================================
          CREATE / EDIT MODAL
          =================================================== */}

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        size="large"
      >
        <TripForm
          trip={editingTrip}
          onSubmit={
            handleFormSubmit
          }
          onClose={
            closeForm
          }
        />
      </Modal>

      {/* ===================================================
          DETAILS MODAL
          =================================================== */}

      <Modal
        isOpen={Boolean(
          selectedTrip
        )}
        onClose={() =>
          setSelectedTrip(null)
        }
        size="large"
      >
        <TripDetails
          trip={selectedTrip}
          onClose={() =>
            setSelectedTrip(null)
          }
        />
      </Modal>

      {/* ===================================================
          DELETE CONFIRMATION
          =================================================== */}

      <ConfirmModal
        isOpen={Boolean(
          deleteTarget
        )}
        title="Delete Trip"
        message={
          deleteTarget
            ? `Are you sure you want to delete the ${deleteTarget.destination} trip? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setDeleteTarget(null)
        }
      />

    </div>
  );
}

export default Trips;