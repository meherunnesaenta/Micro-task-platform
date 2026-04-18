import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { taskAPI, submissionAPI } from '../../../utils/endpoints';
import { ArrowLeft, Loader, CheckCircle, DollarSign, Calendar, Users, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

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
        <AlertCircle size={48} className="mx-auto text-base-content/20 mb-3" />
        <h2 className="text-xl font-bold text-base-content mb-2">Task not found</h2>
        <p className="text-base-content/60 mb-4">The task you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/dashboard/worker/tasks')} className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate('/dashboard/worker/tasks')} className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
        <ArrowLeft size={16} /> Back to Tasks
      </button>

      {/* Success Banner */}
      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <p className="text-green-600 font-medium">Your submission has been received! Redirecting...</p>
        </div>
      )}

      {/* Task Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Task Details */}
        <div className="bg-base-200 rounded-2xl overflow-hidden">
          {task.task_image_url && (
            <img src={task.task_image_url} alt={task.task_title} className="w-full h-48 object-cover" />
          )}
          
          <div className="p-6">
            <h1 className="text-2xl font-bold text-base-content mb-4">{task.task_title}</h1>
            
            {/* Meta Info */}
            <div className="space-y-3 mb-6 pb-6 border-b border-base-300">
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Posted by:</span>
                <span className="font-medium text-base-content">{task.buyer_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Reward:</span>
                <span className="font-bold text-green-600">${task.payable_amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Workers needed:</span>
                <span className="font-medium text-base-content">{task.required_workers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-base-content/60">Deadline:</span>
                <span className="font-medium text-base-content">
                  {new Date(task.completion_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Task Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Task Description
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed">{task.task_detail}</p>
            </div>

            {/* Submission Guidelines */}
            <div>
              <h3 className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-primary" />
                Submission Guidelines
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed">{task.submission_info}</p>
            </div>
          </div>
        </div>

        {/* Right: Submission Form */}
        <div className="bg-base-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-base-content mb-5">Submit Your Work</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Your Submission <span className="text-red-500">*</span>
              </label>
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
                className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors resize-none"
              />
              {errors.submission_details && (
                <p className="text-red-500 text-xs mt-1">{errors.submission_details.message}</p>
              )}
            </div>

            <div className="bg-primary/10 rounded-xl p-4 space-y-2">
              <p className="text-sm flex items-center gap-2"><DollarSign size={14} className="text-primary" /> Reward: <strong className="text-primary">${task.payable_amount}</strong></p>
              <p className="text-sm flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Your work will be reviewed within 24 hours</p>
              <p className="text-sm flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Approved submissions earn instant coins</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Task'
              )}
            </button>
          </form>

          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-xs text-base-content/70"><strong className="text-yellow-600">Tip:</strong> Provide quality work to increase your chances of approval and build a strong reputation!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerTaskDetails;