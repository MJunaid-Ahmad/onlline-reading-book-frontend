import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";
import "../styles/FormElements.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageNumbers, setPageNumbers] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    checkAdminRole();
    fetchBooks();
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

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/book/all-books", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books  || [] );
      } else {
        setError("Failed to fetch books");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (bookId, value) => {
    setPageNumbers(prev => ({
      ...prev,
      [bookId]: value
    }));
  };

  const handleBookmark = async (bookId, pageNumber) => {
    try {
      if (!pageNumber || pageNumber <= 0) {
        alert("Please enter a valid page number");
        return;
      }
      
      const response = await fetch("http://localhost:3000/api/book/add-bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          book_id: bookId,
          page_number: Number(pageNumber)
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert("Bookmark added successfully!");
        setPageNumbers(prev => ({
          ...prev,
          [bookId]: ""
        }));
      } else {
        alert(data.message || "Failed to add bookmark");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding bookmark");
    }
  };

  const triggerDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await fetch(`http://localhost:3000/api/book/delete-book/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        alert("Book deleted successfully!");
        setShowConfirmModal(false);
        setDeleteTargetId(null);
        fetchBooks();
      } else {
        alert(data.message || "Failed to delete book");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting book");
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>📚 Books</h1>
        <p className="page-subtitle">Browse available books and save your reading progress</p>

        {loading && <p className="loading-text">Loading books...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p className="loading-text">No books found. Add some books first!</p>
        )}

        <div className="item-grid">
          {books.map((book) => (
            <div key={book._id} className="item-card">
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
              <p>{book.discription || "No description available."}</p>
              
              <div className="bookmark-action">
                <input
                  type="number"
                  min="1"
                  placeholder="Pg #"
                  value={pageNumbers[book._id] || ""}
                  onChange={(e) => handlePageChange(book._id, e.target.value)}
                />
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBookmark(book._id, pageNumbers[book._id])}
                >
                  🔖 Bookmark
                </button>
              </div>

              {isAdmin && (
                <button 
                  className="btn btn-danger" 
                  onClick={() => triggerDelete(book._id)}
                  style={{ marginTop: "16px", width: "100%" }}
                >
                  🗑️ Delete Book
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
            <p>Are you sure you want to permanently delete this book? This action cannot be undone.</p>
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

export default Books;
