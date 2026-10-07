import {
  LayoutDashboard,
  Map,
  Plane,
  Users,
  CalendarCheck,
  CalendarDays,
  Settings,
  LogOut,
  Globe2,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Destinations",
    path: "/destinations",
    icon: Map,
  },
  {
    label: "Trips",
    path: "/trips",
    icon: Plane,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    label: "Bookings",
    path: "/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
  },
];

function Sidebar({ sidebarOpen }) {
  const handleLogout = () => {
    localStorage.removeItem("travel-user");
    localStorage.removeItem("travel-bookings");

    window.location.href = "/login";
  };

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Globe2 size={24} />
        </div>

        <div>
          <h2>TravelGo</h2>
          <span>Booking Manager</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">
          MAIN MENU
        </p>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            DN
          </div>

          <div className="profile-info">
            <strong>Dasari Nirosha</strong>
            <span>Travel Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;