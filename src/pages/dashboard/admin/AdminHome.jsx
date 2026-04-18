import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { adminAPI } from '../../../utils/endpoints';
import { Users, Briefcase, DollarSign, TrendingUp, Shield, Activity, Clock, UserCheck, UserX, PlusCircle, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminHome = () => {
  const { user } = useAuth();
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
        toast.error('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: <Users size={24} />, label: 'Total Workers', value: stats.totalWorkers.toLocaleString(), change: '+12%', color: 'bg-purple-500', bg: 'purple' },
    { icon: <Briefcase size={24} />, label: 'Total Buyers', value: stats.totalBuyers.toLocaleString(), change: '+8%', color: 'bg-blue-500', bg: 'blue' },
    { icon: <DollarSign size={24} />, label: 'Total Coins', value: stats.totalCoins.toLocaleString(), change: '+15%', color: 'bg-orange-500', bg: 'orange' },
    { icon: <TrendingUp size={24} />, label: 'Platform Revenue', value: `$${stats.totalPayment.toLocaleString()}`, change: '+22%', color: 'bg-green-500', bg: 'green' },
  ];

  const managementOptions = [
    { icon: <Users size={20} />, title: 'Manage Users', description: 'View, edit, and manage platform users', path: '/dashboard/admin/users', color: 'bg-purple-500' },
    { icon: <Briefcase size={20} />, title: 'Manage Tasks', description: 'Monitor and manage all tasks', path: '/dashboard/admin/tasks', color: 'bg-blue-500' },
    { icon: <DollarSign size={20} />, title: 'Withdrawal Requests', description: 'Approve or reject withdrawals', path: '/dashboard/admin/withdrawals', color: 'bg-orange-500' },
    { icon: <Activity size={20} />, title: 'Handle Reports', description: 'Review and handle user reports', path: '/dashboard/admin/reports', color: 'bg-red-500' },
  ];

  const recentActivities = [
    { id: 1, type: 'new', message: 'New user registered - Sarah Johnson', time: '2 hours ago', badge: 'NEW', badgeColor: 'bg-green-500' },
    { id: 2, type: 'pending', message: '5 withdrawal requests awaiting approval', time: 'Updated just now', badge: 'PENDING', badgeColor: 'bg-yellow-500' },
    { id: 3, type: 'completed', message: '12 tasks completed this hour', time: '1 hour ago', badge: 'COMPLETED', badgeColor: 'bg-blue-500' },
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
      {/* Page Title */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Shield size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Admin Portal</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">
          Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
        </h1>
        <p className="text-base-content/60 mt-1">Platform Overview & Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-base-200 rounded-xl p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/60 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-base-content">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shadow-md`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-base-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=3b82f6&color=fff&bold=true`} 
              alt="Profile" 
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-base-content">{user?.name || 'Admin User'}</h3>
              <p className="text-primary text-sm flex items-center gap-1">
                <Shield size={12} /> Administrator
              </p>
              <p className="text-xs text-base-content/40 mt-0.5">{user?.email || 'admin@microtask.com'}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-300">
            <Link to="/dashboard/admin/profile" className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <Settings size={14} />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity size={18} className="text-primary" />
              <span className="text-sm font-medium text-base-content/60">Active Sessions</span>
            </div>
            <p className="text-2xl font-bold text-base-content">1,234</p>
            <p className="text-xs text-green-600 mt-1">+23 today</p>
          </div>
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={18} className="text-primary" />
              <span className="text-sm font-medium text-base-content/60">Pending Reviews</span>
            </div>
            <p className="text-2xl font-bold text-base-content">42</p>
            <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
          </div>
        </div>
      </div>

      {/* Management Options */}
      <div>
        <h2 className="text-xl font-bold text-base-content mb-4">Management Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {managementOptions.map((option, index) => (
            <Link 
              key={index}
              to={option.path}
              className="group bg-base-200 rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl ${option.color} flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110`}>
                <div className="text-white">{option.icon}</div>
              </div>
              <h3 className="font-semibold text-base-content mb-1">{option.title}</h3>
              <p className="text-xs text-base-content/50">{option.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-base-content mb-4">Recent Activity</h2>
        <div className="bg-base-200 rounded-xl overflow-hidden">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border-b border-base-300 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.badgeColor}`}></div>
                <div>
                  <p className="text-sm text-base-content">{activity.message}</p>
                  <p className="text-xs text-base-content/40 mt-0.5">{activity.time}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${activity.badgeColor} bg-opacity-20 text-${activity.badgeColor.replace('bg-', '')}`}>
                {activity.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;