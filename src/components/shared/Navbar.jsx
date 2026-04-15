import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  User, 
  GitBranch, 
  ChevronDown,
  Home,
  LayoutDashboard,
  Coins,
  Moon,
  Sun,
  Bell,
  Menu
} from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const userDropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserDropdownOpen(false);
  };

  const handleGithubClick = () => {
    window.open('https://github.com/meherunnesaenta/Micro-task-platform', '_blank');
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div  className="flex-shrink-0">
              <Logo />
            </div>    

            {/* Desktop Navigation - Large Screen */}
            <div className="hidden lg:flex items-center gap-8">
              
              {/* Nav Links */}
              {isAuthenticated && (
                <div className="flex items-center gap-6">
                  <Link 
                    to="/" 
                    className="text-base-content/70 hover:text-primary transition-colors font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-base-content/70 hover:text-primary transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                </div>
              )}

              {/* Right Section */}
              <div className="flex items-center gap-3">
                
                {/* Coins */}
                {isAuthenticated && (
                  <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-lg">
                    <Coins size={16} className="text-primary" />
                    <span className="font-semibold text-base-content">{user?.coins || 0}</span>
                    <span className="text-xs text-base-content/50">coins</span>
                  </div>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-base-200 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications */}
                {isAuthenticated && (
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="p-2 rounded-lg hover:bg-base-200 transition-colors relative"
                    >
                      <Bell size={18} />
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-error rounded-full"></span>
                    </button>

                    {isNotificationsOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-base-100 rounded-lg shadow-lg border border-base-200 overflow-hidden">
                        <div className="p-3 border-b border-base-200">
                          <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          <div className="p-4 text-center text-base-content/50 text-sm">
                            No new notifications
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* GitHub Button */}
                <button
                  onClick={handleGithubClick}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-base-200 transition-colors text-sm font-medium"
                >
                  <GitBranch size={16} />
                  <span>Developer</span>
                </button>

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff`}
                            alt={user?.name}
                            className="rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-base-content">
                          {user?.name?.split(' ')[0] || 'User'}
                        </div>
                        <div className="text-xs text-primary">{user?.role || 'Worker'}</div>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-lg shadow-lg border border-base-200 overflow-hidden">
                        <div className="p-3 border-b border-base-200">
                          <p className="text-sm font-medium text-base-content">{user?.name}</p>
                          <p className="text-xs text-base-content/50">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 text-sm"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <LayoutDashboard size={15} /> Dashboard
                          </Link>
                          <Link 
                            to="/profile" 
                            className="flex items-center gap-3 px-4 py-2 hover:bg-base-200 text-sm"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <User size={15} /> Profile
                          </Link>
                          <hr className="my-1 border-base-200" />
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-error/10 text-error text-sm"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link 
                      to="/login" 
                      className="px-4 py-1.5 text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-4 py-1.5 bg-primary text-primary-content rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-base-100 shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-base-200">
              <Logo />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-base-200">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link to="/login" className="btn btn-ghost w-full justify-start" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  <button onClick={handleGithubClick} className="btn btn-outline w-full gap-2">Developer</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg mb-4">
                    <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=8b5cf6&color=fff`} className="w-12 h-12 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-semibold">{user?.name}</div>
                      <div className="text-primary text-sm capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg mb-4">
                    <span className="font-medium">Coins</span>
                    <span className="font-bold text-primary text-xl">{user?.coins || 0}</span>
                  </div>
                  <div className="space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-3 py-3 hover:bg-base-200 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /> Home</Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 hover:bg-base-200 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/profile" className="flex items-center gap-3 px-3 py-3 hover:bg-base-200 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}><User size={18} /> Profile</Link>
                  </div>
                  <div className="border-t border-base-200 pt-4 mt-4">
                    <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-base-200 rounded-lg">
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-error hover:bg-error/10 rounded-lg mt-2">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;