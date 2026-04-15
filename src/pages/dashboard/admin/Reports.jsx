import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/endpoints';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Activity,
} from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../styles/admin-dashboard.css';

const Reports = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalTasks: 0,
    totalSubmissions: 0,
    totalCoins: 0,
    totalPayment: 0,
    platformGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchReportStats();
  }, [dateRange]);

  const fetchReportStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStats();
      setStats({
        totalWorkers: response.totalWorkers || 0,
        totalBuyers: response.totalBuyers || 0,
        totalTasks: response.totalTasks || 0,
        totalSubmissions: response.totalSubmissions || 0,
        totalCoins: response.totalCoins || 0,
        totalPayment: response.totalPaymentAmount || 0,
        platformGrowth: response.platformGrowth || 5.2,
      });
    } catch (error) {
      console.error('Error fetching report stats:', error);
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: Users,
      color: 'purple',
      trend: '+2.5%',
    },
    {
      title: 'Total Buyers',
      value: stats.totalBuyers,
      icon: Briefcase,
      color: 'blue',
      trend: '+1.2%',
    },
    {
      title: 'Active Tasks',
      value: stats.totalTasks,
      icon: Activity,
      color: 'green',
      trend: '+4.8%',
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: BarChart3,
      color: 'orange',
      trend: '+3.1%',
    },
    {
      title: 'Platform Revenue',
      value: `$${stats.totalPayment}`,
      icon: DollarSign,
      color: 'red',
      trend: '+6.3%',
    },
    {
      title: 'Platform Growth',
      value: `${stats.platformGrowth}%`,
      icon: TrendingUp,
      color: 'indigo',
      trend: 'This month',
    },
  ];

  return (
    <div className="reports-container">
      <div className="page-title">
        <h1>Platform Reports & Analytics</h1>
        <p>Comprehensive platform statistics and performance metrics</p>
      </div>

      <div className="reports-controls">
        <div className="date-range-selector">
          <label>Select Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="range-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <>
          <div className="reports-grid">
            {reportCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className={`report-card ${card.color}`}>
                  <div className="card-header">
                    <Icon size={32} className="card-icon" />
                    <span className="trend-badge">{card.trend}</span>
                  </div>
                  <div className="card-body">
                    <p className="card-title">{card.title}</p>
                    <h2 className="card-value">{card.value}</h2>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="reports-sections">
            {/* User Distribution */}
            <div className="report-section">
              <h3>User Distribution</h3>
              <div className="distribution-chart">
                <div className="chart-item">
                  <div className="chart-bar">
                    <div
                      className="bar-fill workers"
                      style={{
                        width: `${(stats.totalWorkers / (stats.totalWorkers + stats.totalBuyers)) * 100}%`,
                      }}
                    />
                  </div>
                  <p>
                    Workers: {stats.totalWorkers} (
                    {(
                      (stats.totalWorkers /
                        (stats.totalWorkers + stats.totalBuyers)) *
                      100
                    ).toFixed(1)}
                    %)
                  </p>
                </div>
                <div className="chart-item">
                  <div className="chart-bar">
                    <div
                      className="bar-fill buyers"
                      style={{
                        width: `${(stats.totalBuyers / (stats.totalWorkers + stats.totalBuyers)) * 100}%`,
                      }}
                    />
                  </div>
                  <p>
                    Buyers: {stats.totalBuyers} (
                    {(
                      (stats.totalBuyers /
                        (stats.totalWorkers + stats.totalBuyers)) *
                      100
                    ).toFixed(1)}
                    %)
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="report-section">
              <h3>Key Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Avg Task Budget</span>
                  <span className="metric-value">
                    ${stats.totalTasks > 0 ? (stats.totalPayment / stats.totalTasks).toFixed(2) : 0}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Submission Rate</span>
                  <span className="metric-value">
                    {stats.totalTasks > 0
                      ? (
                        (stats.totalSubmissions / stats.totalTasks) *
                        100
                      ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Total Coins Distributed</span>
                  <span className="metric-value">
                    {stats.totalCoins.toLocaleString()}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Platform Revenue</span>
                  <span className="metric-value">
                    ${stats.totalPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="report-section">
              <h3>Platform Summary</h3>
              <div className="summary-text">
                <p>
                  Your platform has {stats.totalWorkers} active workers and{' '}
                  {stats.totalBuyers} buyers. There are currently{' '}
                  {stats.totalTasks} active tasks with{' '}
                  {stats.totalSubmissions} total submissions. The platform has
                  generated ${stats.totalPayment} in revenue and distributed{' '}
                  {stats.totalCoins.toLocaleString()} coins to workers.
                </p>
                <p>
                  Platform growth this month: <strong>{stats.platformGrowth}%</strong>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
