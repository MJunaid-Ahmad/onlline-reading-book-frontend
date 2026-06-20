import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/book/all-books", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data.books  || [] );
        console.log("API RESPONSE:", data.books);
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

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>📚 Books</h1>

        {loading && <p>Loading books...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="item-grid">
          {books.map((book) => (
            <div key={book._id} className="item-card">
              <h3>{book.title}</h3>
              <p>Author: {book.author?.name || "Unknown"}</p>
              <p>Category: {book.category?.name || "Uncategorized"}</p>
              <p>Price: ${book.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Books;
