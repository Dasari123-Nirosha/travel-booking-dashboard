import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((previous) => !previous);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar sidebarOpen={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <div className="main-area">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={handleMenuClick}
        />

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;