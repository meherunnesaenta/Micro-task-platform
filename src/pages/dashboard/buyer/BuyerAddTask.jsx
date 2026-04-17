import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Upload } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { taskAPI } from '../../../utils/endpoints';
import '../../../styles/buyer-dashboard.css';
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
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Create preview
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
      // Validate required fields
      if (!formData.task_title || !formData.task_detail || !formData.category || !formData.submission_info) {
        toast.error('Please fill in all required fields (title, description, category, submission info)');
        setLoading(false);
        return;
      }

      if (!formData.completion_date) {
        toast.error('Please set a completion date');
        setLoading(false);
        return;
      }

      if (formData.required_workers < 1 || formData.payable_amount <= 0) {
        toast.error('Please enter valid worker count and amount (amount must be greater than 0)');
        setLoading(false);
        return;
      }

      // Check if user has enough coins
      const totalCost = formData.required_workers * formData.payable_amount;
      if (user?.coins < totalCost) {
        toast.error(`You need ${totalCost} coins but only have ${user?.coins}. Please purchase more coins.`);
        setLoading(false);
        return;
      }

      // First, upload image if exists
      let taskImageUrl = '';
      if (formData.task_image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.task_image);
        try {
          // Upload image to ImgBB or your image service
          const imgResponse = await fetch('https://api.imgbb.com/1/upload?key=' + import.meta.env.VITE_IMGBB_API_KEY, {
            method: 'POST',
            body: imageFormData
          });
          const imgData = await imgResponse.json();
          if (imgData.success) {
            taskImageUrl = imgData.data.url;
          }
        } catch (imgError) {
          console.warn('Image upload failed, continuing without image:', imgError);
        }
      }

      // Send task data - using exact field names expected by backend
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

      console.log('📤 Submitting task with payload:', taskPayload);
      console.log('Total cost:', totalCost, '| User coins:', user?.coins);

      const response = await taskAPI.createTask(taskPayload);
      console.log('✅ Task created successfully:', response);
      toast.success('Task created successfully!');
      navigate('/dashboard/buyer/my-tasks');
    } catch (error) {
      console.error('❌ Error creating task');
      console.error('Status:', error.response?.status);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to create task';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-add-task">
      <div className="page-header">
        <h1>Create New Task</h1>
        <p>Post a new task and get workers to complete it</p>
      </div>

      <div className="task-form-container">
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="task_title">Task Title *</label>
              <input
                type="text"
                id="task_title"
                name="task_title"
                value={formData.task_title}
                onChange={handleChange}
                placeholder="Enter an engaging task title"
                className="form-input"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="task_detail">Task Description *</label>
              <textarea
                id="task_detail"
                name="task_detail"
                value={formData.task_detail}
                onChange={handleChange}
                placeholder="Provide detailed instructions for workers"
                className="form-textarea"
                rows="6"
                required
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label htmlFor="submission_info">Submission Instructions *</label>
              <textarea
                id="submission_info"
                name="submission_info"
                value={formData.submission_info}
                onChange={handleChange}
                placeholder="How should workers submit their work? (e.g., upload a file, provide a link, etc.)"
                className="form-textarea"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="required_workers">Number of Workers *</label>
              <input
                type="number"
                id="required_workers"
                name="required_workers"
                value={formData.required_workers}
                onChange={handleChange}
                min="1"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="payable_amount">Amount per Worker (USD) *</label>
              <input
                type="number"
                id="payable_amount"
                name="payable_amount"
                value={formData.payable_amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="completion_date">Completion Deadline *</label>
              <input
                type="date"
                id="completion_date"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="task_image">Task Image (Optional)</label>
              <div className="image-upload-section">
                {formData.task_image_preview ? (
                  <div className="image-preview">
                    <img src={formData.task_image_preview} alt="Task preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeImage}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="image-upload-box">
                    <input
                      type="file"
                      id="task_image"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <Upload size={32} />
                    <p>Click to upload image</p>
                    <small>Supported formats: JPG, PNG, GIF (Max 5MB)</small>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-summary">
            <h3>Cost Summary</h3>
            <div className="summary-item">
              <span>Workers Needed:</span>
              <span>{formData.required_workers}</span>
            </div>
            <div className="summary-item">
              <span>Amount per Worker:</span>
              <span>${formData.payable_amount.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total Cost:</span>
              <span>${(formData.required_workers * formData.payable_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/buyer/my-tasks')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
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
