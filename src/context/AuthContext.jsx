import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { token: newToken, user: newUser } = response;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    return response;
  };

  // Login user
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { token: newToken, user: newUser } = response;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    return response;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (data) => {
    const response = await authAPI.updateProfile(data);
    const updatedUser = { ...user, ...response };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return response;
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check user role
  const hasRole = (role) => user?.role === role;

  // Check if user is worker
  const isWorker = user?.role === 'worker';

  // Check if user is buyer
  const isBuyer = user?.role === 'buyer';

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    hasRole,
    isWorker,
    isBuyer,
    isAdmin,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
