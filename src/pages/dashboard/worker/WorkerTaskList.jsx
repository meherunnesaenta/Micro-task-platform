import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../../../utils/endpoints';
import { Search, Filter, Loader, DollarSign, Calendar, Users, Eye, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

const WorkerTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskAPI.getAllTasks(page, 10);
        
        console.log('WorkerTaskList API Response:', response); // Debug
        
        const tasksData = response.tasks || response.data?.tasks || response.data || [];
        const totalData = response.total || response.data?.total || 0;
        
        setTasks(tasksData);
        setTotal(totalData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to load tasks');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]);

  const handleTaskClick = (taskId) => {
    navigate(`/dashboard/worker/tasks/${taskId}`);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.task_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || task.category?.toLowerCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))];

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Briefcase size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Available Tasks</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Available Tasks</h1>
        <p className="text-base-content/60 mt-1">Browse and submit tasks to earn coins</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg bg-base-200 border border-base-300 focus:border-primary focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-base-content/60">Loading tasks...</p>
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <Briefcase size={48} className="mx-auto text-base-content/20 mb-3" />
          <p className="text-base-content/60">No tasks available at the moment</p>
          <p className="text-xs text-base-content/40 mt-1">Check back later for new opportunities!</p>
        </div>
      ) : (
        <>
          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div key={task._id} className="bg-base-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {task.task_image_url && (
                  <img src={task.task_image_url} alt={task.task_title} className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-base-content mb-1 line-clamp-1">{task.task_title}</h3>
                  <p className="text-xs text-primary mb-3">by {task.buyer_name}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4 pb-3 border-b border-base-300">
                    <div className="text-center">
                      <DollarSign size={14} className="mx-auto text-green-500 mb-1" />
                      <p className="text-xs text-base-content/50">Reward</p>
                      <p className="text-sm font-bold text-base-content">${task.payable_amount}</p>
                    </div>
                    <div className="text-center">
                      <Users size={14} className="mx-auto text-primary mb-1" />
                      <p className="text-xs text-base-content/50">Needed</p>
                      <p className="text-sm font-bold text-base-content">{task.required_workers}</p>
                    </div>
                    <div className="text-center">
                      <Calendar size={14} className="mx-auto text-yellow-500 mb-1" />
                      <p className="text-xs text-base-content/50">Deadline</p>
                      <p className="text-sm font-bold text-base-content">{new Date(task.completion_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-base-content/70 mb-4 line-clamp-2">{task.task_detail}</p>
                  
                  <button
                    className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    onClick={() => handleTaskClick(task._id)}
                  >
                    <Eye size={16} /> View & Submit
                  </button>
                </div>
              </div>
            ))}
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

export default WorkerTaskList;