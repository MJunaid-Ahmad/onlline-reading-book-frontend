import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";
import "../styles/FormElements.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    checkAdminRole();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/category/all-categories", {
        credentials : "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        setError("Failed to fetch categories");
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
      const response = await fetch(`http://localhost:3000/api/category/delete-category/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        alert("Category deleted successfully!");
        setShowConfirmModal(false);
        setDeleteTargetId(null);
        fetchCategories();
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>📂 Categories</h1>
        <p className="page-subtitle">Organize books by genres and subjects</p>
        
        {loading && <p className="loading-text">Loading categories...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && categories.length === 0 && (
          <p className="loading-text">No categories found. Add some categories first!</p>
        )}
        
        <div className="item-grid">
          {categories.map((category) => (
            <div key={category._id} className="item-card">
              <h3>{category.name}</h3>
              <p>{category.discription || "No description available for this category."}</p>

              {isAdmin && (
                <button 
                  className="btn btn-danger" 
                  onClick={() => triggerDelete(category._id)}
                  style={{ marginTop: "16px", width: "100%" }}
                >
                  🗑️ Delete Category
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
            <p>Are you sure you want to permanently delete this category? This action cannot be undone.</p>
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

export default Categories;
