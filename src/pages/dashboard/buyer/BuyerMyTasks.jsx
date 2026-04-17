import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../../../utils/endpoints';
import { Edit2, Trash2, Eye, Plus } from 'lucide-react';
import '../../../styles/buyer-dashboard.css';
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
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

// Status color logic moved to inline (no backend status field needed)

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="buyer-my-tasks">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Manage all your posted tasks</p>
        </div>
        <Link to="/dashboard/buyer/add-task" className="btn btn-primary">
          <Plus size={20} /> Create New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks posted yet</h2>
          <p>Start by creating your first task</p>
          <Link to="/dashboard/buyer/add-task" className="btn btn-primary">
            Create Task
          </Link>
        </div>
      ) : (
        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Category</th>
                <th>Workers</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Submissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
{tasks.map((task) => {
                  const totalBudget = (task.payable_amount * task.required_workers).toFixed(2);
                  const status = task.required_workers > 0 ? 'active' : 'completed';
                  return (
                    <tr key={task._id}>
                      <td className="task-title-cell">{task.task_title}</td>
                      <td>{task.task_detail?.slice(0, 50)}...</td>
                      <td>{task.required_workers}</td>
                      <td>${totalBudget}</td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Link to="/dashboard/buyer/review" className="submission-link">
                          Review
                        </Link>
                      </td>
                      <td className="action-buttons">
                        <Link
                          to={`/dashboard/buyer/my-tasks/${task._id}/edit`}
                          className="action-btn edit"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <Link
                          to={`/dashboard/buyer/my-tasks/${task._id}`}
                          className="action-btn view"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(task._id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {tasks.length > 0 && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPagination(p => ({ ...p, currentPage: Math.max(1, p.currentPage - 1) }))}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <span>{pagination.currentPage} of {pagination.totalPages}</span>
          <button
            onClick={() => setPagination(p => ({ ...p, currentPage: Math.min(p.totalPages, p.currentPage + 1) }))}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerMyTasks;
