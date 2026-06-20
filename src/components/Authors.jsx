import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuthors();
  }, []);

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
        setAuthors(data.authors);
        console.log(data);
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

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>✍️ Authors</h1>

        {loading && <p>Loading authors...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="item-grid">
          {authors.map((author) => (
            <div key={author._id} className="item-card">
              <h3>{author.name}</h3>
              <p>Biography: {author.biography || "Unknown"}</p>
              <img
                src={author.authorImage}
                alt={author.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Authors;
