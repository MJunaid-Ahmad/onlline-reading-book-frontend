import React, { useEffect, useState } from "react";
import SidebarMenu from "./SideBar";
import { useNavigate } from "react-router-dom";
import "../styles/Page.css";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include"
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setError("Failed to load user profile");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <SidebarMenu />
      <div className="page-content">
        <h1>👤 My Profile</h1>
        <p className="page-subtitle">Manage your account information and preferences</p>

        {loading && <p className="loading-text">Loading user profile...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && user && (
          <div className="item-card" style={{ maxWidth: "500px", margin: "20px 0" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div 
                style={{ 
                  width: "90px", 
                  height: "90px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  fontSize: "36px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.2)"
                }}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : "?"}
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f8fafc", margin: "0" }}>
                {user.username}
              </h2>
              <span 
                style={{ 
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginTop: "8px",
                  background: user.role === "admin" ? "rgba(234, 179, 8, 0.15)" : "rgba(99, 102, 241, 0.15)",
                  color: user.role === "admin" ? "#eab308" : "#818cf8",
                  border: user.role === "admin" ? "1px solid rgba(234, 179, 8, 0.3)" : "1px solid rgba(99, 102, 241, 0.3)"
                }}
              >
                {user.role}
              </span>
            </div>

            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>
                  Email Address
                </span>
                <span style={{ fontSize: "16px", color: "#e2e8f0" }}>{user.email}</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ display: "block", fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>
                  User ID
                </span>
                <span style={{ fontSize: "14px", color: "#94a3b8", fontFamily: "monospace" }}>{user._id}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
