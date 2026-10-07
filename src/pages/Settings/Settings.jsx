import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Save,
} from "lucide-react";
import { useState } from "react";

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "language",
      label: "Language & Region",
      icon: Globe,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
    },
  ];

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <p className="page-breadcrumb">Home / Settings</p>

          <h2>Settings</h2>

          <p className="page-description">
            Manage your account, preferences, notifications, and
            travel settings.
          </p>
        </div>
      </div>

      <div className="settings-layout">
        {/* SETTINGS MENU */}
        <aside className="settings-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className={`settings-menu-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* SETTINGS CONTENT */}
        <div className="settings-content">

          {/* PROFILE */}
          {activeSection === "profile" && (
            <section className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Profile Information</h3>
                  <p>
                    Update your personal account information.
                  </p>
                </div>
              </div>

              <div className="profile-settings">
                <div className="large-profile-avatar">
                  DN
                </div>

                <div>
                  <h4>Dasari Nirosha</h4>
                  <p>Travel Admin</p>

                  <button
                    className="outline-button"
                    type="button"
                  >
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    defaultValue="Dasari Nirosha"
                  />
                </div>

                <div className="settings-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    defaultValue="dnirosha0505@gmail.com"
                  />
                </div>

                <div className="settings-field">
                  <label>Role</label>
                  <input
                    type="text"
                    defaultValue="Travel Admin"
                    disabled
                  />
                </div>

                <div className="settings-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </section>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <section className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    Choose how you want to receive updates.
                  </p>
                </div>
              </div>

              <div className="settings-option">
                <div>
                  <strong>Push Notifications</strong>
                  <span>
                    Receive notifications about bookings and
                    trips.
                  </span>
                </div>

                <button
                  className={`toggle-switch ${
                    notifications ? "active" : ""
                  }`}
                  type="button"
                  onClick={() =>
                    setNotifications(!notifications)
                  }
                >
                  <span></span>
                </button>
              </div>

              <div className="settings-option">
                <div>
                  <strong>Email Updates</strong>
                  <span>
                    Receive booking confirmations and account
                    updates.
                  </span>
                </div>

                <button
                  className={`toggle-switch ${
                    emailUpdates ? "active" : ""
                  }`}
                  type="button"
                  onClick={() =>
                    setEmailUpdates(!emailUpdates)
                  }
                >
                  <span></span>
                </button>
              </div>
            </section>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <section className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Security</h3>
                  <p>
                    Manage your password and account security.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="settings-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="settings-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </section>
          )}

          {/* APPEARANCE */}
          {activeSection === "appearance" && (
            <section className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Appearance</h3>
                  <p>
                    Customize how the dashboard looks.
                  </p>
                </div>
              </div>

              <div className="settings-option">
                <div>
                  <strong>Dark Mode</strong>
                  <span>
                    Use a darker appearance for the dashboard.
                  </span>
                </div>

                <button
                  className={`toggle-switch ${
                    darkMode ? "active" : ""
                  }`}
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <span></span>
                </button>
              </div>
            </section>
          )}

          {/* LANGUAGE */}
          {activeSection === "language" && (
            <section className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Language & Region</h3>
                  <p>
                    Set your preferred language and currency.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Language</label>

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value)
                    }
                  >
                    <option>English</option>
                    <option>Telugu</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Currency</label>

                  <select
                    value={currency}
                    onChange={(event) =>
                      setCurrency(event.target.value)
                    }
                  >
                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* PAYMENTS */}
          {activeSection === "payments" && (
            <section className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Payments</h3>
                  <p>
                    Manage your preferred payment information.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label>Payment Method</label>

                  <select defaultValue="Credit Card">
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <div className="settings-field">
                  <label>Billing Currency</label>

                  <select defaultValue="USD">
                    <option>USD</option>
                    <option>INR</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          <div className="settings-save-area">
            <button
              className="primary-button"
              type="button"
              onClick={handleSave}
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;