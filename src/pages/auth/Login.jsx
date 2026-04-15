import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const Login = () => {
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
      await login(data);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.message || 'Login failed. Please check your credentials.'
      );
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      toast.info('Google login coming soon!');
    } catch (error) {
      toast.error('Google login failed');
    }
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
          <button className="google-button" onClick={handleGoogleLogin}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

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
