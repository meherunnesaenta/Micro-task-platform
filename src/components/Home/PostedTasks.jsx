import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { taskAPI } from '../../utils/endpoints';
import '../../styles/home.css';

const PostedTasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostedTasks();
  }, []);

const fetchPostedTasks = async () => {
      setLoading(true);
      // Always use mock data for home page (public, no auth)
        const mockTasks = [
          {
            _id: '1',
            task_title: 'Social Media Engagement',
            buyer_name: 'ABC Corp',
            payable_amount: 2.5,
            required_workers: 150,
            completion_date: '2024-12-31',
            task_image_url: 'https://images.unsplash.com/photo-1611162617213-7d220c8ae000?w=400',
            task_detail: 'Like and comment on 5 posts',
            category: 'Social Media'
          },
          {
            _id: '2',
            task_title: 'Data Entry',
            buyer_name: 'DataPro Inc',
            payable_amount: 1.8,
            required_workers: 200,
            completion_date: '2024-12-28',
            task_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            task_detail: 'Enter 50 records into spreadsheet',
            category: 'Data Entry'
          },
          {
            _id: '3',
            task_title: 'App Testing',
            buyer_name: 'TechStart',
            payable_amount: 5.0,
            required_workers: 80,
            completion_date: '2024-12-30',
            task_image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            task_detail: 'Test mobile app and report bugs',
            category: 'Testing'
          },
          {
            _id: '4',
            task_title: 'Content Research',
            buyer_name: 'MarketingHub',
            payable_amount: 3.2,
            required_workers: 120,
            completion_date: '2024-12-29',
            task_image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
            task_detail: 'Research 10 competitors and report findings',
            category: 'Web Research'
          },
          {
            _id: '5',
            task_title: 'Image Annotation',
            buyer_name: 'AI Vision',
            payable_amount: 1.2,
            required_workers: 300,
            completion_date: '2024-12-31',
            task_image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
            task_detail: 'Label 100 images for AI training',
            category: 'Image Tagging'
          },
          {
            _id: '6',
            task_title: 'Video Transcription',
            buyer_name: 'MediaCorp',
            payable_amount: 4.5,
            required_workers: 60,
            completion_date: '2024-12-28',
            task_image_url: 'https://images.unsplash.com/photo-1482780442678-3a5168a61c15?w=400',
            task_detail: 'Transcribe 30 minutes of video content',
            category: 'Transcription'
          }
        ];
      setTasks(mockTasks);
      setLoading(false);
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
      // Not logged in - redirect to login with callback
      navigate('/login', { state: { from: '/tasks' } });
    } else if (user.role === 'worker') {
      // Worker - go to worker tasks
      navigate('/dashboard/worker/tasks');
    } else if (user.role === 'buyer') {
      // Buyer - go to buyer my tasks
      navigate('/dashboard/buyer/my-tasks');
    } else if (user.role === 'admin') {
      // Admin - go to admin manage tasks
      navigate('/dashboard/admin/tasks');
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-base-100 to-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Briefcase size={14} className="text-primary" />
              <span className="text-primary font-medium text-sm">Latest Opportunities</span>
            </div>
            <h2 className="text-4xl font-bold text-base-content mt-4 mb-2">Posted Tasks</h2>
            <p className="text-base-content/60 text-lg">Loading available tasks...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <Briefcase size={14} className="text-primary" />
            <span className="text-primary font-medium text-sm">Latest Opportunities</span>
          </div>
          <h2 className="text-4xl font-bold text-base-content mt-4 mb-2">Posted Tasks</h2>
          <p className="text-base-content/60 text-lg">
            Browse available tasks and start earning today
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-base-content/30 mb-4" />
            <p className="text-base-content/60">No tasks available yet</p>
          </div>
        ) : (
          <>
            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-base-100 rounded-xl border border-base-300 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/50 flex flex-col"
                >
                  {/* Task Image */}
                  {task.task_image && (
                    <div className="h-40 bg-gradient-to-br from-primary to-secondary overflow-hidden">
                      <img
                        src={task.task_image}
                        alt={task.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Task Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-base-100"
                        style={{ backgroundColor: getCategoryColor(task.category) }}
                      >
                        {task.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2">
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-base-content/60 mb-4 line-clamp-3">
                      {task.description}
                    </p>

                    {/* Task Stats */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <Users size={16} className="text-primary" />
                        <span>{task.required_workers} workers needed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <DollarSign size={16} className="text-success" />
                        <span className="font-semibold">${task.payable_amount}/worker</span>
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                          <Calendar size={16} className="text-warning" />
                          <span>Due: {formatDate(task.deadline)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <Link
                      to={`/dashboard/worker/tasks/${task._id}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-primary-content rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
                    >
                      View Task
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {tasks.length > 0 && (
              <div className="text-center">
                <button
                  onClick={handleBrowseAllTasks}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-0"
                >
                  {user ? `Browse All Tasks (${user.role})` : 'Browse All Tasks'}
                  <ArrowRight size={20} />
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
