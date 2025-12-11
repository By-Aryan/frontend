"use client";
import React, { useState, useEffect } from "react";
import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import useAxiosPost from "@/hooks/useAxiosPost";
import Footer from "@/components/common/default-footer";
import { generateStructuredData } from "@/utils/seoUtils";
import { ApiDeleteRequest, ApiPostRequest } from "@/axios/apiRequest";
import PropertyActions from "@/components/common/PropertyActions";
import { useRouter } from "next/navigation";

// Main Gallery Modal Component
const PropertyGalleryModal = ({
  isOpen,
  onClose,
  images,
  videos,
  currentIndex,
  setCurrentIndex,
}) => {
  const [activeTab, setActiveTab] = useState("photos");

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("photos")}
                className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === "photos"
                  ? "bg-green-600 text-white"
                  : "text-white hover:bg-white hover:bg-opacity-10"
                  }`}
              >
                📷 Photos ({images?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === "videos"
                  ? "bg-green-600 text-white"
                  : "text-white hover:bg-white hover:bg-opacity-10"
                  }`}
              >
                ▶ Videos ({videos?.length || 0})
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded text-white hover:bg-white hover:bg-opacity-10">
                📍 Map
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="pt-20 pb-24 h-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-5xl max-h-[70vh] mx-auto">
            {activeTab === "photos" && images && images[currentIndex] ? (
              <img
                src={images[currentIndex].full_url}
                alt={`Property view ${currentIndex + 1}`}
                className="w-full h-full"
              />
            ) : activeTab === "videos" && videos && videos.length > 0 ? (
              <video
                src={videos[0].full_url}
                controls
                className="w-full h-full object-contain"
              />
            ) : null}

            {activeTab === "photos" && images && images.length > 0 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                >
                  <i className="fas fa-chevron-left text-xl"></i>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70"
                >
                  <i className="fas fa-chevron-right text-xl"></i>
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom agent info */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3 text-white">
              <img
                src="https://images.bayut.com/thumbnails/788322300-800x600.webp"
                alt="Agent"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="text-sm text-gray-300">Listing by</div>
                <div className="font-semibold text-blue-400">Agent Name</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-teal-700">
                <i className="fas fa-envelope"></i>
                Email
              </button>
              <button className="bg-teal-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-teal-700">
                <i className="fas fa-phone"></i>
                Call
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-green-700">
                <i className="fas fa-comment"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyHeader = ({ data, onImageClick, viewCount, isFavorite, onFavoriteToggle }) => {
  const images = data?.developer_notes?.images || [];
  const videos = data?.developer_notes?.videos || [];

  console.log("🎨 PropertyHeader - Raw data:", data?.developer_notes?.images);
  console.log("🎨 PropertyHeader - Images array:", images);

  // Use actual property images only, no fallback placeholders
  const getDisplayImages = () => {
    // If we have actual images from data, use them
    if (images && images.length > 0) {
      const mapped = images.map((img, index) => ({
        url: img.full_url || null,
        id: img._id || `img-${index}`,
      }));
      console.log("🎨 Mapped display images:", mapped);
      return mapped;
    }

    // Return empty array if no images - will show camera icon
    console.log("🎨 No images found, returning empty array");
    return [];
  };

  const displayImages = getDisplayImages();
  console.log("🎨 Final displayImages:", displayImages);

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      {displayImages.length > 0 ? (
        <div className="w-full h-96 flex gap-2">
          {/* Main large image - 60% width */}
          <div className="w-[60%] h-full relative">
            <div
              className="w-full h-full relative cursor-pointer group bg-gray-200 rounded-l overflow-hidden"
              onClick={() => displayImages[0]?.url && onImageClick(0)}
            >
              {displayImages[0]?.url ? (
                <img
                  src={displayImages[0].url}
                  alt={`${data?.title || data?.name || "Property"} - Main view`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <i className="fas fa-camera text-gray-400" style={{ fontSize: '80px' }}></i>
                  </div>
                </>
              )}

              {/* Bottom Overlay - View Count and Like Button */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 10,
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
                  <span>{viewCount || 0}</span>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavoriteToggle(e);
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  }}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <i
                    className={
                      isFavorite ? "fas fa-heart" : "far fa-heart"
                    }
                    style={{
                      color: isFavorite ? "#e74c3c" : "#95a5a6",
                      fontSize: "16px",
                    }}
                  ></i>
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Grid - 40% width, 2x2 layout */}
          <div className="w-[40%] h-full grid grid-cols-2 grid-rows-2 gap-2">
            {/* Show images 2, 3, 4 */}
            {displayImages.slice(1, 4).map((image, index) => (
              <div
                key={image.id}
                className="relative cursor-pointer group overflow-hidden rounded"
                onClick={() => onImageClick(index + 1)}
              >
                <img
                  src={image.url}
                  alt={`${data?.title || data?.name || "Property"} - View ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            ))}

            {/* 4th position - Show either image with +X more, video thumbnail, or regular image */}
            {displayImages.length > 4 ? (
              // If more than 4 images, show image 5 with "+X more" overlay
              <div
                className="relative cursor-pointer group overflow-hidden rounded"
                onClick={() => onImageClick(4)}
              >
                <img
                  src={displayImages[4]?.url}
                  alt={`${data?.title || data?.name || "Property"} - More images`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{displayImages.length - 4} more
                  </span>
                </div>
              </div>
            ) : displayImages.length === 4 ? (
              // If exactly 4 images, show 4th image normally
              <div
                className="relative cursor-pointer group overflow-hidden rounded"
                onClick={() => onImageClick(3)}
              >
                <img
                  src={displayImages[3]?.url}
                  alt={`${data?.title || data?.name || "Property"} - View 4`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
            ) : videos.length > 0 ? (
              // If less than 4 images but has videos, show video thumbnail
              <div
                className="relative cursor-pointer group overflow-hidden rounded bg-black"
                onClick={() => onImageClick(0)}
              >
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <i className="fas fa-play-circle text-4xl mb-2"></i>
                  <span className="text-sm">{videos.length} Video{videos.length > 1 ? 's' : ''}</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300"></div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center bg-gray-100 flex-col gap-4 relative">
          <i className="fas fa-camera text-gray-400" style={{ fontSize: '100px' }}></i>
          <p className="text-gray-500 text-lg">No images available</p>

          {/* Bottom Overlay - View Count and Like Button for No Images */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
              padding: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
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
              <span>{viewCount || 0}</span>
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
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(e);
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.backgroundColor = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              }}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <i
                className={
                  isFavorite ? "fas fa-heart" : "far fa-heart"
                }
                style={{
                  color: isFavorite ? "#e74c3c" : "#95a5a6",
                  fontSize: "16px",
                }}
              ></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Property Information Component
const PropertyInformation = ({ data }) => {
  const formatPrice = (price, currency) => {
    const currencySymbol = currency === "USD" ? "$" : "AED";
    return `${currencySymbol} ${price?.toLocaleString() || 0}`;
  };

  const getPurposeText = (purpose) => {
    return purpose === "Sell" ? "For Sale" : "Yearly";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="mb-6">
        <div className="text-3xl font-bold mb-2 text-gray-900">
          {formatPrice(data?.price, data?.currency)}{" "}
          <span className="text-lg font-normal">
            {getPurposeText(data?.details?.purpose)}
          </span>
        </div>
        <div className="text-gray-600 mb-4">
          {data?.location?.building_name}, {data?.location?.landmark},{" "}
          {data?.location?.city}, {data?.location?.emirate}
        </div>

        <div className="flex items-center gap-6 mb-4 text-gray-600">
          <div className="flex items-center gap-1">
            <i className="fas fa-bed"></i>
            <span>{data?.details?.bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath"></i>
            <span>{data?.details?.bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-ruler-combined"></i>
            <span>
              {data?.details?.size?.value || 0}{" "}
              {data?.details?.size?.unit || "sqft"}
            </span>
          </div>
        </div>

        <div className="text-xl font-semibold mb-2 text-gray-900">
          {data?.title || data?.name}
        </div>
        <div className="text-gray-600 mb-4">
          {data?.details?.property_type} |{" "}
          {data?.details?.furnishing === "yes" ? "Furnished" : "Unfurnished"}
        </div>

        <div className="text-gray-700 leading-relaxed">{data?.description}</div>

        <button className="text-teal-600 font-medium mt-2 hover:text-teal-700">
          Read More ∨
        </button>
      </div>
    </div>
  );
};

// Property Details Table Component
const PropertyDetailsTable = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Property Information
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Type</span>
            <span className="font-medium">{data?.details?.property_type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Purpose</span>
            <span className="font-medium">For {data?.details?.purpose}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Reference no.</span>
            <span className="font-medium">{data?.reference_number}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Furnishing</span>
            <span className="font-medium">
              {data?.details?.furnishing === "yes"
                ? "Furnished"
                : "Unfurnished"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Status</span>
            <span className="font-medium flex items-center">
              {data?.approval_status?.status}
              <span className="ml-2 text-blue-600">ℹ</span>
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Added on</span>
            <span className="font-medium">
              {new Date(data?.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-3 flex items-center text-gray-900">
          <i className="fas fa-check-circle text-green-600 mr-2"></i>
          Validated Information
        </h4>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Ownership</span>
              <span className="font-medium">{data?.details?.ownership}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Built-up Area</span>
              <span className="font-medium">
                {data?.details?.size?.value} {data?.details?.size?.unit}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Usage</span>
              <span className="font-medium">{data?.details?.usage}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Floor</span>
              <span className="font-medium">{data?.location?.floor}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Completion Status</span>
              <span className="font-medium">
                {data?.details?.completion_status}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Parking Availability</span>
              <span className="font-medium">
                {data?.details?.parking_available ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Apartment Number</span>
              <span className="font-medium">
                {data?.location?.apartment_number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floor Plans Component
const FloorPlans = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Floor Plans</h3>
      <p className="text-gray-600 mb-6">
        Explore the floor plans that match this listing
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <span className="text-gray-700">
          Contact the agent to get the relevant floor plan for this listing
        </span>
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium">
          REQUEST FLOORPLAN
        </button>
      </div>
    </div>
  );
};

// Building Information Component
const BuildingInformation = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
        <i className="fas fa-check-circle text-green-600 mr-2"></i>
        Building Information
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Building Name</span>
            <span className="font-medium">
              {data?.building_information?.name}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Year of Completion</span>
            <span className="font-medium">
              {data?.building_information?.year_of_completion}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Floors</span>
            <span className="font-medium">
              {data?.building_information?.total_floors}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Offices</span>
            <span className="font-medium">
              {data?.building_information?.offices}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Total Building Area</span>
            <span className="font-medium">
              {data?.building_information?.total_building_area?.value}{" "}
              {data?.building_information?.total_building_area?.unit}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Street</span>
            <span className="font-medium">{data?.location?.street}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features and Amenities Component
const FeaturesAmenities = ({ data }) => {
  const amenities = data?.features_amenities || [];
  const otherAmenities = data?.other_amenities || [];
  const allAmenities = [...amenities, ...otherAmenities];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Features / Amenities
      </h3>

      {/* Amenities Grid */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 list-disc list-inside text-sm text-gray-800">
        {allAmenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
    </div>
  );
};

// Agent Contact Sidebar Component
const AgentContactSidebar = ({ data }) => {

  console.log("agent contact details", data)
  return (
    <div className="space-y-4">
      {/* Shared style for all cards */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 w-full">
        {/* Agent Header */}
        <div className="relative h-28 bg-gradient-to-br from-green-900 via-teal-800 to-teal-600">
          <div className="absolute top-2 right-3 text-white font-semibold text-sm">
            Tru<span className="font-bold">Broker</span>
            <sup className="text-xs ml-0.5">™</sup>
          </div>

          {/* Absolute image */}
          <div className="absolute inset-x-0 bottom-[-40px] flex justify-center">
            <img
              src="https://t3.ftcdn.net/jpg/02/22/85/16/360_F_222851624_jfoMGbJxwRi5AWGdPgXKSABMnzCQo9RN.jpg"
              alt="Smart Agent"
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>

        {/* Below the header */}
        <div className="mt-12 text-center">
          <h2 className="text-lg font-semibold">Smart Agent</h2>
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            💎 Quality Lister
          </span>
          <span className="flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
            🔄 Responsive Broker
          </span>
        </div>

        {/* Contact Buttons */}
        <div className="flex justify-around mt-4 px-4 pb-4 space-x-2">
          <a
            href={`mailto:zerobrokerage2025@gmail.com?subject=Inquiry about Property: ${data?.location?.building_name || 'Property'} in ${data?.location?.city || 'Dubai'}&body=Hello,%0A%0AI am interested in the ${data?.details?.bedrooms || ''} bedroom property located at ${data?.location?.building_name || ''}, ${data?.location?.landmark || ''}, ${data?.location?.city || ''} listed for ${data?.currency || 'AED'} ${data?.price?.toLocaleString() || ''}. Please provide more information.%0A%0AThank you.`}
            className="flex-1 flex items-center justify-center gap-1 bg-teal-100 text-teal-900 px-4 py-2 rounded hover:bg-teal-200"
          >
            <i className="fas fa-envelope"></i>
            Email
          </a>
          <a href="tel:+971563988134" className="flex-1 flex items-center justify-center gap-1 bg-teal-100 text-teal-900 px-4 py-2 rounded hover:bg-teal-200">
            <i className="fas fa-phone"></i>
            Call
          </a>
          <a href="https://wa.me/971563988134" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 bg-teal-100 text-teal-900 px-4 py-2 rounded hover:bg-teal-200">
            <i className="fas fa-comment"></i>
          </a>
        </div>
      </div>

      {/* Location Card 1 */}
      <div className="bg-white rounded-lg shadow-md p-4 w-full">
        <div className="flex items-center mb-3">
          <img
            src="https://images.bayut.com/thumbnails/790752817-800x600.webp"
            alt={data?.location?.city}
            className="w-24 h-18 rounded mr-3"
          />
          <div>
            <h4 className="font-semibold">{data?.location?.city}</h4>
            <p className="text-sm text-gray-600">
              See the community attractions and lifestyle
            </p>
          </div>
        </div>
      </div>

      {/* Location Card 2 */}
      {/* <div className="bg-white rounded-lg shadow-md p-4 w-full">
        <div className="flex items-center mb-3">
          <img
            src="/api/placeholder/60/60"
            alt={data?.location?.building_name}
            className="w-12 h-12 rounded mr-3"
          />
          <div>
            <h4 className="font-semibold">{data?.location?.building_name}</h4>
            <p className="text-sm text-gray-600">
              View building amenities, service charges and more
            </p>
          </div>
        </div>
      </div> */}

      {/* Featured badge */}
      {data?.featured?.isFeatured && (
        <div className="bg-gradient-to-r from-yellow-10 to-orange-10 text-white rounded-lg p-4 w-full bg-white">
          <div className="text-center">
            <h4 className="font-bold mb-1">⭐ FEATURED PROPERTY</h4>
            <p className="text-xs mt-2">
              Expires: {new Date(data.featured.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <button className="w-full border border-teal-600 text-teal-600 py-3 rounded flex items-center justify-center gap-2 hover:bg-teal-50">
        <i className="fas fa-flag"></i>
        Report this property
      </button>
    </div>
  );
};

const CompletePropertyListing = ({ params }) => {
  const router = useRouter();
  const { data, isLoading, isError, error } = useAxiosFetch(
    `/property/propertyById/${params.id}`
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [hasViewedContact, setHasViewedContact] = useState(false);
  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [currentSeller, setCurrentSeller] = useState(null);
  const [showNoCreditPopup, setShowNoCreditPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);

  // Set up the mutation for tracking contact views
  const contactViewMutation = useAxiosPost("/subscription/track-contact-view", {
    onSuccess: (response) => {
      console.log("🚀 ~ ContactView ~ response:", response.data);
      if (response.data.status === 1) {
        setCurrentSeller({
          name: response.data.sellerDetails?.fullname,
          phone: response.data.sellerDetails?.mobile,
          email: response.data.sellerDetails?.email,
        });
        setShowSellerPopup(true);
        setHasViewedContact(true);
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

  // Track view count and set favorite status when data is loaded
  useEffect(() => {
    if (data?.data) {
      // Set favorite status from backend
      setIsSaved(data.data.is_favourite || false);

      // Set initial view count from backend
      setViewCount(data.data.analytics?.views || 0);

      // Check if user has viewed contact from backend
      setHasViewedContact(data.data.has_viewed_contact || false);

      // Increment view count and update local state
      const incrementViewCount = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/property/view/${params.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            console.log("Property view tracked successfully", result);

            // Update view count from response if available
            if (result?.data?.analytics?.views) {
              setViewCount(result.data.analytics.views);
            } else {
              // Or just increment the local count
              setViewCount(prev => prev + 1);
            }
          }
        } catch (error) {
          console.error("Error tracking property view:", error);
        }
      };

      incrementViewCount();
    }
  }, [data, params.id]);

  // Handle like/favorite toggle
  const handleSaveClick = async (e) => {
    e.preventDefault();

    if (!params.id) return;

    try {
      if (isSaved) {
        // Remove from favorites
        const response = await ApiDeleteRequest(`/property/favourite`, {
          property_id: params.id
        });
        if (response.status === 200) {
          setIsSaved(false);
        }
      } else {
        // Add to favorites
        const response = await ApiPostRequest(`/property/favourite`, {
          property_id: params.id
        });
        if (response.status === 200) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Function to handle the "View Number" click
  const handleViewNumberClick = (e) => {
    e?.stopPropagation();

    // Check if user is logged in
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShowLoginPopup(true);
      return;
    }

    // Let the backend handle access control based on credits
    contactViewMutation.mutate({
      viewType: "true",
      propertyId: params.id,
    });
  };

  // Close the popups
  const closePopup = () => {
    setShowSellerPopup(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error.message}
      </div>
    );

  if (!data?.data)
    return (
      <div className="flex justify-center items-center min-h-screen">
        No property data found
      </div>
    );

  const propertyData = data.data;

  // Use actual property images and videos from API
  const images = propertyData?.developer_notes?.images || [];
  const videos = propertyData?.developer_notes?.videos || [];

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  // Generate structured data for SEO
  const structuredData = generateStructuredData(propertyData);

  return (
    <>
      <div>
        <DefaultHeader />
        <MobileMenu />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Header with image gallery */}
        <div className="max-w-7xl mx-auto px-4 mt-3">
          <PropertyHeader
            data={propertyData}
            onImageClick={handleImageClick}
            viewCount={viewCount}
            isFavorite={isSaved}
            onFavoriteToggle={handleSaveClick}
          />
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <PropertyInformation data={propertyData} />

                  {/* View Number Button */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      className="view-number-btn"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: hasViewedContact ? "#6b7280" : "#0f8363",
                        color: "white",
                        border: hasViewedContact ? "2px solid #9ca3af" : "none",
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
                        if (hasViewedContact) {
                          e.currentTarget.style.backgroundColor = "#4b5563";
                          e.currentTarget.style.borderColor = "#6b7280";
                        } else {
                          e.currentTarget.style.backgroundColor = "#0a6e53";
                        }
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = hasViewedContact
                          ? "0 4px 12px rgba(107, 114, 128, 0.3)"
                          : "0 4px 12px rgba(15, 131, 99, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = hasViewedContact ? "#6b7280" : "#0f8363";
                        e.currentTarget.style.borderColor = hasViewedContact ? "#9ca3af" : "";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      onClick={(e) => handleViewNumberClick(e)}
                      aria-label={hasViewedContact ? "View previously viewed contact" : "View contact information"}
                      title={hasViewedContact ? "You have already viewed this contact" : "Click to view contact number"}
                    >
                      <i className={hasViewedContact ? "fas fa-check-circle" : "fas fa-phone-alt"}></i>
                      {hasViewedContact ? "Viewed Number" : "View Number"}
                    </button>
                  </div>
                </div>
              </div>
              <PropertyDetailsTable data={propertyData} />
              <BuildingInformation data={propertyData} />
              <FeaturesAmenities data={propertyData} />
            </div>
            <AgentContactSidebar data={propertyData} />
          </div>
        </div>
      </div>

      {/* Image/Video Modal */}
      <PropertyGalleryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={images}
        videos={videos}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>

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

export default CompletePropertyListing;