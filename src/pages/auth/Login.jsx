import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/endpoints';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, AlertCircle, Loader, Eye, EyeOff, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data);
      toast.success('Welcome back! Login successful');
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      const from = location.state?.from;
      if (from) {
        navigate(from);
      } else if (response?.user?.role) {
        const roleRoutes = {
          worker: '/dashboard/worker',
          buyer: '/dashboard/buyer',
          admin: '/dashboard/admin'
        };
        navigate(roleRoutes[response.user.role] || '/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { credential } = credentialResponse;
      const response = await authAPI.googleLogin(credential);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Google login successful!');
      
      const from = location.state?.from;
      if (from) {
        navigate(from);
      } else if (response?.user?.role) {
        const roleRoutes = {
          worker: '/dashboard/worker',
          buyer: '/dashboard/buyer',
          admin: '/dashboard/admin'
        };
        navigate(roleRoutes[response.user.role] || '/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Login Form */}
          <div className="bg-base-200 rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Sparkles size={14} className="text-primary" />
                <span className="text-primary font-semibold text-sm">Welcome Back</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
                Sign In
              </h1>
              <p className="text-base-content/60">
                to continue to your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-base-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-base-content/60">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-base-content font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-base-200 text-base-content/50">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                width="100%"
                text="signin_with"
                shape="pill"
                theme="outline"
              />
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-base-content/60 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Illustration - Right Side */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-primary rounded-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 w-fit">
              <Shield size={16} />
              <span className="text-sm font-medium">Secure Platform</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Start Earning Today!
            </h2>
            
            <p className="text-base mb-8 leading-relaxed">
              Join thousands of workers earning money by completing simple tasks. 
              No experience needed, start now!
            </p>
            
            <div className="space-y-3">
              {[
                "Easy tasks to complete",
                "Instant payments",
                "Work from anywhere",
                "Zero commitment",
                "24/7 support"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-base rounded-full"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-xs opacity-80">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-xs opacity-80">Tasks Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold">$100K+</div>
                <div className="text-xs opacity-80">Earnings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;