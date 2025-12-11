"use client";
import React, { useState, useEffect } from 'react';
import api from '@/axios/axios.interceptor';
import { usePaymentHistory } from '@/hooks/useSubscriptionData';
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import "@/styles/payments-dashboard.css";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    totalSpent: 0,
    completedCount: 0,
    successRate: 0
  });
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Fetch payment data from API
  useEffect(() => {
    fetchPaymentHistory();
    // Test the enhanced boost routes
    testEnhancedBoostRoutes();
  }, [filter]);

  const testEnhancedBoostRoutes = async () => {
    try {
      console.log('Testing enhanced boost routes...');
      const response = await api.get('/enhanced-boost/test');
      console.log('Enhanced boost test response:', response.data);
    } catch (error) {
      console.error('Enhanced boost test error:', error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        status: filter === 'all' ? 'all' : filter,
        limit: 100, // Get more records for client-side filtering
        offset: 0,
        _t: Date.now() // Cache busting parameter
      };

      const response = await api.get('/subscription/payment-history', { params });
      
      if (response.data.success) {
        const { payments: paymentData, summary: summaryData } = response.data.data;
        
        // Transform the data to match the expected format
        const transformedPayments = paymentData.map(payment => ({
          id: payment.id,
          date: new Date(payment.date).toISOString(),
          amount: payment.amount,
          currency: payment.currency || 'AED',
          type: payment.planName || 'Property Boost',
          status: mapStatus(payment.status),
          description: payment.description || `${payment.planName} for ${payment.propertyTitle}`,
          paymentMethod: getPaymentMethodDisplay(payment.paymentMethod),
          transactionId: payment.transactionId || payment.id,
          propertyTitle: payment.propertyTitle,
          planDuration: payment.planDuration
        }));

        setPayments(transformedPayments);
        setSummary({
          totalTransactions: summaryData.totalTransactions,
          totalSpent: summaryData.totalSpent,
          completedCount: summaryData.completedCount,
          successRate: summaryData.successRate
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch payment history');
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        setError('Please log in to view your payment history.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view this data.');
      } else if (error.response?.status === 404) {
        setError('Payment history service not found. Please contact support.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.message || 'Failed to load payment history. Please try again.');
      }
      
      setPayments([]);
      setSummary({
        totalTransactions: 0,
        totalSpent: 0,
        completedCount: 0,
        successRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Map backend status to frontend status
  const mapStatus = (backendStatus) => {
    const statusMap = {
      'active': 'completed',
      'pending': 'pending',
      'failed': 'failed',
      'expired': 'completed',
      'cancelled': 'failed'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  // Get payment method display name
  const getPaymentMethodDisplay = (method) => {
    const methodMap = {
      'stripe': 'Credit Card',
      'paypal': 'PayPal',
      'bank_transfer': 'Bank Transfer'
    };
    return methodMap[method] || 'Credit Card';
  };

  // Format date consistently
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format time consistently
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'pending-style style2', // Green - matches theme
      pending: 'pending-style style1',    // Yellow - matches theme  
      failed: 'pending-style',            // Red - matches theme
      refunded: 'pending-style style3'    // Blue - matches theme
    };
    
    return (
      <span className={statusClasses[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (payment.propertyTitle && payment.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading) {
    return (
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
          <div className="col-lg-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    );
  }

  if (error) {
    return (
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
          <div className="col-lg-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 overflow-hidden position-relative">
              <div className="text-center py-5">
                <i className="flaticon-warning text-danger" style={{ fontSize: '4rem' }}></i>
                <h5 className="text-danger mt-3">Error Loading Payments</h5>
                <p className="text-muted">{error}</p>
                <button 
                  className="ud-btn btn-thm mt-3"
                  onClick={fetchPaymentHistory}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    );
  }

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <DboardMobileNavigation />
        </div>
        {/* End .col-12 */}

        <div className="col-lg-12">
          <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
            {/* Page Header */}
            <div className="dashboard_title_area">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                <div>
                  <h2>Payment History</h2>
                  <p className="text">Manage your payments and transaction history</p>
                </div>
                <button 
                  className="ud-btn btn-white"
                  onClick={fetchPaymentHistory}
                  disabled={loading}
                >
                  <i className={`flaticon-refresh me-2 ${loading ? 'fa-spin' : ''}`} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}></i>
                  Refresh
                </button>
              </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="row mb-4">
              <div className="col-6 col-md-3 mb-3">
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 p-sm-30 overflow-hidden position-relative stats-card">
                  <div className="d-flex align-items-center h-100">
                    <div className="icon-container me-2 me-sm-3">
                      <span className="icon flaticon-credit-card text-primary" style={{ fontSize: '1.5rem' }}></span>
                    </div>
                    <div className="details">
                      <p className="text mb-1 small">Total Spent</p>
                      <h4 className="title text-primary" style={{ fontSize: '1.25rem' }}>AED {summary.totalSpent.toLocaleString()}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 p-sm-30 overflow-hidden position-relative stats-card">
                  <div className="d-flex align-items-center h-100">
                    <div className="icon-container me-2 me-sm-3">
                      <span className="icon flaticon-check text-success" style={{ fontSize: '1.5rem' }}></span>
                    </div>
                    <div className="details">
                      <p className="text mb-1 small">Completed</p>
                      <h4 className="title text-success" style={{ fontSize: '1.25rem' }}>{summary.completedCount}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 p-sm-30 overflow-hidden position-relative stats-card">
                  <div className="d-flex align-items-center h-100">
                    <div className="icon-container me-2 me-sm-3">
                      <span className="icon flaticon-clock text-warning" style={{ fontSize: '1.5rem' }}></span>
                    </div>
                    <div className="details">
                      <p className="text mb-1 small">Pending</p>
                      <h4 className="title text-warning" style={{ fontSize: '1.25rem' }}>{payments.filter(p => p.status === 'pending').length}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3 mb-3">
                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p20 p-sm-30 overflow-hidden position-relative stats-card">
                  <div className="d-flex align-items-center h-100">
                    <div className="icon-container me-2 me-sm-3">
                      <span className="icon flaticon-close text-danger" style={{ fontSize: '1.5rem' }}></span>
                    </div>
                    <div className="details">
                      <p className="text mb-1 small">Failed</p>
                      <h4 className="title text-danger" style={{ fontSize: '1.25rem' }}>{payments.filter(p => p.status === 'failed').length}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="row align-items-center mb-4">
              <div className="col-lg-6 col-12 mb-3 mb-lg-0">
                <div className="d-flex flex-wrap gap-2">
                  <button 
                    className={`ud-btn btn-sm ${filter === 'all' ? 'btn-thm' : 'btn-white'}`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`ud-btn btn-sm ${filter === 'completed' ? 'btn-thm' : 'btn-white text-success border-success'}`}
                    onClick={() => setFilter('completed')}
                  >
                    Completed
                  </button>
                  <button 
                    className={`ud-btn btn-sm ${filter === 'pending' ? 'btn-thm' : 'btn-white text-warning border-warning'}`}
                    onClick={() => setFilter('pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className={`ud-btn btn-sm ${filter === 'failed' ? 'btn-thm' : 'btn-white text-danger border-danger'}`}
                    onClick={() => setFilter('failed')}
                  >
                    Failed
                  </button>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="search-box">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-group-text">
                      <i className="flaticon-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            {filteredPayments.length === 0 ? (
              <div className="text-center py-5">
                <i className="flaticon-receipt text-muted" style={{ fontSize: '4rem' }}></i>
                <h5 className="text-muted mt-3">
                  {payments.length === 0 ? 'No payment history' : 'No payments found'}
                </h5>
                <p className="text-muted">
                  {payments.length === 0 
                    ? 'You haven\'t made any payments yet.' 
                    : 'Try adjusting your search criteria'
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="table-responsive d-none d-lg-block">
                  <table className="table-style3 table at-savesearch">
                    <thead className="t-head">
                      <tr>
                        <th scope="col">Payment ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Description</th>
                        <th scope="col">Type</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Method</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody className="t-body">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="ps20">
                            <div className="list-item">
                              <div className="list-content">
                                <p className="list-text body-color">{payment.id}</p>
                                <p className="list-text2 body-color">{payment.transactionId}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="list-item">
                              <div className="list-content">
                                <p className="list-text body-color">{formatDate(payment.date)}</p>
                                <p className="list-text2 body-color">{formatTime(payment.date)}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="list-item">
                              <div className="list-content">
                                <p className="list-text body-color">{payment.description}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="status-tag style3">{payment.type}</span>
                          </td>
                          <td>
                            <div className="list-item">
                              <div className="list-content">
                                <p className="list-text body-color fw-bold">{payment.currency} {payment.amount}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className={`flaticon-${payment.paymentMethod === 'Credit Card' ? 'credit-card' : 
                                payment.paymentMethod === 'PayPal' ? 'paypal' : 'bank'} me-2 text-muted`}></i>
                              <span className="body-color">{payment.paymentMethod}</span>
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(payment.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="d-lg-none">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="mobile-payment-card p15 p-sm-20 border-bottom">
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1" style={{ fontSize: '0.875rem' }}>{payment.id}</h6>
                              <p className="text-muted small mb-0">{payment.transactionId}</p>
                            </div>
                            {getStatusBadge(payment.status)}
                          </div>
                          
                          <div className="mb-2">
                            <p className="mb-1 fw-medium" style={{ fontSize: '0.875rem' }}>{payment.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="status-tag style3">{payment.type}</span>
                              <span className="fw-bold text-primary">{payment.currency} {payment.amount}</span>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <i className={`flaticon-${payment.paymentMethod === 'Credit Card' ? 'credit-card' : 
                                payment.paymentMethod === 'PayPal' ? 'paypal' : 'bank'} me-2 text-muted`}></i>
                              <span className="small">{payment.paymentMethod}</span>
                            </div>
                            <div className="small text-muted">
                              {formatDate(payment.date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {filteredPayments.length > 0 && (
              <div className="row align-items-center mt-4 pt-3 border-top">
                <div className="col-md-6 col-12 mb-2 mb-md-0">
                  <div className="text-muted">
                    Showing {filteredPayments.length} of {summary.totalTransactions} payments
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <nav className="d-flex justify-content-md-end justify-content-center">
                    <div className="mbp_pagination">
                      <ul className="page_navigation">
                        <li className="page-item disabled">
                          <a className="page-link" href="#" tabIndex="-1">
                            <span className="fas fa-angle-left"></span>
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">1</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">2</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            <span className="fas fa-angle-right"></span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardContentWrapper>
  );
};

export default PaymentsPage;