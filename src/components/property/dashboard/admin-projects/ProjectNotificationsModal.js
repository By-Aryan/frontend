"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProjectNotificationsModal = ({ project, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('active');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    return null;
  };

  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    if (isOpen && project) {
      fetchNotifications();
      fetchStats();
    }
  }, [isOpen, project, currentPage, activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/projects/admin/${project._id}/notifications?page=${currentPage}&limit=10&status=${activeTab}`,
        axiosConfig
      );

      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/admin/${project._id}/notifications/stats`,
        axiosConfig
      );

      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !project) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-bell me-2"></i>
              Notifications for: {project.title}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Statistics Cards */}
            {stats && (
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{stats.active}</h5>
                      <p className="card-text">Active Requests</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title text-success">{stats.notified}</h5>
                      <p className="card-text">Notified Users</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title text-secondary">{stats.cancelled}</h5>
                      <p className="card-text">Cancelled</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title text-info">{stats.total}</h5>
                      <p className="card-text">Total Requests</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-3">

              <button 
                className="btn btn-outline-secondary"
                onClick={fetchNotifications}
              >
                <i className="fas fa-refresh me-1"></i>
                Refresh
              </button>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                  onClick={() => {setActiveTab('active'); setCurrentPage(1);}}
                >
                  Active ({stats?.active || 0})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'notified' ? 'active' : ''}`}
                  onClick={() => {setActiveTab('notified'); setCurrentPage(1);}}
                >
                  Notified ({stats?.notified || 0})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => {setActiveTab('cancelled'); setCurrentPage(1);}}
                >
                  Cancelled ({stats?.cancelled || 0})
                </button>
              </li>
            </ul>

            {/* Notifications Table */}
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                    {activeTab === 'notified' && <th>Notified Date</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={activeTab === 'notified' ? 6 : 5} className="text-center">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : notifications.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'notified' ? 6 : 5} className="text-center text-muted">
                        No {activeTab} notification requests found
                      </td>
                    </tr>
                  ) : (
                    notifications.map((notification) => (
                      <tr key={notification._id}>
                        <td>
                          <div>
                            <strong>{notification.name || notification.userId?.name}</strong>
                            {notification.userId?.role && (
                              <span className="badge badge-secondary ms-1">
                                {notification.userId.role}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{notification.email || notification.userId?.email}</td>
                        <td>{notification.phone || notification.userId?.phone || '-'}</td>
                        <td>
                          {notification.message ? (
                            <span title={notification.message}>
                              {notification.message.length > 50 
                                ? `${notification.message.substring(0, 50)}...`
                                : notification.message
                              }
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          <small>{formatDate(notification.createdAt)}</small>
                        </td>
                        {activeTab === 'notified' && (
                          <td>
                            <small>{notification.notifiedAt ? formatDate(notification.notifiedAt) : '-'}</small>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNotificationsModal;