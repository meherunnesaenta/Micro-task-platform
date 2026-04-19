import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/endpoints';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  LineChart
} from 'lucide-react';
import { toast } from 'react-toastify';

const Reports = () => {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalTasks: 0,
    totalSubmissions: 0,
    totalCoins: 0,
    totalPayment: 0,
    platformGrowth: 0,
    weeklyGrowth: 0,
    monthlyActiveUsers: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const fetchReportStats = async () => {
    setLoading(true);
    try {
      console.log('Fetching reports for:', dateRange);
      const response = await adminAPI.getStats(dateRange);
      console.log('Reports stats response:', response);
      
      const data = response?.data || response || {};
      
      setStats({
        totalWorkers: data.totalWorkers || 0,
        totalBuyers: data.totalBuyers || 0,
        totalTasks: data.totalTasks || 0,
        totalSubmissions: data.totalSubmissions || 0,
        totalCoins: data.totalCoins || 0,
        totalPayment: data.totalPaymentAmount || data.totalPayment || 0,
        platformGrowth: data.platformGrowth || 0,
        weeklyGrowth: data.weeklyGrowth || 0,
        monthlyActiveUsers: data.monthlyActiveUsers || 0,
        completionRate: data.completionRate || 0,
      });
    } catch (error) {
      console.error('Error fetching report stats:', error.response?.data || error);
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportStats();
  }, [dateRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReportStats();
    setRefreshing(false);
    toast.success('Reports refreshed');
  };

  const handleExport = () => {
    toast.info('Exporting reports...');
  };

  const reportCards = [
    { title: 'Total Workers', value: stats.totalWorkers.toLocaleString(), icon: Users, color: 'bg-purple-500', trend: `+${stats.weeklyGrowth}%` },
    { title: 'Total Buyers', value: stats.totalBuyers.toLocaleString(), icon: Briefcase, color: 'bg-blue-500', trend: '+1.2%' },
    { title: 'Active Tasks', value: stats.totalTasks.toLocaleString(), icon: Activity, color: 'bg-green-500', trend: '+4.8%' },
    { title: 'Total Submissions', value: stats.totalSubmissions.toLocaleString(), icon: BarChart3, color: 'bg-orange-500', trend: '+3.1%' },
    { title: 'Platform Revenue', value: `$${stats.totalPayment.toLocaleString()}`, icon: DollarSign, color: 'bg-red-500', trend: '+6.3%' },
    { title: 'Platform Growth', value: `${stats.platformGrowth}%`, icon: TrendingUp, color: 'bg-indigo-500', trend: 'This month' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
            <BarChart3 size={14} className="text-primary" />
            <span className="text-primary font-semibold text-sm">Analytics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content">Platform Reports</h1>
          <p className="text-base-content/60 mt-1">Comprehensive platform statistics and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-base-200 hover:bg-base-300 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-base-200 rounded-xl">
        <Calendar size={18} className="text-primary" />
        <span className="text-sm font-medium text-base-content">Date Range:</span>
        <div className="flex flex-wrap gap-2">
          {['week', 'month', 'quarter', 'year', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 capitalize ${
                dateRange === range
                  ? 'bg-primary text-white'
                  : 'bg-base-100 hover:bg-base-300 text-base-content/70'
              }`}
            >
              {range === 'all' ? 'All Time' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : range === 'quarter' ? 'This Quarter' : 'This Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-base-content/60">Loading reports...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reportCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-base-200 rounded-xl p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-base-content/60 mb-1">{card.title}</p>
                      <p className="text-2xl font-bold text-base-content">{card.value}</p>
                      <p className="text-xs text-green-600 mt-1">{card.trend} from last period</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center shadow-md`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Reports Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution */}
            <div className="bg-base-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                <PieChart size={18} className="text-primary" />
                User Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Workers ({stats.totalWorkers.toLocaleString()})</span>
                    <span>
                      {stats.totalWorkers + stats.totalBuyers > 0
                        ? ((stats.totalWorkers / (stats.totalWorkers + stats.totalBuyers)) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(stats.totalWorkers / (stats.totalWorkers + stats.totalBuyers || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Buyers ({stats.totalBuyers.toLocaleString()})</span>
                    <span>
                      {stats.totalWorkers + stats.totalBuyers > 0
                        ? ((stats.totalBuyers / (stats.totalWorkers + stats.totalBuyers)) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(stats.totalBuyers / (stats.totalWorkers + stats.totalBuyers || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-base-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                <LineChart size={18} className="text-primary" />
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-base-100 rounded-lg">
                  <p className="text-xs text-base-content/50">Avg Task Budget</p>
                  <p className="text-lg font-bold text-base-content">
                    ${stats.totalTasks > 0 ? (stats.totalPayment / stats.totalTasks).toFixed(2) : 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-base-100 rounded-lg">
                  <p className="text-xs text-base-content/50">Completion Rate</p>
                  <p className="text-lg font-bold text-green-600">
                    {stats.completionRate}%
                  </p>
                </div>
                <div className="text-center p-3 bg-base-100 rounded-lg">
                  <p className="text-xs text-base-content/50">Total Coins</p>
                  <p className="text-lg font-bold text-primary">
                    {stats.totalCoins.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-base-100 rounded-lg">
                  <p className="text-xs text-base-content/50">Monthly Active</p>
                  <p className="text-lg font-bold text-base-content">
                    {stats.monthlyActiveUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Summary */}
          <div className="bg-base-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-base-content mb-4">Platform Summary</h3>
            <div className="space-y-3 text-base-content/70 text-sm">
              <p>
                Your platform has <strong className="text-primary">{stats.totalWorkers.toLocaleString()}</strong> active workers and{' '}
                <strong className="text-primary">{stats.totalBuyers.toLocaleString()}</strong> buyers. There are currently{' '}
                <strong className="text-primary">{stats.totalTasks.toLocaleString()}</strong> active tasks with{' '}
                <strong className="text-primary">{stats.totalSubmissions.toLocaleString()}</strong> total submissions.
              </p>
              <p>
                The platform has generated <strong className="text-green-600">${stats.totalPayment.toLocaleString()}</strong> in revenue and distributed{' '}
                <strong className="text-primary">{stats.totalCoins.toLocaleString()}</strong> coins to workers.
              </p>
              <p className="pt-2 border-t border-base-300">
                Platform growth this month: <strong className="text-green-600">{stats.platformGrowth}%</strong> ↑
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;