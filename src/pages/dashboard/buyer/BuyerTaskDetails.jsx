import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskAPI } from '../../../utils/endpoints';
import { submissionAPI } from '../../../utils/endpoints';
import { ArrowLeft, Clock, CheckCircle, XCircle, Edit2, Trash2, User } from 'lucide-react';
import '../../../styles/task-details.css';
import { toast } from 'react-toastify';

const BuyerTaskDetails
