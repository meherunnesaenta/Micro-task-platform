import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../../../utils/endpoints';
import { Edit2, Trash2, Eye, Plus, Briefcase, DollarSign, Users, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const BuyerMyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchTasks();
  }, [pagination.currentPage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getMyTasks(pagination.currentPage, 10);
      setTasks(response.tasks || []);
      setPagination({
        currentPage: response.currentPage || parseInt(response.page) || 1,
        totalPages: response.pages || 1,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await taskAPI.deleteTask(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getStatusBadge = (task) => {
    const isActive = task.required_workers > 0;
    const isExpired = new Date(task.completion_date) < new Date();
    
    if (isExpired) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-600">Expired</span>;
    }
    if (isActive) {
      return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-600">Active</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600">Completed</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading tasks...</p>
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
            <Briefcase size={14} className="text-primary" />
            <span className="text-primary font-semibold text-sm">My Tasks</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content">My Tasks</h1>
          <p className="text-base-content/60 mt-1">Manage all your posted tasks</p>
        </div>
        <Link to="/dashboard/buyer/add-task" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
          <Plus size={18} /> Create New Task
        </Link>
      </div>

      {/* Tasks Table */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <Briefcase size={48} className="mx-auto text-base-content/20 mb-3" />
          <h2 className="text-xl font-bold text-base-content mb-2">No tasks posted yet</h2>
          <p className="text-base-content/60 mb-4">Start by creating your first task</p>
          <Link to="/dashboard/buyer/add-task" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            <Plus size={18} /> Create Task
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-base-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Task Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Workers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Deadline</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {tasks.map((task) => {
                    const totalBudget = (task.payable_amount * task.required_workers).toFixed(2);
                    return (
                      <tr key={task._id} className="hover:bg-base-100 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-base-content">{task.task_title}</div>
                          <div className="text-xs text-base-content/40 truncate max-w-[200px]">{task.task_detail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">{task.category || 'General'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-base-content/40" />
                            <span>{task.required_workers}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} className="text-green-500" />
                            <span className="font-semibold">${totalBudget}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(task)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} className="text-base-content/40" />
                            <span className="text-sm">{new Date(task.completion_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link
                              to={`/dashboard/buyer/my-tasks/${task._id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <Link
                              to={`/dashboard/buyer/my-tasks/${task._id}`}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                              title="View"
                            >
                              <Eye size={16} />
                            </Link>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors"
                              onClick={() => handleDelete(task._id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-base-content/60">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BuyerMyTasks;