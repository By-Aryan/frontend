"use client"
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const DashboardRequests = () => {
  const [showTable, setShowTable] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch data for both tables
  const { data: pendingData, isLoading: pendingLoading, refetch: refetchPending } = useAxiosFetch("/requestproperty/pending-driver-request");
  const { data: acceptedData, isLoading: acceptedLoading, refetch: refetchAccepted } = useAxiosFetch("/requestproperty/accepted-driver-request-byagent");

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch both queries
      await queryClient.invalidateQueries(["fetchData", "/requestproperty/pending-driver-request"]);
      await queryClient.invalidateQueries(["fetchData", "/requestproperty/accepted-driver-request-byagent"]);
      await Promise.all([refetchPending(), refetchAccepted()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500); // Small delay for visual feedback
    }
  };

  // Update loading state whenever tab changes or loading state changes
  useEffect(() => {
    if (showTable === "Pending") {
      setIsLoading(pendingLoading);
    } else {
      setIsLoading(acceptedLoading);
    }
  }, [showTable, pendingLoading, acceptedLoading]);

  // Update data when it's available
  useEffect(() => {
    if (pendingData?.data) {
      setPendingRequests(pendingData.data);
    }
    if (acceptedData?.data) {
      setAcceptedRequests(acceptedData.data);
    }
  }, [pendingData, acceptedData]);

  // Check if the current tab has data
  const hasData = () => {
    if (showTable === "Pending") {
      return pendingRequests && pendingRequests.length > 0;
    } else {
      return acceptedRequests && acceptedRequests.length > 0;
    }
  };

  const renderEmptyState = () => {
    return (
      <tr>
        <td colSpan={showTable === "Pending" ? 4 : 4} className="text-center py-5">
          <div className="d-flex justify-content-center flex-column align-items-center">
            <div className="fs-5 fw-medium mb-3">No data found</div>
            <p className="text-muted">There are no {showTable.toLowerCase()} driver requests at the moment.</p>
          </div>
        </td>
      </tr>
    );
  };

  function formatDate(dateString) {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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
              <h2>Driver's Requests</h2>
              <p className="text">We are glad to see you again!</p>
              <small className="text-muted d-block mt-1">
                <i className="fas fa-sync-alt me-1"></i>
                Auto-refreshes every 30 seconds
              </small>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-end gap-2">
              <button
                className="ud-btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i>
                {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
              </button>
              <button className={`ud-btn btn-${showTable === 'Pending' ? 'thm' : 'white'}`} onClick={() => { setShowTable("Pending") }}>Pending</button>
              <button className={`ud-btn btn-${showTable === 'Accepted' ? 'thm' : 'white'}`} onClick={() => { setShowTable("Accepted") }}>Accepted</button>
            </div>
          </div>
        </div>

        <DashboardTableWrapper>
          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <LoadingSpinner message="Loading requests..." size="md" color="success" />
            </div>
          ) : (
            <div className="packages_table table-responsive p-0">
              {showTable === "Pending" ? (
                <table className="table-style3 table at-savesearch">
                  <thead className="t-head">
                    <tr>
                      <th scope="col">Property Name</th>
                      <th scope="col">Requested By</th>
                      <th scope="col">Requested</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="t-body">
                    {hasData() ? (
                      pendingRequests.map((property, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                              <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                                <div className="h6 list-title">
                                  <Link href={`/single-v1/${property._id}`}>
                                    {property.propertyName}
                                  </Link>
                                </div>
                                <p className="list-text mb-0">{property.address}</p>
                                <div className="list-price">
                                  <a href="#">{property.area} sqft</a>
                                </div>
                              </div>
                            </div>
                          </th>
                          <td className="vam">
                            <div className="d-flex flex-column align-items-start">
                              <span>{property.seller?.fullname}</span>
                              <span>{property.seller?.email}</span>
                              <span>{property.seller?.mobile}</span>
                            </div>
                          </td>
                          <td className="vam">{formatDate(property.createdAt)}</td>
                          <td className="vam">
                            {property.mediaStatus === "Pending" ? (
                              // Driver has uploaded media - Agent can review
                              <div className="d-flex flex-column gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    router.push(`/dashboard/agent/driver-request-detail/${property._id}`)
                                  }}
                                >
                                  📷 Review Media
                                </button>
                                <span className="badge bg-warning text-dark" style={{ fontSize: "10px" }}>
                                  Driver Uploaded
                                </span>
                              </div>
                            ) : property.mediaStatus === "Assigned" ? (
                              // Driver assigned but not uploaded yet
                              <div className="d-flex flex-column gap-2">
                                <span className="badge bg-info text-white" style={{ fontSize: "11px" }}>
                                  ⏳ Waiting for Driver
                                </span>
                                <small className="text-muted" style={{ fontSize: "10px" }}>
                                  Driver not uploaded yet
                                </small>
                              </div>
                            ) : (
                              // Other statuses
                              <button
                                className="btn btn-sm btn-outline-primary"
                                style={{ fontSize: "12px" }}
                                onClick={() => {
                                  router.push(`/dashboard/agent/driver-request-detail/${property._id}`)
                                }}
                              >
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      renderEmptyState()
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="table-style3 table at-savesearch">
                  <thead className="t-head">
                    <tr>
                      <th scope="col">Property Name</th>
                      <th scope="col">Requested By</th>
                      <th scope="col">Requested Date</th>
                      <th scope="col">Accepted Date</th>
                    </tr>
                  </thead>
                  <tbody className="t-body">
                    {hasData() ? (
                      acceptedRequests.map((property, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                              <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                                <div className="h6 list-title">
                                  <Link href={`/single-v1/${property._id}`}>
                                    {property.propertyName}
                                  </Link>
                                </div>
                                <p className="list-text mb-0">{property.address}</p>
                                <div className="list-price">
                                  <a href="#">{property.area} sqft</a>
                                </div>
                              </div>
                            </div>
                          </th>
                          <td className="vam">
                            <div className="d-flex flex-column align-items-start">
                              <span>{property.seller.fullname}</span>
                              <span>{property.seller.email}</span>
                              <span>{property.seller.mobile}</span>
                            </div>
                          </td>
                          <td className="vam">{formatDate(property.createdAt)}</td>
                          <td className="vam">
                            <span>{formatDate(property.acceptedAt)}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      renderEmptyState()
                    )}
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
