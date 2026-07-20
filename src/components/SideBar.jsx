import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    // Always redirect to login page and clear any client token leftovers
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <div className="mobile-header">
        <h2>📚 BookStore</h2>
        <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>📚 BookStore</h2>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/books" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>📚</span> Books
          </NavLink>
          <NavLink to="/add-book" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>➕</span> Add Book
          </NavLink>
          <NavLink to="/authors" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>✍️</span> Authors
          </NavLink>
          <NavLink to="/add-author" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>➕</span> Add Author
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>📂</span> Categories
          </NavLink>
          <NavLink to="/add-category" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>➕</span> Add Category
          </NavLink>
          <NavLink to="/bookmarks" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>🔖</span> Bookmarks
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setIsOpen(false)}>
            <span>👤</span> Profile
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}

export default SidebarMenu;
