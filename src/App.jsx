import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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
import WorkerTaskList from './pages/dashboard/worker/WorkerTaskList';
import WorkerTaskDetails from './pages/dashboard/worker/WorkerTaskDetails';
import WorkerSubmissions from './pages/dashboard/worker/WorkerSubmissions';
import WorkerWithdrawals from './pages/dashboard/worker/WorkerWithdrawals';

// Buyer Pages
import BuyerHome from './pages/dashboard/buyer/BuyerHome';

// Admin Pages
import AdminHome from './pages/dashboard/admin/AdminHome';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import ManageTasks from './pages/dashboard/admin/ManageTasks';
import ManageWithdrawals from './pages/dashboard/admin/ManageWithdrawals';
import Reports from './pages/dashboard/admin/Reports';

import './App.css'

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

function App() {
  // Worker sidebar items
  const workerSidebarItems = [
    { path: '/dashboard/worker/home', label: 'Home', icon: '🏠' },
    { path: '/dashboard/worker/tasks', label: 'Available Tasks', icon: '📋' },
    { path: '/dashboard/worker/submissions', label: 'My Submissions', icon: '✅' },
    { path: '/dashboard/worker/withdrawals', label: 'Withdrawals', icon: '💰' },
  ];

  // Buyer sidebar items
  const buyerSidebarItems = [
    { path: '/dashboard/buyer/home', label: 'Home', icon: '🏠' },
    { path: '/dashboard/buyer/add-task', label: 'Add New Task', icon: '➕' },
    { path: '/dashboard/buyer/my-tasks', label: 'My Tasks', icon: '📋' },
    { path: '/dashboard/buyer/review', label: 'Review Submissions', icon: '👀' },
    { path: '/dashboard/buyer/purchase-coin', label: 'Purchase Coin', icon: '🪙' },
    { path: '/dashboard/buyer/payment-history', label: 'Payment History', icon: '📊' },
  ];

  // Admin sidebar items
  const adminSidebarItems = [
    { path: '/dashboard/admin/home', label: 'Home', icon: '🏠' },
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/dashboard/admin/tasks', label: 'Manage Tasks', icon: '📋' },
    { path: '/dashboard/admin/withdrawals', label: 'Withdrawals', icon: '💰' },
    { path: '/dashboard/admin/reports', label: 'Reports', icon: '⚠️' },
  ];

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

            {/* Worker Dashboard Routes */}
            <Route
              path="/dashboard/worker/*"
              element={
                <ProtectedRoute requiredRole="worker">
                  <DashboardLayout sidebarItems={workerSidebarItems}>
                    <Routes>
                      <Route path="/home" element={<WorkerHome />} />
                      <Route path="/tasks" element={<WorkerTaskList />} />
                      <Route path="/tasks/:taskId" element={<WorkerTaskDetails />} />
                      <Route path="/submissions" element={<WorkerSubmissions />} />
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
                      <Route path="/add-task" element={<div>Add Task Page</div>} />
                      <Route path="/my-tasks" element={<div>My Tasks Page</div>} />
                      <Route path="/review" element={<div>Review Submissions Page</div>} />
                      <Route path="/purchase-coin" element={<div>Purchase Coin Page</div>} />
                      <Route path="/payment-history" element={<div>Payment History Page</div>} />
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
