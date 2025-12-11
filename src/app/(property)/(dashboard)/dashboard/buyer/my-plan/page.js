"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SidebarDashboard from '@/components/property/dashboard/SidebarDashboard';
import DboardMobileNavigation from '@/components/property/dashboard/DboardMobileNavigation';
import '@/styles/favourites-layout.css';
import styles from './my-plan.module.css';

const MyPlanPage = () => {
  const [planData, setPlanData] = useState(null);
  const [contactViews, setContactViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    // Add your page change logic here
  };

  const fetchPlanData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/buyer/plan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlanData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      toast.error('Failed to fetch plan data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

const MyPlanPage = () => {
  const [planData, setPlanData] = useState(null);
  const [contactViews, setContactViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    // Add your page change logic here
  };

  const fetchPlanData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/buyer/plan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlanData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      toast.error('Failed to fetch plan data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  // Loading state
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="dashboard_content_wrapper">
      <div className="dashboard dashboard_wrapper pr30 pr0-xl">
        <SidebarDashboard />
        <div className="dashboard__main pl0-md">
          <div className="dashboard__content bgc-f7">
            <div className="row">
              <div className="col-lg-12">
                <DboardMobileNavigation />
              </div>
            </div>
            <div className="row align-items-center pb20">
              <div className="col-lg-12">
                <div className="dashboard_title_area text-center">
                  <h2 className="mb-2">My Plan</h2>
                  <p className="text text-muted">Manage your subscription and view usage details</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div style={{ maxWidth: '950px', width: '100%', margin: '40px auto 0 auto' }}>
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                  {/* Plan Cards */}
                  {planData && (
                    <div className="row mb-4 justify-content-center">
                      <div className="col-lg-6 col-md-6 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body text-center">
                            <div className={styles['plan-icon'] + ' mb-3'}>
                              <i className="fas fa-eye fa-2x text-primary"></i>
                            </div>
                            <h6 className="card-title">Contact Views</h6>
                            <div className="plan-stats">
                              <div className={styles['stat-number']}>{planData.contactViewsUsed}/{planData.contactViewsLimit}</div>
                              <div className={styles.progress + ' mt-2'}>
                                <div 
                                  className="progress-bar bg-primary" 
                                  style={{ width: `${planData.usage.contactViewsPercentage}%` }}
                                ></div>
                              </div>
                              <small className="text-muted">{planData.contactViewsRemaining} remaining</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body text-center">
                            <div className={styles['plan-icon'] + ' mb-3'}>
                              <i className="fas fa-star fa-2x text-warning"></i>
                            </div>
                            <h6 className="card-title">Featured Listings</h6>
                            <div className="plan-stats">
                              <div className={styles['stat-number']}>{planData.featuredListingsUsed}/{planData.featuredListingsLimit}</div>
                              <div className={styles.progress + ' mt-2'}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  style={{ width: `${planData.usage.featuredListingsPercentage}%` }}
                                ></div>
                              </div>
                              <small className="text-muted">{planData.featuredListingsRemaining} remaining</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Tabs */}
                  <ul className={styles['nav-tabs'] + ' mb-4'}>
                    <li className="nav-item">
                      <button 
                        className={`${styles['nav-link']}${activeTab === 'overview' ? ` ${styles.active}` : ''}`}
                        onClick={() => setActiveTab('overview')}
                      >
                        Overview
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`${styles['nav-link']}${activeTab === 'contact-views' ? ` ${styles.active}` : ''}`}
                        onClick={() => setActiveTab('contact-views')}
                      >
                        Contact Views
                      </button>
                    </li>
                  </ul>
                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <div className={styles['plan-info']}>
                      <div className={styles['info-item']}>
                        <span className={styles.label}>Plan Name</span>
                        <span className={styles.value}>{planData?.planName || 'N/A'}</span>
                      </div>
                      <div className={styles['info-item']}>
                        <span className={styles.label}>Start Date</span>
                        <span className={styles.value}>{planData?.startDate ? new Date(planData.startDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className={styles['info-item']}>
                        <span className={styles.label}>End Date</span>
                        <span className={styles.value}>{planData?.endDate ? new Date(planData.endDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className={styles['info-item']}>
                        <span className={styles.label}>Status</span>
                        <span className={styles.value}>{planData?.status || 'N/A'}</span>
                      </div>
                    </div>
                  )}
                  {activeTab === 'contact-views' && (
                    <div className="contact-views-history">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Price</th>
                              <th>Contact Details</th>
                              <th>Viewed Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contactViews.length > 0 ? (
                              contactViews.map((view, index) => (
                                <tr key={index}>
                                  <td className="price-info">
                                    AED {view.price ? view.price.toFixed(2) : 'N/A'}
                                  </td>
                                  <td className="contact-details">
                                    <div className="property-info fw-bold">
                                      {view.contactType || 'Property Owner'}
                                    </div>
                                    <div className="contact-numbers">
                                      {view.phone || 'Not provided'}
                                    </div>
                                  </td>
                                  <td className="date-info text-muted">
                                    {new Date(view.viewedAt).toLocaleString() || 'N/A'}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="text-center">No contact views yet</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <ul className="pagination justify-content-center mt-4">
                        {hasPrevPage && (
                          <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                          </li>
                        )}
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li key={i + 1} className={`page-item${i + 1 === currentPage ? " active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        {hasNextPage && (
                          <li className="page-item">
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

}

export default MyPlanPage;