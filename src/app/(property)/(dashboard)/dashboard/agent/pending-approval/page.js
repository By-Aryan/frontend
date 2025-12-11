"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const PendingApprovalPage = () => {
  const { data, isLoading, error, refetch } = useAxiosFetch(
    "/requestproperty/pending-approval"
  );
  const [submitting, setSubmitting] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmitForApproval = async (propertyId) => {
    setSubmitting(propertyId);
    try {
      const token = Cookies.get("token");
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

      const response = await axios.post(
        `${BASE_URL}/property/submit-for-approval/${propertyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Property submitted for admin approval successfully!");
        refetch(); // Refresh the list
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit property");
    } finally {
      setSubmitting(null);
    }
  };

  const getStatusBadge = (status, rejectionReason) => {
    if (status === "Rejected") {
      return (
        <div>
          <span className="badge bg-danger">Rejected</span>
          {rejectionReason && (
            <small className="d-block text-danger mt-1" style={{ fontSize: "11px" }}>
              Reason: {rejectionReason}
            </small>
          )}
        </div>
      );
    }
    if (status === "Waiting for Media Approval") {
      return <span className="badge bg-info text-white">Form Incomplete</span>;
    }
    return <span className="badge bg-warning text-dark">Pending Admin Approval</span>;
  };

  return (
    <DashboardContentWrapper>
      <div className="row">
        <div className="col-lg-12">
          <DboardMobileNavigation />
        </div>
      </div>

      <div className="row align-items-center pb20">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Pending Approval</h2>
            <p className="text">
              Properties waiting for admin approval. You can edit these until approved.
            </p>
          </div>
        </div>
      </div>

      <DashboardTableWrapper>
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingSpinner
              message="Loading properties..."
              size="md"
              color="success"
            />
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            Error loading properties: {error.message}
          </div>
        ) : (
          <div className="packages_table table-responsive p-0">
            <table className="table-style3 table at-savesearch">
              <thead className="t-head">
                <tr>
                  <th scope="col">Property Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Property Type</th>
                  <th scope="col">Submitted Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="t-body">
                {data?.data && data.data.length > 0 ? (
                  data.data.map((property) => (
                    <tr key={property._id}>
                      <th scope="row">
                        <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                          <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                            <div className="h6 list-title">
                              {property.name || property.title}
                            </div>
                            <p className="list-text mb-0">
                              {property.location?.address}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="vam">
                        <div className="list-price">
                          {property.currency} {property.price?.toLocaleString()}
                        </div>
                      </td>
                      <td className="vam">
                        {property.details?.property_type}
                      </td>
                      <td className="vam">
                        {formatDate(property.createdAt)}
                      </td>
                      <td className="vam">
                        {getStatusBadge(
                          property.approval_status?.status,
                          property.rejection_reason
                        )}
                      </td>
                      <td className="vam">
                        <div className="d-flex gap-2">
                          {property.approval_status?.status === "Waiting for Media Approval" ? (
                            <>
                              <Link
                                href={`/dashboard/agent/add-property/${property.requested_id}`}
                                className="btn btn-sm btn-outline-primary"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 12px",
                                }}
                              >
                                Complete Form
                              </Link>
                              <button
                                onClick={() => handleSubmitForApproval(property._id)}
                                className="btn btn-sm btn-success"
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 12px",
                                }}
                                disabled={submitting === property._id}
                              >
                                {submitting === property._id ? "Submitting..." : "Submit for Approval"}
                              </button>
                            </>
                          ) : (
                            <Link
                              href={`/dashboard/agent/edit-property/${property._id}`}
                              className="btn btn-sm btn-outline-primary"
                              style={{
                                fontSize: "12px",
                                padding: "4px 12px",
                              }}
                            >
                              View Details
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="d-flex justify-content-center flex-column align-items-center">
                        <div className="fs-5 fw-medium mb-3">
                          No pending properties
                        </div>
                        <p className="text-muted">
                          All your properties have been processed by admin
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DashboardTableWrapper>
    </DashboardContentWrapper>
  );
};

export default PendingApprovalPage;
