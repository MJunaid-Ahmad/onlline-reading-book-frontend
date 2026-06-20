import React, { useState, useEffect } from "react";
import SidebarMenu from "./SideBar";
import TextInput from "./TextInput";
import Dropdown from "./Dropdown";
import "../styles/Page.css";
import "../styles/FormElements.css";

function AddBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchAuthors = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/author/all-authors",
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      console.log("Fetched authors:", data);
      setAuthors(Array.isArray(data.authors) ? data.authors : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      // const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/category/all-categories",
        {
          credentials: "include",
        },
      );
      const data = await response.json();
      console.log("Fetched categories:", data);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (err) {
      console.error(err);

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("discription", description);
    formData.append("author", author);
    formData.append("category", category);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      // const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/book/add-book", {
        method: "POST",
        credentials: "include",
        // headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Book added successfully!");
        setTitle("");
        setDescription("");
        setAuthor("");
        setCategory("");
        setCoverImage(null);
      } else {
        setMessage(data.message || "Failed to add book");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const authorOptions = authors.map((a) => ({ value: a._id, label: a.name }));
  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <div className="form-card">
          <h2>📚 Add New Book</h2>
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
              label="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
            <TextInput
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
            />
            <Dropdown
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              options={authorOptions}
              placeholder="Select author"
              required
            />
            <Dropdown
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
              required
            />
            <div className="form-group">
              <label>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBook;
