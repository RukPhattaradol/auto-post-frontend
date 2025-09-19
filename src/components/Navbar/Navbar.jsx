// src/components/Navbar.jsx
import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>My Dashboard</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/upload">Upload</a>
        <a href="/post">Post</a>
        <a href="/groups">Group</a>
      </div>
    </nav>
  );
}
