import React, { useEffect, useState } from 'react';
import { submissionAPI } from '../../../utils/endpoints';
import { useAuth } from '../../../context/AuthContext';
import { Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import '../../../styles/submissions.css';

  const WorkerSubmissions = () => {
  const { refreshUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await submissionAPI.getMySubmissions(page, 10);
        setSubmissions(response.submissions || []);
        setTotal(response.total || 0);
        // Refresh user on load to get latest coins
        refreshUser();
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [page]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      case 'approved':
        return <CheckCircle size={20} className="status-icon approved" />;
      case 'rejected':
        return <XCircle size={20} className="status-icon rejected" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="submissions-page">
      <div className="page-header">
        <h1>My Submissions</h1>
        <p>Track the status of your task submissions</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader className="spinner" size={40} />
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet</p>
          <small>Complete a task and submit it to see your submissions here</small>
        </div>
      ) : (
        <>
          <div className="submissions-table-container">
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Submitted Date</th>
                  <th>Reward</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td className="task-title-cell">{submission.task_title}</td>
                    <td>
                      {new Date(submission.submitted_date).toLocaleDateString()}
                    </td>
                    <td className="reward-cell">${submission.payable_amount}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        {submission.status.charAt(0).toUpperCase() +
                          submission.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="details-btn">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={page === p ? 'active' : ''}
                >
                  {p}
                </button>
              ))}
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

export default WorkerSubmissions;
