"use client";
import React, { useState, useEffect } from "react";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const AdminDelistRequestsPage = () => {
  const { auth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [action, setAction] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDelistRequests = async (page = 1, limit = 10, status = "all") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/delist/requests`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          params: {
            page,
            limit,
            status: status === "all" ? undefined : status,
            _t: Date.now(), // Cache buster
          },
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.data.success) {
        // NEW: Handle delistController format - data.requests (not data directly)
        const responseData = response.data.data;
        const requestsData = responseData.requests || responseData || []; // Handle both formats
        const paginationData = responseData.pagination || response.data.pagination || {};
        const totalItems = paginationData.totalItems || paginationData.total || 0;
        
        console.log("Raw response data:", responseData); // Debug log
        console.log("Extracted requests:", requestsData); // Debug log
        console.log("Total items:", totalItems); // Debug log
        
        setRequests(requestsData);
        setTotalRows(totalItems);
      } else {
        console.error("API returned success: false", response.data);
        setRequests([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching delist requests:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Failed to fetch delist requests");
      setRequests([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.accessToken) {
      fetchDelistRequests(currentPage, perPage, statusFilter);
    }
  }, [auth.accessToken, currentPage, perPage, statusFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleProcessRequest = (request, actionType) => {
    setSelectedRequest(request);
    setAction(actionType);
    setAdminNotes("");
    setShowProcessModal(true);
  };

  const submitProcessRequest = async () => {
    if (!selectedRequest || !action) return;

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/delist/admin-process/${selectedRequest._id}`,
        {
          action,
          adminNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(`Request ${action}d successfully`);
        setShowProcessModal(false);
        setSelectedRequest(null);
        setAdminNotes("");
        fetchDelistRequests(currentPage, perPage, statusFilter);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      const errorMessage = error.response?.data?.message || "Failed to process request";
      
      if (errorMessage.includes("already been processed")) {
        toast.error("This request has already been processed. Please refresh the page to see the latest status.");
      } else if (errorMessage.includes("not found")) {
        toast.error("Delist request not found. It may have been deleted.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectDelist = async (propertyId, reason = "Admin direct delist") => {
    if (!confirm("Are you sure you want to directly delist this property?")) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/delist/admin-direct/${propertyId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Property delisted successfully");
        fetchDelistRequests(currentPage, perPage, statusFilter);
      }
    } catch (error) {
      console.error("Error delisting property:", error);
      toast.error(error.response?.data?.message || "Failed to delist property");
    }
  };

  const columns = [
    {
      name: "Property",
      selector: (row) => row.propertyId?.title || row.propertyId?.name || "N/A",
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div>
          <div className="fw-bold">{row.propertyId?.title || row.propertyId?.name || "N/A"}</div>
          <small className="text-muted">Property ID: {row.propertyId?._id}</small>
        </div>
      ),
    },
    {
      name: "Requested By",
      selector: (row) => row.requestedBy?.fullname || "N/A",
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <div>
          <div>{row.requestedBy?.fullname || "N/A"}</div>
          <small className="text-muted">{row.requestType}</small>
        </div>
      ),
    },
    {
      name: "Reason",
      selector: (row) => row.reason || "N/A",
      sortable: false,
      minWidth: "200px",
      cell: (row) => (
        <div>
          <div title={row.reason}>
            <strong>Request:</strong> {row.reason && row.reason.length > 50 ? `${row.reason.substring(0, 50)}...` : row.reason || "N/A"}
          </div>
          {row.adminNotes && (
            <div title={row.adminNotes} className="mt-1">
              <small className="text-muted">
                <strong>Admin:</strong> {row.adminNotes.length > 30 ? `${row.adminNotes.substring(0, 30)}...` : row.adminNotes}
              </small>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Date Requested",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      minWidth: "120px",
    },
    {
      name: "Request Type",  
      selector: (row) => row.requestType || "N/A",
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <span className={`badge ${
          row.requestType === "seller" ? "bg-primary" :
          row.requestType === "agent" ? "bg-info" : "bg-secondary"
        }`}>
          {row.requestType || "N/A"}
        </span>
      ),
    },
    {
      name: "Processed By",
      selector: (row) => row.processedBy?.fullname || "N/A",
      sortable: false,
      minWidth: "150px",
      cell: (row) => {
        if (row.status === "pending") {
          return <span className="text-muted">-</span>;
        }
        return (
          <div>
            <div>{row.processedBy?.fullname || "N/A"}</div>
            {row.processedAt && (
              <small className="text-muted">
                {new Date(row.processedAt).toLocaleDateString()}
              </small>
            )}
          </div>
        );
      },
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <span className={`badge ${
          row.status === "pending" ? "bg-warning text-dark" :
          row.status === "approved" ? "bg-success" : "bg-danger"
        }`}>
          {row.status === "pending" ? "🟡 Pending" :
           row.status === "approved" ? "🟢 Approved" : "🔴 Rejected"}
        </span>
      ),
    },
    {
      name: "Actions",
      minWidth: "200px",
      cell: (row) => {
        if (row.status === "pending") {
          return (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-success d-flex align-items-center gap-1"
                onClick={() => handleProcessRequest(row, "approve")}
                title="Approve this delist request"
              >
                <i className="fas fa-check"></i>
                Approve
              </button>
              <button
                className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                onClick={() => handleProcessRequest(row, "reject")}
                title="Reject this delist request"
              >
                <i className="fas fa-times"></i>
                Reject
              </button>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <small className="text-muted">
                {row.status === "approved" ? "✅ Already Approved" : "❌ Already Rejected"}
              </small>
              {row.processedAt && (
                <div>
                  <small className="text-muted">
                    {new Date(row.processedAt).toLocaleDateString()}
                  </small>
                </div>
              )}
            </div>
          );
        }
      },
    },
  ];

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_title_area d-flex justify-content-between align-items-center">
            <div>
              <h2><i className="fas fa-list-ul me-2"></i>Delist Requests Management</h2>
              <p className="text-muted">Review and process property delist requests from sellers and agents</p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-primary">
                Total: {totalRows}
              </span>
              <span className="badge bg-warning">
                Pending: {(requests || []).filter(r => r.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="dashboard_setup_property_area">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h5 className="mb-0 text-primary">
                  <i className="fas fa-clipboard-list me-2"></i>
                  All Delist Requests
                </h5>
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    style={{ width: "auto", minWidth: "150px" }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">🟡 Pending</option>
                    <option value="approved">🟢 Approved</option>
                    <option value="rejected">🔴 Rejected</option>
                  </select>
                </div>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns}
                  data={requests}
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  paginationDefaultPage={currentPage}
                  paginationPerPage={perPage}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  highlightOnHover
                  striped
                  responsive
                  progressComponent={
                    <div className="text-center py-5 w-full">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading delist requests...</p>
                    </div>
                  }
                  noDataComponent={
                    <div className="text-center py-5 w-full">
                      <i className="fas fa-list fa-3x text-muted mb-3"></i>
                      <h5>No delist requests found</h5>
                      <p className="text-muted">
                        No delist requests match your current filter criteria.
                      </p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Request Modal */}
      {showProcessModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className={`modal-header ${action === "approve" ? "bg-success" : "bg-danger"} text-white`}>
                <h5 className="modal-title">
                  <i className={`fas ${action === "approve" ? "fa-check-circle" : "fa-times-circle"} me-2`}></i>
                  {action === "approve" ? "Approve" : "Reject"} Delist Request
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowProcessModal(false)}
                  disabled={isProcessing}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-light border">
                      <h6 className="alert-heading">
                        <i className="fas fa-home me-2"></i>Property Details
                      </h6>
                      <div className="row">
                        <div className="col-md-6">
                          <strong>Property:</strong><br />
                          <span className="text-primary">{selectedRequest?.propertyId?.title || selectedRequest?.propertyId?.name || "N/A"}</span>
                        </div>
                        <div className="col-md-6">
                          <strong>Requested by:</strong><br />
                          <span className="text-info">{selectedRequest?.requestedBy?.fullname}</span>
                          <span className="badge bg-secondary ms-2">{selectedRequest?.requestType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <i className="fas fa-comment me-2"></i>Requester's Reason:
                  </label>
                  <div className="bg-light p-3 rounded border">
                    {selectedRequest?.reason}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="adminNotes" className="form-label fw-bold">
                    <i className="fas fa-sticky-note me-2"></i>
                    Admin Notes {action === "reject" && <span className="text-danger">*</span>}
                  </label>
                  <textarea
                    id="adminNotes"
                    className="form-control form-control-lg"
                    rows="4"
                    placeholder={`Add your notes for ${action === "approve" ? "approving" : "rejecting"} this request...`}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    disabled={isProcessing}
                    style={{ resize: "none" }}
                  />
                  <div className="form-text">
                    {action === "reject" ? "Please provide a reason for rejection" : "Optional notes for this decision"}
                  </div>
                </div>
                
                {action === "approve" && (
                  <div className="alert alert-success border-0">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Action Summary:</strong> This property will be marked as delisted and removed from public listings.
                  </div>
                )}
                
                {action === "reject" && (
                  <div className="alert alert-warning border-0">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Action Summary:</strong> This request will be rejected and the property will remain active.
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => setShowProcessModal(false)}
                  disabled={isProcessing}
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${action === "approve" ? "btn-success" : "btn-danger"} btn-lg`}
                  onClick={submitProcessRequest}
                  disabled={isProcessing || (action === "reject" && !adminNotes.trim())}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className={`fas ${action === "approve" ? "fa-check" : "fa-times"} me-2`}></i>
                      {action === "approve" ? "Approve Request" : "Reject Request"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardContentWrapper>
  );
};

export default AdminDelistRequestsPage;
