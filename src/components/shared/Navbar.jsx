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
  Menu,
  Sparkles
} from 'lucide-react';
import Logo from './Logo';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const userDropdownRef = useRef(null);

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const handleCoinsUpdate = () => {
      window.location.reload();
    };
    window.addEventListener('userCoinsUpdated', handleCoinsUpdate);
    return () => window.removeEventListener('userCoinsUpdated', handleCoinsUpdate);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-base-100/90 backdrop-blur-md border-b border-base-200/50 shadow-lg' 
          : 'bg-base-100 border-b border-base-200'
      }`}>
        <div className="container-modern">
          <div className="flex justify-between items-center h-16 lg:h-[72px]">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>    

            {/* Desktop Navigation - Large Screen */}
            <div className="hidden lg:flex items-center gap-8">
              
              {/* Nav Links */}
              {isAuthenticated && (
                <div className="flex items-center gap-6">
                  <Link 
                    to="/" 
                    className="text-base-content/70 hover:text-primary transition-all duration-300 font-medium relative group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-base-content/70 hover:text-primary transition-all duration-300 font-medium relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              )}

              {/* Right Section */}
              <div className="flex items-center gap-3">
                
                {/* Coins Badge */}
                {isAuthenticated && (
                  <div className="coin-badge flex items-center gap-2 px-3 py-1.5 rounded-field">
                    <Coins size={16} className="text-yellow-400" />
                    <span className="font-bold text-sm text-base-100">{user?.coins || 0}</span>
                    <span className="text-xs text-base-100/70">coins</span>
                  </div>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-field glass-panel hover:glass-panel-dark transition-all duration-300 hover:scale-110"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
                </button>

                {/* Notification Bell */}
                <NotificationBell />

                {/* User Menu / Auth Buttons */}
                {isAuthenticated ? (
                  <>
                    {/* GitHub Button - Outline Style */}
                    <button
                      onClick={handleGithubClick}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-field border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 text-sm font-medium"
                    >
                      <GitBranch size={16} className="group-hover:rotate-12 transition-transform" />
                      <span>Developer</span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-field glass-panel hover:glass-panel-dark transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&bold=true`}
                            alt={user?.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full ring-2 ring-base-100"></div>
                        </div>
                        <div className="text-left hidden xl:block">
                          <div className="text-sm font-semibold text-base-content">
                            {user?.name?.split(' ')[0] || 'User'}
                          </div>
                          <div className="text-xs text-primary capitalize">{user?.role || 'Worker'}</div>
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-64 z-50 animate-slide-in-right">
                          <div className="glass-panel rounded-box overflow-hidden">
                            <div className="p-4 border-b border-base-200/50 flex items-center gap-3">
                              <img
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=8b5cf6&color=fff`}
                                alt={user?.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-base-content">{user?.name}</p>
                                <p className="text-xs text-base-content/50">{user?.email}</p>
                              </div>
                            </div>
                            <div className="py-2">
                              <Link 
                                to="/dashboard" 
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200/50 transition-colors text-sm"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <LayoutDashboard size={16} /> Dashboard
                              </Link>
                              <Link 
                                to="/profile" 
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200/50 transition-colors text-sm"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <User size={16} /> Profile Settings
                              </Link>
                              <hr className="my-1 border-base-200/50" />
                              <button 
                                onClick={handleLogout} 
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error/10 text-error transition-colors text-sm"
                              >
                                <LogOut size={16} /> Sign Out
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Sign In - Ghost Button */}
                    <Link 
                      to="/login" 
                      className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-primary transition-all duration-300"
                    >
                      Sign In
                    </Link>
                    
                    {/* Sign Up - Primary Gradient Button (Eye-catching) */}
                    <Link 
                      to="/register" 
                      className="btn-gradient px-5 py-2 rounded-field text-sm font-medium inline-flex items-center gap-1 shadow-lg hover:shadow-glow"
                    >
                      Sign Up
                      <Sparkles size={14} />
                    </Link>
                    
                    {/* Developer - Outline Button (Distinct from Sign Up) */}
                    <button
                      onClick={handleGithubClick}
                      className="group flex items-center gap-2 px-3 py-2 rounded-field border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 text-sm font-medium ml-1"
                    >
                      <GitBranch size={14} className="group-hover:rotate-12 transition-transform" />
                      <span>Developer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 rounded-field glass-panel hover:glass-panel-dark transition-all duration-300"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-[72px]"></div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-85 bg-base-100 shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex justify-between items-center p-5 border-b border-base-200">
              <Logo />
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-field glass-panel flex items-center justify-center hover:scale-110 transition-all duration-300">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Link to="/login" className="btn btn-ghost w-full justify-start rounded-field" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn-gradient w-full rounded-field text-center block py-2.5" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  <button onClick={handleGithubClick} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-field border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-300">
                    <GitBranch size={16} /> Developer
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-gradient-card rounded-box mb-5">
                    <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=8b5cf6&color=fff`} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30" alt="" />
                    <div>
                      <div className="font-bold text-base-content">{user?.name}</div>
                      <div className="text-primary text-sm capitalize flex items-center gap-1">{user?.role}</div>
                    </div>
                  </div>
                  <div className="coin-badge flex items-center justify-between p-3 rounded-field mb-5">
                    <span className="font-medium text-base-100">Available Coins</span>
                    <span className="font-bold text-base-100 text-xl flex items-center gap-1"><Coins size={18} /> {user?.coins || 0}</span>
                  </div>
                  <div className="space-y-1">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 rounded-field transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /> Home</Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 rounded-field transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}><LayoutDashboard size={18} /> Dashboard</Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-base-200 rounded-field transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}><User size={18} /> Profile</Link>
                  </div>
                  <div className="border-t border-base-200 pt-5 mt-5">
                    <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 rounded-field transition-all duration-300">
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 rounded-field transition-all duration-300 mt-2">
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