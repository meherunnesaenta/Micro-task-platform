import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Sparkles, Zap, Award, Clock, Eye } from 'lucide-react';
import { notificationAPI } from '../../utils/endpoints';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);

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
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
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
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      fetchNotifications();
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (message) => {
    if (message?.includes('approved') || message?.includes('earned')) 
      return <Sparkles size={14} className="text-green-500" />;
    if (message?.includes('Payment') || message?.includes('withdraw')) 
      return <Zap size={14} className="text-primary" />;
    if (message?.includes('task') || message?.includes('Task')) 
      return <Clock size={14} className="text-warning" />;
    return <Award size={14} className="text-accent" />;
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative p-2.5 rounded-full bg-base-200 hover:bg-base-300 transition-all duration-300"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <Bell size={18} className="text-base-content" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-96 z-50 animate-slide-in-right">
          <div className="bg-base-100 rounded-xl shadow-2xl border border-base-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-base-200 flex items-center justify-between bg-base-50">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary" />
                <h3 className="font-bold text-base-content">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-medium"
                >
                  <Check size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="loading-spinner w-6 h-6"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10">
                  <Bell size={32} className="mx-auto text-base-content/20 mb-3" />
                  <p className="text-base-content/50 text-sm font-medium">No notifications</p>
                  <p className="text-xs text-base-content/30 mt-1">We'll notify you when something happens</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`relative px-4 py-3 border-b border-base-100 hover:bg-base-100 transition-all duration-200 cursor-pointer group
                        ${!notif.isRead ? 'bg-primary/5' : 'bg-base-50'}`}
                      onClick={() => !notif.isRead && markAsRead(notif._id)}
                    >
                      {/* Unread Indicator */}
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
                      )}
                      
                      <div className="flex items-start gap-3 pl-2">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center
                            ${!notif.isRead ? 'bg-primary/15' : 'bg-base-200'}`}>
                            {getNotificationIcon(notif.message)}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${!notif.isRead ? 'font-semibold text-base-content' : 'text-base-content/70'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-base-content/40">
                              {formatTime(notif.createdAt)}
                            </span>
                            {!notif.isRead && (
                              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full font-medium">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Mark as read button on hover */}
                        {!notif.isRead && (
                          <button 
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-base-200 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif._id);
                            }}
                            title="Mark as read"
                          >
                            <Check size={12} className="text-primary" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-base-200 bg-base-50">
              <Link 
                to="/dashboard/notifications"
                onClick={() => setShowDropdown(false)}
                className="block text-center text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center justify-center gap-1"
              >
                <Eye size={14} />
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;