"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPut from "@/hooks/useAxiosPut";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DashboardRequests = () => {
  const [showTable, setShowTable] = useState("Pending");
  const queryClient = useQueryClient();

  // Fetch data for both tabs
  const { data: pendingData, isLoading: pendingLoading } = useAxiosFetch(
    "/requestproperty/pending"
  );
  const { data: acceptedData, isLoading: acceptedLoading } = useAxiosFetch(
    "/requestproperty/accepted-by-me"
  );
  
  // Fetch pending approval properties to check if property is already created
  const { data: pendingApprovalData } = useAxiosFetch(
    "/requestproperty/pending-approval"
  );

  const isLoading = showTable === "Pending" ? pendingLoading : acceptedLoading;

  // Mutation for accepting request
  const acceptRequestMutation = useAxiosPut("/requestproperty/accept/");

  const handleAcceptClick = (id) => {
    acceptRequestMutation.mutate(id, {
      onSuccess: (data) => {
        if (data.data?.status == "success") {
          setShowTable("Accepted");

          // Invalidate both queries to refetch fresh data
          queryClient.invalidateQueries([
            "fetchData",
            "/requestproperty/accepted-by-me",
          ]);
        }
      },
      onError: (error) => {
        console.error("Error accepting request:", error);
      },
    });
  };

  // Check if property is already created and pending approval
  const isPropertyPendingApproval = (requestId) => {
    if (!pendingApprovalData?.data) return false;
    return pendingApprovalData.data.some(
      prop => prop.requested_id?._id === requestId || prop.requested_id === requestId
    );
  };

  // Get property ID for editing
  const getPropertyIdForEdit = (requestId) => {
    if (!pendingApprovalData?.data) return null;
    const property = pendingApprovalData.data.find(
      prop => prop.requested_id?._id === requestId || prop.requested_id === requestId
    );
    return property?._id;
  };

  // Check if current tab has data
  const hasData = () => {
    if (showTable === "Pending") {
      return pendingData?.data && pendingData.data.length > 0;
    }
    return acceptedData?.data && acceptedData.data.length > 0;
  };

  // Empty state row JSX
  const renderEmptyState = () => (
    <tr>
      <td
        colSpan={showTable === "Pending" ? 7 : 6}
        className="text-center py-5"
      >
        <div className="d-flex justify-content-center flex-column align-items-center">
          <div className="fs-5 fw-medium mb-3">No data found</div>
          <p className="text-muted">
            There are no {showTable.toLowerCase()} requests at the moment.
          </p>
        </div>
      </td>
    </tr>
  );

  // Date formatting helper
  function formatDate(dateString) {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Download documents as ZIP
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  const handleDownloadDocuments = async (requestId, documents) => {
    if (!documents || documents.length === 0) {
      alert("No documents available to download");
      return;
    }

    // Add to downloading set
    setDownloadingIds((prev) => new Set(prev).add(requestId));

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/requestproperty/download-documents/${requestId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download documents");
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `documents-${requestId}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading documents:", error);
      alert("Failed to download documents. Please try again.");
    } finally {
      // Remove from downloading set
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Render documents download button
  const renderDocuments = (documents, requestId) => {
    if (!documents || documents.length === 0) {
      return <span className="text-muted">No documents</span>;
    }

    const isDownloading = downloadingIds.has(requestId);
    const documentCount = documents.filter(doc => doc && doc.file_path).length;

    return (
      <button
        className="btn btn-sm btn-primary d-flex align-items-center gap-2"
        onClick={() => handleDownloadDocuments(requestId, documents)}
        disabled={isDownloading}
        style={{
          fontSize: "12px",
          padding: "4px 12px",
        }}
      >
        {isDownloading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Downloading...
          </>
        ) : (
          <>
            <i className="fas fa-download"></i>
            Download Documents ({documentCount})
          </>
        )}
      </button>
    );
  };

  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>

        <div className="row align-items-center pb20">
          <div className="col-lg-6">
            <div className="dashboard_title_area">
              <h2>Seller's Requests</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-end gap-2">
              <button
                className={`ud-btn btn-${
                  showTable === "Pending" ? "thm" : "white"
                }`}
                onClick={() => setShowTable("Pending")}
              >
                Pending
              </button>
              <button
                className={`ud-btn btn-${
                  showTable === "Accepted" ? "thm" : "white"
                }`}
                onClick={() => setShowTable("Accepted")}
              >
                Accepted
              </button>
            </div>
          </div>
        </div>

        <DashboardTableWrapper>
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <LoadingSpinner
                message="Loading requests..."
                size="md"
                color="success"
              />
            </div>
          ) : (
            <div className="packages_table table-responsive p-0">
              {showTable === "Pending" ? (
                <table className="table-style3 table at-savesearch">
                  <thead className="t-head">
                    <tr>
                      <th scope="col">Property Name</th>
                      <th scope="col">Requested By</th>
                      <th scope="col">Property Type</th>
                      <th scope="col">Purpose</th>
                      <th scope="col">Documents</th>
                      <th scope="col">Requested</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="t-body">
                    {hasData()
                      ? pendingData.data.map((property, index) => (
                          <tr key={property._id || index}>
                            <th scope="row">
                              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                                  <div className="h6 list-title">
                                    <Link href={`/single-v1/${property._id}`}>
                                      {property.propertyName}
                                    </Link>
                                  </div>
                                  <p className="list-text mb-0">
                                    {property.address}
                                  </p>
                                  <div className="list-price">
                                    <a href="#">{property.area} sqft</a>
                                  </div>
                                </div>
                              </div>
                            </th>
                            <td className="vam">
                              <div className="d-flex flex-column align-items-start">
                                <span>{property.name}</span>
                                <span>{property.email}</span>
                                <span>{property.phone}</span>
                              </div>
                            </td>
                            <td className="vam">{property.propertyType}</td>
                            <td className="vam">
                              <span>{property.purpose}</span>
                            </td>
                            <td className="vam">
                              {renderDocuments(property.documents, property._id)}
                            </td>
                            <td className="vam">
                              {formatDate(property.createdAt)}
                            </td>
                            <td className="vam">
                              <div className="d-flex gap-2">
                                <button
                                  className="py-1 px-3 hover:bg-[#0f8363] border-1 border-[#0f8363] text-[#0f8363] hover:text-white font-semibold rounded-xl"
                                  style={{
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                  }}
                                  onClick={() =>
                                    handleAcceptClick(property._id)
                                  }
                                >
                                  Accept
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      : renderEmptyState()}
                  </tbody>
                </table>
              ) : (
                <table className="table-style3 table at-savesearch">
                  <thead className="t-head">
                    <tr>
                      <th scope="col">Property Name</th>
                      <th scope="col">Requested By</th>
                      <th scope="col">Documents</th>
                      <th scope="col">Requested Date</th>
                      <th scope="col">Accepted Date</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="t-body">
                    {hasData()
                      ? acceptedData.data.map((property, index) => (
                          <tr key={property._id || index}>
                            <th scope="row">
                              <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                                <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                                  <div className="h6 list-title">
                                    <Link href={`/single-v1/${property._id}`}>
                                      {property.propertyName}
                                    </Link>
                                  </div>
                                  <p className="list-text mb-0">
                                    {property.address}
                                  </p>
                                  <div className="list-price">
                                    <a href="#">{property.area} sqft</a>
                                  </div>
                                </div>
                              </div>
                            </th>
                            <td className="vam">
                              <div className="d-flex flex-column align-items-start">
                                <span>
                                  {property.seller?.fullname || "N/A"}
                                </span>
                                <span>{property.seller?.email || "N/A"}</span>
                                <span>{property.seller?.mobile || "N/A"}</span>
                              </div>
                            </td>
                            <td className="vam">
                              {renderDocuments(property.documents, property._id)}
                            </td>
                            <td className="vam">
                              {formatDate(property.createdAt)}
                            </td>
                            <td className="vam">
                              <span>{formatDate(property.acceptedAt)}</span>
                            </td>
                            <td className="vam">
                              {isPropertyPendingApproval(property.request_id) ? (
                                <div className="d-flex flex-column gap-2">
                                  <Link
                                    href={`/dashboard/agent/add-property/${property.request_id}`}
                                    className="btn btn-sm btn-warning"
                                    style={{
                                      fontSize: "12px",
                                      padding: "6px 12px",
                                    }}
                                  >
                                    ✏️ Edit Property
                                  </Link>
                                  <span className="badge bg-warning text-dark" style={{ fontSize: "10px" }}>
                                    Pending Admin Approval
                                  </span>
                                </div>
                              ) : (
                                <Link
                                  href={`/dashboard/agent/add-property/${property.request_id}`}
                                  className="py-2 px-4 hover:bg-[#0f8363] border-1 border-[#0f8363] text-[#0f8363] hover:text-white font-semibold rounded-xl"
                                  style={{
                                    backgroundColor: "#0f8363",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    color: "white",
                                  }}
                                >
                                  List
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))
                      : renderEmptyState()}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </DashboardTableWrapper>
      </DashboardContentWrapper>
    </>
  );
};

export default DashboardRequests;
