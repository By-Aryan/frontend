"use client";

import useAxiosPost from "@/hooks/useAxiosPost";
import { usePropertyStore } from "@/store/store";
import { useEffect, useState } from "react";
import PaginationTwo from "../../PaginationTwo";
import ListingSidebar from "../../sidebar";
import FeaturedListings from "./FeatuerdListings";
import AdsDisplay from "@/components/common/AdsDisplay";
import BannerAds from "@/components/common/BannerAds";

export default function PropertyFilteringList({
  showModal,
  setShowModal,
  filterFunctions,
  handleFilterChange,
  sortedFilteredData,
  filteredData,
  currentPage = 0,
  onPageChange,
  totalRecords = 0,
  limit = 5,
  currentSortingOption,
  setCurrentSortingOption,
  visibleLocations = [],
  showAll = false,
  setShowAll = () => {},
  locations = [],
  getImageUrl,
}) {
  const [propData, setPropData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [isScheduleTourModal, setIsScheduleTourModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true); // Set to true for list view
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  const { properties } = usePropertyStore();

  useEffect(() => {
    if (properties) {
      setPropData(properties);
    }
  }, [properties]);

  const mutation = useAxiosPost("/savefilter", {
    onSuccess: (details) => {
      console.log("Search Saved successfully:", details);
      setShowModal(false);
    },
    onError: (error) => {
      console.error("Error Saving Search:", error.response.data.message);
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ filterName: searchName });
  };

  const sortingOptions = [
    "Newest",
    "Best Seller",
    "Best Match",
    "Price Low",
    "Price High",
  ];

  return (
    <>
      <style jsx>{`
        .container {
          max-width: 100%;
          padding-left: 10px;
          padding-right: 10px;
        }

        .enhanced-sidebar-container {
          height: calc(100vh - 60px);
          min-height: 750px;
        }

        .enhanced-sidebar-container :global(.ads-display) {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 15px;
          padding: 25px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .enhanced-sidebar-container :global(.ads-container) {
          flex: 1;
          overflow-y: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .enhanced-sidebar-container :global(.ads-container)::-webkit-scrollbar {
          width: 6px;
        }

        .enhanced-sidebar-container :global(.ads-container)::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .enhanced-sidebar-container :global(.ads-container)::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 3px;
        }

        .enhanced-sidebar-container :global(.ad-item) {
          min-height: 300px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 2px solid #e9ecef;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          border-radius: 15px;
          padding: 20px;
          position: relative;
          margin-bottom: 0;
        }

        .enhanced-sidebar-container :global(.ad-image),
        .enhanced-sidebar-container :global(.ad-image-fallback) {
          height: 200px !important;
          border-radius: 12px;
        }

        .enhanced-sidebar-container :global(.ad-image-fallback) {
          font-size: 48px !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
        }

        .enhanced-sidebar-container :global(.ad-title) {
          font-size: 22px !important;
          font-weight: bold;
          margin-bottom: 12px;
          color: #2c3e50;
          line-height: 1.3;
        }

        .enhanced-sidebar-container :global(.ad-description) {
          font-size: 16px !important;
          line-height: 1.5;
          color: #5a6c7d;
          margin-bottom: 18px;
        }

        .enhanced-sidebar-container :global(.ad-cta) {
          padding: 16px 25px !important;
          font-size: 16px !important;
          font-weight: bold;
          background: linear-gradient(135deg, #007bff, #0056b3) !important;
          border: none;
          color: white;
          border-radius: 25px;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .enhanced-sidebar-container :global(.ads-header) {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e9ecef;
        }

        .enhanced-sidebar-container :global(.ads-header h6) {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .row {
          margin-left: -5px;
          margin-right: -5px;
        }

        .col-lg-8, .col-xl-9, .col-lg-4, .col-xl-3 {
          padding-left: 5px;
          padding-right: 5px;
        }

        @media (max-width: 1200px) {
          .enhanced-sidebar-container {
            height: auto;
            min-height: 500px;
            max-height: 80vh;
          }
          
          .enhanced-sidebar-container :global(.ad-item) {
            min-height: 200px;
          }
          
          .enhanced-sidebar-container :global(.ad-image),
          .enhanced-sidebar-container :global(.ad-image-fallback) {
            height: 120px !important;
          }
        }

        @media (max-width: 991px) {
          .enhanced-sidebar-container {
            height: auto;
            min-height: auto;
          }

          .enhanced-sidebar-container :global(.ads-container) {
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            gap: 15px;
            padding-bottom: 15px;
          }

          .enhanced-sidebar-container :global(.ad-item) {
            flex: none;
            min-width: 280px;
            min-height: 180px;
            margin-right: 15px;
          }
        }
      `}</style>
      
      <div className="container">
        {/* Mobile filter sidebar */}
        <div
          className="offcanvas offcanvas-start p-0"
          id="listingSidebarFilter"
          aria-labelledby="listingSidebarFilterLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="listingSidebarFilterLabel">
              Listing Filter
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body p-0">
            <ListingSidebar
              filterFunctions={filterFunctions}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="row gx-2">
          <div className="col-lg-8 col-xl-9" id="main-content-area">
            {/* Compact Popular Locations Section */}
            <div
              className="bg-white border rounded-3 mb-3"
              style={{
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
              }}
            >
              <div className="px-3 py-2">
                <div className="d-flex flex-wrap gap-2">
                  {/* Visible Locations */}
                  {visibleLocations.map((loc, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        filterFunctions.handlelocation(
                          loc.name.toLowerCase().replace(/\s+/g, "-")
                        );
                      }}
                      className="btn btn-sm"
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                        backgroundColor:
                          filterFunctions.location ===
                          loc.name.toLowerCase().replace(/\s+/g, "-")
                            ? "#ecfdf5"
                            : "#f9fafb",
                        color:
                          filterFunctions.location ===
                          loc.name.toLowerCase().replace(/\s+/g, "-")
                            ? "#059669"
                            : "#4b5563",
                        borderColor:
                          filterFunctions.location ===
                          loc.name.toLowerCase().replace(/\s+/g, "-")
                            ? "#a7f3d0"
                            : "#e5e7eb",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {loc.name}
                    </button>
                  ))}

                  {/* Sort Options */}
                  <div className="d-flex justify-content-between align-items-center ms-auto">
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Sort by:
                    </span>
                    <select
                      className="form-select form-select-sm"
                      value={currentSortingOption}
                      onChange={(e) => setCurrentSortingOption(e.target.value)}
                      style={{
                        fontSize: "13px",
                        width: "120px",
                        height: "32px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {sortingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Show More/Less Button */}
                {(() => {
                  // Button shows when there are more locations than currently visible
                  const shouldShowButton = visibleLocations.length < locations.length;
                  console.log("🏙️ Button visibility check:", {
                    visibleLocationsLength: visibleLocations.length,
                    totalLocationsLength: locations.length,
                    showAll,
                    shouldShowButton,
                    visibleLocationNames: visibleLocations.map(l => l.name),
                    allLocationNames: locations.map(l => l.name)
                  });
                  return shouldShowButton;
                })() && (
                  <div className="d-flex justify-content-end mt-2">
                    <button
                      onClick={() => {
                        console.log("🔄 View More clicked:", { currentShowAll: showAll, newShowAll: !showAll });
                        setShowAll(!showAll);
                      }}
                      className="btn btn-link p-0"
                      style={{
                        color: "#0d9488",
                        fontSize: "12px",
                        fontWeight: "500",
                        textDecoration: "none",
                      }}
                    >
                      <i
                        className={`fa ${
                          showAll ? "fa-chevron-up" : "fa-chevron-down"
                        } me-1`}
                      />
                      {showAll ? "View Fewer" : "View More"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Header Banner Ad */}
            <div className="row mb-4">
              <div className="col-12">
                <BannerAds placement="header" className="header-banner-ad" />
              </div>
            </div>

            {/* Properties List */}
            <div className="row">
              <FeaturedListings
                colstyle={colstyle}
                data={filteredData}
                setIsScheduleTourModal={setIsScheduleTourModal}
                sortedFilteredData={sortedFilteredData}
                getImageUrl={getImageUrl}
              />
            </div>

            {/* Mid-content Banner Ad */}
            <div className="row my-4">
              <div className="col-12">
                <BannerAds placement="banner" className="mid-content-banner-ad" />
              </div>
            </div>

            {/* Pagination */}
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                {totalRecords > 0 && (
                  <PaginationTwo
                    pageCapacity={limit}
                    data={sortedFilteredData}
                    pageNumber={currentPage + 1}
                    setPageNumber={(page) => {
                      if (onPageChange && typeof page === 'number' && page >= 1) {
                        onPageChange(page - 1);
                      }
                    }}
                    totalRecords={totalRecords}
                  />
                )}
              </div>
            </div>

            {/* Mobile Sidebar Ads */}
            <div className="row mt-4 d-lg-none">
              <div className="col-12">
                <div className="bg-light rounded p-3">
                  <h6 className="text-muted mb-3">Sponsored</h6>
                  <AdsDisplay placement="sidebar" maxAds={2} showTitle={false} />
                </div>
              </div>
            </div>

            {/* Footer Banner Ad */}
            <div className="row mt-4">
              <div className="col-12">
                <BannerAds placement="footer" className="footer-banner-ad" />
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="col-lg-4 col-xl-3">
            <div className="sticky-top d-none d-lg-block" style={{ top: "10px", zIndex: 1 }}>
              <div className="enhanced-sidebar-container">
                <AdsDisplay placement="sidebar" maxAds={6} className="full-height-sidebar" />
              </div>
            </div>
            
            <div className="d-lg-none mt-4">
              <AdsDisplay placement="sidebar" maxAds={2} />
            </div>
          </div>
        </div>

        {/* Save Search Modal */}
        {showModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-lg shadow-lg"
              style={{
                width: "400px",
                maxWidth: "90%",
                borderRadius: "10px",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "15px 20px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h2
                  className="text-lg font-semibold m-0"
                  style={{ color: "#0f8363" }}
                >
                  Save Search
                </h2>
                <button
                  onClick={handleCloseModal}
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#666",
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: "20px" }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#555" }}
                    >
                      Search Name:
                    </label>
                    <input
                      type="text"
                      name="search_name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "14px",
                        transition: "border-color 0.3s ease",
                      }}
                      placeholder="Enter a name for this search"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#f0f0f0",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "#0f8363",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}