"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const NotifyMeButton = ({ projectId, onNotificationAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // Check if user is already subscribed on component mount
  useEffect(() => {
    checkSubscriptionStatus();
  }, [projectId]);

  const checkSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/user/notifications`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data?.success) {
        const isSubscribed = response.data.notifications?.some(
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
      if (!token) {
        setShowLoginModal(true);
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}/notify`,
        { 
          message: 'Please notify me about updates to this project',
          requestDetails: true // Request all project details via email
        },
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
      } else {
        setMessage('Failed to subscribe to notifications. Please try again.');
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

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}/notify`,
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
    <>
      <div className="notify-me-container">
        <div className="d-flex align-items-center gap-2 mb-2">
          {!isNotified ? (
            <button
              className="btn text-white"
              style={{
                backgroundColor: '#0f8363',
                borderColor: '#0f8363',
                fontWeight: 600,
                fontSize: '14px',
                padding: '8px 16px',
                borderRadius: '6px'
              }}
              onClick={handleNotifyMe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="fas fa-bell me-2"></i>
                  Notify Me
                </>
              )}
            </button>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-success btn-sm"
                disabled
                style={{ fontWeight: 600 }}
              >
                <i className="fas fa-check me-2"></i>
                Subscribed
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleRemoveNotification}
                disabled={isLoading}
                title="Unsubscribe from notifications"
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="fas fa-times"></i>
                )}
              </button>
            </div>
          )}
        </div>
        
        {message && (
          <div className={`alert ${
            message.includes('Failed') || message.includes('error') 
              ? 'alert-danger' 
              : message.includes('Success') || message.includes('✅')
                ? 'alert-success'
                : 'alert-info'
          } alert-dismissible fade show`} role="alert">
            <small>{message}</small>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMessage('')}
              aria-label="Close"
            ></button>
          </div>
        )}
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-sign-in-alt me-2 text-primary"></i>
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
                  <i className="fas fa-bell fa-3x text-primary mb-3"></i>
                  <h6>Get Project Notifications</h6>
                  <p className="text-muted mb-4">
                    Please login to subscribe to project notifications. You will receive:
                  </p>
                  <ul className="list-unstyled text-start">
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Project updates and announcements
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Detailed project information via email
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Price updates and special offers
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      Launch notifications and pre-booking alerts
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
    </>
  );
};

export default NotifyMeButton;