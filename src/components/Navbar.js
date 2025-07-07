import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userRole, onLogout }) => {
  return (
    <nav className="navbar-container">
      <h2 className="navbar-logo">
        MentoApp
        {userRole && (
          <span className="role-badge">
            [{userRole.toUpperCase()}]
          </span>
        )}
      </h2>

      <div className="navbar-links">
        <Link to="/" className="nav-btn">Profile</Link>
        <Link to="/edit" className="nav-btn">Edit</Link>

        {/* ✅ Admin-only navigation */}
        {userRole === 'admin' && (
          <>
            <Link to="/admin" className="nav-btn">Admin Dashboard</Link>
            <Link to="/admin-sessions" className="nav-btn">Manage Sessions</Link>
            <Link to="/admin-add-user" className="nav-btn">Add User</Link>
          </>
        )}

        <button onClick={onLogout} className="nav-btn logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
