"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const EnhancedNotifyMeButton = ({
  projectId,
  onNotificationAdded,
  className = '',
  variant = 'default',
  showViewButton = true,
  onViewDetails
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const { auth, isAuthenticated } = useAuth();

  useEffect(() => {
    checkSubscriptionStatus();
  }, [projectId]);

  const checkSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

      const response = await axios.get(
        `${API_BASE_URL}/projects/user/notifications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        const notifications = response.data.data?.notifications || response.data.notifications || [];
        const isSubscribed = notifications.some(
          notification => notification.projectId === projectId && notification.status === 'active'
        );
        setIsNotified(isSubscribed);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const handleNotifyMe = async () => {
    try {
      setIsLoading(true);
      setMessage('');

      const token = localStorage.getItem('accessToken');
      if (!token || !isAuthenticated) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }

      if (!projectId) {
        setMessage('Error: Project ID is missing');
        setIsLoading(false);
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';
      const userInfo = auth?.user || auth || {};
      const userName = userInfo.name || userInfo.firstName || userInfo.username || userInfo.displayName || 'Anonymous User';
      const userEmail = userInfo.email || '';
      const userPhone = userInfo.phone || userInfo.phoneNumber || '';

      const finalPayload = {
        name: userName || 'User',
        email: userEmail || '',
        phone: userPhone || '',
        message: 'Please notify me about updates to this project',
        requestDetails: true
      };

      const response = await axios.post(
        `${API_BASE_URL}/projects/${projectId}/notify`,
        finalPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        setIsNotified(true);
        setMessage('✅ Success! You will be notified about updates and project details have been sent to your email!');
        if (onNotificationAdded) {
          onNotificationAdded();
        }
      }
    } catch (error) {
      console.error('Error adding notification:', error);

      if (error.response?.status === 409) {
        setMessage('You are already subscribed to notifications for this project');
        setIsNotified(true);
      } else if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else if (error.response?.status === 500) {
        setMessage('Server error. Please try again later or contact support.');
      } else if (error.response?.status === 404) {
        setMessage('Project not found. Please refresh the page and try again.');
      } else {
        setMessage(`Failed to subscribe to notifications: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveNotification = async () => {
    try {
      setIsLoading(true);
      setMessage('');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

      const response = await axios.delete(
        `${API_BASE_URL}/projects/${projectId}/notify`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        setIsNotified(false);
        setMessage('Notification subscription removed successfully');
        if (onNotificationAdded) {
          onNotificationAdded();
        }
      }
    } catch (error) {
      console.error('Error removing notification:', error);
      setMessage('Failed to remove notification subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    router.push('/login');
  };

  return (
    <div className="notify-me-container">
      <div className="button-group mb-2">
        {!isNotified ? (
          <button
            className={`enhanced-notify-btn text-white ${variant === 'apply' ? 'btn-apply' :
              variant === 'notify' ? 'btn-notify' : 'btn-default'
              } ${className}`}
            onClick={handleNotifyMe}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner me-2" role="status" aria-hidden="true">
                  <i className="fas fa-spinner"></i>
                </span>
                {variant === 'apply' ? 'Applying...' : 'Adding...'}
              </>
            ) : (
              <>
                <i className="fas fa-bell bell-icon me-2"></i>
                {variant === 'apply' ? 'Apply Now' : 'Notify Me'}
              </>
            )}
          </button>
        ) : (
          <div>
            <button
              className={`success-btn text-white ${variant === 'apply' ? '' : 'btn-sm'} ${className}`}
              disabled
              style={{
                fontWeight: 700,
                padding: variant === 'apply' ? '14px 32px' : '10px 20px',
                borderRadius: variant === 'apply' ? '30px' : '20px',
                textTransform: variant === 'apply' ? 'uppercase' : 'none',
                letterSpacing: variant === 'apply' ? '0.8px' : '0.5px',
                fontSize: '14px',
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fas fa-check me-2" style={{
                animation: 'checkPulse 2s infinite',
                color: '#fff'
              }}></i>
              {variant === 'apply' ? 'Applied' : 'Notified'}
            </button>
          </div>
        )}

        {showViewButton && (
          <button
            className="creative-view-btn"
            onClick={onViewDetails}
            title="View detailed project information"
          >
            <i className="fas fa-eye eye-icon"></i>
            <span className="view-text">View Details</span>
          </button>
        )}
      </div>

      {message && (
        <div
          className={`enhanced-alert ${message.includes('Failed') || message.includes('error')
            ? 'alert-danger'
            : message.includes('Success') || message.includes('✅')
              ? 'alert-success'
              : 'alert-info'
            } alert-dismissible fade show`}
          role="alert"
        >
          <small>{message}</small>
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {showLoginModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login Required
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLoginModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div className="mb-4">
                    <i className="fas fa-bell" style={{ fontSize: '3.5rem', color: 'var(--color-primary)' }}></i>
                  </div>
                  <h6>Get Project Notifications</h6>
                  <p className="mb-4">
                    Please login to subscribe to project notifications. You will receive:
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <span>Project updates and announcements</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <span>Detailed project information via email</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <span>Price updates and special offers</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <span>Launch notifications and pre-booking alerts</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLogin}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .notify-me-container {
          position: relative;
        }

        .button-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .enhanced-notify-btn {
          position: relative;
          overflow: hidden;
          border: none;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          box-shadow: 0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
          cursor: pointer;
        }

        /* Make actions full width when placed in a stacked layout */
        .button-group .btn,
        .button-group .enhanced-notify-btn,
        .button-group .creative-view-btn {
          min-width: 0;
        }

        .btn-apply {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%);
          padding: 14px 28px;
          border-radius: 30px;
        }

        .btn-notify {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%);
          padding: 12px 24px;
          border-radius: 25px;
        }

        .btn-default {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-700) 100%);
          padding: 10px 20px;
          border-radius: 20px;
        }

        .success-btn {
          background: linear-gradient(135deg, var(--color-success) 0%, color-mix(in srgb, var(--color-success) 70%, transparent) 100%);
          border: none;
        }

        .remove-btn {
          background: linear-gradient(135deg, var(--color-danger) 0%, color-mix(in srgb, var(--color-danger) 70%, transparent) 100%);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .creative-view-btn {
          background: var(--color-bg);
          border: 2px solid var(--color-primary);
          padding: 12px 20px;
          border-radius: 30px;
          color: var(--color-primary);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          cursor: pointer;
        }

        .eye-icon {
          margin-right: 8px;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes checkPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        /* Alert styling consistent with detail page */
        .enhanced-alert {
          border-left: 4px solid color-mix(in srgb, var(--color-primary) 60%, transparent);
          background: color-mix(in srgb, var(--color-primary) 6%, white);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default EnhancedNotifyMeButton;