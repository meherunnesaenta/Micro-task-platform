import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { notificationAPI } from '../../utils/endpoints';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 10000); // 10s poll

    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const response = await notificationAPI.getNotifications(5);
      setNotifications(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    try {
      await notificationAPI.markAllAsRead();
      setUnreadCount(0);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  return (
    <div className="notification-bell">
      <button 
        className="notification-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="mark-read-btn">
                Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            <div className="notification-list">
              {notifications.map((notif) => (
                <div key={notif._id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
          
          <button className="view-all-btn" onClick={() => window.location.href = '/dashboard/notifications'}>
            View all
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

