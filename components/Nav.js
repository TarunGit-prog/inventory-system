// src/components/Nav.js
import React from 'react';
import { Link } from 'react-router-dom';  // If you're using React Router
import './nav.css'
function Nav() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/products" className="navbar-link">Products</Link>
        </li>
        <li className="navbar-item">
          <Link to="/categories" className="navbar-link">Categories</Link>
        </li>
        <li className="navbar-item">
          <Link to="/suppliers" className="navbar-link">Suppliers</Link>
        </li>
        <li className="navbar-item">
          <Link to="/sales" className="navbar-link">Sales</Link>
        </li>
        <li className="navbar-item">
          <Link to="/restocking" className="navbar-link">Restocking</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
