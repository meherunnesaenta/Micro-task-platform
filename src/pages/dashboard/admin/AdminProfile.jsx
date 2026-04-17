import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Edit2, Save, X, Home } from 'lucide-react';
import '../../../styles/buyer-dashboard.css';
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
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
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

  return (
    <div className="buyer-profile">
      <div className="page-header">
        <div>
          <h1>Admin Profile Settings</h1>
          <p>Manage your admin account information</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard/admin/home')}
        >
          <Home size={18} /> Back to Home
        </button>
      </div>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <img
              src={user?.photoURL || 'https://via.placeholder.com/120'}
              alt={user?.name}
              className="profile-avatar"
            />
            <div className="profile-basic-info">
              <h2>{user?.name}</h2>
              <p>Administrator</p>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{user?.joinDate ? new Date(user.joinDate).getFullYear() : new Date().getFullYear()}</span>
              <span className="stat-label">Member Since</span>
            </div>
            <div className="stat">
              <span className="stat-value">Active</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form-section">
          <div className="form-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={18} /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="form-input"
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className="form-textarea"
                    rows="4"
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{formData.name}</p>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{formData.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <p>{formData.phone || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Address</label>
                  <p>{formData.address || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <p>{formData.city || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Country</label>
                  <p>{formData.country || 'Not provided'}</p>
                </div>
                <div className="info-item full-width">
                  <label>Bio</label>
                  <p>{formData.bio || 'Not provided'}</p>
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
