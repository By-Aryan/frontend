'use client';
import React, { useState, useEffect } from 'react';

const BoostAnalyticsDashboard = ({ propertyId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoostAnalytics();
  }, [propertyId]);

  const fetchBoostAnalytics = async () => {
    try {
      // Simulated analytics data - replace with actual API call
      const mockAnalytics = {
        totalViews: 1247,
        totalClicks: 89,
        conversionRate: 7.14,
        boostStartDate: new Date('2024-10-01'),
        daysRemaining: 15,
        dailyStats: [
          { date: '2024-10-01', views: 45, clicks: 3 },
          { date: '2024-10-02', views: 67, clicks: 5 },
          { date: '2024-10-03', views: 52, clicks: 4 },
        ],
        performanceScore: 85,
        roi: 340 // Return on investment percentage
      };
      
      setAnalytics(mockAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch boost analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="boost-analytics-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        No analytics data available for this boost.
      </div>
    );
  }

  return (
    <div className="boost-analytics-dashboard">
      <div className="row">
        {/* Key Metrics */}
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="fas fa-eye fa-2x mb-2"></i>
              <h4>{analytics.totalViews.toLocaleString()}</h4>
              <small>Total Views</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="fas fa-mouse-pointer fa-2x mb-2"></i>
              <h4>{analytics.totalClicks}</h4>
              <small>Total Clicks</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="fas fa-percentage fa-2x mb-2"></i>
              <h4>{analytics.conversionRate}%</h4>
              <small>Conversion Rate</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="fas fa-calendar-alt fa-2x mb-2"></i>
              <h4>{analytics.daysRemaining}</h4>
              <small>Days Remaining</small>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Score */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="fas fa-chart-line me-2"></i>Performance Score</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className={`progress-bar ${analytics.performanceScore >= 80 ? 'bg-success' : analytics.performanceScore >= 60 ? 'bg-warning' : 'bg-danger'}`}
                      style={{ width: `${analytics.performanceScore}%` }}
                    >
                      {analytics.performanceScore}%
                    </div>
                  </div>
                </div>
                <div className="ms-3">
                  <span className="badge bg-primary">{analytics.performanceScore}/100</span>
                </div>
              </div>
              <small className="text-muted mt-2 d-block">
                Based on views, clicks, and engagement metrics
              </small>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="fas fa-dollar-sign me-2"></i>Return on Investment</h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h2 className="text-success">+{analytics.roi}%</h2>
                <p className="text-muted mb-0">
                  Your boost is generating {analytics.roi}% more engagement than non-boosted properties
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Performance Chart */}
      <div className="card">
        <div className="card-header">
          <h5><i className="fas fa-chart-bar me-2"></i>Daily Performance</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                </tr>
              </thead>
              <tbody>
                {analytics.dailyStats.map((day, index) => (
                  <tr key={index}>
                    <td>{new Date(day.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-primary">{day.views}</span>
                    </td>
                    <td>
                      <span className="badge bg-success">{day.clicks}</span>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {((day.clicks / day.views) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card mt-3">
        <div className="card-header">
          <h5><i className="fas fa-lightbulb me-2"></i>Optimization Tips</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="alert alert-info">
                <strong>📸 Images:</strong> Properties with 5+ high-quality images get 40% more views
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-success">
                <strong>💰 Pricing:</strong> Your price is competitive for the area
              </div>
            </div>
            <div className="col-md-4">
              <div className="alert alert-warning">
                <strong>📝 Description:</strong> Add more details to improve engagement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostAnalyticsDashboard;