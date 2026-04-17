import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/endpoints';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import '../../styles/auth.css';

const Login = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data);
      toast.success('Login successful!');
      
      // Check if there's a callback URL
      const from = location.state?.from;
      if (from) {
        navigate(from);
      } else if (response?.role) {
        // Route based on user role
        if (response.role === 'worker') {
          navigate('/dashboard/worker/tasks');
        } else if (response.role === 'buyer') {
          navigate('/dashboard/buyer/my-tasks');
        } else if (response.role === 'admin') {
          navigate('/dashboard/admin/tasks');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(
        error.message || 'Login failed. Please check your credentials.'
      );
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { credential } = credentialResponse;
      const response = await authAPI.googleLogin(credential);
      
      // Store token and user info
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Google login successful!');
      
      // Check if there's a callback URL
      const from = location.state?.from;
      if (from) {
        navigate(from);
      } else if (response?.user?.role) {
        // Route based on user role
        if (response.user.role === 'worker') {
          navigate('/dashboard/worker/tasks');
        } else if (response.user.role === 'buyer') {
          navigate('/dashboard/buyer/my-tasks');
        } else if (response.user.role === 'admin') {
          navigate('/dashboard/admin/tasks');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back!</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  placeholder="Enter your password"
                  className="form-input"
                />
              </div>
              {errors.password && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={20} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Google Login */}
          <div className="divider">Or</div>
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              width="100%"
            />
          </div>

          {/* Sign Up Link */}
          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Illustration */}
        <div className="auth-illustration">
          <div className="illustration-box">
            <h2>Earn Money Today</h2>
            <p>Join thousands of workers earning money by completing tasks</p>
            <ul className="benefits-list">
              <li>✓ Easy tasks to complete</li>
              <li>✓ Instant payments</li>
              <li>✓ Work from anywhere</li>
              <li>✓ Zero commitment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
