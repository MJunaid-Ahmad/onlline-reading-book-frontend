import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";
import "../styles/FormElements.css";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/book/user-bookmarks", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks || []);
        console.log("Bookmarks API response:", data.bookmarks);
      } else {
        setError("Failed to fetch bookmarks");
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

  const handleDeleteBookmark = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/book/delete-bookmark/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        alert("Bookmark removed successfully!");
        setShowConfirmModal(false);
        setDeleteTargetId(null);
        fetchBookmarks();
      } else {
        alert(data.message || "Failed to remove bookmark");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing bookmark");
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>🔖 Bookmarks</h1>
        <p className="page-subtitle">Your saved reading progress across books</p>

        {loading && <p className="loading-text">Loading bookmarks...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && bookmarks.length === 0 && (
          <p className="loading-text">You haven't added any bookmarks yet. Go to Books page to bookmark some pages!</p>
        )}

        <div className="item-grid">
          {bookmarks.map((bookmark) => {
            const book = bookmark.book_id;
            if (!book) return null;
            
            return (
              <div key={bookmark._id} className="item-card">
                <img 
                  src={book.coverImage || "https://via.placeholder.com/150"} 
                  alt={book.title} 
                  className="card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author?.name || "Unknown"}</p>
                <p><strong>Category:</strong> {book.category?.name || "Uncategorized"}</p>
                
                <div style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "rgba(99, 102, 241, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                  color: "#818cf8",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "block",
                  textAlign: "center"
                }}>
                  📖 Reading at Page {bookmark.page_number}
                </div>

                <button 
                  className="btn btn-danger" 
                  onClick={() => triggerDelete(bookmark._id)}
                  style={{ marginTop: "16px", width: "100%" }}
                >
                  🗑️ Remove Bookmark
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Confirm Removal</h3>
            <p>Are you sure you want to remove this bookmark from your list?</p>
            <div className="modal-actions">
              <button 
                className="modal-btn-cancel" 
                onClick={() => { setShowConfirmModal(false); setDeleteTargetId(null); }}
              >
                Cancel
              </button>
              <button 
                className="modal-btn-delete" 
                onClick={handleDeleteBookmark}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
