import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    books: 0,
    authors: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:3000/api/book/all-books", { credentials: "include" }),
        fetch("http://localhost:3000/api/author/all-authors", { credentials: "include" }),
        fetch("http://localhost:3000/api/category/all-categories", { credentials: "include" }),
      ]);

      if (booksRes.status === 401 || authorsRes.status === 401 || categoriesRes.status === 401) {
        navigate("/");
        return;
      }

      const [books, authors, categories] = await Promise.all([
        booksRes.json(),
        authorsRes.json(),
        categoriesRes.json(),
      ]);

      setStats({
        books: Array.isArray(books.books) ? books.books.length : 0,
        authors: Array.isArray(authors.authors) ? authors.authors.length : 0,
        categories: Array.isArray(categories.categories) ? categories.categories.length : 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      navigate("/");
    } finally {
      setLoading(false);
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
        <p className="page-subtitle">Welcome to your BookStore dashboard 🚀</p>

        {loading ? (
          <p className="loading-text">Loading dashboard statistics...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
