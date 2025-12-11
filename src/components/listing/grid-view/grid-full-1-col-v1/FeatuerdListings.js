"use client";

import { ApiDeleteRequest, ApiPostRequest } from "@/axios/apiRequest";
import useAxiosPost from "@/hooks/useAxiosPost";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyAd from "./PropertyAd";
import "../../../../styles/boost-indicators.css";
import { generateStructuredData } from "@/utils/seoUtils";

const FeaturedListings = ({
  data,
  colstyle,
  setIsScheduleTourModal,
  getImageUrl,
  viewedPropertyIds = [], // List of property IDs where user has viewed contacts
}) => {
  console.log("🚀 ~ FeaturedListings ~ data:123435678", data);
  // Debug: Log each property's image info
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("📸 Image Debug - Property Images:");
      data.forEach((prop, index) => {
        console.log(`Property ${index + 1}:`, {
          id: prop._id,
          title: prop.title || prop.name,
          imageCount: prop.developer_notes?.image_count || 0,
          firstImage: prop.developer_notes?.images?.[0]?.filename || 'NO IMAGE',
          fullUrl: prop.developer_notes?.images?.[0]?.full_url?.substring(0, 100) || 'NO URL'
        });
      });
    }
  }, [data]);
  const router = useRouter();
  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  const isPlanActive = localStorage.getItem("isPlanActive") === "true";
  console.log("🚀 ~ FeaturedListings ~ isPlanActive:", isPlanActive);
  const [favorites, setFavorites] = useState({});
  const [showNoCreditPopup, setShowNoCreditPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);

  // Add state to track failed images
  const [failedImages, setFailedImages] = useState({});

  // Set up the mutation for tracking contact views
  const contactViewMutation = useAxiosPost("/subscription/track-contact-view", {
    onSuccess: (response) => {
      console.log("🚀 ~ FeaturedListings ~ response:", response.data);
      if (response.data.status === 1) {
        setCurrentSeller({
          name: response.data.sellerDetails?.fullname,
          phone: response.data.sellerDetails?.mobile,
          email: response.data.sellerDetails?.email,
        });
        setShowSellerPopup(true);
      } else if (response.data.status === 2) {
        setShowNoCreditPopup(true);
      }
    },
    onError: (error) => {
      console.error("Error tracking contact view", error);
      if (error.response?.status === 401) {
        setShowLoginPopup(true);
      } else if (error.response?.status === 403) {
        setShowRolePopup(true);
      }
    },
  });

  const propertyTrackClickMutation = useAxiosPost("/property/track-click", {
    onSuccess: (response) => { },
    onError: (error) => {
      console.error("Error tracking contact view", error);
    },
  });

  // Initialize favorites state from the API data
  useEffect(() => {
    if (data && data.length > 0) {
      const initialFavorites = {};
      data.forEach((property) => {
        initialFavorites[property._id] = !!property.is_favourite;
      });
      setFavorites(initialFavorites);
    }
  }, [data]);

  // Function to handle favorite toggle
  const handleFavoriteToggle = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (favorites[propertyId]) {
        const response = await ApiDeleteRequest(`/property/favourite/${propertyId}`, {
          property_id: propertyId,
        });
        if (response.status === 200) {
          setFavorites((prev) => ({
            ...prev,
            [propertyId]: false,
          }));
        }
      } else {
        const response = await ApiPostRequest(`/property/favourite`, {
          property_id: propertyId,
        });
        if (response.status === 200) {
          setFavorites((prev) => ({
            ...prev,
            [propertyId]: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Function to handle the "View Number" click
  const handleViewNumberClick = (e, listing) => {
    e?.stopPropagation();

    // Check if user is logged in
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginPopup(true);
      return;
    }

    // Removed role check - now depends on backend credit validation
    // Let the backend handle access control based on credits

    contactViewMutation.mutate({
      viewType: "true",
      propertyId: listing?._id,
    });
  };

  // Close the popups
  const closePopup = () => {
    setShowSellerPopup(false);
  };

  const getPropertyImageUrl = (listing, index = 0) => {
    // Create unique key for this image
    const imageKey = `${listing?._id}_${index}`;

    // If this image has failed before, return null to show camera icon
    if (failedImages[imageKey]) {
      return null;
    }

    try {
      // First try to use processed images (if they exist)
      if (listing.processedImages && listing.processedImages[index]) {
        return listing.processedImages[index];
      }

      // Use the full_url from developer_notes.images
      if (
        listing.developer_notes?.images &&
        listing.developer_notes.images[index] &&
        listing.developer_notes.images[index].full_url
      ) {
        return listing.developer_notes.images[index].full_url;
      }
    } catch (error) {
      console.error("Error getting image URL:", error);
    }

    // Final fallback to null (show camera icon)
    return null;
  };

  // Function to handle image error
  const handleImageError = (listingId, index) => {
    console.log(`Image failed to load for listing ${listingId}, index ${index}`);
    const imageKey = `${listingId}_${index}`;
    setFailedImages((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  const handlePropertyView = (property_id) => {
    propertyTrackClickMutation.mutate({ propertyId: property_id });
    router.push(`/single-v1/${property_id}`);
  };

  return (
    <>
      <style jsx>{`
        @media (max-width: 768px) {
          .property-card {
            flex-direction: column !important;
            min-height: auto !important;
          }

          .property-image-container {
            width: 100% !important;
            min-width: 100% !important;
            height: 200px !important;
          }

          .property-content {
            padding: 15px !important;
          }

          .property-price {
            font-size: 20px !important;
          }

          .property-title {
            font-size: 16px !important;
          }

          .property-location {
            font-size: 13px !important;
          }

          .property-details {
            font-size: 13px !important;
            gap: 12px !important;
          }

          .property-tags span {
            font-size: 11px !important;
            padding: 4px 10px !important;
          }

          .view-number-btn {
            padding: 8px 16px !important;
            font-size: 13px !important;
            width: 100% !important;
            justify-content: center !important;
          }

          /* No Image Available tablet styles */
          .no-image-placeholder .fa-camera {
            font-size: 48px !important;
            margin-bottom: 10px !important;
          }

          .no-image-placeholder span {
            font-size: 12px !important;
          }
        }

        @media (max-width: 576px) {
          .property-image-container {
            height: 180px !important;
          }

          .property-content {
            padding: 12px !important;
          }

          .property-price {
            font-size: 18px !important;
          }

          .property-title {
            font-size: 15px !important;
            margin-bottom: 8px !important;
          }

          .property-details {
            font-size: 12px !important;
            gap: 10px !important;
          }

          .property-details i {
            font-size: 14px !important;
          }

          .col-md-12 {
            margin-bottom: 15px !important;
          }

          /* No Image Available mobile styles */
          .no-image-placeholder .fa-camera {
            font-size: 40px !important;
            margin-bottom: 8px !important;
          }

          .no-image-placeholder span {
            font-size: 11px !important;
          }
        }

        /* Mobile popup/modal responsiveness */
        @media (max-width: 768px) {
          .fixed.inset-0 {
            padding: 15px;
          }

          .bg-white.rounded-lg.p-6 {
            padding: 20px !important;
            max-width: 95% !important;
          }

          .text-xl {
            font-size: 18px !important;
          }

          .space-y-3 > div {
            padding: 10px !important;
          }

          .flex.items-center.p-3 {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 8px;
          }
        }
      `}</style>
      {data && data.length > 0 ? (
        <>
          {data.map((listing, index) => (
            <div key={listing?._id}>
              {/* Render property listing */}
              <article
                className="col-md-12"
                style={{ cursor: "pointer", marginBottom: "20px" }}
                onClick={() => handlePropertyView(listing?._id)}
                role="article"
                aria-label={`${listing?.name || listing?.title || "Property"} - AED ${listing.price ? listing.price.toLocaleString() : 'N/A'}`}
              >
                <div
                  className={`property-card ${(listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted) ? 'boosted-listing' : ''}`}
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: (listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted)
                      ? "0 4px 20px rgba(255, 107, 53, 0.15)"
                      : "0 10px 30px rgba(0,0,0,0.08)",
                    border: (listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted)
                      ? "2px solid #ff6b35"
                      : "1px solid #eee",
                    transition: "all 0.3s ease",
                    minHeight: "250px",
                    transform: (listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted)
                      ? "translateY(-2px)"
                      : "translateY(0)",
                  }}
                  onMouseOver={(e) => {
                    const isBoosted = listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted;
                    e.currentTarget.style.boxShadow = isBoosted
                      ? "0 8px 25px rgba(255, 107, 53, 0.25)"
                      : "0 15px 40px rgba(0,0,0,0.15)";
                    e.currentTarget.style.transform = isBoosted
                      ? "translateY(-4px)"
                      : "translateY(-5px)";
                  }}
                  onMouseOut={(e) => {
                    const isBoosted = listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted;
                    e.currentTarget.style.boxShadow = isBoosted
                      ? "0 4px 20px rgba(255, 107, 53, 0.15)"
                      : "0 10px 30px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = isBoosted
                      ? "translateY(-2px)"
                      : "translateY(0)";
                  }}
                >
                  {/* Left side - Image */}
                  <div
                    className="property-image-container"
                    style={{
                      width: "50%",
                      minWidth: "50%",
                      height: "250px",
                      position: "relative",
                      overflow: "hidden",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    {getPropertyImageUrl(listing, 0) ? (
                      <div style={{
                        position: "relative",
                        width: "100%",
                        height: "100%"
                      }}>
                        <Image
                          src={getPropertyImageUrl(listing, 0)}
                          alt={`${listing?.name || listing?.title || "Property"} in ${typeof listing.location === 'string'
                            ? listing.location
                            : listing.location?.city || listing.location?.emirate || "Dubai"}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={true}
                          onError={() => handleImageError(listing?._id, 0)}
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="no-image-placeholder"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#e8e8e8",
                        }}>
                        <i
                          className="fas fa-camera"
                          style={{
                            fontSize: "64px",
                            color: "#999",
                            marginBottom: "12px"
                          }}
                        ></i>
                        <span style={{
                          fontSize: "14px",
                          color: "#666",
                          fontWeight: "500"
                        }}>
                          No Image Available
                        </span>
                      </div>
                    )}

                    {/* Enhanced Boost/Featured Badge - positioned on left */}
                    {(listing?.is_boosted || listing?.isBoosted || listing?.boosted?.isBoosted) ? (
                      <div
                        className="boosted-tag"
                        style={{
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                          background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
                          color: "white",
                          padding: "8px 14px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          zIndex: "5",
                          animation: "boostPulse 2s infinite",
                        }}
                      >
                        <i className="fas fa-rocket" style={{ fontSize: "12px" }}></i>
                        BOOSTED
                      </div>
                    ) : listing?.isFeatured && (
                      <div
                        style={{
                          position: "absolute",
                          top: "15px",
                          left: "15px",
                          backgroundColor: "#0f8363",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          boxShadow: "0 4px 12px rgba(15, 131, 99, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          zIndex: "5",
                        }}
                      >
                        <i className="fas fa-crown" style={{ fontSize: "12px" }}></i>
                        FEATURED
                      </div>
                    )}

                    {/* Bottom Overlay - View Count and Like Button */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                        padding: "15px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        zIndex: "5",
                      }}
                    >
                      {/* View Count */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        <i className="fas fa-eye" style={{ fontSize: "16px" }}></i>
                        <span>{listing?.views || 0}</span>
                      </div>

                      {/* Heart/Like Button */}
                      <button
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          transition: "all 0.2s ease",
                        }}
                        onClick={(e) => handleFavoriteToggle(e, listing?._id)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                        }}
                        aria-label={favorites[listing?._id] ? "Remove from favorites" : "Add to favorites"}
                      >
                        <i
                          className={
                            favorites[listing?._id] ? "fas fa-heart" : "far fa-heart"
                          }
                          style={{
                            color: favorites[listing?._id] ? "#e74c3c" : "#95a5a6",
                            fontSize: "16px",
                          }}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div
                    className="property-content"
                    style={{
                      flex: 1,
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Top section */}
                    <div>
                      {/* Price */}
                      <div
                        className="property-price"
                        style={{
                          fontSize: "26px",
                          fontWeight: "800",
                          color: "#0f8363",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "baseline",
                          gap: "8px",
                        }}
                      >
                        AED {listing.price ? listing.price.toLocaleString() : 'N/A'}
                        {/* Only show "Yearly" for rent properties */}
                        {listing.details?.purpose === "Rent" && (
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "500",
                              color: "#7f8c8d",
                            }}
                          >
                            /Year
                          </span>
                        )}
                      </div>

                      {/* Property Title */}
                      <h3
                        className="property-title"
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#2c3e50",
                          marginBottom: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {listing.name || listing.title || "Untitled Property"}
                      </h3>

                      {/* Location */}
                      <div
                        className="property-location"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "15px",
                          color: "#7f8c8d",
                          fontSize: "15px",
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                        <span>
                          {typeof listing.location === 'string'
                            ? listing.location
                            : listing.location?.address ||
                            `${listing.location?.city || ''}, ${listing.location?.emirate || ''}`.replace(/^, |, $/, '') ||
                            'Location not available'
                          }
                        </span>
                      </div>

                      {/* Property type and details */}
                      <div
                        className="property-details"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          marginBottom: "15px",
                          fontSize: "15px",
                          color: "#2c3e50",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i
                            className="fas fa-bed"
                            style={{ color: "#0f8363", fontSize: "16px" }}
                          ></i>
                          <span style={{ fontWeight: "600" }}>{listing.details?.bedrooms || 'N/A'} Beds</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i
                            className="fas fa-bath"
                            style={{ color: "#0f8363", fontSize: "16px" }}
                          ></i>
                          <span style={{ fontWeight: "600" }}>{listing.details?.bathrooms || 'N/A'} Baths</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i
                            className="fas fa-ruler-combined"
                            style={{ color: "#0f8363", fontSize: "16px" }}
                          ></i>
                          <span style={{ fontWeight: "600" }}>{listing.details?.size?.value || "N/A"} sqft</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div
                        className="property-tags"
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginBottom: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: "#f0f8f6",
                            color: "#0f8363",
                            fontSize: "13px",
                            fontWeight: "500",
                            padding: "5px 12px",
                            borderRadius: "20px",
                          }}
                        >
                          {listing.details?.furnishing === "yes"
                            ? "Furnished"
                            : "Unfurnished"}
                        </span>
                        <span
                          style={{
                            backgroundColor: "#f0f8f6",
                            color: "#0f8363",
                            fontSize: "13px",
                            fontWeight: "500",
                            padding: "5px 12px",
                            borderRadius: "20px",
                          }}
                        >
                          Vacant
                        </span>
                      </div>
                    </div>

                    {/* View Number Button */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "10px",
                      }}
                    >
                      {(() => {
                        const isViewed = viewedPropertyIds.includes(listing._id);
                        return (
                          <button
                            className="view-number-btn"
                            style={{
                              padding: "10px 20px",
                              backgroundColor: isViewed ? "#6b7280" : "#0f8363",
                              color: "white",
                              border: isViewed ? "2px solid #9ca3af" : "none",
                              borderRadius: "8px",
                              fontSize: "15px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            onMouseOver={(e) => {
                              if (isViewed) {
                                e.currentTarget.style.backgroundColor = "#4b5563";
                                e.currentTarget.style.borderColor = "#6b7280";
                              } else {
                                e.currentTarget.style.backgroundColor = "#0a6e53";
                              }
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = isViewed
                                ? "0 4px 12px rgba(107, 114, 128, 0.3)"
                                : "0 4px 12px rgba(15, 131, 99, 0.3)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = isViewed ? "#6b7280" : "#0f8363";
                              e.currentTarget.style.borderColor = isViewed ? "#9ca3af" : "";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                            onClick={(e) => handleViewNumberClick(e, listing)}
                            aria-label={isViewed ? "View previously viewed contact" : "View contact information"}
                            title={isViewed ? "You have already viewed this contact" : "Click to view contact number"}
                          >
                            <i className={isViewed ? "fas fa-check-circle" : "fas fa-phone-alt"}></i>
                            {isViewed ? "Viewed Number" : "View Number"}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Structured Data for SEO */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateStructuredData(listing)),
                  }}
                />
              </article>

              {/* Insert an ad after every 3rd property, starting after the first property */}
              {index > 0 && (index + 1) % 3 === 0 && index < data.length - 1 && (
                <PropertyAd placement="property-listing" />
              )}
            </div>
          ))}
        </>
      ) : (
        <div className="col-12 text-center py-5">
          <p style={{ fontSize: "16px", color: "#666" }}>
            No properties found.
          </p>
        </div>
      )}

      {/* Seller Info Popup */}
      {showSellerPopup && currentSeller && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#0f8363]">
                <i className="fas fa-user-circle mr-2"></i>
                Seller Information
              </h3>
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close popup"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-6 space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <i className="fas fa-user text-[#0f8363] mr-3"></i>
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{currentSeller.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <i className="fas fa-phone text-[#0f8363] mr-3"></i>
                <div className="flex-1">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-900">{currentSeller.phone || 'Not provided'}</p>
                </div>
                {currentSeller.phone && (
                  <a
                    href={`tel:${currentSeller.phone}`}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    title="Call"
                    aria-label={`Call ${currentSeller.name}`}
                  >
                    <i className="fas fa-phone-alt"></i>
                  </a>
                )}
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <i className="fas fa-envelope text-[#0f8363] mr-3"></i>
                <div className="flex-1">
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">{currentSeller.email || 'Not provided'}</p>
                </div>
                {currentSeller.email && (
                  <a
                    href={`mailto:${currentSeller.email}`}
                    className="ml-2 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                    title="Email"
                    aria-label={`Email ${currentSeller.name}`}
                  >
                    <i className="fas fa-envelope"></i>
                  </a>
                )}
              </div>

              {currentSeller.phone && (
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <i className="fab fa-whatsapp text-green-600 mr-3"></i>
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">WhatsApp:</span>
                    <p className="text-gray-900">Available</p>
                  </div>
                  <a
                    href={`https://wa.me/${currentSeller.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                    title="WhatsApp"
                    aria-label={`Message ${currentSeller.name} on WhatsApp`}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              )}
            </div>

            <div className="text-center text-sm text-gray-500 mb-4">
              <i className="fas fa-info-circle mr-1"></i>
              Contact details saved to your "Number Views by Me" dashboard
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.open('/dashboard/my-plan', '_blank')}
                className="py-2 px-4 rounded-lg border border-[#0f8363] text-[#0f8363] hover:bg-[#0f8363] hover:text-white transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={closePopup}
                className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No Credit Popup */}
      {showNoCreditPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowNoCreditPopup(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="no-credit-title"
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="no-credit-title" className="text-xl font-bold text-[#0f8363]">
                No Credits Available
              </h3>
              <button
                onClick={() => setShowNoCreditPopup(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close popup"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-3">{contactViewMutation.data?.data?.message}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNoCreditPopup(false)}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNoCreditPopup(false);
                  router.push("/pricing");
                }}
                className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowLoginPopup(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-required-title"
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="login-required-title" className="text-xl font-bold text-[#0f8363]">
                Login Required
              </h3>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close popup"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-3">You need to login to view seller contact details.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  router.push("/login");
                }}
                className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Role Required Popup */}
      {showRolePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowRolePopup(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-required-title"
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="role-required-title" className="text-xl font-bold text-[#e74c3c]">
                Access Restricted
              </h3>
              <button
                onClick={() => setShowRolePopup(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close popup"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-3">Only buyers can view seller contact details.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRolePopup(false)}
                className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedListings;