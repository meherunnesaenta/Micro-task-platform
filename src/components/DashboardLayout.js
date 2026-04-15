import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const getNavItems = () => {
    switch(user?.role) {
      case 'worker':
        return [
          { path: '/dashboard', label: 'Home' },
          { path: '/dashboard/task-list', label: 'Task List' },
          { path: '/dashboard/my-submissions', label: 'My Submissions' },
          { path: '/dashboard/withdrawals', label: 'Withdrawals' }
        ];
      case 'buyer':
        return [
          { path: '/dashboard', label: 'Home' },
          { path: '/dashboard/add-task', label: 'Add New Task' },
          { path: '/dashboard/my-tasks', label: 'My Tasks' },
          { path: '/dashboard/purchase-coins', label: 'Purchase Coins' },
          { path: '/dashboard/payment-history', label: 'Payment History' }
        ];
      case 'admin':
        return [
          { path: '/dashboard', label: 'Home' },
          { path: '/dashboard/manage-users', label: 'Manage Users' },
          { path: '/dashboard/manage-tasks', label: 'Manage Tasks' },
          { path: '/dashboard/withdraw-requests', label: 'Withdraw Requests' }
        ];
      default:
        return [];
    }
  };
  
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <h2>TaskEarn</h2>
        </div>
        <div className="user-info">
          <img src={user?.photoURL || '/default-avatar.png'} alt="avatar" />
          <div>
            <p>{user?.name}</p>
            <small>{user?.role}</small>
          </div>
          <div className="coins">💰 {user?.coins} coins</div>
        </div>
        <nav>
          {getNavItems().map(item => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="logout-btn">Logout</button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;