"use client";
import { ApiPostRequest } from "@/axios/apiRequest";
import api from "@/axios/axios.interceptor";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Get API URL from environment variables
const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
  /\/api\/v1\/?$/,
  ""
);

const getStatusStyle = (status) => {
  switch (status) {
    case "Approved":
      return "pending-style style2";
    case "Pending":
      return "pending-style style1";
    case "Processing":
      return "pending-style style3";
    default:
      return "pending-style style1"; // Default style
  }
};

const getListingStatus = (property) => {
  const status = property.listing_status;

  switch (status) {
    case "delisted":
      return { text: "Delisted", style: "pending-style" };
    case "pending_delist":
      return { text: "Pending Approval", style: "pending-style style1" };
    case "active":
      return { text: "Active", style: "pending-style style2" };
    case "pending":
      return { text: "Under Review", style: "pending-style style3" };
    default:
      return { text: "Active", style: "pending-style style2" };
  }
};

const canDelist = (property) => {
  const status = property.listing_status;
  return status === "active" || !status; // Can delist only if active or undefined (default active)
};

const formatPrice = (price, currency) => {
  if (!price) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "AED",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHour < 24)
      return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
    if (diffMonth < 12)
      return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
    return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString || "N/A";
  }
};

const getFormattedLocation = (location) => {
  if (!location) return "Location not specified";
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.emirate) parts.push(location.emirate);
  if (location.country) parts.push(location.country);
  return parts.length > 0
    ? parts.join(", ")
    : location.address || "Location not specified";
};

const getPropertyImage = (property) => {
  // Check if property and developer_notes exist
  if (!property || !property.developer_notes) return "/images/placeholder.jpg";

  // Check if images array exists and has at least one item
  const image =
    property.developer_notes.images &&
      property.developer_notes.images.length > 0
      ? property.developer_notes.images[0]
      : "/images/placeholder.jpg";

  // Only prepend backendBaseUrl if the image path doesn't already include https/https
  if (image.startsWith("https")) {
    return image;
  } else {
    return backendBaseUrl ? `${backendBaseUrl}${image}` : image;
  }
};

// Check if property is currently boosted/featured and active OR has pending payment
const isBoostActive = (property) => {
  const now = new Date();

  // Check if backend already calculated boost status
  if (property.isBoosted !== undefined) {
    return property.isBoosted;
  }

  // Fallback: Check both boosted and featured fields manually
  const boosted = property.boosted || {};
  const featured = property.featured || {};

  // Check boosted field first
  if (boosted.isBoosted && boosted.expiresAt) {
    return new Date(boosted.expiresAt) > now;
  }

  // Check featured field for backward compatibility
  if (featured.isFeatured && featured.expiresAt) {
    return new Date(featured.expiresAt) > now;
  }

  // Check if marked as boosted/featured without expiry
  if (boosted.isBoosted && !boosted.expiresAt) return true;
  if (featured.isFeatured && !featured.expiresAt) return true;

  return false;
};

// Check if property has pending boost payment
const hasPendingBoostPayment = (property) => {
  // This would need to be populated by backend or checked via API
  // For now, we'll rely on the boost checkout API to handle this
  return false;
};

