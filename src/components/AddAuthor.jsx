import React, { useState } from "react";
import SidebarMenu from "./SideBar";
import TextInput from "./TextInput";
import "../styles/Page.css";
import "../styles/FormElements.css";

function AddAuthor() {
  const [name, setName] = useState("");
  const [biography, setBiography] = useState("");
  const [authorImage, setAuthorImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("biography", biography);
    if (authorImage) {
      formData.append("authorImage", authorImage);
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/author/add-author",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Author added successfully!");
        setName("");
        setBiography("");
        setAuthorImage(null);
      } else {
        setMessage(data.message || "Failed to add author");
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
          <h2>✍️ Add New Author</h2>
          {message && (
            <p
              style={{
                color: message.includes("success") ? "green" : "red",
                marginBottom: "15px",
              }}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Author Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter author name"
              required
            />
            <div className="form-group">
              <label>Biography</label>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Enter author biography"
              />
            </div>
            <div className="form-group">
              <label>Author Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAuthorImage(e.target.files[0])}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Author"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAuthor;
