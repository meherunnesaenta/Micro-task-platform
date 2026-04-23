import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Worker Pages
import WorkerHome from './pages/dashboard/worker/WorkerHome';
import WorkerProfile from './pages/dashboard/worker/WorkerProfile';
import WorkerTaskList from './pages/dashboard/worker/WorkerTaskList';
import WorkerTaskDetails from './pages/dashboard/worker/WorkerTaskDetails';
import WorkerSubmissions from './pages/dashboard/worker/WorkerSubmissions';
import WorkerSubmissionDetails from './pages/dashboard/worker/WorkerSubmissionDetails';
import WorkerWithdrawals from './pages/dashboard/worker/WorkerWithdrawals';

// Buyer Pages
import BuyerHome from './pages/dashboard/buyer/BuyerHome';
import BuyerAddTask from './pages/dashboard/buyer/BuyerAddTask';
import BuyerMyTasks from './pages/dashboard/buyer/BuyerMyTasks';
import BuyerReviewSubmissions from './pages/dashboard/buyer/BuyerReviewSubmissions';
import BuyerPurchaseCoin from './pages/dashboard/buyer/BuyerPurchaseCoin';
import BuyerPaymentHistory from './pages/dashboard/buyer/BuyerPaymentHistory';
import BuyerProfile from './pages/dashboard/buyer/BuyerProfile';

// Admin Pages
import AdminHome from './pages/dashboard/admin/AdminHome';
import AdminProfile from './pages/dashboard/admin/AdminProfile';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import ManageTasks from './pages/dashboard/admin/ManageTasks';
import ManageWithdrawals from './pages/dashboard/admin/ManageWithdrawals';
import Reports from './pages/dashboard/admin/Reports';

// 404 Page
import NotFound from './pages/NotFound';

import './App.css'

// React Icons
import {
  FaHome,
  FaClipboardList,
  FaCheckCircle,
  FaMoneyBillWave,
  FaUser,
  FaArrowLeft,
  FaPlusCircle,
  FaEye,
  FaCoins,
  FaChartLine,
  FaUsers,
  FaExclamationTriangle
} from 'react-icons/fa';

// Component to handle role-based dashboard redirect
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard/admin/home" />;
  } else if (user?.role === 'buyer') {
    return <Navigate to="/dashboard/buyer/home" />;
  } else if (user?.role === 'worker') {
    return <Navigate to="/dashboard/worker/home" />;
  }

  return <Navigate to="/" />;
};

// Component to conditionally render Navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  // Hide navbar on dashboard routes
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }
  return <Navbar />;
};

function App() {
  // Worker sidebar items
  // App.js - এভাবে আইকনগুলো প্রি-রেন্ডার করুন
  const workerSidebarItems = [
    { path: '/dashboard/worker/home', label: 'Home', icon: <FaHome /> },
    { path: '/dashboard/worker/tasks', label: 'Available Tasks', icon: <FaClipboardList /> },
    { path: '/dashboard/worker/submissions', label: 'My Submissions', icon: <FaCheckCircle /> },
    { path: '/dashboard/worker/withdrawals', label: 'Withdrawals', icon: <FaMoneyBillWave /> },
    { path: '/dashboard/worker/profile', label: 'Profile Settings', icon: <FaUser /> },
    { path: '/', label: 'go back', icon: <FaArrowLeft /> },
  ];

  // Buyer sidebar items
  const buyerSidebarItems = [
    { path: '/dashboard/buyer/home', label: 'Home', icon: <FaHome /> },
    { path: '/dashboard/buyer/add-task', label: 'Add New Task', icon: <FaPlusCircle /> },
    { path: '/dashboard/buyer/my-tasks', label: 'My Tasks', icon: <FaClipboardList /> },
    { path: '/dashboard/buyer/review', label: 'Review Submissions', icon: <FaEye /> },
    { path: '/dashboard/buyer/purchase-coin', label: 'Purchase Coin', icon: <FaCoins /> },
    { path: '/dashboard/buyer/payment-history', label: 'Payment History', icon: <FaChartLine /> },
    { path: '/dashboard/buyer/profile', label: 'Profile Settings', icon: <FaUser /> },
    { path: '/', label: 'go back', icon: <FaArrowLeft /> },
  ];

  // Admin sidebar items
  const adminSidebarItems = [
    { path: '/dashboard/admin/home', label: 'Home', icon: <FaHome /> },
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: <FaUsers /> },
    { path: '/dashboard/admin/tasks', label: 'Manage Tasks', icon: <FaClipboardList /> },
    { path: '/dashboard/admin/withdrawals', label: 'Withdrawals', icon: <FaMoneyBillWave /> },
    { path: '/dashboard/admin/reports', label: 'Reports', icon: <FaExclamationTriangle /> },
    { path: '/dashboard/admin/profile', label: 'Profile Settings', icon: <FaUser /> },
    { path: '/', label: 'go back', icon: <FaArrowLeft /> },
  ];

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <div className="app">
            <ConditionalNavbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Worker Dashboard Routes */}
              <Route
                path="/dashboard/worker/*"
                element={
                  <ProtectedRoute requiredRole="worker">
                    <DashboardLayout sidebarItems={workerSidebarItems}>
                      <Routes>
                        <Route path="/home" element={<WorkerHome />} />
                        <Route path="/profile" element={<WorkerProfile />} />
                        <Route path="/tasks" element={<WorkerTaskList />} />
                        <Route path="/tasks/:taskId" element={<WorkerTaskDetails />} />
                        <Route path="/submissions" element={<WorkerSubmissions />} />
                        <Route path="/submissions/:id" element={<WorkerSubmissionDetails />} />
                        <Route path="/withdrawals" element={<WorkerWithdrawals />} />
                        <Route path="/" element={<Navigate to="home" />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Buyer Dashboard Routes */}
              <Route
                path="/dashboard/buyer/*"
                element={
                  <ProtectedRoute requiredRole="buyer">
                    <DashboardLayout sidebarItems={buyerSidebarItems}>
                      <Routes>
                        <Route path="/home" element={<BuyerHome />} />
                        <Route path="/add-task" element={<BuyerAddTask />} />
                        <Route path="/my-tasks" element={<BuyerMyTasks />} />
                        <Route path="/review" element={<BuyerReviewSubmissions />} />
                        <Route path="/purchase-coin" element={<BuyerPurchaseCoin />} />
                        <Route path="/payment-history" element={<BuyerPaymentHistory />} />
                        <Route path="/profile" element={<BuyerProfile />} />
                        <Route path="/" element={<Navigate to="home" />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Dashboard Routes */}
              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout sidebarItems={adminSidebarItems}>
                      <Routes>
                        <Route path="/home" element={<AdminHome />} />
                        <Route path="/profile" element={<AdminProfile />} />
                        <Route path="/users" element={<ManageUsers />} />
                        <Route path="/tasks" element={<ManageTasks />} />
                        <Route path="/withdrawals" element={<ManageWithdrawals />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/" element={<Navigate to="home" />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Dashboard redirect based on role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;