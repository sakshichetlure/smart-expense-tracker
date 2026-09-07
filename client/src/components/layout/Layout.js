import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {/* Overlay – only visible on mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen && isMobile ? 'open' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content-area fade-in">{children}</div>
      </div>
    </div>
  );
}

<footer className="text-center text-secondary small mt-4 pt-3 border-top">
  &copy; {new Date().getFullYear()} SmartTracker. All rights reserved.
</footer>

export default Layout;
