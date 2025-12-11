"use client"
import useAxiosFetch from '@/hooks/useAxiosFetch';
import { useUserStore } from '@/store/store';
import { getPropertyImageStyle, getPropertyImageUrl, handleImageError } from '@/utils/imageUtils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiPostRequest } from "@/axios/apiRequest";

// Helper function to safely format location
const getFormattedLocation = (location) => {
  if (!location) return "Location not specified";
  
  if (typeof location === 'string') return location;
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.emirate) parts.push(location.emirate);
  if (location.country) parts.push(location.country);
  
  return parts.length > 0 
    ? parts.join(', ') 
    : location.address || "Location not specified";
};

function PropertyListedByMeDataTable() {
  const [requestData, setRequestData] = useState([]);
  const [id, setId] = useState("")
  const [showDelistModal, setShowDelistModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [delistReason, setDelistReason] = useState("");
  const [isDelisting, setIsDelisting] = useState(false);
  const router = useRouter();
  const { user } = useUserStore();

  // ✅ Only fetch APPROVED properties (not pending approval)
  const { data, isLoading, isError, error } = useAxiosFetch(`/requestproperty/approved-properties`);

  useEffect(() => {
    if (data) {
      setRequestData(data.data);
      console.log("📸 Approved Properties Response:", data.data);
      // Log first property's images
      if (data.data && data.data[0]) {
        console.log("📸 First Property Images:", data.data[0].developer_notes?.images);
      }
    }
  }, [data]);

  useEffect(() => {
    console.log("📋 Request Data:", requestData);
  }, [requestData]);

  function formatDate(dateString) {
    if (!dateString) return "Invalid Date"; // Handle empty or undefined input

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date formats

    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // Returns DD/MM/YYYY
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "pending-style style1";
      case "Approved":
        return "pending-style style2";
      default:
        return "";
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
        // Refresh the property list if needed
        window.location.reload();
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

  return (
    <>
      <table className="table-style3 table at-savesearch" style={{ fontSize: "14px" }}>
        <thead className="t-head">
          <tr>
            <th scope="col">Property Name</th>
            <th scope="col">Requested By</th>
            <th scope="col">Requested Date</th>
            <th scope="col">Status</th>
            <th scope="col">Listed Date</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {requestData?.map((property, index) => (
            <tr key={index}>
              <th scope="row">
                <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0" style={{ gap: "10px" }}>
                  <div className="list-thumb" style={{ minWidth: "80px", height: "60px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" }}>
                    {(() => {
                      try {
                        const imageUrl = getPropertyImageUrl(property);
                        if (!imageUrl || imageUrl === null || imageUrl === undefined || imageUrl === '') {
                          return <i className="flaticon-photo-camera" style={{ fontSize: "32px", color: "#999" }}></i>;
                        }
                        return (
                          <Image
                            width={80}
                            height={60}
                            className="w-100 h-100"
                            src={imageUrl}
                            alt={property?.name || "Property"}
                            style={getPropertyImageStyle(imageUrl)}
                            unoptimized={true}
                            onError={(e) => {
                              console.error("Image load error:", imageUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        );
                      } catch (error) {
                        console.error("Error rendering image:", error);
                        return <i className="flaticon-photo-camera" style={{ fontSize: "32px", color: "#999" }}></i>;
                      }
                    })()}
                  </div>
                  <div className="list-content py-0 p-0 mt-1 mt-xxl-0 ps-xxl-2">
                    <div className="h6 list-title mb-1">
                      <Link href={`/single-v1/${property._id}`}>
                        {property.name}
                      </Link>
                    </div>
                    <p className="list-text mb-0 text-sm" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {getFormattedLocation(property.location)}
                    </p>
                    <div className="d-flex gap-1 text-sm">
                      <span className="list-text mb-0">
                        {property.location?.city || property.location?.emirate || 'Location'}
                      </span>
                      {property.location?.country && <span className="list-text mb-0">, {typeof property.location.country === 'string' ? property.location.country : property.location.country?.name || ''}</span>}
                    </div>
                    <div className="list-price text-sm">
                      <a href="#">{property.details.size.value} sqft</a>
                    </div>
                  </div>
                </div>
              </th>

              <td className="vam">
                <div className="flex flex-col justify-center items-center py-2">
                  <a className="text-sm">{property.seller?.fullname || "-"}</a>
                  <a className="text-sm">{property.seller?.email || "-"}</a>
                </div>
              </td>
              <td className="vam text-sm">{property.requested_id?.createdAt ? formatDate(property.requested_id.createdAt) : "-"}</td>
              <td className="vam">
                <span className={getListingStatus(property).style}>
                  {getListingStatus(property).text}
                </span>
              </td>
              <td className="vam text-sm">
                <span>{property.created_at ? formatDate(property.created_at) : "-"}</span>
              </td>
              
              <td className="vam">
                {canDelist(property) ? (
                  <button
                    onClick={() => handleDelistClick(property)}
                    className="delist-action-btn btn btn-outline-danger btn-sm d-flex align-items-center"
                    title="Request Delist"
                  >
                    <i className="fas fa-minus-circle me-1"></i>
                    Delist
                  </button>
                ) : (
                  <span className="text-muted small">
                    {getListingStatus(property).text}
                  </span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Delist Modal */}
      {showDelistModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg shadow-lg w-full max-w-md mx-4 delist-modal">
            <div className="p-6">
              <div className="d-flex align-items-center mb-4">
                <i className="fas fa-exclamation-triangle text-warning me-3 fa-2x"></i>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-1">
                    Request Property Delist
                  </h3>
                  <p className="text-muted mb-0">Confirm delisting request</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Please provide a reason for delisting <strong>"{selectedProperty?.name || 'this property'}"</strong>:
                </p>
                <textarea
                  value={delistReason}
                  onChange={(e) => setDelistReason(e.target.value)}
                  placeholder="Enter reason for delisting (minimum 10 characters)..."
                  className="form-control"
                  rows="4"
                  disabled={isDelisting}
                />
                <small className={`text-muted mt-1 d-block ${delistReason.trim().length < 10 ? 'text-danger' : 'text-success'}`}>
                  {delistReason.trim().length}/10 characters minimum
                </small>
              </div>

              <div className="alert alert-info py-2 px-3 mb-4 delist-waiting-indicator">
                <i className="fas fa-info-circle me-2"></i>
                <small>This request will be reviewed by an administrator before the property is delisted.</small>
              </div>
              
              <div className="d-flex justify-content-end gap-3">
                <button
                  onClick={handleCloseDelistModal}
                  disabled={isDelisting}
                  className="btn btn-secondary btn-sm"
                >
                  <i className="fas fa-times me-1"></i>
                  Cancel
                </button>
                <button
                  onClick={handleDelistSubmit}
                  disabled={isDelisting || !delistReason.trim() || delistReason.trim().length < 10}
                  className="delist-action-btn btn btn-danger btn-sm d-flex align-items-center"
                >
                  {isDelisting && (
                    <span className="spinner-border spinner-border-sm me-2" />
                  )}
                  <i className="fas fa-paper-plane me-1"></i>
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyListedByMeDataTable