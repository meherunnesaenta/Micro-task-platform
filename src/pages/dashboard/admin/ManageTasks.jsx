import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/endpoints';
import { Trash2, Search, Filter, Eye, X, AlertCircle, Calendar, User, DollarSign, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [page, limit]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllTasks(page, limit);
      setTasks(response.tasks || []);
      setTotalTasks(response.total || 0);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await adminAPI.deleteTaskAsAdmin(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
        setSelectedTask(null);
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-500/20 text-green-600' },
      pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600' },
      completed: { label: 'Completed', className: 'bg-blue-500/20 text-blue-600' },
      expired: { label: 'Expired', className: 'bg-gray-500/20 text-gray-600' },
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>{config.label}</span>;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.task_title || task.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.buyerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Briefcase size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Task Management</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Manage Tasks</h1>
        <p className="text-base-content/60 mt-1">Monitor and manage all platform tasks</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search by title, description or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
          <div className="px-4 py-2.5 rounded-lg bg-primary/10 flex items-center gap-2">
            <span className="text-sm font-medium text-primary">Total: {totalTasks}</span>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-base-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-base-content/20 mb-3" />
            <p className="text-base-content/50">No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-base-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Submissions</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Posted By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-base-100 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-base-content">{task.task_title || task.title}</div>
                      <div className="text-xs text-base-content/40 truncate max-w-[200px]">{task.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">{task.category || 'General'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-600" />
                        <span className="font-semibold">{task.budget}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{task.submissionCount || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-base-content/40" />
                        <span className="text-sm">{task.buyerName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-base-content/40" />
                        <span className="text-sm">{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          onClick={() => setSelectedTask(task)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                          onClick={() => handleDeleteTask(task._id)}
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-base-content/60">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-base-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-base-300">
              <h3 className="text-xl font-bold text-base-content">{selectedTask.task_title || selectedTask.title}</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 rounded-lg hover:bg-base-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-base-content/50 uppercase tracking-wide">Description</label>
                <p className="mt-1 text-base-content">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Category</label>
                  <p className="mt-1 font-medium">{selectedTask.category || 'General'}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Budget</label>
                  <p className="mt-1 font-medium text-green-600">${selectedTask.budget}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Required Workers</label>
                  <p className="mt-1 font-medium">{selectedTask.required_workers || 0}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Payable Amount</label>
                  <p className="mt-1 font-medium">${selectedTask.payable_amount || selectedTask.budget / (selectedTask.required_workers || 1)}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Posted By</label>
                  <p className="mt-1 font-medium">{selectedTask.buyerName || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Submissions</label>
                  <p className="mt-1 font-medium">{selectedTask.submissionCount || 0}</p>
                </div>
                <div>
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Created</label>
                  <p className="mt-1 font-medium">{new Date(selectedTask.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-base-300">
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-300 transition-colors"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  handleDeleteTask(selectedTask._id);
                  setSelectedTask(null);
                }}
              >
                <Trash2 size={16} /> Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;