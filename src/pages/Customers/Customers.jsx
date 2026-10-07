import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Users,
  UserCheck,
  Wallet,
  Plane,
  X,
  Save,
} from "lucide-react";

import customersData from "../../data/customers";
import CustomerTable from "../../components/customers/CustomerTable";
import CustomerCard from "../../components/customers/CustomerCard";
import CustomerDetails from "../../components/customers/CustomerDetails";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import { useToast } from "../../context/ToastContext";
import { formatCurrency } from "../../utils/formatters";

function Customers() {
  const [customers, setCustomers] =
    useState(customersData);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [viewMode, setViewMode] =
    useState("grid");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "Active",
  });

  const {
    toast,
    showToast,
    hideToast,
  } = useToast();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        customer.name
          ?.toLowerCase()
          .includes(search) ||
        customer.email
          ?.toLowerCase()
          .includes(search) ||
        customer.phone
          ?.toLowerCase()
          .includes(search) ||
        customer.location
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    customers,
    searchTerm,
    statusFilter,
  ]);

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Active"
    ).length;

  const totalBookings =
    customers.reduce(
      (total, customer) =>
        total +
        Number(customer.bookings || 0),
      0
    );

  const totalRevenue =
    customers.reduce(
      (total, customer) =>
        total +
        Number(customer.totalSpent || 0),
      0
    );

  // VIEW CUSTOMER
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  // OPEN EDIT
  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setEditForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      location: customer.location || "",
      status: customer.status || "Active",
    });

    setShowDetails(false);
    setShowEditModal(true);
  };

  // EDIT INPUT CHANGE
  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // SAVE EDIT
  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (!editingCustomer) {
      return;
    }

    const name =
      editForm.name.trim();

    const email =
      editForm.email.trim();

    const phone =
      editForm.phone.trim();

    const location =
      editForm.location.trim();

    if (
      !name ||
      !email ||
      !phone ||
      !location
    ) {
      showToast(
        "Please fill in all customer details.",
        "error"
      );

      return;
    }

    const updatedCustomer = {
      ...editingCustomer,
      name,
      email,
      phone,
      location,
      status: editForm.status,
    };

    setCustomers((currentCustomers) =>
      currentCustomers.map(
        (customer) =>
          customer.id ===
          editingCustomer.id
            ? updatedCustomer
            : customer
      )
    );

    setSelectedCustomer(
      updatedCustomer
    );

    setEditingCustomer(null);
    setShowEditModal(false);

    showToast(
      `${name}'s details updated successfully.`,
      "success"
    );
  };

  // DELETE CUSTOMER
  const handleDelete = (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.name}?`
    );

    if (!confirmed) {
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.filter(
        (item) =>
          item.id !== customer.id
      )
    );

    if (
      selectedCustomer?.id ===
      customer.id
    ) {
      setSelectedCustomer(null);
      setShowDetails(false);
    }

    if (
      editingCustomer?.id ===
      customer.id
    ) {
      setEditingCustomer(null);
      setShowEditModal(false);
    }

    showToast(
      `${customer.name} was removed successfully.`,
      "success"
    );
  };

  // ADD CUSTOMER
  const handleAddCustomer = () => {
    showToast(
      "Customer form will be available in the next update.",
      "info"
    );
  };

  // CLOSE EDIT
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCustomer(null);
  };

  return (
    <div className="page customers-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>Customers</h1>

          <p>
            Manage customer profiles,
            bookings, and travel activity.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
      </div>

      {/* STATISTICS */}
      <div className="stats-grid customer-stats">
        <div className="stat-card">
          <div className="stat-card-icon">
            <Users size={22} />
          </div>

          <div className="stat-card-content">
            <span>Total Customers</span>

            <strong>
              {totalCustomers}
            </strong>

            <small>
              Registered customers
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            <UserCheck size={22} />
          </div>

          <div className="stat-card-content">
            <span>Active Customers</span>

            <strong>
              {activeCustomers}
            </strong>

            <small>
              Currently active
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">
            <Plane size={22} />
          </div>

          <div className="stat-card-content">
            <span>Total Bookings</span>

            <strong>
              {totalBookings}
            </strong>

            <small>
              Customer bookings
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
              {formatCurrency(
                totalRevenue
              )}
            </strong>

            <small>
              Customer spending
            </small>
          </div>
        </div>
      </div>

      {/* CUSTOMER DIRECTORY */}
      <div className="content-card">
        <div className="content-card-header">
          <div>
            <h2>
              Customer Directory
            </h2>

            <p>
              {filteredCustomers.length}{" "}
              customer
              {filteredCustomers.length !==
              1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>

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
              aria-label="Grid view"
            >
              <LayoutGrid size={18} />
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
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="customer-filters">
          <div className="search-input-wrapper">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search customers, email, phone..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
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
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* CUSTOMER CONTENT */}
        {filteredCustomers.length ===
        0 ? (
          <div className="empty-state">
            <Users size={42} />

            <h3>
              No customers found
            </h3>

            <p>
              Try changing your search
              or status filter.
            </p>
          </div>
        ) : viewMode ===
          "grid" ? (
          <div className="customers-grid">
            {filteredCustomers.map(
              (customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            )}
          </div>
        ) : (
          <CustomerTable
            customers={
              filteredCustomers
            }
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* VIEW CUSTOMER MODAL */}
      <Modal
        isOpen={showDetails}
        onClose={() =>
          setShowDetails(false)
        }
        title=""
        size="large"
      >
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() =>
            setShowDetails(false)
          }
        />
      </Modal>

      {/* EDIT CUSTOMER MODAL */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title=""
        size="medium"
      >
        <div className="customer-edit-modal">
          <div className="customer-edit-header">
            <div>
              <span className="details-label">
                CUSTOMER MANAGEMENT
              </span>

              <h3>
                Edit Customer
              </h3>

              <p>
                Update customer profile
                information.
              </p>
            </div>

            <button
              type="button"
              className="modal-close-button"
              onClick={closeEditModal}
              aria-label="Close edit customer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form
            className="customer-edit-form"
            onSubmit={handleSaveEdit}
          >
            <div className="customer-edit-grid">
              {/* NAME */}
              <div className="form-group">
                <label htmlFor="customer-name">
                  Customer Name
                </label>

                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter customer name"
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label htmlFor="customer-email">
                  Email
                </label>

                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter email address"
                />
              </div>

              {/* PHONE */}
              <div className="form-group">
                <label htmlFor="customer-phone">
                  Phone
                </label>

                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter phone number"
                />
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label htmlFor="customer-location">
                  Location
                </label>

                <input
                  id="customer-location"
                  name="location"
                  type="text"
                  value={
                    editForm.location
                  }
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter location"
                />
              </div>

              {/* STATUS */}
              <div className="form-group customer-status-field">
                <label htmlFor="customer-status">
                  Status
                </label>

                <select
                  id="customer-status"
                  name="status"
                  value={
                    editForm.status
                  }
                  onChange={
                    handleEditChange
                  }
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

            {/* EDIT ACTIONS */}
            <div className="customer-edit-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={closeEditModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* TOAST */}
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

export default Customers;