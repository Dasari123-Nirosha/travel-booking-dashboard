import { useMemo, useState } from "react";
import {
  Grid3X3,
  List,
  Plus,
  Search,
  Star,
  TrendingUp,
  Gem,
  Sparkles,
} from "lucide-react";

import destinationsData from "../../data/destinations";
import DestinationCard from "../../components/destinations/DestinationCard";
import DestinationTable from "../../components/destinations/DestinationTable";
import DestinationForm from "../../components/destinations/DestinationForm";
import Modal from "../../components/common/Modal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useToast } from "../../context/ToastContext";

const STORAGE_KEY = "travel-destinations";

/*
  Load destinations from localStorage.

  Important:
  - Existing user-created destinations are preserved.
  - New fields from destinations.js are added when missing.
  - We do NOT overwrite values entered by the user.
*/
function getSavedDestinations() {
  try {
    const savedDestinations = localStorage.getItem(STORAGE_KEY);

    if (!savedDestinations) {
      const initialData = destinationsData;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialData)
      );

      return initialData;
    }

    const parsedDestinations = JSON.parse(
      savedDestinations
    );

    if (!Array.isArray(parsedDestinations)) {
      return destinationsData;
    }

    /*
      Merge the latest default destination structure
      with the user's saved values.

      User-entered values always have priority.
    */
    const mergedDestinations = parsedDestinations.map(
      (savedDestination) => {
        const defaultDestination =
          destinationsData.find(
            (item) =>
              item.id === savedDestination.id ||
              item.name?.toLowerCase() ===
                savedDestination.name?.toLowerCase()
          );

        if (!defaultDestination) {
          return savedDestination;
        }

        return {
          ...defaultDestination,
          ...savedDestination,
        };
      }
    );

    /*
      Add new destinations from destinations.js
      if they do not already exist in localStorage.
    */
    const savedIds = new Set(
      mergedDestinations.map(
        (destination) => destination.id
      )
    );

    const savedNames = new Set(
      mergedDestinations.map((destination) =>
        destination.name?.toLowerCase()
      )
    );

    const newDefaultDestinations =
      destinationsData.filter((destination) => {
        const existsById = savedIds.has(destination.id);

        const existsByName = savedNames.has(
          destination.name?.toLowerCase()
        );

        return !existsById && !existsByName;
      });

    const finalDestinations = [
      ...mergedDestinations,
      ...newDefaultDestinations,
    ];

    /*
      Update localStorage with the merged data.
    */
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(finalDestinations)
    );

    return finalDestinations;
  } catch (error) {
    console.error(
      "Unable to load saved destinations:",
      error
    );

    return destinationsData;
  }
}

