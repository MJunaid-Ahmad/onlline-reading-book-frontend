import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import "../styles/Page.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/category/all-categories", {
        credentials : "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
        console.log(data.categories[0].discription)
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

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>📂 Categories</h1>
        
        {loading && <p>Loading categories...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <div className="item-grid">
          {categories.map((category) => (
            <div key={category._id} className="item-card">
              <h3>{category.name}</h3>
              <p>{category.discription || "No description"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
