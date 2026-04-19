import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submissionAPI, taskAPI } from '../../../utils/endpoints';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Clock, CheckCircle, XCircle, DollarSign, User, Calendar, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

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
        
        const submissionResponse = await submissionAPI.getSubmissionById(id);
        console.log('Full response:', submissionResponse);
        
        // ✅ Handle nested response structure { submission: {...} }
        let submissionData = submissionResponse.data?.submission || 
                            submissionResponse.submission || 
                            submissionResponse.data || 
                            submissionResponse;
        
        console.log('Submission data:', submissionData);
        console.log('Task ID object:', submissionData?.task_id);
        console.log('Task ID value:', submissionData?.task_id?._id);
        
        setSubmission(submissionData);
        
        // ✅ Get task ID correctly
        let taskId = null;
        if (submissionData?.task_id) {
          if (typeof submissionData.task_id === 'object' && submissionData.task_id._id) {
            taskId = submissionData.task_id._id;
          } else if (typeof submissionData.task_id === 'string') {
            taskId = submissionData.task_id;
          }
        }
        
        console.log('Extracted Task ID:', taskId);
        
        if (taskId) {
          const taskResponse = await taskAPI.getTaskById(taskId);
          const taskData = taskResponse.data || taskResponse;
          console.log('Task data:', taskData);
          setTask(taskData);
        }
        
      } catch (err) {
        console.error('Submission fetch error:', err);
        setError('Failed to load submission details');
        toast.error('Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={20} className="text-yellow-500" />;
      case 'approved': return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected': return <XCircle size={20} className="text-red-500" />;
      default: return <AlertCircle size={20} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600' },
      approved: { label: 'Approved', className: 'bg-green-500/20 text-green-600' },
      rejected: { label: 'Rejected', className: 'bg-red-500/20 text-red-600' },
    };
    const c = config[status?.toLowerCase()] || config.pending;
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${c.className}`}>{c.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-base-content/20 mb-3" />
        <h2 className="text-xl font-bold text-base-content mb-2">Submission not found</h2>
        <p className="text-base-content/60 mb-4">The submission you're looking for doesn't exist.</p>
        <Link to="/dashboard/worker/submissions" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
          <ArrowLeft size={16} /> Back to Submissions
        </Link>
      </div>
    );
  }

  // ✅ Get task details from submission.task_id (already populated)
  const taskDetail = submission.task_id?.task_detail || task?.task_detail || 'No description available';
  const taskSubmissionInfo = submission.task_id?.submission_info || task?.submission_info || 'No submission info available';
  const taskIdForResubmit = submission.task_id?._id || submission.task_id || task?._id;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/dashboard/worker/submissions" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-3">
            <ArrowLeft size={16} /> Back to Submissions
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content">Submission Details</h1>
          <p className="text-base-content/60 mt-1">Review your task submission status and details</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-base-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">{submission.task_title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                {getStatusIcon(submission.status)}
                {getStatusBadge(submission.status)}
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl font-bold">${submission.payable_amount}</div>
              <div className="text-white/70 text-sm">Reward Amount</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Submission Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-base-300">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-primary" />
              <div>
                <p className="text-xs text-base-content/50">Submitted Date</p>
                <p className="text-sm font-medium text-base-content">
                  {new Date(submission.submitted_date).toLocaleString()}
                </p>
              </div>
            </div>
            {submission.reviewed_date && (
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-green-500" />
                <div>
                  <p className="text-xs text-base-content/50">Reviewed Date</p>
                  <p className="text-sm font-medium text-base-content">
                    {new Date(submission.reviewed_date).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Buyer & Task Info */}
          <div>
            <h3 className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Task Information
            </h3>
            <div className="bg-base-100 rounded-xl p-4">
              <p className="text-sm text-base-content/70 mb-2">
                <span className="font-semibold text-base-content">Posted by:</span> {submission.buyer_name}
              </p>
              <p className="text-sm text-base-content/70 mb-2">
                <span className="font-semibold text-base-content">Task Description:</span>
              </p>
              <p className="text-sm text-base-content mt-1 leading-relaxed">
                {taskDetail}
              </p>
              {taskSubmissionInfo && taskSubmissionInfo !== 'No submission info available' && (
                <>
                  <p className="text-sm text-base-content/70 mt-3 mb-1">
                    <span className="font-semibold text-base-content">Submission Guidelines:</span>
                  </p>
                  <p className="text-sm text-base-content leading-relaxed">
                    {taskSubmissionInfo}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Your Submission */}
          <div>
            <h3 className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Your Submission
            </h3>
            <div className="bg-base-100 rounded-xl p-4">
              <p className="text-sm text-base-content leading-relaxed whitespace-pre-wrap">
                {submission.submission_details}
              </p>
            </div>
          </div>

          {/* Resubmit Section for Rejected */}
          {submission.status === 'rejected' && taskIdForResubmit && (
            <div className="bg-yellow-500/10 rounded-xl p-5 border border-yellow-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base-content mb-1">Task Still Available</h3>
                  <p className="text-sm text-base-content/60">Your submission was rejected. You can resubmit the task.</p>
                </div>
                <Link to={`/dashboard/worker/tasks/${taskIdForResubmit}`} className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors text-center">
                  Resubmit Task
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerSubmissionDetails;