import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, DollarSign, Calendar, ArrowRight, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostedTasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPostedTasks();
  }, [page]);

  const fetchPostedTasks = async () => {
    setLoading(true);
    try {
      // API call to public endpoint (no auth token needed)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/public/tasks?page=${page}&limit=6`);
      
      if (response.data.success) {
        setTasks(response.data.tasks);
        setTotalPages(response.data.pages);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Data Entry': '#3b82f6',
      'Content Writing': '#8b5cf6',
      'Web Research': '#ec4899',
      'Social Media': '#f59e0b',
      'Transcription': '#10b981',
      'Image Tagging': '#06b6d4',
      'Testing': '#ef4444',
      'Other': '#6b7280',
    };
    return colors[category] || '#667eea';
  };

  const handleBrowseAllTasks = () => {
    if (!user) {
      navigate('/login', { state: { from: '/tasks' } });
    } else if (user.role === 'worker') {
      navigate('/dashboard/worker/tasks');
    } else if (user.role === 'buyer') {
      navigate('/dashboard/buyer/my-tasks');
    } else if (user.role === 'admin') {
      navigate('/dashboard/admin/tasks');
    }
  };

  const handleViewTask = (taskId) => {
    if (!user) {
      navigate('/login', { state: { from: `/task/${taskId}` } });
    } else {
      navigate(`/dashboard/worker/tasks/${taskId}`);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-base-100">
        <div className="container-modern">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Briefcase size={14} className="text-primary" />
              <span className="text-primary font-medium text-sm">Latest Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">Posted Tasks</h2>
            <p className="text-base-content/60">Loading available tasks...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-base-200 rounded-xl p-6 animate-pulse">
                <div className="w-full h-40 bg-base-300 rounded-lg mb-4"></div>
                <div className="h-5 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-base-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-base-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-base-100">
      <div className="container-modern">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <Briefcase size={14} className="text-primary" />
            <span className="text-primary font-medium text-sm">Latest Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">Posted Tasks</h2>
          <p className="text-base-content/60">
            Browse available tasks and start earning today
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-xl">
            <Briefcase size={48} className="mx-auto text-base-content/30 mb-4" />
            <p className="text-base-content/60">No tasks available at the moment</p>
            <p className="text-xs text-base-content/40 mt-1">Check back later!</p>
          </div>
        ) : (
          <>
            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-base-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Task Image */}
                  {task.task_image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={task.task_image_url}
                        alt={task.task_title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Task Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getCategoryColor(task.category) }}
                      >
                        {task.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2">
                      {task.task_title}
                    </h3>

                    {/* Buyer Name */}
                    <p className="text-sm text-base-content/50 mb-3">
                      by {task.buyer_name}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-base-content/60 mb-4 line-clamp-2">
                      {task.task_detail}
                    </p>

                    {/* Task Stats */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">Workers Needed</span>
                        <span className="font-semibold text-base-content">{task.required_workers}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">Reward</span>
                        <span className="font-bold text-green-600">${task.payable_amount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-base-content/60">Deadline</span>
                        <span className="text-base-content/70">{formatDate(task.completion_date)}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => handleViewTask(task._id)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
                    >
                      View Task
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-base-content/60">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* View All Button */}
            {tasks.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={handleBrowseAllTasks}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300"
                >
                  {user ? `Browse All Tasks` : 'Login to Browse All Tasks'}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PostedTasks;