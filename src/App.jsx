import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Dashboard Coming Soon</div>
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
