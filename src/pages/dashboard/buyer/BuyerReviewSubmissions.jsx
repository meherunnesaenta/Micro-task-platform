import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submissionAPI } from '../../../utils/endpoints';
import { Check, X, Eye, DollarSign, User, Calendar, Clock, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const BuyerReviewSubmissions = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('task');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingIds, setSubmittingIds] = useState(new Set());

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
      
      let submissionsData = [];
      if (response && response.data) {
        submissionsData = response.data.submissions || response.data || [];
      } else if (response && response.submissions) {
        submissionsData = response.submissions;
      } else if (Array.isArray(response)) {
        submissionsData = response;
      }
      
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    setSubmittingIds(prev => new Set([...prev, submissionId]));
    try {
      await submissionAPI.approveSubmission(submissionId);
      toast.success('Submission approved! Coins sent to worker.');
      
      // ✅ Small delay to let backend process
      setTimeout(() => {
        fetchSubmissions();
      }, 500);
      
    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to approve');
    } finally {
      setSubmittingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  };

  const handleReject = async (submissionId) => {
    setSubmittingIds(prev => new Set([...prev, submissionId]));
    try {
      await submissionAPI.rejectSubmission(submissionId);
      toast.success('Submission rejected!');
      
      setTimeout(() => {
        fetchSubmissions();
      }, 500);
      
    } catch (error) {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to reject');
    } finally {
      setSubmittingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600' },
      approved: { label: 'Approved', className: 'bg-green-500/20 text-green-600' },
      rejected: { label: 'Rejected', className: 'bg-red-500/20 text-red-600' },
    };
    const c = config[status?.toLowerCase()] || config.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.className}`}>{c.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Eye size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Review Submissions</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Review Submissions</h1>
        <p className="text-base-content/60 mt-1">Review and approve worker submissions</p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <Clock size={48} className="mx-auto text-base-content/20 mb-3" />
          <h2 className="text-xl font-bold text-base-content mb-2">No submissions yet</h2>
          <p className="text-base-content/60">Workers haven't submitted any work yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-base-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="bg-primary p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={submission.worker_id?.photoURL || `https://ui-avatars.com/api/?name=${submission.worker_id?.name?.charAt(0) || 'W'}&background=ffffff&color=3b82f6&bold=true`}
                      alt={submission.worker_name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                    />
                    <div>
                      <p className="font-semibold">{submission.worker_name || 'Unknown Worker'}</p>
                      <p className="text-white/80 text-sm">{submission.task_id?.title || submission.task_title}</p>
                    </div>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {submission.submission_text || submission.submission_details}
                  </p>
                  {submission.submission_image && (
                    <img src={submission.submission_image} alt="Submission" className="mt-3 rounded-lg max-h-48 w-full object-cover" />
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-base-content/50 mb-4 pb-3 border-b border-base-300">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Submitted: {new Date(submission.createdAt || submission.submitted_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-green-500" />
                    <span className="font-medium text-green-600">${submission.payable_amount}</span>
                  </div>
                </div>

                {submission.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleApprove(submission._id)}
                      disabled={submittingIds.has(submission._id)}
                    >
                      {submittingIds.has(submission._id) ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                      {submittingIds.has(submission._id) ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleReject(submission._id)}
                      disabled={submittingIds.has(submission._id)}
                    >
                      {submittingIds.has(submission._id) ? <Loader2 className="animate-spin" size={16} /> : <X size={16} />}
                      {submittingIds.has(submission._id) ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}

                {submission.status !== 'pending' && (
                  <div className="text-center py-2 text-sm text-base-content/50">
                    This submission has been {submission.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerReviewSubmissions;