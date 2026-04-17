import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { taskAPI } from '../../../utils/endpoints';
import { BarChart3, Clock, DollarSign } from 'lucide-react';
import '../../../styles/buyer-dashboard.css';
import { Link } from 'react-router-dom';

const BuyerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await taskAPI.getMyTasks(1, 100);
        const tasks = response.tasks || [];
        
        let pending = 0;
        let spent = 0;
        
        tasks.forEach(task => {
          spent += task.required_workers * task.payable_amount;
          if (task.required_workers > 0) {
            pending++;
          }
        });

        setStats({
          totalTasks: tasks.length,
          pendingTasks: pending,
          totalSpent: spent,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="buyer-home">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BarChart3 size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Tasks Posted</p>
            <h3 className="stat-value">{stats.totalTasks}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Tasks</p>
            <h3 className="stat-value">{stats.pendingTasks}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <DollarSign size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Spent</p>
            <h3 className="stat-value">${stats.totalSpent}</h3>
          </div>
        </div>
      </div>

      <div className="welcome-card buyer">
        <h2>Welcome back, {user?.name}!</h2>
        <p>Manage your tasks and track worker submissions efficiently.</p>
        <div className="action-buttons">
          <Link to="/dashboard/buyer/add-task" className="btn btn-primary">
            Create New Task
          </Link>
          <Link to="/dashboard/buyer/review" className="btn btn-secondary">
            Review Submissions
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card-section">
        <div className="profile-card-home">
          <div className="profile-header">
            <img 
              src={user?.photoURL || 'https://via.placeholder.com/60'} 
              alt="Profile" 
              className="profile-avatar"
            />
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p>Buyer</p>
            </div>
          </div>
          <Link to="/dashboard/buyer/profile" className="btn btn-primary btn-sm">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/dashboard/buyer/my-tasks" className="action-card">
            <span className="action-number">{stats.totalTasks}</span>
            <span className="action-label">View My Tasks</span>
          </Link>
          <Link to="/dashboard/buyer/review" className="action-card">
            <span className="action-number">0</span>
            <span className="action-label">Pending Reviews</span>
          </Link>
          <Link to="/dashboard/buyer/purchase-coin" className="action-card">
            <span className="action-icon">🪙</span>
            <span className="action-label">Purchase Coins</span>
          </Link>
          <Link to="/dashboard/buyer/payment-history" className="action-card">
            <span className="action-icon">📊</span>
            <span className="action-label">Payment History</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
