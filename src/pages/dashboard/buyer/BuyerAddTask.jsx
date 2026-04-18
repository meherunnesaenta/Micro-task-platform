import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Upload, Calendar, Users, DollarSign, FileText, Image, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { taskAPI } from '../../../utils/endpoints';
import { toast } from 'react-toastify';

const BuyerAddTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    task_title: '',
    task_detail: '',
    category: '',
    required_workers: 1,
    payable_amount: 0,
    completion_date: '',
    submission_info: '',
    task_image: null,
    task_image_preview: '',
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Data Entry',
    'Content Writing',
    'Web Research',
    'Social Media',
    'Transcription',
    'Image Tagging',
    'Testing',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'required_workers' || name === 'payable_amount' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          task_image: file,
          task_image_preview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      task_image: null,
      task_image_preview: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.task_title || !formData.task_detail || !formData.category || !formData.submission_info) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!formData.completion_date) {
        toast.error('Please set a completion date');
        setLoading(false);
        return;
      }

      if (formData.required_workers < 1 || formData.payable_amount <= 0) {
        toast.error('Please enter valid worker count and amount');
        setLoading(false);
        return;
      }

      const totalCost = formData.required_workers * formData.payable_amount;
      if (user?.coins < totalCost) {
        toast.error(`You need ${totalCost} coins but only have ${user?.coins}. Please purchase more coins.`);
        setLoading(false);
        return;
      }

      let taskImageUrl = '';
      if (formData.task_image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.task_image);
        try {
          const imgResponse = await fetch('https://api.imgbb.com/1/upload?key=' + import.meta.env.VITE_IMGBB_API_KEY, {
            method: 'POST',
            body: imageFormData
          });
          const imgData = await imgResponse.json();
          if (imgData.success) {
            taskImageUrl = imgData.data.url;
          }
        } catch (imgError) {
          console.warn('Image upload failed:', imgError);
        }
      }

      const taskPayload = {
        task_title: formData.task_title.trim(),
        task_detail: formData.task_detail.trim(),
        category: formData.category.trim(),
        required_workers: parseInt(formData.required_workers),
        payable_amount: parseFloat(formData.payable_amount),
        completion_date: formData.completion_date,
        submission_info: formData.submission_info.trim(),
        ...(taskImageUrl && { task_image_url: taskImageUrl })
      };

      await taskAPI.createTask(taskPayload);
      toast.success('Task created successfully!');
      navigate('/dashboard/buyer/my-tasks');
    } catch (error) {
      let errorMessage = 'Failed to create task';
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = formData.required_workers * formData.payable_amount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
          <Plus size={14} className="text-primary" />
          <span className="text-primary font-semibold text-sm">Create Task</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">Create New Task</h1>
        <p className="text-base-content/60 mt-1">Post a new task and get workers to complete it</p>
      </div>

      <div className="bg-base-200 rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                <input
                  type="text"
                  name="task_title"
                  value={formData.task_title}
                  onChange={handleChange}
                  placeholder="Enter an engaging task title"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Task Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Task Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="task_detail"
                value={formData.task_detail}
                onChange={handleChange}
                placeholder="Provide detailed instructions for workers"
                rows="5"
                className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Submission Instructions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Submission Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="submission_info"
                value={formData.submission_info}
                onChange={handleChange}
                placeholder="How should workers submit their work? (e.g., upload a file, provide a link, etc.)"
                rows="3"
                className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Required Workers */}
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Number of Workers <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                <input
                  type="number"
                  name="required_workers"
                  value={formData.required_workers}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Payable Amount */}
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Amount per Worker (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                <input
                  type="number"
                  name="payable_amount"
                  value={formData.payable_amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Completion Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                <input
                  type="date"
                  name="completion_date"
                  value={formData.completion_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Task Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Task Image <span className="text-base-content/40 text-xs">(Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                {formData.task_image_preview ? (
                  <div className="relative">
                    <img src={formData.task_image_preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-base-300" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors cursor-pointer bg-base-100">
                    <Image size={24} className="text-base-content/40" />
                    <span className="text-xs text-base-content/40 mt-1">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
                <p className="text-xs text-base-content/40">JPG, PNG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-primary/10 rounded-xl p-5 mt-4">
            <h3 className="text-lg font-bold text-base-content mb-3">Cost Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Workers Needed:</span>
                <span className="font-medium">{formData.required_workers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Amount per Worker:</span>
                <span className="font-medium">${formData.payable_amount.toFixed(2)}</span>
              </div>
              <div className="border-t border-base-300 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span className="text-primary">${totalCost.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-base-content/50 mt-2">
                <AlertCircle size={12} />
                <span>Your available coins: {user?.coins || 0}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg border border-base-300 hover:bg-base-300 transition-colors font-medium"
              onClick={() => navigate('/dashboard/buyer/my-tasks')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerAddTask;