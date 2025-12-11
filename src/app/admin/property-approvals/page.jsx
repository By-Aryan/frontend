"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPut from "@/hooks/useAxiosPut";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const PropertyApprovalsPage = () => {
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const { data, isLoading } = useAxiosFetch(
    "/requestproperty/admin/properties-pending-approval"
  );

  const approveMutation = useAxiosPut("/requestproperty/admin/approve-property/");

  const handleApprove = async (propertyId) => {
    if (!confirm("Are you sure you want to approve this property? It will be visible to buyers.")) return;

    setProcessing(true);
    try {
      await approveMutation.mutateAsync(propertyId);
      alert("Property approved successfully!");
      queryClient.invalidateQueries([
        "fetchData",
        "/requestproperty/admin/properties-pending-approval",
      ]);
    } catch (error) {
      alert("Failed to approve property: " + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectClick = (property) => {
    setSelectedProperty(property);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${API_BASE_URL}/requestproperty/admin/reject-property/${selectedProperty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Property rejected successfully! Agent can edit and resubmit.");
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedProperty(null);
        queryClient.invalidateQueries([
          "fetchData",
          "/requestproperty/admin/properties-pending-approval",
        ]);
      } else {
        alert("Failed to reject property: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      alert("Failed to reject property: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="dashboard__main pl0-md">
      <div className="dashboard__content property-page bgc-f7">
        <div className="row align-items-center pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Property Approvals</h2>
              <p className="text">Review and approve properties submitted by agents</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingSpinner message="Loading properties..." size="lg" color="primary" />
          </div>
        ) : (
          <div className="row">
            <div className="col-xl-12">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30">
                <div className="packages_table table-responsive">
                  <table className="table-style3 table">
                    <thead className="t-head">
                      <tr>
                        <th>Property</th>
                        <th>Agent</th>
                        <th>Price</th>
                        <th>Media</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="t-body">
                      {data?.data && data.data.length > 0 ? (
                        data.data.map((property) => (
                          <tr key={property._id}>
                            <td className="vam">
                              <div>
                                <strong>{property.name || property.title}</strong>
                                <br />
                                <small className="text-muted">
                                  {property.details?.property_type} • {property.details?.purpose}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {property.location?.address}
                                </small>
                              </div>
                            </td>
                            <td className="vam">
                              <div>
                                {property.agent_id?.fullname || "N/A"}
                                <br />
                                <small className="text-muted">
                                  {property.agent_id?.email || "N/A"}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {property.agent_id?.mobile || "N/A"}
                                </small>
                              </div>
                            </td>
                            <td className="vam">
                              <strong>
                                {property.currency} {property.price?.toLocaleString()}
                              </strong>
                            </td>
                            <td className="vam">
                              <div>
                                <small>
                                  📷 {property.developer_notes?.image_count || 0} images
                                  <br />
                                  🎥 {property.developer_notes?.video_count || 0} videos
                                </small>
                              </div>
                            </td>
                            <td className="vam">{formatDate(property.createdAt)}</td>
                            <td className="vam">
                              <div className="d-flex gap-2 flex-wrap">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleApprove(property._id)}
                                  disabled={processing}
                                  style={{ fontSize: "12px" }}
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRejectClick(property)}
                                  disabled={processing}
                                  style={{ fontSize: "12px" }}
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="fs-5 fw-medium mb-3">
                              No properties pending approval
                            </div>
                            <p className="text-muted">
                              All properties have been processed
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div 
            className="modal show d-block" 
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={(e) => {
              if (e.target.className.includes("modal show")) {
                setShowRejectModal(false);
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Property</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRejectModal(false)}
                    disabled={processing}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Property:</strong> {selectedProperty?.name || selectedProperty?.title}
                  </p>
                  <p className="text-muted">
                    <strong>Agent:</strong> {selectedProperty?.agent_id?.fullname}
                  </p>
                  <div className="form-group">
                    <label className="fw-bold mb-2">Rejection Reason *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a detailed reason for rejection so the agent can fix the issues..."
                      disabled={processing}
                    ></textarea>
                    <small className="text-muted">
                      This reason will be shown to the agent
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowRejectModal(false)}
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleRejectSubmit}
                    disabled={processing || !rejectionReason.trim()}
                  >
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Rejecting...
                      </>
                    ) : (
                      "Reject Property"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyApprovalsPage;
