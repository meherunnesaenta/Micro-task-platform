import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { taskAPI, submissionAPI } from '../../../utils/endpoints';
import { AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
          pendingSubmissions: 0,
          totalEarnings: response.totalEarnings || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: <Clock size={24} />, label: 'Total Submissions', value: stats.totalSubmissions, color: 'bg-blue-500' },
    { icon: <CheckCircle size={24} />, label: 'Pending Submissions', value: stats.pendingSubmissions, color: 'bg-yellow-500' },
    { icon: <DollarSign size={24} />, label: 'Total Earnings', value: `$${stats.totalEarnings}`, color: 'bg-green-500' },
  ];

  const quickActions = [
    { title: 'Browse Tasks', description: 'Find new tasks to complete', path: '/dashboard/worker/tasks', icon: <Briefcase size={20} />, color: 'bg-primary' },
    { title: 'My Submissions', description: 'View your task submissions', path: '/dashboard/worker/submissions', icon: <CheckCircle size={20} />, color: 'bg-primary' },
    { title: 'Withdraw Earnings', description: 'Withdraw your earned coins', path: '/dashboard/worker/withdrawals', icon: <DollarSign size={20} />, color: 'bg-primary' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Award size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Worker Dashboard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">
          Welcome back, {user?.name?.split(' ')[0] || 'Worker'}!
        </h1>
        <p className="text-base-content/60 mt-1">Track your earnings and task progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-base-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/60 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-base-content">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-md`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Great job, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-white/80 text-sm">
              You have completed <strong className="text-white">{stats.totalSubmissions}</strong> tasks and earned{' '}
              <strong className="text-white">${stats.totalEarnings}</strong> so far.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/worker/tasks" className="px-4 py-2 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors text-sm">
              Browse Tasks
            </Link>
            <Link to="/dashboard/worker/submissions" className="px-4 py-2 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-colors text-sm">
              View Submissions
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-base-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Worker')}&background=3b82f6&color=fff&bold=true`} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-base-content">{user?.name}</h3>
              <p className="text-primary text-sm">Worker</p>
              <p className="text-xs text-base-content/40 mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-300">
            <Link to="/dashboard/worker/profile" className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Award size={18} className="text-primary" />
              <span className="text-sm font-medium text-base-content/60">Available Coins</span>
            </div>
            <p className="text-2xl font-bold text-base-content">{user?.coins?.toLocaleString() || 0}</p>
            <p className="text-xs text-green-600 mt-1">≈ ${Math.floor((user?.coins || 0) / 20)} USD</p>
          </div>
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={18} className="text-primary" />
              <span className="text-sm font-medium text-base-content/60">Member Since</span>
            </div>
            <p className="text-lg font-bold text-base-content">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024'}
            </p>
            <p className="text-xs text-green-600 mt-1">Active Member</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-base-content mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-base-200 rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                <div className="text-white">{action.icon}</div>
              </div>
              <h3 className="font-semibold text-base-content mb-1">{action.title}</h3>
              <p className="text-xs text-base-content/50">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;