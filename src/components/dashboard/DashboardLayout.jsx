import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, Bell, Settings } from 'lucide-react';
import '../../styles/dashboard.css';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children, sidebarItems }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="dashboard-title">Dashboard</h1>
        </div>

        <div className="header-right">
          <div className="coins-badge">
            <span className="coins-icon">🪙</span>
            <span className="coins-value">{user?.coins || 0}</span>
          </div>

          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu-dashboard">
            <img
              src={user?.photoURL || 'https://via.placeholder.com/40'}
              alt={user?.name}
              className="user-avatar-dashboard"
            />
            <div className="dropdown-menu-dashboard">
              <div className="dropdown-header">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/40'}
                  alt={user?.name}
                  className="dropdown-avatar"
                />
                <div className="user-info">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
              <hr />
              <Link to="/profile" className="dropdown-link">
                <Settings size={16} /> Profile Settings
              </Link>
              <button className="dropdown-link logout-link" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {sidebarItems?.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${
                  window.location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <div className="content-wrapper">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
