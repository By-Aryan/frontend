'use client';
import React, { useState, useEffect } from 'react';

const PaymentHistoryDashboard = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, success, failed, pending
  const [dateRange, setDateRange] = useState('30'); // 30, 90, 365, all

  useEffect(() => {
    fetchPaymentHistory();
  }, [userId, filter, dateRange]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Simulated payment history - replace with actual API call
      const mockPayments = [
        {
          id: 'pay_1',
          propertyId: '6853021f8f6432d42b356c83',
          propertyTitle: 'Luxury Villa in Dubai',
          amount: 180,
          currency: 'AED',
          status: 'completed',
          paymentMethod: 'stripe',
          planName: 'Premium Boost Plan',
          planDuration: 30,
          transactionId: 'txn_1234567890',
          stripeSessionId: 'cs_test_1234567890',
          date: new Date('2024-10-01'),
          description: '30-day property boost',
          invoice: {
            number: 'INV-2024-001',
            downloadUrl: '/api/invoices/INV-2024-001.pdf'
          }
        },
        {
          id: 'pay_2',
          propertyId: '689d53711d54dae949df6a82',
          propertyTitle: 'Modern Apartment',
          amount: 50,
          currency: 'AED',
          status: 'completed',
          paymentMethod: 'stripe',
          planName: 'Standard Boost Plan',
          planDuration: 7,
          transactionId: 'txn_0987654321',
          stripeSessionId: 'cs_test_0987654321',
          date: new Date('2024-09-25'),
          description: '7-day property boost',
          invoice: {
            number: 'INV-2024-002',
            downloadUrl: '/api/invoices/INV-2024-002.pdf'
          }
        },
        {
          id: 'pay_3',
          propertyId: '68826d77f6705993238187ee',
          propertyTitle: '24-july property',
          amount: 30,
          currency: 'AED',
          status: 'failed',
          paymentMethod: 'stripe',
          planName: 'Basic Boost Plan',
          planDuration: 3,
          transactionId: null,
          stripeSessionId: 'cs_test_failed_123',
          date: new Date('2024-09-20'),
          description: '3-day property boost',
          failureReason: 'Insufficient funds',
          retryUrl: '/seller-pricing/68826d77f6705993238187ee'
        }
      ];
      
      // Apply filters
      let filteredPayments = mockPayments;
      
      if (filter !== 'all') {
        filteredPayments = filteredPayments.filter(p => p.status === filter);
      }
      
      if (dateRange !== 'all') {
        const days = parseInt(dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        filteredPayments = filteredPayments.filter(p => new Date(p.date) >= cutoffDate);
      }
      
      setPayments(filteredPayments);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'failed':
        return <span className="badge bg-danger">Failed</span>;
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'refunded':
        return <span className="badge bg-info">Refunded</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getTotalAmount = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getSuccessRate = () => {
    if (payments.length === 0) return 0;
    const successCount = payments.filter(p => p.status === 'completed').length;
    return ((successCount / payments.length) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading payment history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history-dashboard">
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-credit-card fa-2x mb-2"></i>
              <h4>{payments.length}</h4>
              <small>Total Transactions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-dollar-sign fa-2x mb-2"></i>
              <h4>AED {getTotalAmount()}</h4>
              <small>Total Spent</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-percentage fa-2x mb-2"></i>
              <h4>{getSuccessRate()}%</h4>
              <small>Success Rate</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-rocket fa-2x mb-2"></i>
              <h4>{payments.filter(p => p.status === 'completed').length}</h4>
              <small>Successful Boosts</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <label className="form-label me-2 mb-0">Status:</label>
                <select 
                  className="form-select form-select-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Payments</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <label className="form-label me-2 mb-0">Period:</label>
                <select 
                  className="form-select form-select-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="card">
        <div className="card-header">
          <h5><i className="fas fa-history me-2"></i>Payment History</h5>
        </div>
        <div className="card-body">
          {payments.length === 0 ? (
            <div className="text-center p-4 text-muted">
              <i className="fas fa-receipt fa-3x mb-3"></i>
              <h5>No payments found</h5>
              <p>No payment history matches your current filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Property</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <div>
                          <strong>{new Date(payment.date).toLocaleDateString()}</strong>
                          <br />
                          <small className="text-muted">
                            {new Date(payment.date).toLocaleTimeString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{payment.propertyTitle}</strong>
                          <br />
                          <small className="text-muted">
                            ID: {payment.propertyId.slice(-8)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{payment.planName}</strong>
                          <br />
                          <small className="text-muted">
                            {payment.planDuration} days
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong>{payment.currency} {payment.amount}</strong>
                      </td>
                      <td>
                        {getStatusBadge(payment.status)}
                        {payment.status === 'failed' && payment.failureReason && (
                          <div>
                            <small className="text-danger">
                              {payment.failureReason}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {payment.status === 'completed' && payment.invoice && (
                            <a 
                              href={payment.invoice.downloadUrl}
                              className="btn btn-outline-primary"
                              title="Download Invoice"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fas fa-download"></i>
                            </a>
                          )}
                          {payment.status === 'failed' && payment.retryUrl && (
                            <a 
                              href={payment.retryUrl}
                              className="btn btn-outline-warning"
                              title="Retry Payment"
                            >
                              <i className="fas fa-redo"></i>
                            </a>
                          )}
                          <button 
                            className="btn btn-outline-info"
                            title="View Details"
                            onClick={() => {
                              // Show payment details modal
                              alert(`Transaction ID: ${payment.transactionId || 'N/A'}\nStripe Session: ${payment.stripeSessionId}`);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="card mt-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-0">Export Payment History</h6>
              <small className="text-muted">Download your payment records</small>
            </div>
            <div className="btn-group">
              <button className="btn btn-outline-primary btn-sm">
                <i className="fas fa-file-csv me-1"></i>
                Export CSV
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-file-pdf me-1"></i>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryDashboard;