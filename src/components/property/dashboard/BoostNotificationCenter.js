'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BoostNotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Set up periodic refresh
      const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Simulated notifications - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: 'boost_expiry_warning',
          title: 'Boost Expiring Soon',
          message: 'Your boost for "Luxury Villa in Dubai" expires in 2 days',
          propertyId: '6853021f8f6432d42b356c83',
          propertyTitle: 'Luxury Villa in Dubai',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          priority: 'high',
          actionUrl: '/dashboard/my-boosted-properties'
        },
        {
          id: 2,
          type: 'boost_activated',
          title: 'Boost Activated',
          message: 'Your property "Modern Apartment" is now boosted for 7 days',
          propertyId: '689d53711d54dae949df6a82',
          propertyTitle: 'Modern Apartment',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          priority: 'medium',
          actionUrl: '/dashboard/my-boosted-properties'
        },
        {
          id: 3,
          type: 'payment_success',
          title: 'Payment Successful',
          message: 'Payment of AED 50 processed successfully for property boost',
          propertyId: '689d53711d54dae949df6a82',
          propertyTitle: 'Modern Apartment',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          priority: 'low',
          actionUrl: '/dashboard/user/payments'
        },
        {
          id: 4,
          type: 'performance_update',
          title: 'Great Performance!',
          message: 'Your boosted property got 50+ views today',
          propertyId: '6853021f8f6432d42b356c83',
          propertyTitle: 'Luxury Villa in Dubai',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          read: false,
          priority: 'medium',
          actionUrl: '/dashboard/boost-analytics/6853021f8f6432d42b356c83'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // API call to mark notification as read would go here
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // API call to mark all notifications as read would go here
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowPanel(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'boost_expiry_warning':
        return 'fas fa-exclamation-triangle text-warning';
      case 'boost_activated':
        return 'fas fa-rocket text-success';
      case 'payment_success':
        return 'fas fa-check-circle text-success';
      case 'payment_failed':
        return 'fas fa-times-circle text-danger';
      case 'performance_update':
        return 'fas fa-chart-line text-info';
      default:
        return 'fas fa-bell text-info';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge bg-danger';
      case 'medium':
        return 'badge bg-warning';
      case 'low':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className="boost-notification-center position-relative">
      {/* Notification Bell */}
      <button
        className="btn btn-outline-primary position-relative"
        onClick={() => setShowPanel(!showPanel)}
        title="Boost Notifications"
        style={{
          border: 'none',
          background: 'transparent',
          fontSize: '18px',
          padding: '8px 12px'
        }}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '10px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <>
          <div 
            className="position-absolute bg-white border rounded shadow-lg"
            style={{
              top: '100%',
              right: 0,
              width: '400px',
              maxHeight: '500px',
              zIndex: 1050,
              marginTop: '5px'
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h6 className="mb-0">
                <i className="fas fa-bell me-2"></i>
                Boost Notifications
              </h6>
              <div>
                {unreadCount > 0 && (
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowPanel(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  <i className="fas fa-bell-slash fa-2x mb-2"></i>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-bottom cursor-pointer ${!notification.read ? 'bg-light' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (notification.read) {
                        e.target.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (notification.read) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <i className={getNotificationIcon(notification.type)}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
                            {notification.title}
                          </h6>
                          <div className="d-flex align-items-center">
                            <span className={getPriorityBadge(notification.priority)} style={{ fontSize: '10px' }}>
                              {notification.priority}
                            </span>
                            {!notification.read && (
                              <span className="badge bg-primary ms-1" style={{ fontSize: '8px' }}>
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="mb-1 text-muted" style={{ fontSize: '13px' }}>
                          {notification.message}
                        </p>
                        {notification.propertyTitle && (
                          <p className="mb-1 text-primary" style={{ fontSize: '12px' }}>
                            <i className="fas fa-home me-1"></i>
                            {notification.propertyTitle}
                          </p>
                        )}
                        <small className="text-muted">
                          {formatTimestamp(notification.timestamp)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2 border-top text-center">
                <button 
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() => {
                    setShowPanel(false);
                    router.push('/dashboard/notifications');
                  }}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>

          {/* Overlay to close panel when clicking outside */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1040 }}
            onClick={() => setShowPanel(false)}
          ></div>
        </>
      )}
    </div>
  );
};

export default BoostNotificationCenter;