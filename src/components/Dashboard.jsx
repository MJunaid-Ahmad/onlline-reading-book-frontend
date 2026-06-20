import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    categories: 0,
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      // Fetch all stats in parallel
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:3000/api/book/all-books", { credentials:"include" }),
        fetch("http://localhost:3000/api/author/all-authors", { credentials:"include" }),
        fetch("http://localhost:3000/api/category/all-categories", { credentials:"include" }),
      ]);
      console.log("1st Done" )
      const [books, authors, categories] = await Promise.all([
        booksRes.json(),
        authorsRes.json(),
        categoriesRes.json(),
      ]);
      console.log("2st Done", books, authors, categories)

      setStats({
        books: Array.isArray(books.books) ? books.books.length : 0,
        authors: Array.isArray(authors.authors) ? authors.authors.length : 0,
        categories: Array.isArray(categories.categories) ? categories.categories.length : 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="page-container">
      <SidebarMenu />

      <div className="page-content">
        <h1>📊 Dashboard</h1>
        <p>Welcome to your BookStore dashboard 🚀</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Books</h3>
            <div className="number">{stats.books}</div>
          </div>
          <div className="stat-card">
            <h3>Total Authors</h3>
            <div className="number">{stats.authors}</div>
          </div>
          <div className="stat-card">
            <h3>Total Categories</h3>
            <div className="number">{stats.categories}</div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
