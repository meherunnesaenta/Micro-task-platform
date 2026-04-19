import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { taskAPI } from '../../../utils/endpoints';
import { BarChart3, Clock, DollarSign, PlusCircle, Eye, CreditCard, History, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BuyerHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
       
        const response = await taskAPI.getMyTasks(1, 100);
       
        
        const tasksData = response.tasks || response.data?.tasks || [];
        
        let pending = 0;
        let spent = 0;
        
        tasksData.forEach(task => {
          const totalCost = task.required_workers * task.payable_amount;
          spent += totalCost;
          if (task.required_workers > 0) {
            pending++;
          }
        });

       
        setStats({
          totalTasks: tasksData.length,
          pendingTasks: pending,
          totalSpent: spent,
        });
      } catch (error) {
        console.error('Error fetching buyer stats:', error);
        toast.error('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: <Briefcase size={24} />, label: 'Total Tasks Posted', value: stats.totalTasks, color: 'bg-blue-500' },
    { icon: <Clock size={24} />, label: 'Pending Tasks', value: stats.pendingTasks, color: 'bg-yellow-500' },
    { icon: <DollarSign size={24} />, label: 'Total Spent', value: `$${stats.totalSpent}`, color: 'bg-green-500' },
  ];

  const quickActions = [
    { title: 'Create New Task', description: 'Post a new task for workers', path: '/dashboard/buyer/add-task', icon: <PlusCircle size={20} />, color: 'bg-primary' },
    { title: 'Review Submissions', description: 'Review worker submissions', path: '/dashboard/buyer/review', icon: <Eye size={20} />, color: 'bg-primary' },
    { title: 'Purchase Coins', description: 'Buy more coins', path: '/dashboard/buyer/purchase-coin', icon: <CreditCard size={20} />, color: 'bg-primary' },
    { title: 'Payment History', description: 'View your payment history', path: '/dashboard/buyer/payment-history', icon: <History size={20} />, color: 'bg-primary' },
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
          <TrendingUp size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Buyer Dashboard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">
          Welcome back, {user?.name?.split(' ')[0] || 'Buyer'}!
        </h1>
        <p className="text-base-content/60 mt-1">Manage your tasks and track worker submissions efficiently</p>
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
            <h2 className="text-xl font-bold mb-1">Great to see you, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-white/80 text-sm">
              You have posted <strong className="text-white">{stats.totalTasks}</strong> tasks and spent{' '}
              <strong className="text-white">${stats.totalSpent}</strong> so far.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/buyer/add-task" className="px-4 py-2 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors text-sm">
              Create New Task
            </Link>
            <Link to="/dashboard/buyer/review" className="px-4 py-2 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 transition-colors text-sm">
              Review Submissions
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-base-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Buyer')}&background=3b82f6&color=fff&bold=true`} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-base-content">{user?.name}</h3>
              <p className="text-primary text-sm">Buyer</p>
              <p className="text-xs text-base-content/40 mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-300">
            <Link to="/dashboard/buyer/profile" className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={18} className="text-primary" />
              <span className="text-sm font-medium text-base-content/60">Available Coins</span>
            </div>
            <p className="text-2xl font-bold text-base-content">{user?.coins?.toLocaleString() || 0}</p>
            <p className="text-xs text-green-600 mt-1">≈ ${Math.floor((user?.coins || 0) / 10)} USD value</p>
          </div>
          <div className="bg-base-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={18} className="text-primary" />
              <span className="text-sm font-medium text-base-content/60">Pending Reviews</span>
            </div>
            <p className="text-2xl font-bold text-base-content">{stats.pendingTasks}</p>
            <p className="text-xs text-yellow-600 mt-1">Tasks waiting for workers</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-base-content mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default BuyerHome;