function Destinations() {
  const [destinations, setDestinations] = useState(
    getSavedDestinations
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [viewMode, setViewMode] = useState("grid");

  const [showForm, setShowForm] = useState(false);

  const [editingDestination, setEditingDestination] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const { showToast } = useToast();

  /*
    Save destinations everywhere.

    This event allows Header / BookingForm
    and other components to know that destination
    data has changed.
  */
  const saveDestinations = (updatedDestinations) => {
    setDestinations(updatedDestinations);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedDestinations)
      );

      window.dispatchEvent(
        new Event("travel-destinations-updated")
      );
    } catch (error) {
      console.error(
        "Unable to save destinations:",
        error
      );
    }
  };

  const popularCount = destinations.filter(
    (destination) =>
      destination.category === "Popular"
  ).length;

  const trendingCount = destinations.filter(
    (destination) =>
      destination.category === "Trending"
  ).length;

  const luxuryCount = destinations.filter(
    (destination) =>
      destination.category === "Luxury"
  ).length;

  const newCount = destinations.filter(
    (destination) =>
      destination.category === "New"
  ).length;

  /*
    Search destinations.
  */
  const filteredDestinations = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return destinations.filter((destination) => {
      const name = String(
        destination.name || ""
      ).toLowerCase();

      const country = String(
        destination.country || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        country.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        destination.category === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    destinations,
    searchTerm,
    statusFilter,
  ]);

  /*
    Add destination.
  */
  const handleAdd = () => {
    setEditingDestination(null);
    setShowForm(true);
  };

  /*
    Edit destination.
  */
  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setShowForm(true);
  };

  /*
    Save Add/Edit destination.

    This keeps ALL fields from DestinationForm,
    including:
    - amount
    - price
    - duration
    - startDate
    - endDate
    - category
    - description
    - image
    - rating
    - status
  */
  const handleFormSubmit = (formData) => {
    if (editingDestination) {
      const updatedDestinations =
        destinations.map((destination) =>
          destination.id ===
          editingDestination.id
            ? {
                ...destination,
                ...formData,
                id: editingDestination.id,
              }
            : destination
        );

      saveDestinations(updatedDestinations);

      showToast(
        "Destination updated successfully.",
        "success"
      );
    } else {
      const newDestination = {
        ...formData,
        id: Date.now(),
      };

      const updatedDestinations = [
        ...destinations,
        newDestination,
      ];

      saveDestinations(updatedDestinations);

      showToast(
        "Destination added successfully.",
        "success"
      );
    }

    setShowForm(false);
    setEditingDestination(null);
  };

  /*
    Ask before deleting.
  */
  const handleDeleteRequest = (destination) => {
    setDeleteTarget(destination);
  };

  /*
    Delete destination.
  */
  const handleDelete = () => {
    if (!deleteTarget) return;

    const updatedDestinations =
      destinations.filter(
        (destination) =>
          destination.id !== deleteTarget.id
      );

    saveDestinations(updatedDestinations);

    showToast(
      "Destination deleted successfully.",
      "success"
    );

    setDeleteTarget(null);
  };

  /*
    Close form.
  */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDestination(null);
  };

  return (
    <div className="destinations-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <p className="page-breadcrumb">
            Home / Destinations
          </p>

          <h2>Destinations</h2>

          <p className="page-description">
            Explore and manage all your travel
            destinations.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
          type="button"
        >
          <Plus size={18} />
          Add Destination
        </button>
      </div>

      {/* DESTINATION CATEGORIES */}
      <div className="destination-summary">

        <button
          type="button"
          className={`summary-item ${
            statusFilter === "Popular"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "Popular"
                ? "All"
                : "Popular"
            )
          }
        >
          <div className="summary-icon popular">
            <Star size={19} />
          </div>

          <div>
            <span>Popular</span>
            <strong>{popularCount}</strong>
          </div>
        </button>

        <button
          type="button"
          className={`summary-item ${
            statusFilter === "Trending"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "Trending"
                ? "All"
                : "Trending"
            )
          }
        >
          <div className="summary-icon trending">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>Trending</span>
            <strong>{trendingCount}</strong>
          </div>
        </button>

        <button
          type="button"
          className={`summary-item ${
            statusFilter === "Luxury"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "Luxury"
                ? "All"
                : "Luxury"
            )
          }
        >
          <div className="summary-icon luxury">
            <Gem size={19} />
          </div>

          <div>
            <span>Luxury</span>
            <strong>{luxuryCount}</strong>
          </div>
        </button>

        <button
          type="button"
          className={`summary-item ${
            statusFilter === "New"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter(
              statusFilter === "New"
                ? "All"
                : "New"
            )
          }
        >
          <div className="summary-icon new">
            <Sparkles size={19} />
          </div>

          <div>
            <span>New</span>
            <strong>{newCount}</strong>
          </div>
        </button>

      </div>

      {/* SEARCH + VIEW */}
      <div className="destination-toolbar">

        <div className="destination-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />
        </div>

        <div className="destination-toolbar-right">

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Destinations
            </option>

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
              title="Grid view"
            >
              <Grid3X3 size={18} />
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
              title="List view"
            >
              <List size={18} />
            </button>

          </div>

        </div>
      </div>

      {/* DESTINATION RESULTS */}
      {filteredDestinations.length === 0 ? (

        <div className="empty-table-state">
          <Search size={34} />

          <h3>
            No destinations found
          </h3>

          <p>
            Try changing your search or category.
          </p>
        </div>

      ) : viewMode === "grid" ? (

        <div className="destination-grid">
          {filteredDestinations.map(
            (destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            )
          )}
        </div>

      ) : (

        <DestinationTable
          destinations={filteredDestinations}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
      >
        <DestinationForm
          destination={editingDestination}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      </Modal>

      {/* DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Destination"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteTarget(null)
        }
      />

    </div>
  );
}

export default Destinations;