// Custom hook to safely get userId from localStorage
const useUserId = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const id = localStorage.getItem("id");
      setUserId(id);
    } catch (error) {
      console.error("Failed to retrieve userId from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userId, isLoading };
};

const PropertyDataTable = () => {
  const { userId, isLoading: userIdLoading } = useUserId();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDelistModal, setShowDelistModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [delistReason, setDelistReason] = useState("");
  const [isDelisting, setIsDelisting] = useState(false);
  const [purposeFilter, setPurposeFilter] = useState("all"); // New state for purpose filter
  const [showViewersModal, setShowViewersModal] = useState(false); // For contact viewers popup
  const [selectedPropertyViewers, setSelectedPropertyViewers] = useState(null); // Store viewers data
  const [loadingViewers, setLoadingViewers] = useState(false); // Loading state for viewers
  const itemsPerPage = 4;

  // Only create the endpoint when userId is available
  const endpoint = userId ? `/property/approvedbyId?userId=${userId}` : null;

  const {
    data,
    isLoading: dataLoading,
    error,
    refetch,
    isFetching,
  } = useAxiosFetch(endpoint);

  // Extract property data safely
  const allProperties = Array.isArray(data?.data) ? data.data : [];

  // Debug: Log user and property information
  useEffect(() => {
    console.log("=== USER DEBUG ===");
    console.log("Current userId from localStorage:", userId);
    console.log("API endpoint:", endpoint);
  }, [userId, endpoint]);

  useEffect(() => {
    if (allProperties.length > 0) {
      console.log("=== PROPERTY DEBUG ===");
      console.log("Total properties:", allProperties.length);
      console.log("Sample property structure:", allProperties[0]);
      console.log("Available keys:", Object.keys(allProperties[0]));
      console.log("Details object:", allProperties[0].details);
      console.log("Purpose field:", allProperties[0].details?.purpose);

      // Check all properties for their purposes
      const purposes = allProperties.map(p => ({
        id: p._id,
        title: p.title,
        purpose: p.details?.purpose,
        detailsKeys: p.details ? Object.keys(p.details) : 'no details'
      }));
      console.log("All property purposes:", purposes);
    }
  }, [allProperties]);

  // Helper function to determine if property is for rent or sale
  const isPropertyForRent = (property) => {
    const possibleFields = [
      property.details?.purpose,
      property.purpose,
      property.listing_type,
      property.type,
      property.transaction_type,
      property.transactionType
    ];

    const purposeValue = possibleFields.find(field => field && typeof field === 'string') || '';
    const lowerPurpose = purposeValue.toLowerCase();

    return lowerPurpose.includes('rent') || lowerPurpose.includes('rental') || lowerPurpose === 'rent';
  };

  // Helper function to determine if property is for sale (default for unclear cases)
  const isPropertyForSale = (property) => {
    const possibleFields = [
      property.details?.purpose,
      property.purpose,
      property.listing_type,
      property.type,
      property.transaction_type,
      property.transactionType
    ];

    const purposeValue = possibleFields.find(field => field && typeof field === 'string') || '';
    const lowerPurpose = purposeValue.toLowerCase();

    // If it's clearly for rent, return false
    if (lowerPurpose.includes('rent') || lowerPurpose.includes('rental') || lowerPurpose === 'rent') {
      return false;
    }

    // Otherwise, assume it's for sale (including commercial, mixed, unclear, etc.)
    return true;
  };

  // Filter properties based on purpose
  const filteredProperties = allProperties.filter(property => {
    if (purposeFilter === "all") return true;

    if (purposeFilter === "rent") {
      return isPropertyForRent(property);
    }

    if (purposeFilter === "sell") {
      return isPropertyForSale(property);
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [purposeFilter]);

  // Calculate paginated properties from filtered results
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        // Implementation for property deletion would go here
        console.log(`Deleting property with ID ${propertyId}`);

        // After successful deletion, refetch the data
        await refetch();
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete property. Please try again.");
      }
    }
  };



  const handleBoostPropertyClicked = (property_id, property) => {
    if (property_id) {
      // Check if it's a rental property
      const isRental = isPropertyForRent(property);

      if (isRental) {
        router.push(`/rental-pricing/${property_id}`);
      } else {
        router.push(`/seller-pricing/${property_id}`);
      }
    }
  };

  // Handle viewing contact viewers for a property
  const handleViewContactViewers = async (propertyId) => {
    setLoadingViewers(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get(
        `/property/${propertyId}/contact-views`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSelectedPropertyViewers(response.data.data);
        setShowViewersModal(true);
      }
    } catch (error) {
      console.error('Error fetching contact viewers:', error);
      alert('Failed to fetch contact viewers');
    } finally {
      setLoadingViewers(false);
    }
  };

  // Delist functionality
  const handleDelistClick = (property) => {
    setSelectedProperty(property);
    setShowDelistModal(true);
  };

  const handleDelistSubmit = async () => {
    if (!delistReason.trim()) {
      alert("Please provide a reason for delisting");
      return;
    }

    if (delistReason.trim().length < 10) {
      alert("Reason must be at least 10 characters long");
      return;
    }

    setIsDelisting(true);
    try {
      const response = await ApiPostRequest("/delist/request", {
        propertyId: selectedProperty._id,
        reason: delistReason,
      });

      if (response.data && response.data.success) {
        alert("Delist request submitted successfully!");
        setShowDelistModal(false);
        setDelistReason("");
        setSelectedProperty(null);
        refetch(); // Refresh the property list
      } else {
        alert(response.data?.message || "Failed to submit delist request");
      }
    } catch (error) {
      console.error("Error submitting delist request:", error);
      // Show backend error message if available
      const errorMessage = error.response?.data?.message || "Failed to submit delist request. Please try again.";
      alert(errorMessage);
    } finally {
      setIsDelisting(false);
    }
  };

  const handleCloseDelistModal = () => {
    setShowDelistModal(false);
    setDelistReason("");
    setSelectedProperty(null);
  };

  // Loading states with better user feedback
  if (userIdLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Initializing...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          No user found. Please{" "}
          <Link href="/login" className="alert-link">
            log in
          </Link>{" "}
          again.
        </div>
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="text-center py-5">Preparing to load properties...</div>
    );
  }

  if (dataLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          Error: {error.message || "Failed to load properties"}
        </div>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => refetch()}
        >
          <i className="fas fa-sync-alt me-2"></i>Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Show update indicator when data is being refreshed */}
      {isFetching && !dataLoading && (
        <div className="alert alert-info d-flex align-items-center mb-3" style={{ fontSize: '14px' }}>
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>🔄 Checking for property updates...</span>
        </div>
      )}

      {/* Purpose Filter Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <button
            onClick={() => setPurposeFilter("all")}
            className={`btn ${purposeFilter === "all" ? "btn-primary" : "btn-outline-primary"} btn-sm`}
          >
            All ({allProperties.length})
          </button>
          <button
            onClick={() => setPurposeFilter("rent")}
            className={`btn ${purposeFilter === "rent" ? "btn-success" : "btn-outline-success"} btn-sm`}
          >
            Rental ({allProperties.filter(p => isPropertyForRent(p)).length})
          </button>
          <button
            onClick={() => setPurposeFilter("sell")}
            className={`btn ${purposeFilter === "sell" ? "btn-warning" : "btn-outline-warning"} btn-sm`}
          >
            Sale ({allProperties.filter(p => isPropertyForSale(p)).length})
          </button>
        </div>

        {/* Filter Results Info */}
        <div className="text-muted small d-flex justify-content-between align-items-center">
          <span>
            {purposeFilter !== "all" && (
              <span>
                Showing {filteredProperties.length} of {allProperties.length} properties
              </span>
            )}
          </span>
          <button
            onClick={() => {
              console.log("🔄 Manual refresh triggered");
              refetch();
            }}
            className="btn btn-outline-secondary btn-sm"
            disabled={isFetching}
          >
            {isFetching ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Refreshing...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt me-1"></i>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th scope="col">Listing title</th>
            <th scope="col">Date Published</th>
            <th scope="col">Status</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {filteredProperties.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <div className="py-4">
                  <i className="fas fa-home fa-3x text-muted mb-3"></i>
                  <h5>No properties found</h5>
                  <p className="text-muted">
                    {purposeFilter === "all"
                      ? "You haven't added any properties yet."
                      : `No ${purposeFilter === "rent" ? "rental" : "sale"} properties found.`
                    }
                  </p>
                  <Link
                    href="/dashboard/seller/request-to-add-new-property"
                    className="btn-theme-success hover:bg-success text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <i className="fas fa-plus me-2"></i>Add Property
                  </Link>
                </div>
              </td>
            </tr>
          ) : (
            paginatedProperties.map((property) => (
              <tr key={property._id}>
                <th scope="row">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div
                      className="list-thumb position-relative"
                      style={{ width: 110, height: 94 }}
                    >
                      <Image
                        width={110}
                        height={94}
                        className="w-100 h-100 object-fit-cover"
                        src="/images/icon/pricing-icon-3.svg"
                        alt={property.title || "Property"}
                      />
                      {/* Boosted/Featured badge on image */}
                      {isBoostActive(property) && (
                        <span className={`badge position-absolute top-0 start-0 m-1 ${property.hasPendingBoostPayment ? 'bg-warning' : 
                          isPropertyForRent(property) ? 'bg-info' : 'bg-success'
                          }`}>
                          <i className={`fas ${property.hasPendingBoostPayment ? 'fa-clock' : 
                            isPropertyForRent(property) ? 'fa-home' : 'fa-rocket'} me-1`}></i>
                          {property.hasPendingBoostPayment ? 'Pending' : 
                           isPropertyForRent(property) ? 'Rental Boost' : 'Boosted'}
                        </span>
                      )}
                    </div>
                    <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title d-flex align-items-center gap-2">
                        <Link href={`/single-v1/${property._id}`}>
                          {property.title || "Untitled Property"}
                        </Link>
                        {/* Purpose Badge */}
                        {(() => {
                          if (isPropertyForRent(property)) {
                            return <span className="badge bg-success text-white small">Rental</span>;
                          } else {
                            return <span className="badge bg-warning text-dark small">Sale</span>;
                          }
                        })()}
                      </div>
                      <p className="list-text mb-0">
                        {getFormattedLocation(property.location)}
                      </p>
                      <div className="list-price">
                        <span>
                          {formatPrice(property.price, property.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </th>
                <td className="vam">{formatDate(property.created_at)}</td>
                <td className="vam">
                  <span
                    className={getListingStatus(property).style}
                  >
                    {getListingStatus(property).text}
                  </span>
                </td>
                <td className="vam">
                  {formatPrice(property.price, property.currency)}
                </td>
                <td className="vam">
                  <div className="d-flex align-items-center gap-2">
                    {/* Contact Views Button */}
                    <button
                      onClick={() => handleViewContactViewers(property._id)}
                      className="icon border-0 bg-transparent"
                      style={{
                        fontSize: "18px",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.2s ease",
                        color: "#10b981",
                        position: "relative"
                      }}
                      data-tooltip-id={`contact-views-${property._id}`}
                      disabled={loadingViewers}
                    >
                      <span className="fas fa-eye" />
                      <ReactTooltip
                        id={`contact-views-${property._id}`}
                        place="top"
                        content="View who viewed your contact"
                      />
                    </button>

                    {/* Boost Button */}
                    {/* Show boost button only when property is NOT currently boosted */}
                    {!isBoostActive(property) && (
                      <button
                        onClick={() =>
                          handleBoostPropertyClicked(property._id, property)
                        }
                        className={`icon border-0 bg-transparent text-warning`}
                        style={{
                          fontSize: "18px",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "color 0.2s ease",
                        }}
                        data-tooltip-id={`boost-${property._id}`}
                      >
                        <span className="fas fa-star" />
                        {/* Optional Tooltip */}
                        <ReactTooltip
                          id={`boost-${property._id}`}
                          place="top"
                          content="Boost Property"
                        />
                      </button>
                    )}





                    {/* Edit Icon */}
                    <Link
                      href={`/dashboard/seller/edit-property/${property._id}`}
                      className="icon"
                      data-tooltip-id={`edit-${property._id}`}
                      style={{
                        fontSize: "18px",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="fas fa-pen" />
                    </Link>

                    {/* Delist Icon - only show if property can be delisted */}
                    {canDelist(property) && (
                      <button
                        onClick={() => handleDelistClick(property)}
                        className="icon border-0 bg-transparent"
                        data-tooltip-id={`delist-${property._id}`}
                        style={{
                          fontSize: "18px",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#dc3545",
                        }}
                      >
                        <span className="fas fa-minus-circle" />
                      </button>
                    )}

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDeleteProperty(property._id)}
                      className="icon border-0 bg-transparent"
                      data-tooltip-id={`delete-${property._id}`}
                      style={{
                        fontSize: "18px",
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="flaticon-bin" />
                    </button>
                    <ReactTooltip
                      id={`edit-${property._id}`}
                      place="top"
                      content="Edit Property"
                    />
                    {canDelist(property) && (
                      <ReactTooltip
                        id={`delist-${property._id}`}
                        place="top"
                        content="Request Delist"
                      />
                    )}
                    <ReactTooltip
                      id={`delete-${property._id}`}
                      place="top"
                      content="Delete Property"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination - only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="mbp_pagination text-center mt-4 px-auto">
          <ul className="page_navigation d-flex justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                <span className="fas fa-angle-left" />
              </button>
            </li>

            {(() => {
              const pageNumbers = [];
              const maxPagesToShow = 5;
              const startPage = Math.max(
                1,
                currentPage - Math.floor(maxPagesToShow / 2)
              );
              const endPage = Math.min(
                totalPages,
                startPage + maxPagesToShow - 1
              );

              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
              }

              return pageNumbers.map((page) => (
                <li
                  key={page}
                  className={`page-item${page === currentPage ? " active" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ));
            })()}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                <span className="fas fa-angle-right" />
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Delist Modal */}
      {showDelistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Request Property Delist
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for delisting "{selectedProperty?.title || 'this property'}":
            </p>
            <textarea
              value={delistReason}
              onChange={(e) => setDelistReason(e.target.value)}
              placeholder="Enter reason for delisting (minimum 10 characters)..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus-primary"
              rows="4"
              disabled={isDelisting}
            />
            <small className={`block mt-1 text-sm ${delistReason.trim().length < 10 ? 'text-danger' : 'text-success'}`}>
              {delistReason.trim().length}/10 characters minimum
            </small>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={handleCloseDelistModal}
                disabled={isDelisting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelistSubmit}
                disabled={isDelisting || !delistReason.trim() || delistReason.trim().length < 10}
                className="px-4 py-2 btn-theme-danger text-white rounded-lg hover:bg-danger disabled:opacity-50 flex items-center"
              >
                {isDelisting && (
                  <span className="spinner-border spinner-border-sm me-2" />
                )}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Viewers Modal */}
      {showViewersModal && selectedPropertyViewers && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setShowViewersModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold">Contact Views</h5>
                  <p className="text-muted small mb-0">
                    {selectedPropertyViewers.propertyTitle}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewersModal(false)}
                />
              </div>
              <div className="modal-body">
                {selectedPropertyViewers.totalViews === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-eye-slash text-muted" style={{ fontSize: "48px" }}></i>
                    <p className="text-muted mt-3">No one has viewed your contact yet</p>
                  </div>
                ) : (
                  <>
                    <div className="alert alert-success d-flex align-items-center mb-3">
                      <i className="fas fa-chart-line me-2"></i>
                      <strong>{selectedPropertyViewers.totalViews}</strong>
                      <span className="ms-1">
                        {selectedPropertyViewers.totalViews === 1 ? 'person has' : 'people have'} viewed your contact
                      </span>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Viewed At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPropertyViewers.viewers.map((viewer, index) => (
                            <tr key={viewer.viewerId || index}>
                              <td>{index + 1}</td>
                              <td>
                                <i className="fas fa-user text-primary me-2"></i>
                                {viewer.viewerName}
                              </td>
                              <td className="text-muted small">{viewer.viewerEmail}</td>
                              <td className="text-muted small">{viewer.viewerPhone}</td>
                              <td className="text-muted small">
                                {formatDate(viewer.viewedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewersModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDataTable;
