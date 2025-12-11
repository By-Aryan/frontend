"use client";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import { ApiFetchRequest, ApiPostRequest } from "@/axios/apiRequest";
import React, { useState, useEffect } from "react";

// Agent Delist Management Page - VIEW ONLY - agents can view delist requests but cannot approve/reject
// Only administrators can approve delist requests
const AgentDelistManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentDelistRequests();
  }, []);

  const fetchAgentDelistRequests = async () => {
    try {
      // Get delist requests for properties managed by this agent
      const response = await ApiFetchRequest("/delist/agent-requests");

      if (response.data && response.data.success) {
        setRequests(response.data.data);
      } else {
        console.error("Failed to fetch agent delist requests:", response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching agent delist requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // ❌ REMOVED: handleProcessRequest function - agents can no longer approve/reject
  // Only admins can process delist requests

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <DashboardContentWrapper>
        <div className="row pb40">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>

        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Delist Management</h2>
              <p className="text">View delist requests for your assigned properties</p>
              <div className="alert alert-info mt-3 d-flex align-items-center">
                <i className="fas fa-info-circle me-2"></i>
                <span>You can view delist requests here. Only administrators can approve or reject these requests.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="ps-widget bgc-white bdrs12 default-box-shadow2 pt30 mb30 overflow-hidden position-relative">
              <div className="navtab-style1">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading delist requests...</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                    <h5>No Pending Requests</h5>
                    <p className="text-muted">
                      There are no pending delist requests for your properties.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                    <table className="table table-hover table-style3">
                      <thead className="t-head sticky-top" style={{ backgroundColor: "#f8f9fa", zIndex: 10 }}>
                        <tr>
                          <th scope="col" style={{ minWidth: "250px" }}>Property</th>
                          <th scope="col" style={{ minWidth: "150px" }}>Seller</th>
                          <th scope="col" style={{ minWidth: "120px" }}>Request Type</th>
                          <th scope="col" style={{ minWidth: "250px" }}>Reason</th>
                          <th scope="col" style={{ minWidth: "140px" }}>Date</th>
                          <th scope="col" style={{ minWidth: "180px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody className="t-body">
                        {requests.map((request) => (
                          <tr key={request._id} className="delist-notification-item">
                            <td style={{ minWidth: "250px" }}>
                              <div className="d-flex align-items-center">
                                <div className="property-image me-3" style={{ width: "60px", height: "60px" }}>
                                  {request.propertyId?.developer_notes?.images?.[0] ? (
                                    <img
                                      src={request.propertyId.developer_notes.images[0]}
                                      alt="Property"
                                      className="rounded"
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                  ) : (
                                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: "100%", height: "100%" }}>
                                      <i className="fas fa-home text-muted"></i>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-dark">
                                    {request.property_name || request.propertyId?.title || request.propertyId?.name || "N/A"}
                                  </div>
                                  {request.propertyId?.location && (
                                    <div className="text-sm text-muted">
                                      {
                                        typeof request.propertyId.location === 'object' 
                                          ? `${request.propertyId.location.city || ''}, ${request.propertyId.location.emirate || ''}`.replace(/^,\s*|,\s*$/g, '') || "Location N/A"
                                          : request.propertyId.location || "Location N/A"
                                      }
                                    </div>
                                  )}
                                  {request.propertyId?.price && (
                                    <div className="text-sm text-success font-weight-bold">
                                      AED {request.propertyId.price.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td style={{ minWidth: "150px" }}>
                              <div>
                                <div className="font-medium text-dark">
                                  {request.seller?.fullname || request.propertyId?.seller_id?.fullname || "N/A"}
                                </div>
                                <div className="text-sm text-muted">
                                  {request.seller?.email || request.propertyId?.seller_id?.email || "N/A"}
                                </div>
                              </div>
                            </td>
                            <td style={{ minWidth: "120px" }}>
                              <span className={`delist-status-badge ${
                                request.request_type === "seller" 
                                  ? "bg-primary text-white" 
                                  : "bg-info text-white"
                              }`}>
                                {request.request_type || "seller"}
                              </span>
                            </td>
                            <td style={{ minWidth: "250px" }}>
                              <div className="text-wrap" style={{ maxWidth: "250px", wordBreak: "break-word" }}>
                                {request.reason || "No reason provided"}
                              </div>
                            </td>
                            <td className="text-sm text-muted" style={{ minWidth: "140px" }}>
                              {formatDate(request.created_at || request.createdAt)}
                            </td>
                            <td style={{ minWidth: "180px" }}>
                              <div className="d-flex flex-column gap-1">
                                <span className="badge bg-warning text-dark d-inline-flex align-items-center" style={{ width: "fit-content" }}>
                                  <i className="fas fa-clock me-1"></i>
                                  Pending Admin Approval
                                </span>
                                <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                                  <i className="fas fa-info-circle me-1"></i>
                                  Waiting for admin to review
                                </small>
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
          </div>
        </div>
      </DashboardContentWrapper>
      
      <style jsx>{`
        .delist-status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .table-responsive {
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .table th {
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
          font-size: 0.875rem;
          color: #495057;
          padding: 12px 8px;
        }
        
        .table td {
          padding: 12px 8px;
          vertical-align: middle;
          border-bottom: 1px solid #f1f3f4;
        }
        
        .delist-notification-item:hover {
          background-color: #f8f9fa;
        }
        
        .delist-action-btn {
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.875rem;
          }
          
          .delist-action-btn {
            font-size: 0.7rem;
            padding: 4px 8px;
          }
        }
      `}</style>
    </>
  );
};

export default AgentDelistManagement;
