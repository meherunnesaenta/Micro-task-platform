import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, Home, User, Mail, Phone, MapPin, Calendar, Shield, Camera, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const infoItems = [
    { label: 'Full Name', value: formData.name, icon: <User size={16} />, key: 'name' },
    { label: 'Email Address', value: formData.email, icon: <Mail size={16} />, key: 'email' },
    { label: 'Phone Number', value: formData.phone || 'Not provided', icon: <Phone size={16} />, key: 'phone' },
    { label: 'Address', value: formData.address || 'Not provided', icon: <MapPin size={16} />, key: 'address' },
    { label: 'City', value: formData.city || 'Not provided', icon: <MapPin size={16} />, key: 'city' },
    { label: 'Country', value: formData.country || 'Not provided', icon: <MapPin size={16} />, key: 'country' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-3">
            <Shield size={14} className="text-primary" />
            <span className="text-primary font-semibold text-sm">Admin Profile</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-base-content">Profile Settings</h1>
          <p className="text-base-content/60 mt-1">Manage your admin account information</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors text-sm font-medium"
          onClick={() => navigate('/dashboard/admin/home')}
        >
          <Home size={16} />
          Back to Home
        </button>
      </div>

      {/* Profile Container */}
      <div className="bg-base-200 rounded-2xl overflow-hidden">
        
        {/* Profile Header Card */}
        <div className="bg-primary p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=ffffff&color=3b82f6&bold=true&length=2&size=120`}
                  alt={user?.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg">
                  <Camera size={14} className="text-primary" />
                </button>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">{user?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield size={14} className="text-yellow-300" />
                  <p className="text-white/90">Administrator</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-white/80">Verified Account</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {user?.joinDate ? new Date(user.joinDate).getFullYear() : '2024'}
                </div>
                <div className="text-xs text-white/70">Member Since</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center gap-1">
                  <Calendar size={18} />
                  Active
                </div>
                <div className="text-xs text-white/70">Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-base-300">
            <h3 className="text-xl font-bold text-base-content">Personal Information</h3>
            {!isEditing && (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            // Edit Mode Form
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-base-300 border border-base-300 cursor-not-allowed"
                  />
                  <small className="text-xs text-base-content/40">Email cannot be changed</small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-base-content/80 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className="w-full px-4 py-2.5 rounded-lg bg-base-100 border border-base-300 focus:border-primary focus:outline-none transition-colors"
                    rows="4"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg border border-base-300 text-base-content/70 hover:bg-base-300 transition-colors flex items-center gap-2"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X size={16} /> Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            // Display Mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-base-100">
                  <div className="text-primary mt-0.5">{item.icon}</div>
                  <div>
                    <label className="text-xs text-base-content/50 uppercase tracking-wide">{item.label}</label>
                    <p className="text-base-content font-medium mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="md:col-span-2 flex items-start gap-3 p-3 rounded-lg bg-base-100">
                <div className="text-primary mt-0.5"><User size={16} /></div>
                <div className="flex-1">
                  <label className="text-xs text-base-content/50 uppercase tracking-wide">Bio</label>
                  <p className="text-base-content mt-0.5">{formData.bio || 'No bio provided yet.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;