import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { taskAPI, submissionAPI } from '../../../utils/endpoints';
import { ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../../styles/task-details.css';

const WorkerTaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await taskAPI.getTaskById(taskId);
        setTask(response);
      } catch (error) {
        toast.error('Failed to load task');
        navigate('/dashboard/worker/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, navigate]);

  const onSubmit = async (data) => {
    try {
      const submissionData = {
        task_id: taskId,
        submission_details: data.submission_details,
      };

      await submissionAPI.submitTask(submissionData);
      toast.success('Task submitted successfully!');
      setSubmitted(true);

      setTimeout(() => {
        navigate('/dashboard/worker/submissions');
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to submit task');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader className="spinner" size={40} />
        <p>Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="error-state">
        <p>Task not found</p>
      </div>
    );
  }

  return (
    <div className="task-details">
      <button className="back-btn" onClick={() => navigate('/dashboard/worker/tasks')}>
        <ArrowLeft size={20} /> Back to Tasks
      </button>

      {submitted && (
        <div className="success-banner">
          <CheckCircle size={24} />
          <p>Your submission has been received! Redirecting...</p>
        </div>
      )}

      <div className="detail-grid">
        {/* Left: Task Details */}
        <div className="task-details-card">
          {task.task_image_url && (
            <img src={task.task_image_url} alt={task.task_title} className="task-detail-image" />
          )}

          <h1>{task.task_title}</h1>

          <div className="task-meta-info">
            <div className="meta-row">
              <span className="meta-key">Posted by:</span>
              <span className="meta-value">{task.buyer_name}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Status:</span>
              <span className="meta-value badge">{task.status}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Reward per submission:</span>
              <span className="meta-value highlight">${task.payable_amount}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Workers needed:</span>
              <span className="meta-value">{task.required_workers}</span>
            </div>
            <div className="meta-row">
              <span className="meta-key">Deadline:</span>
              <span className="meta-value">
                {new Date(task.completion_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="task-description-section">
            <h3>Task Description</h3>
            <p>{task.task_detail}</p>
          </div>

          <div className="submission-guidelines">
            <h3>Submission Guidelines</h3>
            <p>{task.submission_info}</p>
          </div>
        </div>

        {/* Right: Submission Form */}
        <div className="submission-form-card">
          <h2>Submit Your Work</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="submission-form">
            <div className="form-group">
              <label htmlFor="submission_details">Your Submission</label>
              <textarea
                {...register('submission_details', {
                  required: 'Please provide your submission',
                  minLength: {
                    value: 10,
                    message: 'Submission must be at least 10 characters',
                  },
                })}
                placeholder={`Describe your submission... (${task.submission_info})`}
                rows="8"
                className="submission-textarea"
              />
              {errors.submission_details && (
                <p className="error-text">{errors.submission_details.message}</p>
              )}
            </div>

            <div className="submission-info">
              <p>✓ Reward: <strong>${task.payable_amount}</strong></p>
              <p>✓ Your work will be reviewed within 24 hours</p>
              <p>✓ Approved submissions earn instant coins</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader size={20} className="spinner" /> Submitting...
                </>
              ) : (
                'Submit Task'
              )}
            </button>
          </form>

          <div className="tip-section">
            <p><strong>Tip:</strong> Provide quality work to increase your chances of approval and build a strong reputation!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskDetails;
