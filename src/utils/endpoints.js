import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (token) => api.post('/auth/google-login', { tokenId: token }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Task endpoints
export const taskAPI = {
  getAllTasks: (page = 1, limit = 10) =>
    api.get(`/tasks?page=${page}&limit=${limit}`),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  getMyTasks: (page = 1, limit = 10) =>
    api.get(`/tasks/buyer/my-tasks?page=${page}&limit=${limit}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Submission endpoints
export const submissionAPI = {
  submitTask: (data) => api.post('/submissions', data),
  getMySubmissions: (page = 1, limit = 10) =>
    api.get(`/submissions/worker/my-submissions?page=${page}&limit=${limit}`),
  getReviewSubmissions: (page = 1, limit = 10) =>
    api.get(`/submissions/buyer/review?page=${page}&limit=${limit}`),
  approveSubmission: (id) => api.put(`/submissions/${id}/approve`),
  rejectSubmission: (id) => api.put(`/submissions/${id}/reject`),
  getApprovedSubmissions: () => api.get('/submissions/worker/approved'),
  getTaskSubmissions: (taskId) => api.get(`/submissions/task/${taskId}`),
  getSubmissionById: (id) => api.get(`/submissions/${id}`),
  updateSubmissionStatus: (id, status) => api.put(`/submissions/${id}/status`, { status }),
  getAllSubmissions: (page = 1, limit = 10) =>
    api.get(`/submissions?page=${page}&limit=${limit}`),
};

// Withdrawal endpoints
export const withdrawalAPI = {
  createWithdrawal: (data) => api.post('/withdrawals', data),
  getMyWithdrawals: (page = 1, limit = 10) =>
    api.get(`/withdrawals/worker/history?page=${page}&limit=${limit}`),
  getMyWithdrawalsHistory: (page = 1, limit = 10) =>
    api.get(`/withdrawals/worker/history?page=${page}&limit=${limit}`),
  getPendingWithdrawals: (page = 1, limit = 10) => 
    api.get(`/withdrawals/pending?page=${page}&limit=${limit}`), // ✅ This matches backend
  approveWithdrawal: (id) => api.put(`/withdrawals/${id}/approve`),
  rejectWithdrawal: (id) => api.put(`/withdrawals/${id}/reject`),
};

// Payment endpoints
export const paymentAPI = {
  getPackages: () => api.get('/payments/packages'),
  createPayment: (data) => api.post('/payments/create-payment', data),
  confirmPayment: (paymentId, data) => api.put(`/payments/confirm/${paymentId}`, data),
  dummyPayment: (data) => api.post('/payments/dummy-payment', data),
  getPaymentHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/payments/history?page=${page}&limit=${limit}`);
    return response.data;
  },
  purchaseCoins: (data) => api.post('/payments/purchase-coins', data),
};

// Notification endpoints
export const notificationAPI = {
  getNotifications: async (limit = 10) => {
    const user = localStorage.getItem('user');
    const email = user ? JSON.parse(user).email : '';
    return api.get(`/notifications?email=${email}&limit=${limit}`);
  },
  getUnreadCount: async () => {
    const user = localStorage.getItem('user');
    const email = user ? JSON.parse(user).email : '';
    const response = await api.get(`/notifications/unread/count?email=${email}`);
    return { unreadCount: response.data?.unreadCount || 0 };
  },
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (page = 1, limit = 10, role = '') =>
    api.get(`/admin/users?page=${page}&limit=${limit}&role=${role}`),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllTasks: (page = 1, limit = 10) => api.get(`/admin/tasks?page=${page}&limit=${limit}`),
  deleteTaskAsAdmin: (id) => api.delete(`/admin/tasks/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');
