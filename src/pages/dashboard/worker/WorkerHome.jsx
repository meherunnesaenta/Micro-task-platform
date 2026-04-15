import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submissionAPI } from '../../utils/endpoints';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import '../../styles/worker-dashboard.css';

const WorkerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await submissionAPI.getApprovedSubmissions();
        const earnings = response.approvedSubmissions || [];
        
        setStats({
          totalSubmissions: earnings.length,
          pendingSubmissions: 0, // Would be fetched from actual API
          totalEarnings: response.totalEarnings || 0,
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
    <div className="worker-home">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Submissions</p>
            <h3 className="stat-value">{stats.totalSubmissions}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <CheckCircle size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Submissions</p>
            <h3 className="stat-value">{stats.pendingSubmissions}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earning">
            <AlertCircle size={32} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Earnings</p>
            <h3 className="stat-value">${stats.totalEarnings}</h3>
          </div>
        </div>
      </div>

      <div className="welcome-card">
        <h2>Welcome, {user?.name}!</h2>
        <p>You have completed {stats.totalSubmissions} tasks and earned ${stats.totalEarnings} so far.</p>
        <div className="action-buttons">
          <a href="/dashboard/worker/tasks" className="btn btn-primary">
            Browse Tasks
          </a>
          <a href="/dashboard/worker/submiss ions" className="btn btn-secondary">
            View Submissions
          </a>
        </div>
      </div>

      <div className="info-section">
        <h3>Quick Stats</h3>
        <div className="info-grid">
          <div className="info-item">
            <p>Current Coins: <strong>{user?.coins || 0}</strong></p>
          </div>
          <div className="info-item">
            <p>Account Status: <strong>Active</strong></p>
          </div>
          <div className="info-item">
            <p>Member Since: <strong>{new Date(user?.createdAt).toLocaleDateString()}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
