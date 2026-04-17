import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submissionAPI, taskAPI } from '../../../../utils/endpoints';
import { ArrowLeft, CheckCircle, XCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import '../../../../styles/submissions.css';

const WorkerSubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionRes, taskRes] = await Promise.all([
          submissionAPI.getSubmission(id), // Need endpoint or use /worker/my-submissions w/ id
          taskAPI.getTaskById(submission.task_id) // Reuse existing
        ]);
        setSubmission(submissionRes);
        setTask(taskRes);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={24} />;
      case 'rejected': return <XCircle className="text-red-500" size={24} />;
      case 'pending': return <Clock className="text-yellow-500" size={24} />;
      default: return null;
    }
  };
