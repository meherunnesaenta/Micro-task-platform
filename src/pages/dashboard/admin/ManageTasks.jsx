import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../../utils/endpoints';
import { Trash2, Search, Filter, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../styles/admin-dashboard.css';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

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
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await adminAPI.deleteTaskAsAdmin(taskId);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="manage-container">
      <div className="page-title">
        <h1>Manage Tasks</h1>
        <p>Monitor and manage all platform tasks</p>
      </div>

      <div className="management-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="stats-box">
          <span>Total Tasks: {totalTasks}</span>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="no-data">No tasks found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Submissions</th>
                <th>Posted By</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  <td className="title-cell">{task.title}</td>
                  <td>{task.category || 'General'}</td>
                  <td className="budget-cell">${task.budget}</td>
                  <td className="submissions-cell">
                    {task.submissionCount || 0}
                  </td>
                  <td>{task.buyerName || 'Unknown'}</td>
                  <td>
                    <span className={`status-badge ${task.status}`}>
                      {task.status || 'Active'}
                    </span>
                  </td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedTask(task)}
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content task-modal">
            <h3>{selectedTask.title}</h3>
            <div className="modal-body">
              <p>
                <strong>Description:</strong> {selectedTask.description}
              </p>
              <p>
                <strong>Category:</strong> {selectedTask.category || 'General'}
              </p>
              <p>
                <strong>Budget:</strong> ${selectedTask.budget}
              </p>
              <p>
                <strong>Status:</strong> {selectedTask.status || 'Active'}
              </p>
              <p>
                <strong>Posted By:</strong> {selectedTask.buyerName || 'Unknown'}
              </p>
              <p>
                <strong>Submissions:</strong> {selectedTask.submissionCount || 0}
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(selectedTask.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setSelectedTask(null)}
              >
                Close
              </button>
              <button
                className="btn-delete"
                onClick={() => {
                  handleDeleteTask(selectedTask._id);
                  setSelectedTask(null);
                }}
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="btn-pagination"
        >
          Previous
        </button>
        <span className="page-info">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="btn-pagination"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageTasks;
