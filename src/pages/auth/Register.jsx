import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'worker',
      photoURL: '',
    },
  });

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        photoURL:
          data.photoURL ||
          'https://via.placeholder.com/150?text=' +
            encodeURIComponent(data.name),
      };

      await registerUser(userData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join our platform and start earning or hiring</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters',
                    },
                  })}
                  type="text"
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>
              {errors.name && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.name.message}
                </div>
              )}
            </div>

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

            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="role">I want to</label>
              <div className="role-selector">
                <label className="radio-label">
                  <input
                    {...register('role')}
                    type="radio"
                    value="worker"
                    defaultChecked
                  />
                  <span className="radio-text">
                    <Briefcase size={16} /> Complete tasks and earn
                  </span>
                </label>
                <label className="radio-label">
                  <input {...register('role')} type="radio" value="buyer" />
                  <span className="radio-text">
                    <Briefcase size={16} /> Post tasks and hire workers
                  </span>
                </label>
              </div>
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
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        'Password must contain uppercase, lowercase, and numbers',
                    },
                  })}
                  type="password"
                  placeholder="Create a strong password"
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

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type="password"
                  placeholder="Confirm your password"
                  className="form-input"
                />
              </div>
              {errors.confirmPassword && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            {/* Photo URL Field */}
            <div className="form-group">
              <label htmlFor="photoURL">Profile Photo URL (Optional)</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  {...register('photoURL')}
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="form-input"
                />
              </div>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Illustration */}
        <div className="auth-illustration">
          <div className="illustration-box">
            <h2>Get Started Today</h2>
            <p>Choose your role and start your journey</p>
            <ul className="benefits-list">
              <li>✓ Worker - Earn money completing tasks</li>
              <li>✓ Buyer - Post tasks for workers</li>
              <li>✓ Instant Setup</li>
              <li>✓ Safe & Secure Platform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
