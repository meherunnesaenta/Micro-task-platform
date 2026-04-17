import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submissionAPI } from '../../../utils/endpoints';
import { Check, X, Eye } from 'lucide-react';
import '../../../styles/submissions.css';
import { toast } from 'react-toastify';

const BuyerReviewSubmissions = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('task');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [taskId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      let response;
      if (taskId) {
        response = await submissionAPI.getTaskSubmissions(taskId);
      } else {
        response = await submissionAPI.getReviewSubmissions(1, 50);
      }
      setSubmissions(response.submissions || response || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      await submissionAPI.approveSubmission(submissionId);
      toast.success('Submission approved successfully!');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to approve submission');
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await submissionAPI.rejectSubmission(submissionId);
      toast.success('Submission rejected successfully!');
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to reject submission');
    }
  };

  if (loading) {
    return <div className="loading">Loading submissions...</div>;
  }

  return (
    <div className="buyer-review-submissions">
      <div className="page-header">
        <h1>Review Submissions</h1>
        <p>Review and approve worker submissions</p>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <h2>No submissions yet</h2>
          <p>Workers haven't submitted any work yet</p>
        </div>
      ) : (
        <div className="submissions-grid">
          {submissions.map((submission) => (
            <div key={submission._id} className="submission-card">
              <div className="submission-header">
                <div className="worker-info">
                  <img
                    src={submission.worker_id?.photoURL || 'https://via.placeholder.com/40'}
                    alt={submission.worker_id?.name}
                    className="worker-avatar"
                  />
                  <div>
                    <p className="worker-name">{submission.worker_id?.name}</p>
                    <p className="task-title">{submission.task_id?.title}</p>
                  </div>
                </div>
                <span className={`status-badge ${submission.status}`}>
                  {submission.status}
                </span>
              </div>

              <div className="submission-content">
                <p className="submission-text">{submission.submission_text}</p>
                {submission.submission_image && (
                  <img src={submission.submission_image} alt="Submission" className="submission-image" />
                )}
              </div>

              <div className="submission-meta">
                <p>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</p>
              </div>

              {submission.status === 'pending' && (
                <div className="submission-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApprove(submission._id)}
                  >
                    <Check size={18} /> Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(submission._id)}
                  >
                    <X size={18} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerReviewSubmissions;
