// src/Sidebar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "./index.css";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const goToCategory = (path) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <>
      {/* Overlay background */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar drawer */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3>🛍️ Categories</h3>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => goToCategory("/products")}>New Arrivals</li>
          <li onClick={() => goToCategory("/products")}>Festive Collection</li>
          <li onClick={() => goToCategory("/products")}>Summer Drop 2025</li>
          <li onClick={() => goToCategory("/products")}>Luxury Lawn</li>
          <li onClick={() => goToCategory("/products")}>Accessories</li>
        </ul>

        <div className="sidebar-footer">
          <p>✨ Discover your perfect style ✨</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
