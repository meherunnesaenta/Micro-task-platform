import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionAPI, taskAPI } from '../../../utils/endpoints';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import '../../../styles/task-details.css';

const WorkerSubmissionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const submissionData = await submissionAPI.getTaskSubmissions(submission._id);
        setSubmission(submissionData.submission);
        const taskData = await taskAPI.getTaskById(submissionData.task_id);
        setTask(taskData);
      } catch (err) {
        setError('Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <p>Loading details...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="error-state">
        <h2>Submission not found</h2>
        <Link to="/dashboard/worker/submissions" className="btn btn-primary">
          ← Back to Submissions
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'approved': return <CheckCircle className="status-icon approved" />;
      case 'rejected': return <XCircle className="status-icon rejected" />;
      default: return null;
    }
  };

  return (
    <div className="submission-details-page">
      <div className="page-header">
        <Link to="/dashboard/worker/submissions" className="back-btn">
          <ArrowLeft size={20} /> Back to Submissions
        </Link>
        <h1>Submission Details</h1>
      </div>

      <div className="submission-details-card">
        <div className="submission-header">
          <div className="submission-meta">
            <h2>{submission.task_title}</h2>
            <div className="status-badge-wrapper">
              {getStatusIcon(submission.status)}
              <span className={`status-badge ${submission.status}`}>
                {submission.status.toUpperCase()}
              </span>
            </div>
            <div className="submission-date">
              Submitted: {new Date(submission.submitted_date).toLocaleString()}
              {submission.reviewed_date && (
                <> | Reviewed: {new Date(submission.reviewed_date).toLocaleString()}</>
              )}
            </div>
          </div>
          <div className="submission-reward">
            <span className="reward-amount">${submission.payable_amount}</span>
            <span className="reward-label">Reward</span>
          </div>
        </div>

        <div className="submission-content">
          <div className="buyer-info">
            <h3>Buyer: {submission.buyer_name}</h3>
            <p>{task?.task_detail}</p>
          </div>

          <div className="your-submission">
            <h3>Your Submission</h3>
            <div className="submission-text">
              {submission.submission_details}
            </div>
          </div>

          {submission.status === 'rejected' && task && (
            <div className="resubmit-section">
              <h3>Task Still Available</h3>
              <Link to={`/dashboard/worker/tasks/${task._id}`} className="btn btn-primary">
                Resubmit
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerSubmissionDetails;
