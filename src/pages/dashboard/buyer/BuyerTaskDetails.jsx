import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskAPI } from '../../../utils/endpoints';
import { submissionAPI } from '../../../utils/endpoints';
import { ArrowLeft, Clock, CheckCircle, XCircle, Edit2, Trash2, User, DollarSign, Calendar, Users, Eye, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

const BuyerTaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const taskData = await taskAPI.getTaskById(taskId);
        setTask(taskData);
        
        try {
          const submissionsData = await submissionAPI.getTaskSubmissions(taskId);
          setSubmissions(submissionsData.submissions || []);
        } catch (err) {
          console.error('Error fetching submissions:', err);
          setSubmissions([]);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to load task details');
        navigate('/dashboard/buyer/my-tasks');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await taskAPI.deleteTask(taskId);
        toast.success('Task deleted successfully');
        navigate('/dashboard/buyer/my-tasks');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getStatusBadge = () => {
    if (!task) return null;
    const isActive = task.required_workers > 0;
    const isExpired = new Date(task.completion_date) < new Date();
    
    if (isExpired) {
      return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-600">Expired</span>;
    }
    if (isActive) {
      return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-600">Active</span>;
    }
    return <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-600">Completed</span>;
  };

  const getSubmissionStatusBadge = (status) => {
    const config = {
      pending: { icon: <Clock size={14} />, label: 'Pending', className: 'bg-yellow-500/20 text-yellow-600' },
      approved: { icon: <CheckCircle size={14} />, label: 'Approved', className: 'bg-green-500/20 text-green-600' },
      rejected: { icon: <XCircle size={14} />, label: 'Rejected', className: 'bg-red-500/20 text-red-600' },
    };
    const c = config[status?.toLowerCase()] || config.pending;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${c.className}`}>{c.icon}{c.label}</span>;
  };

  const totalBudget = task ? (task.payable_amount * task.required_workers).toFixed(2) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-base-content/60">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <Briefcase size={48} className="mx-auto text-base-content/20 mb-3" />
        <h2 className="text-xl font-bold text-base-content mb-2">Task not found</h2>
        <p className="text-base-content/60 mb-4">The task you're looking for doesn't exist.</p>
        <Link to="/dashboard/buyer/my-tasks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
          <ArrowLeft size={16} /> Back to My Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/dashboard/buyer/my-tasks" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-3">
            <ArrowLeft size={16} /> Back to My Tasks
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content">{task.task_title}</h1>
          <p className="text-base-content/60 mt-1">Task ID: {task._id?.slice(-8)}</p>
        </div>
        <div className="flex gap-3">
          <Link to={`/dashboard/buyer/my-tasks/${taskId}/edit`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
            <Edit2 size={16} /> Edit
          </Link>
          <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Task Overview Card */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-white/70 text-sm">Total Budget</p>
            <p className="text-2xl font-bold">${totalBudget}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Per Worker</p>
            <p className="text-2xl font-bold">${task.payable_amount}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Workers Needed</p>
            <p className="text-2xl font-bold">{task.required_workers}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm">Status</p>
            <div className="mt-1">{getStatusBadge()}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-base-300">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-base-content/60 hover:text-base-content'}`}
        >
          Task Details
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'submissions' ? 'text-primary border-b-2 border-primary' : 'text-base-content/60 hover:text-base-content'}`}
        >
          Submissions ({submissions.length})
        </button>
      </div>

      {/* Task Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-base-200 rounded-2xl p-6 space-y-6">
          {task.task_image_url && (
            <img src={task.task_image_url} alt={task.task_title} className="w-full h-64 object-cover rounded-xl" />
          )}
          
          <div>
            <h3 className="text-lg font-bold text-base-content mb-2">Description</h3>
            <p className="text-base-content/70 leading-relaxed">{task.task_detail}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-base-content mb-2">Submission Instructions</h3>
            <p className="text-base-content/70 leading-relaxed">{task.submission_info}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-base-300">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-primary" />
              <div>
                <p className="text-xs text-base-content/50">Deadline</p>
                <p className="font-medium">{new Date(task.completion_date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase size={18} className="text-primary" />
              <div>
                <p className="text-xs text-base-content/50">Category</p>
                <p className="font-medium">{task.category || 'General'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="bg-base-200 rounded-2xl p-6">
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <Eye size={48} className="mx-auto text-base-content/20 mb-3" />
              <p className="text-base-content/60">No submissions yet</p>
              <p className="text-xs text-base-content/40 mt-1">Workers will submit their work here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission._id} className="bg-base-100 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={submission.worker_id?.photoURL || `https://ui-avatars.com/api/?name=${submission.worker_name?.charAt(0) || 'W'}&background=3b82f6&color=fff`} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-base-content">{submission.worker_name}</p>
                        <p className="text-xs text-base-content/40">{new Date(submission.submitted_date || submission.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {getSubmissionStatusBadge(submission.status)}
                  </div>
                  <p className="text-sm text-base-content/70 mb-3">{submission.submission_details || submission.submission_text}</p>
                  {submission.submission_image && (
                    <img src={submission.submission_image} alt="Submission" className="mt-2 rounded-lg max-h-32 object-cover" />
                  )}
                  {submission.status === 'pending' && (
                    <div className="flex gap-3 mt-4 pt-3 border-t border-base-300">
                      <Link to={`/dashboard/buyer/review?submission=${submission._id}`} className="text-sm text-primary hover:underline">
                        Review Submission
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerTaskDetails;