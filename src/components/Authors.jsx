import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";
import "../styles/FormElements.css";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    checkAdminRole();
    fetchAuthors();
  }, []);

  const checkAdminRole = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include"
      });
      if (response.ok) {
        const user = await response.json();
        setIsAdmin(user.role === "admin");
      }
    } catch (err) {
      console.error("Failed to check admin role:", err);
    }
  };

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/author/all-authors",
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAuthors(data.authors || []);
      } else {
        setError("Failed to fetch authors");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/author/delete-author/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        alert("Author deleted successfully!");
        setShowConfirmModal(false);
        setDeleteTargetId(null);
        fetchAuthors();
      } else {
        alert(data.message || "Failed to delete author");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting author");
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>✍️ Authors</h1>
        <p className="page-subtitle">Meet the talented writers behind our collection</p>

        {loading && <p className="loading-text">Loading authors...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && authors.length === 0 && (
          <p className="loading-text">No authors found. Add some authors first!</p>
        )}

        <div className="item-grid">
          {authors.map((author) => (
            <div key={author._id} className="item-card" style={{ textAlign: "center" }}>
              <img
                src={author.authorImage || "https://via.placeholder.com/150"}
                alt={author.name}
                className="author-circle-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <h3>{author.name}</h3>
              <p style={{ marginTop: "10px" }}>{author.biography || "No biography available."}</p>

              {isAdmin && (
                <button 
                  className="btn btn-danger" 
                  onClick={() => triggerDelete(author._id)}
                  style={{ marginTop: "16px", width: "100%" }}
                >
                  🗑️ Delete Author
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to permanently delete this author? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-btn-cancel" 
                onClick={() => { setShowConfirmModal(false); setDeleteTargetId(null); }}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-delete" 
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Authors;
