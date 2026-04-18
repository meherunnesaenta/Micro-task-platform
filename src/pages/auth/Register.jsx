import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Briefcase, AlertCircle, Loader, Eye, EyeOff, ArrowRight, Sparkles, Shield, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        photoURL: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3b82f6&color=fff&bold=true&length=2`,
      };

      await registerUser(userData);
      toast.success('Registration successful! Welcome aboard!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-base-100">
      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Registration Form */}
          <div className="bg-base-200 rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Sparkles size={14} className="text-primary" />
                <span className="text-primary font-semibold text-sm">Join Us Today</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2">
                Create Account
              </h1>
              <p className="text-base-content/60">
                Join our platform and start earning or hiring
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    {errors.name.message}
                  </div>
                )}
              </div>

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

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer transition-all duration-300 ${watch('role') === 'worker' ? 'ring-2 ring-primary' : 'ring-1 ring-base-300'} rounded-lg p-3 bg-base-100`}>
                    <input {...register('role')} type="radio" value="worker" className="hidden" />
                    <div className="text-center">
                      <Briefcase size={24} className={`mx-auto mb-2 ${watch('role') === 'worker' ? 'text-primary' : 'text-base-content/40'}`} />
                      <div className={`text-sm font-semibold ${watch('role') === 'worker' ? 'text-primary' : 'text-base-content'}`}>Worker</div>
                      <div className="text-xs text-base-content/50 mt-1">Complete tasks & earn</div>
                    </div>
                  </label>
                  <label className={`cursor-pointer transition-all duration-300 ${watch('role') === 'buyer' ? 'ring-2 ring-primary' : 'ring-1 ring-base-300'} rounded-lg p-3 bg-base-100`}>
                    <input {...register('role')} type="radio" value="buyer" className="hidden" />
                    <div className="text-center">
                      <Briefcase size={24} className={`mx-auto mb-2 ${watch('role') === 'buyer' ? 'text-primary' : 'text-base-content/40'}`} />
                      <div className={`text-sm font-semibold ${watch('role') === 'buyer' ? 'text-primary' : 'text-base-content'}`}>Buyer</div>
                      <div className="text-xs text-base-content/50 mt-1">Post tasks & hire</div>
                    </div>
                  </label>
                </div>
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
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: 'Password must contain uppercase, lowercase, and numbers',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                <p className="text-xs text-base-content/40 mt-1">Must contain uppercase, lowercase, and numbers</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                  <input
                    {...register('confirmPassword', {
                      required: 'Confirm password is required',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>

              {/* Photo URL Field */}
              <div>
                <label className="block text-sm font-medium text-base-content/80 mb-2">
                  Profile Photo URL <span className="text-base-content/40 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                  <input
                    {...register('photoURL')}
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-base-content/60 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Illustration - Right Side */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-primary rounded-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 w-fit">
              <Shield size={16} />
              <span className="text-sm font-medium">Secure Registration</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Get Started Today!
            </h2>
            
            <p className="text-white/90 mb-8 leading-relaxed">
              Choose your role and start your journey with us. Whether you want to earn or hire, we've got you covered.
            </p>
            
            <div className="space-y-3">
              {[
                "Worker - Earn money completing tasks",
                "Buyer - Post tasks for workers",
                "Instant Setup - Start in minutes",
                "Safe & Secure Platform",
                "24/7 Customer Support"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Bonus Info */}
            <div className="mt-8 p-4 bg-primary rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-sm font-semibold">Welcome Bonus!</span>
              </div>
              <p className="text-xs opacity-90">
                Workers get 10 free coins • Buyers get 50 free coins on registration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;