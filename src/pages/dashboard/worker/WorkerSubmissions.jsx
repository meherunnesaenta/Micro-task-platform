import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { submissionAPI } from '../../../utils/endpoints';
import { useAuth } from '../../../context/AuthContext';
import { Clock, CheckCircle, XCircle, Loader, Eye, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const WorkerSubmissions = () => {
  const { refreshUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await submissionAPI.getMySubmissions(page, 10);
        
        console.log('WorkerSubmissions API Response:', response); // Debug
        
        const submissionsData = response.submissions || response.data?.submissions || response.data || [];
        const totalData = response.total || response.data?.total || 0;
        
        setSubmissions(submissionsData);
        setTotal(totalData);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to fetch submissions');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [page]);

  const refreshSubmissions = async () => {
    await fetchSubmissions();
    await refreshUser(); // Refresh user to get updated coins
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
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

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status?.toLowerCase() === filterStatus;
  });

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Clock size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">My Submissions</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">My Submissions</h1>
        <p className="text-base-content/60 mt-1">Track the status of your task submissions</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'all' ? 'bg-primary text-white' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'approved' ? 'bg-green-500 text-white' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'rejected' ? 'bg-red-500 text-white' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-base-content/60">Loading submissions...</p>
          </div>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <Clock size={48} className="mx-auto text-base-content/20 mb-3" />
          <p className="text-base-content/60">No submissions yet</p>
          <p className="text-xs text-base-content/40 mt-1">Complete a task and submit it to see your submissions here</p>
        </div>
      ) : (
        <>
          {/* Submissions Table */}
          <div className="bg-base-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Task Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Reward</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-base-content/60 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-base-100 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-base-content">{submission.task_title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-base-content/40" />
                          <span className="text-sm text-base-content/70">
                            {new Date(submission.submitted_date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-green-500" />
                          <span className="font-semibold text-base-content">{submission.payable_amount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(submission.status)}
                          {getStatusBadge(submission.status)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/dashboard/worker/submissions/${submission._id}`}>
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-sm">
                            <Eye size={14} /> View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-base-300 hover:bg-base-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <span className="px-2 py-2">...</span>
              )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
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

export default WorkerSubmissions;