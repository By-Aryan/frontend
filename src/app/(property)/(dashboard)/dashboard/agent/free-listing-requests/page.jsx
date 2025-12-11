"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardContentWrapper from "@/components/property/dashboard/DashboardContentWrapper";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import SellerRequestsDataTable from "@/components/property/dashboard/agent/SellerRequestDataTable";
import DashboardTableWrapper from "@/components/table/DashboardTableWrapper";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useState } from "react";
import FreeListingDataTable from "./free-listing-table";
const CreateSellerAccount = () => {
  const [showTable, setShowTable] = useState("Pending");
  const [pendingPage, setPendingPage] = useState(1);
  const [createdPage, setCreatedPage] = useState(1);
  const [pageSize] = useState(10); // You can make this configurable

  // Fetch pending requests
  const {
    data: pendingData,
    error: pendingError,
    isLoading: pendingLoading,
    isError: pendingIsError,
    refetch: refetchPending,
  } = useAxiosFetch(
    `/agent-free-listing/pending?page=${pendingPage}&limit=${pageSize}`
  );

  // Fetch accepted/created requests
  const {
    data: createdData,
    error: createdError,
    isLoading: createdLoading,
    isError: createdIsError,
    refetch: refetchCreated,
  } = useAxiosFetch(
    `/agent-free-listing/accepted?page=${createdPage}&limit=${pageSize}`
  );

  // Handle pagination for pending table
  const handlePendingPageChange = (newPage) => {
    setPendingPage(newPage);
  };

  // Handle pagination for created table
  const handleCreatedPageChange = (newPage) => {
    setCreatedPage(newPage);
  };

  // Handle tab switching
  const handleTabSwitch = (tab) => {
    setShowTable(tab);
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    if (showTable === "Pending") {
      return {
        data: pendingData?.data || [],
        currentPage: pendingData?.currentPage || 1,
        totalPages: pendingData?.totalPages || 1,
        totalItems: pendingData?.totalItems || 0,
        isLoading: pendingLoading,
        isError: pendingIsError,
        error: pendingError,
        onPageChange: handlePendingPageChange,
      };
    } else {
      return {
        data: createdData?.data || [],
        currentPage: createdData?.currentPage || 1,
        totalPages: createdData?.totalPages || 1,
        totalItems: createdData?.totalItems || 0,
        isLoading: createdLoading,
        isError: createdIsError,
        error: createdError,
        onPageChange: handleCreatedPageChange,
      };
    }
  };

  const currentData = getCurrentData();

  // Refresh data when tab is switched or action is performed
  const refreshData = () => {
    refetchPending();
    refetchCreated();
  };

  return (
    <>
      <DashboardContentWrapper>
        <div className="row">
          <div className="col-lg-12">
            <DboardMobileNavigation />
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-12">
            <div className="dashboard_title_area">
              <h2>Seller's Requests For Free Listing</h2>
              <p className="text">We are glad to see you again!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-self-end gap-2 me-3 mb-3">
          <button
            className={`ud-btn btn-${
              showTable === "Pending" ? "thm" : "white"
            }`}
            onClick={() => handleTabSwitch("Pending")}
          >
            Pending
            {pendingData?.totalItems > 0 && (
              <span className="badge bg-secondary ms-2">
                {pendingData.totalItems}
              </span>
            )}
          </button>
        </div>

        <DashboardTableWrapper>
          {currentData.isLoading ? (
            <LoadingSpinner
              message="Loading seller data..."
              size="md"
              color="primary"
            />
          ) : currentData.isError ? (
            <div className="alert alert-danger m-4 text-center">
              <i className="fa fa-exclamation-circle me-2"></i>
              Error loading seller data:{" "}
              {currentData.error?.message || "Unknown error"}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={refreshData}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="packages_table table-responsive">
              {showTable === "Pending" && (
                <FreeListingDataTable
                  data={currentData.data}
                  currentPage={currentData.currentPage}
                  totalPages={currentData.totalPages}
                  totalItems={currentData.totalItems}
                  onPageChange={currentData.onPageChange}
                  onActionComplete={refreshData}
                  setShowTable={setShowTable}
                />
              )}
              {/* Use In Future If Needed -> The Accpted Table */}
            </div>
          )}
        </DashboardTableWrapper>
      </DashboardContentWrapper>
    </>
  );
};

export default CreateSellerAccount;
