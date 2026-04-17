import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Settings,
  User,
  ChevronDown,
  Coins,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children, sidebarItems }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-layout">
      {/* Header - Glass Morphism */}
      <header className="fixed top-0 right-0 left-0 z-30 bg-base-100/80 backdrop-blur-md border-b border-base-200/50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              className="btn btn-ghost btn-square rounded-field"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-primary" size={24} />
              <h1 className="text-xl font-bold text-gradient hidden sm:block">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Coin Badge - 3D Effect */}
            <div className="coin-badge flex items-center gap-2 px-4 py-2 rounded-full">
              <Coins size={18} className="text-yellow-400" />
              <span className="font-bold text-base-100">
                {user?.coins || 0}
              </span>
            </div>

            {/* Notification Button */}
            <div className="relative">
              <button
                className="btn btn-ghost btn-circle relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center animate-pulse-ring">
                  3
                </span>
              </button>

              {/* Notification Dropdown - Glass Panel */}
              {isNotificationOpen && (
                <div className="notification-popup">
                  <div className="glass-panel rounded-box p-2">
                    <div className="px-3 py-2 border-b border-base-200">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="notification-item">
                          <p className="text-sm">Your task submission has been approved!</p>
                          <span className="text-xs opacity-60">2 min ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-field hover:bg-base-200 transition-all duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user?.photoURL || 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=' + (user?.name || 'User')}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold">{user?.name || 'User Name'}</p>
                  <p className="text-xs opacity-60">{user?.role || 'Worker'}</p>
                </div>
                <ChevronDown size={16} className="hidden md:block" />
              </button>

              {/* Dropdown Menu - Glass Morphism */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 z-50 animate-slide-in-right">
                  <div className="glass-panel rounded-box p-2">
                    <div className="flex items-center gap-3 p-3 border-b border-base-200">
                      <img
                        src={user?.photoURL || 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=' + (user?.name || 'User')}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{user?.name || 'User Name'}</p>
                        <p className="text-sm opacity-60">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-base-200 transition-colors duration-200 rounded-field"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings size={16} />
                        Profile Settings
                      </Link>
                      <button
                        className="flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-200 rounded-field w-full"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="flex pt-[73px] min-h-screen">
        {/* Sidebar - Glass Morphism */}
        <aside
          className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] z-20 transition-all duration-500 ease-out
            ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
            bg-base-100/95 backdrop-blur-md border-r border-base-200/50 overflow-hidden`}
        >
          <nav className="h-full overflow-y-auto py-6">
            {sidebarItems?.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item group relative flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-field transition-all duration-300
                  ${window.location.pathname === item.path 
                    ? 'bg-gradient-primary text-white shadow-glow' 
                    : 'hover:bg-base-200 text-base-content'
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`sidebar-label text-sm font-medium transition-all duration-300
                  ${!isSidebarOpen && 'lg:hidden'}`}>
                  {item.label}
                </span>
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-base-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 hidden lg:block">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
          <div className="p-6 md:p-8">
            <div className="animate-fade-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;