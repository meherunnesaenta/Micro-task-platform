import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, GitBranch } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleGithubClick = () => {
    window.open(
      'https://github.com/yourusername/micro-task-platform',
      '_blank'
    );
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-icon">💼</span>
          <span className="logo-text">MicroTask</span>
        </Link>

        {/* Menu Toggle Button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <div className="coins-display">
                <span className="coins-text">
                  🪙 {user?.coins || 0} Coins
                </span>
              </div>
            </>
          )}

          {/* GitHub Button */}
          <button
            className="github-btn"
            onClick={() => {
              handleGithubClick();
              setIsOpen(false);
            }}
          >
            <GitBranch size={18} /> Join as Developer
          </button>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="user-menu">
              <img
                src={user?.photoURL || 'https://via.placeholder.com/40'}
                alt={user?.name}
                className="user-avatar"
              />
              <div className="user-dropdown">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} /> Profile
                </Link>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
