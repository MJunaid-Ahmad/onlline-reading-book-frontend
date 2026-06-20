import React, { useState } from "react";
import SidebarMenu from "./SideBar";
import TextInput from "./TextInput";
import "../styles/Page.css";
import "../styles/FormElements.css";

function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/category/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, discription: description }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Category added successfully!");
        setName("");
        setDescription("");
      } else {
        setMessage(data.message || "Failed to add category");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <div className="form-card">
          <h2>📂 Add New Category</h2>
          {message && (
            <p style={{ color: message.includes("success") ? "green" : "red", marginBottom: "15px" }}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
