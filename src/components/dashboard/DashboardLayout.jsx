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
  LayoutDashboard,
  Home,
  Briefcase,
  CheckSquare,
  Wallet,
  ShoppingCart,
  History,
  Users,
  AlertCircle,
  DollarSign
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

  // Default sidebar items if none provided
  const defaultSidebarItems = [
  
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/dashboard/tasks', label: 'Tasks', icon: <Briefcase size={20} /> },
    { path: '/dashboard/submissions', label: 'Submissions', icon: <CheckSquare size={20} /> },
    { path: '/dashboard/wallet', label: 'Wallet', icon: <Wallet size={20} /> },
    { path: '/dashboard/transactions', label: 'History', icon: <History size={20} /> },
  ];

  const items = sidebarItems || defaultSidebarItems;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-30 bg-base-100 border-b border-base-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-primary" size={22} />
              <h1 className="text-lg md:text-xl font-bold text-base-content hidden sm:block">
                Dashboard
              </h1>
              
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Coin Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 shadow-md">
              <Coins size={16} className="text-white" />
              <span className="font-bold text-sm text-white">
                {user?.coins || 0}
              </span>
            </div>

            {/* Notification Button */}
            <div className="relative">
              <button
                className="p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300 relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell size={18} className="text-base-content" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 z-50 bg-base-100 rounded-xl shadow-xl border border-base-200 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-base-200">
                    <h3 className="font-semibold text-base-content">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="px-4 py-3 border-b border-base-100 hover:bg-base-200 transition-colors cursor-pointer">
                        <p className="text-sm text-base-content">Your task submission has been approved!</p>
                        <span className="text-xs text-base-content/50 mt-1 block">2 min ago</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-base-200 text-center">
                    <button className="text-xs text-primary hover:underline">View all</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${encodeURIComponent(user?.name || 'User')}`}
                  alt={user?.name}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-base-content">{user?.name?.split(' ')[0] || 'User'}</p>
                  <p className="text-xs text-primary capitalize">{user?.role || 'Worker'}</p>
                </div>
                <ChevronDown size={14} className="hidden md:block text-base-content/50" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 z-50 bg-base-100 rounded-xl shadow-xl border border-base-200 animate-fade-in-up">
                  <div className="flex items-center gap-3 p-3 border-b border-base-200">
                    <img
                      src={user?.photoURL || `https://ui-avatars.com/api/?background=3b82f6&color=fff&name=${encodeURIComponent(user?.name || 'User')}`}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-base-content">{user?.name || 'User'}</p>
                      <p className="text-xs text-base-content/50">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  <div className="py-1">

                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="flex pt-[57px] md:pt-[65px] min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-[57px] md:top-[65px] h-[calc(100vh-57px)] md:h-[calc(100vh-65px)] z-20 transition-all duration-300 ease-out
            ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'}
            bg-base-100 border-r border-base-200 overflow-hidden`}
        >
          <nav className="h-full overflow-y-auto py-4">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 px-4 py-2.5 mx-2 my-1 rounded-lg transition-all duration-200
                  ${window.location.pathname === item.path 
                    ? 'bg-primary text-white' 
                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                  }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`text-sm font-medium transition-all duration-200
                  ${!isSidebarOpen && 'lg:hidden'}`}>
                  {item.label}
                </span>
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-base-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 hidden lg:block shadow-lg">
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <div className="p-4 md:p-6">
            {children}
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