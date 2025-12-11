"use client";

import PropertyDataTable from "@/components/property/dashboard/dashboard-my-properties/PropertyDataTable";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Eye, MousePointer, TrendingUp, Users, Activity } from "lucide-react";

const DashboardMyPropertyAnalytics = () => {
  const params = useParams();
  let propertyId = params.propertyId || 52;
  const endpoint = `/property/analytics/${propertyId}`;

  // Pagination state
  const [viewersCurrentPage, setViewersCurrentPage] = useState(1);
  const [interactionsCurrentPage, setInteractionsCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data,
    isLoading: dataLoading,
    error,
    refetch,
  } = useAxiosFetch(endpoint);

  const property = data;
  const analytics = property?.analytics || {};

  const totalViews = analytics.views || 0;
  const totalClicks = analytics.clicks || 0;
  const uniqueViewers = Array.isArray(analytics.viewers)
    ? analytics.viewers.length
    : 0;
  const clickThroughRate =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0";

  // Pagination calculations
  const viewers = Array.isArray(analytics.viewers) ? analytics.viewers : [];
  const clickLogs = Array.isArray(analytics.clickLogs) ? analytics.clickLogs : [];

  // Viewers pagination
  const totalViewersPages = Math.ceil(viewers.length / itemsPerPage);
  const startViewersIndex = (viewersCurrentPage - 1) * itemsPerPage;
  const endViewersIndex = startViewersIndex + itemsPerPage;
  const paginatedViewers = viewers.slice(startViewersIndex, endViewersIndex);

  // Interactions pagination
  const totalInteractionsPages = Math.ceil(clickLogs.length / itemsPerPage);
  const startInteractionsIndex = (interactionsCurrentPage - 1) * itemsPerPage;
  const endInteractionsIndex = startInteractionsIndex + itemsPerPage;
  const paginatedInteractions = clickLogs.slice(startInteractionsIndex, endInteractionsIndex);

  if (dataLoading) {
    return (
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content bgc-f7">
          <div className="row">
            <div className="col-lg-12">
              <DboardMobileNavigation />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="dashboard__main pl0-md">
        <div className="dashboard__content bgc-f7">
          <div className="row">
            <div className="col-lg-12">
              <DboardMobileNavigation />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error Loading Analytics</h4>
                <p>Unable to load property analytics. Please try again.</p>
                <button className="btn btn-outline-danger" onClick={refetch}>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard__main pl0-md">
      <div className="dashboard__content bgc-f7">
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>

        {/* Header */}
        <div className="row align-items-center pb40">
          <div className="col-xxl-6">
            <div className="dashboard_title_area">
              <h2>Property Analytics</h2>
              <p className="text">
                Track your property performance and engagement
              </p>
            </div>
          </div>
          <div className="col-xxl-6">
            {property && (
              <div className="bg-white rounded p-3 shadow-sm border text-end">
                <p className="mb-1 text-muted small">Property:</p>
                <h5 className="mb-1">{property.title}</h5>
                <p className="mb-0 text-success fw-bold">
                  ${property.price?.toLocaleString() || "N/A"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="row mb-4">
          <StatCard
            icon={Eye}
            title="Total Views"
            value={totalViews.toLocaleString()}
            subtitle="All time views"
            color="text-primary"
          />
          <StatCard
            icon={MousePointer}
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            subtitle="Contact actions"
            color="text-success"
          />
          <StatCard
            icon={Users}
            title="Unique Viewers"
            value={uniqueViewers.toLocaleString()}
            subtitle="Individual users"
            color="text-info"
          />
          <StatCard
            icon={TrendingUp}
            title="Click Rate"
            value={`${clickThroughRate}%`}
            subtitle="Clicks per view"
            color="text-warning"
          />
        </div>

        {/* Activity & Interactions */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="bg-white rounded shadow-sm p-4 border">
              <h5 className="mb-3 d-flex align-items-center">
                <Activity className="h-5 w-5 me-2 text-primary" />
                Recent Viewers
              </h5>
              <div className="table-responsive">
                {paginatedViewers.length > 0 ? (
                  <>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Views</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedViewers.map((viewer, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge bg-light text-dark">
                                User {viewer.userId?.slice(-4) || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="text-primary fw-bold">
                                {viewer.viewCount || 1}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {viewer.viewDate
                                  ? new Date(viewer.viewDate).toLocaleDateString()
                                  : "N/A"}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Viewers Pagination */}
                    {totalViewersPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          Showing {startViewersIndex + 1}-{Math.min(endViewersIndex, viewers.length)} of {viewers.length} viewers
                        </small>
                        <nav>
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${viewersCurrentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setViewersCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={viewersCurrentPage === 1}
                              >
                                Previous
                              </button>
                            </li>
                            
                            {Array.from({ length: Math.min(5, totalViewersPages) }, (_, i) => {
                              let pageNumber;
                              if (totalViewersPages <= 5) {
                                pageNumber = i + 1;
                              } else if (viewersCurrentPage <= 3) {
                                pageNumber = i + 1;
                              } else if (viewersCurrentPage >= totalViewersPages - 2) {
                                pageNumber = totalViewersPages - 4 + i;
                              } else {
                                pageNumber = viewersCurrentPage - 2 + i;
                              }
                              
                              return (
                                <li key={pageNumber} className={`page-item ${viewersCurrentPage === pageNumber ? 'active' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => setViewersCurrentPage(pageNumber)}
                                  >
                                    {pageNumber}
                                  </button>
                                </li>
                              );
                            })}
                            
                            <li className={`page-item ${viewersCurrentPage === totalViewersPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setViewersCurrentPage(prev => Math.min(totalViewersPages, prev + 1))}
                                disabled={viewersCurrentPage === totalViewersPages}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Users className="h-4 w-4 text-muted mb-2" />
                    <p className="text-muted mb-0 small">No viewers yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="bg-white rounded shadow-sm p-4 border">
              <h5 className="mb-3 d-flex align-items-center">
                <MousePointer className="h-5 w-5 me-2 text-success" />
                Recent Interactions
              </h5>
              <div className="table-responsive">
                {paginatedInteractions.length > 0 ? (
                  <>
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Action</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedInteractions.map((log, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge bg-light text-dark">
                                User {log.userId?.slice(-4) || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success text-capitalize">
                                {log.action || "click"}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {log.clickDate
                                  ? new Date(log.clickDate).toLocaleDateString()
                                  : "N/A"}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Interactions Pagination */}
                    {totalInteractionsPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          Showing {startInteractionsIndex + 1}-{Math.min(endInteractionsIndex, clickLogs.length)} of {clickLogs.length} interactions
                        </small>
                        <nav>
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${interactionsCurrentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setInteractionsCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={interactionsCurrentPage === 1}
                              >
                                Previous
                              </button>
                            </li>
                            
                            {Array.from({ length: Math.min(5, totalInteractionsPages) }, (_, i) => {
                              let pageNumber;
                              if (totalInteractionsPages <= 5) {
                                pageNumber = i + 1;
                              } else if (interactionsCurrentPage <= 3) {
                                pageNumber = i + 1;
                              } else if (interactionsCurrentPage >= totalInteractionsPages - 2) {
                                pageNumber = totalInteractionsPages - 4 + i;
                              } else {
                                pageNumber = interactionsCurrentPage - 2 + i;
                              }
                              
                              return (
                                <li key={pageNumber} className={`page-item ${interactionsCurrentPage === pageNumber ? 'active' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => setInteractionsCurrentPage(pageNumber)}
                                  >
                                    {pageNumber}
                                  </button>
                                </li>
                              );
                            })}
                            
                            <li className={`page-item ${interactionsCurrentPage === totalInteractionsPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setInteractionsCurrentPage(prev => Math.min(totalInteractionsPages, prev + 1))}
                                disabled={interactionsCurrentPage === totalInteractionsPages}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <MousePointer className="h-4 w-4 text-muted mb-2" />
                    <p className="text-muted mb-0 small">No interactions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-white rounded shadow-sm p-4 border">
              <h5 className="mb-4">Performance Summary</h5>
              <div className="row text-center">
                <SummaryCard
                  label="Total Property Views"
                  value={totalViews}
                  color="primary"
                />
                <SummaryCard
                  label="Contact Attempts"
                  value={totalClicks}
                  color="success"
                />
                <SummaryCard
                  label="Engagement Rate"
                  value={`${clickThroughRate}%`}
                  color="warning"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="row">
          <div className="col-12">
            <div className="bg-gradient-primary rounded p-4 text-white">
              <h5 className="mb-3">💡 Tips to Improve Performance</h5>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 small">
                      • Add high-quality photos to increase views
                    </li>
                    <li className="mb-2 small">
                      • Update property description regularly
                    </li>
                    <li className="mb-0 small">
                      • Respond quickly to inquiries
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 small">
                      • Share your listing on social media
                    </li>
                    <li className="mb-2 small">
                      • Consider featuring your property
                    </li>
                    <li className="mb-0 small">
                      • Keep pricing competitive for your area
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Subcomponents
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "text-primary",
}) => (
  <div className="col-xl-3 col-lg-6 col-md-6 mb-3">
    <div className="bg-white rounded shadow-sm p-4 border">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="text-muted mb-1 small">{title}</p>
          <h3 className={`mb-0 ${color}`}>{value}</h3>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
        <div className="bg-light rounded-circle p-2">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
    </div>
  </div>
);

const SummaryCard = ({ label, value, color }) => (
  <div className="col-md-4 mb-3">
    <div className={`bg-${color} bg-opacity-10 rounded p-4`}>
      <h3 className={`text-${color} mb-1`}>{value}</h3>
      <p className="text-muted mb-1 small">{label}</p>
      <small className="text-muted">Since listing creation</small>
    </div>
  </div>
);

export default DashboardMyPropertyAnalytics;
