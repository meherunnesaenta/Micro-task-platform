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
  Sparkles,
  Shield
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-base-100/95 backdrop-blur-md border-b border-base-200 shadow-md'
        : 'bg-base-100 border-b border-base-200'
        }`}>
        <div className="container-modern">
          <div className="flex justify-between items-center h-16 md:h-[72px]">

            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">

              {isAuthenticated && (
                <div className="flex items-center gap-8">
                  <Link
                    to="/"
                    className="text-base font-medium text-base-content hover:text-primary transition-colors duration-300"
                  >
                    Home
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3">

                {/* Coins Badge - Solid Color */}
                {isAuthenticated && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 shadow-md">
                    <Coins size={18} className="text-white" />
                    <span className="font-bold text-base text-white">{user?.coins?.toLocaleString() || 0}</span>
                    <span className="text-xs text-white/90">coins</span>
                  </div>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full bg-base-200 hover:bg-base-300 transition-all duration-300"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <Moon size={20} className="text-slate-600" />
                  )}
                </button>

                <NotificationBell />

                {isAuthenticated ? (
                  <>
                    {/* Developer Button */}
                    <button
                      onClick={handleGithubClick}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 text-sm font-semibold shadow-md"
                    >
                      <GitBranch size={16} />
                      <span>Developer</span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-base-200 hover:bg-base-300 transition-all duration-300"
                      >
                        <div className="relative">
                          <img
                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&bold=true&length=2&size=40`}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100"></div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-base-content">
                            {user?.name?.split(' ')[0] || 'User'}
                          </div>
                          <div className="text-xs text-primary font-medium capitalize">{user?.role || 'Worker'}</div>
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-300 text-base-content/50 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-64 z-50 animate-slide-in-right">
                          <div className="bg-base-100 rounded-xl shadow-xl border border-base-200 overflow-hidden">
                            <div className="p-4 border-b border-base-200 flex items-center gap-3">
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
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-colors text-sm text-base-content"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <LayoutDashboard size={16} /> Dashboard
                              </Link>
                              <Link
                                to="/profile"
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-colors text-sm text-base-content"
                                onClick={() => setIsUserDropdownOpen(false)}
                              >
                                <User size={16} /> Profile
                              </Link>
                              <hr className="my-1 border-base-200" />
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors text-sm"
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
                  <div className="flex items-center gap-3">
                    {/* Sign In Button - Ghost */}
                    <Link
                      to="/login"
                      className="px-5 py-2 text-base font-medium text-base-content hover:text-primary transition-colors duration-300"
                    >
                      Sign In
                    </Link>

                    {/* Sign Up Button - Solid Primary */}
                    <Link
                      to="/register"
                      className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-base shadow-md hover:bg-primary/90 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      Sign Up
                      <Sparkles size={16} />
                    </Link>

                    {/* Developer Button - Outline */}
                    <button
                      onClick={handleGithubClick}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-semibold"
                    >
                      <GitBranch size={16} />
                      <span>Developer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-300"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 md:h-[72px]"></div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-base-100 shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex justify-between items-center p-5 border-b border-base-200">
              <Logo />
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-base-200 hover:bg-base-300 flex items-center justify-center transition-all duration-300 text-xl">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-xl transition-all duration-300 font-medium">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <Link to="/login" className="flex items-center justify-center w-full py-3 rounded-xl border border-base-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-md" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up <Sparkles size={16} />
                  </Link>
                  <button onClick={handleGithubClick} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-semibold">
                    <GitBranch size={16} /> Developer
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl mb-5">
                    <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=8b5cf6&color=fff`} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40" alt="" />
                    <div>
                      <div className="font-bold text-base-content text-lg">{user?.name}</div>
                      <div className="text-primary text-sm capitalize flex items-center gap-1"><Shield size={12} /> {user?.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500 mb-5">
                    <span className="font-semibold text-white">Available Coins</span>
                    <span className="font-bold text-white text-xl flex items-center gap-1"><Coins size={18} /> {user?.coins?.toLocaleString() || 0}</span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 transition-colors text-sm text-base-content"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-xl transition-all duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}><Home size={18} /> Home</Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-xl transition-all duration-300 font-medium" onClick={() => setIsMobileMenuOpen(false)}><User size={18} /> Profile</Link>

                  </div>
                  <div className="border-t border-base-200 pt-5 mt-5">
                    <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 rounded-xl transition-all duration-300 font-medium">
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-300 font-medium mt-2">
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