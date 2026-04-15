import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../../utils/endpoints';
import { Search, Filter, Loader } from 'lucide-react';
import '../../styles/worker-dashboard.css';

const WorkerTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskAPI.getAllTasks(page, 10);
        setTasks(response.tasks || []);
        setTotal(response.total || 0);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]);

  const handleTaskClick = (taskId) => {
    navigate(`/dashboard/worker/tasks/${taskId}`);
  };

  const filteredTasks = tasks.filter((task) =>
    task.task_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="worker-task-list">
      <div className="section-header">
        <h1>Available Tasks</h1>
        <p>Browse and submit tasks to earn coins</p>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={20} />
          Filter
        </button>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="loading-state">
          <Loader className="spinner" size={40} />
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks available at the moment</p>
          <small>Check back later!</small>
        </div>
      ) : (
        <>
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div key={task._id} className="task-card">
                {task.task_image_url && (
                  <img
                    src={task.task_image_url}
                    alt={task.task_title}
                    className="task-image"
                  />
                )}

                <h3 className="task-title">{task.task_title}</h3>
                <p className="task-buyer">by {task.buyer_name}</p>

                <div className="task-meta">
                  <div className="meta-item">
                    <p className="meta-label">Reward</p>
                    <p className="meta-value">${task.payable_amount}</p>
                  </div>
                  <div className="meta-item">
                    <p className="meta-label">Needed</p>
                    <p className="meta-value">{task.required_workers}</p>
                  </div>
                  <div className="meta-item">
                    <p className="meta-label">Deadline</p>
                    <p className="meta-value">
                      {new Date(task.completion_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="task-description">{task.task_detail}</p>

                <button
                  className="view-details-btn"
                  onClick={() => handleTaskClick(task._id)}
                >
                  View & Submit
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={page === p ? 'active' : ''}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
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

export default WorkerTaskList;
