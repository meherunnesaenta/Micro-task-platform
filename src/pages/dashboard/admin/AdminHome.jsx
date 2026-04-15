import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/endpoints';
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import '../../styles/admin-dashboard.css';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayment: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats({
          totalWorkers: response.totalWorkers || 0,
          totalBuyers: response.totalBuyers || 0,
          totalCoins: response.totalCoins || 0,
          totalPayment: response.totalPaymentAmount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-home">
      <div className="page-title">
        <h1>Admin Dashboard</h1>
        <p>Platform Overview & Management</p>
      </div>

      <div className="stats-grid admin">
        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Workers</p>
            <h3 className="stat-value">{stats.totalWorkers}</h3>
            <p className="stat-change">Active members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Briefcase size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Buyers</p>
            <h3 className="stat-value">{stats.totalBuyers}</h3>
            <p className="stat-change">Task posters</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <DollarSign size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Coins</p>
            <h3 className="stat-value">{stats.totalCoins.toLocaleString()}</h3>
            <p className="stat-change">In circulation</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Platform Revenue</p>
            <h3 className="stat-value">${stats.totalPayment}</h3>
            <p className="stat-change">Total payment</p>
          </div>
        </div>
      </div>

      <div className="management-section">
        <h2>Management Options</h2>
        <div className="management-grid">
          <a href="/dashboard/admin/users" className="management-card">
            <div className="card-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View, edit, and manage platform users</p>
          </a>

          <a href="/dashboard/admin/tasks" className="management-card">
            <div className="card-icon">📋</div>
            <h3>Manage Tasks</h3>
            <p>Monitor and manage all tasks on the platform</p>
          </a>

          <a href="/dashboard/admin/withdrawals" className="management-card">
            <div className="card-icon">💰</div>
            <h3>Withdrawal Requests</h3>
            <p>Approve or reject worker withdrawals</p>
          </a>

          <a href="/dashboard/admin/reports" className="management-card">
            <div className="card-icon">⚠️</div>
            <h3>Handle Reports</h3>
            <p>Review and handle user reports</p>
          </a>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-badge new">NEW</span>
            <p>New user registered</p>
            <time>2 hours ago</time>
          </div>
          <div className="activity-item">
            <span className="activity-badge pending">PENDING</span>
            <p>5 withdrawal requests awaiting approval</p>
            <time>Updated just now</time>
          </div>
          <div className="activity-item">
            <span className="activity-badge completed">COMPLETED</span>
            <p>12 tasks completed this hour</p>
            <time>1 hour ago</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
