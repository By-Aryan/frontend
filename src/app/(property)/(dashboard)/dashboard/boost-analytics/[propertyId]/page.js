'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardNavigation from "@/components/property/dashboard/DashboardNavigation";
import MobileMenu from "@/components/common/mobile-menu";
import useAxiosFetch from "@/hooks/useAxiosFetch";

const BoostAnalyticsPage = () => {
    const params = useParams();
    const router = useRouter();
    const propertyId = params.propertyId;

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [property, setProperty] = useState(null);

    // Fetch property details
    const { data: propertyData } = useAxiosFetch(`/property/single/${propertyId}`);

    useEffect(() => {
        if (propertyData?.data) {
            setProperty(propertyData.data);
        }
    }, [propertyData]);

    useEffect(() => {
        fetchBoostAnalytics();
    }, [propertyId]);

    const fetchBoostAnalytics = async () => {
        try {
            setLoading(true);

            // Simulated analytics data - replace with actual API call
            const mockAnalytics = {
                propertyId: propertyId,
                propertyTitle: property?.title || 'Loading...',
                boostStartDate: new Date('2024-10-01'),
                daysActive: 15,
                daysRemaining: 15,

                // Performance metrics
                totalViews: 1247,
                totalClicks: 89,
                totalInquiries: 12,
                conversionRate: 7.14,
                performanceScore: 85,
                roi: 340,

                // Daily breakdown (last 7 days)
                dailyStats: [
                    { date: '2024-10-01', views: 45, clicks: 3, inquiries: 1 },
                    { date: '2024-10-02', views: 67, clicks: 5, inquiries: 2 },
                    { date: '2024-10-03', views: 52, clicks: 4, inquiries: 0 },
                    { date: '2024-10-04', views: 78, clicks: 6, inquiries: 3 },
                    { date: '2024-10-05', views: 91, clicks: 8, inquiries: 2 },
                    { date: '2024-10-06', views: 63, clicks: 4, inquiries: 1 },
                    { date: '2024-10-07', views: 85, clicks: 7, inquiries: 3 }
                ],

                // Recommendations
                recommendations: [
                    {
                        type: 'images',
                        message: 'Add more high-quality images to increase engagement',
                        priority: 'high',
                        icon: 'fas fa-camera'
                    },
                    {
                        type: 'pricing',
                        message: 'Your pricing is competitive for the area',
                        priority: 'low',
                        icon: 'fas fa-dollar-sign'
                    },
                    {
                        type: 'description',
                        message: 'Enhance property description with more details',
                        priority: 'medium',
                        icon: 'fas fa-edit'
                    }
                ]
            };

            setAnalytics(mockAnalytics);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch boost analytics:', error);
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'info';
        }
    };

    if (loading) {
        return (
            <div className="wrapper">
                <div className="preloader"></div>
                <div className="dashboard_content_wrapper">
                    <div className="dashboard dashboard_wrapper pr30 pr0-xl">
                        <DashboardNavigation />
                        <div className="dashboard__main pl0-md">
                            <div className="dashboard__content property-page bgc-f7">
                                <div className="row pb40">
                                    <div className="col-lg-12">
                                        <div className="dashboard_title_area">
                                            <h2>Boost Analytics</h2>
                                            <p className="text">Loading analytics data...</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading analytics...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MobileMenu />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="wrapper">
                <div className="preloader"></div>
                <div className="dashboard_content_wrapper">
                    <div className="dashboard dashboard_wrapper pr30 pr0-xl">
                        <DashboardNavigation />
                        <div className="dashboard__main pl0-md">
                            <div className="dashboard__content property-page bgc-f7">
                                <div className="row pb40">
                                    <div className="col-lg-12">
                                        <div className="dashboard_title_area">
                                            <h2>Boost Analytics</h2>
                                            <p className="text">Analytics not available</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    No analytics data available for this property.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MobileMenu />
            </div>
        );
    }

    return (
        <div className="wrapper">
            <div className="preloader"></div>
            <div className="dashboard_content_wrapper">
                <div className="dashboard dashboard_wrapper pr30 pr0-xl">
                    <DashboardNavigation />
                    <div className="dashboard__main pl0-md">
                        <div className="dashboard__content property-page bgc-f7">
                            {/* Header */}
                            <div className="row pb40">
                                <div className="col-lg-12">
                                    <div className="dashboard_title_area d-flex justify-content-between align-items-center">
                                        <div>
                                            <h2>🚀 Boost Analytics</h2>
                                            <p className="text">
                                                Performance insights for "{analytics.propertyTitle}"
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={() => router.back()}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Back to Properties
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="row mb-4">
                                <div className="col-md-3 mb-3">
                                    <div className="card bg-primary text-white h-100">
                                        <div className="card-body text-center">
                                            <i className="fas fa-eye fa-2x mb-2"></i>
                                            <h4>{analytics.totalViews.toLocaleString()}</h4>
                                            <small>Total Views</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <div className="card bg-success text-white h-100">
                                        <div className="card-body text-center">
                                            <i className="fas fa-mouse-pointer fa-2x mb-2"></i>
                                            <h4>{analytics.totalClicks}</h4>
                                            <small>Total Clicks</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <div className="card bg-warning text-white h-100">
                                        <div className="card-body text-center">
                                            <i className="fas fa-percentage fa-2x mb-2"></i>
                                            <h4>{analytics.conversionRate}%</h4>
                                            <small>Conversion Rate</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3 mb-3">
                                    <div className="card bg-info text-white h-100">
                                        <div className="card-body text-center">
                                            <i className="fas fa-calendar-alt fa-2x mb-2"></i>
                                            <h4>{analytics.daysRemaining}</h4>
                                            <small>Days Remaining</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Score & ROI */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card h-100">
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
                                    <div className="card h-100">
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
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5><i className="fas fa-chart-bar me-2"></i>Daily Performance (Last 7 Days)</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Views</th>
                                                    <th>Clicks</th>
                                                    <th>Inquiries</th>
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
                                                            <span className="badge bg-warning">{day.inquiries}</span>
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
                            <div className="card">
                                <div className="card-header">
                                    <h5><i className="fas fa-lightbulb me-2"></i>Optimization Recommendations</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {analytics.recommendations.map((rec, index) => (
                                            <div key={index} className="col-md-4 mb-3">
                                                <div className={`alert alert-${getPriorityColor(rec.priority)}`}>
                                                    <div className="d-flex align-items-center">
                                                        <i className={`${rec.icon} me-2`}></i>
                                                        <div>
                                                            <strong>{rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}:</strong>
                                                            <br />
                                                            {rec.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-0">Boost Actions</h6>
                                                    <small className="text-muted">Manage your property boost</small>
                                                </div>
                                                <div className="btn-group">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => router.push(`/single-v1/${propertyId}`)}
                                                    >
                                                        <i className="fas fa-eye me-1"></i>
                                                        View Property
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-success"
                                                        onClick={() => router.push(`/seller-pricing/${propertyId}`)}
                                                    >
                                                        <i className="fas fa-rocket me-1"></i>
                                                        Extend Boost
                                                    </button>
                                                    <button className="btn btn-outline-info">
                                                        <i className="fas fa-download me-1"></i>
                                                        Export Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MobileMenu />
        </div>
    );
};

export default BoostAnalyticsPage;