"use client";

import Image from "next/image";
import Link from "next/link";
import NotifyMeButton from '@/components/property/EnhancedNotifyMeButton';
import { ApiDeleteRequest, ApiPostRequest } from "@/axios/apiRequest";
import { useState, useEffect } from "react";

const NewProjects = ({ data, colstyle, setIsScheduleTourModal }) => {
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '');
  const [favorites, setFavorites] = useState({});

  // Only use real data, no dummy fallback to prevent fake ID issues
  const list = data && data.length ? data : [];
  console.log("NewProjects received data:", { dataLength: data?.length, listLength: list.length, firstItem: list[0] });

  // Initialize favorites state from the API data
  useEffect(() => {
    if (data && data.length > 0) {
      const initialFavorites = {};
      data.forEach((project) => {
        initialFavorites[project._id] = !!project.is_favourite;
      });
      setFavorites(initialFavorites);
    }
  }, [data]);

  // Function to handle favorite toggle
  const handleFavoriteToggle = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (favorites[projectId]) {
        const response = await ApiDeleteRequest(`/property/favourite/${projectId}`, {
          property_id: projectId,
        });
        if (response.status === 200) {
          setFavorites((prev) => ({
            ...prev,
            [projectId]: false,
          }));
        }
      } else {
        const response = await ApiPostRequest(`/property/favourite`, {
          property_id: projectId,
        });
        if (response.status === 200) {
          setFavorites((prev) => ({
            ...prev,
            [projectId]: true,
          }));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // If no data, show a loading or empty state
  if (!list.length) {
    return (
      <div className="col-md-12 text-center py-5">
        <div className="text-muted">
          <i className="fas fa-building fa-3x mb-3"></i>
          <h5>No projects available</h5>
          <p>Check back later for new project listings.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {list.map((listing) => (
        <div className="col-md-12" style={{ cursor: "pointer" }} key={listing._id}>
          <div className="listing-style1 flex md:flex-row flex-col" style={{ minHeight: 260 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Link href={`/new-projects/${listing._id}`}>
                <div className="list-thumb xl:w-[700px] md:w-[420px] w-full" style={{ position: 'relative', minHeight: 220, height: 220, borderRadius: 12, overflow: 'hidden', background: '#f3f3f3' }}>
                  {listing.images?.mainImage?.url ? (
                    <Image
                      src={`${backendBaseUrl}${listing.images.mainImage.url}`}
                      alt={listing.title || listing.name}
                      width={700}
                      height={220}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-building fa-3x" style={{ color: '#999' }}></i>
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Price Badge - Top Right */}
              <div className="list-price" style={{ position: 'absolute', right: 16, top: 16, padding: '8px 12px', borderRadius: 8, backgroundColor: '#ffffff', color: '#333', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10 }}>
                {listing.pricing?.priceRange?.min && listing.pricing.priceRange.min > 0
                  ? `AED ${(listing.pricing.priceRange.min / 1000000).toFixed(1)}M`
                  : 'Price TBA'
                } <span></span>
              </div>

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
                  zIndex: "10",
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
            <div className="md:p-6 p-4 flex-1 flex flex-col justify-between">
              <div>
                <h6 className="fz24">
                  <Link href={`/new-projects/${listing._id}`} className="text-[#0f8363]" style={{ color: "#0f8363", fontSize: 20 }}>
                    {listing.title || listing.name}
                  </Link>
                </h6>
                <h6 className="text-gray-500" style={{ marginTop: 6 }}>
                  by <span className="text-[#0e6a50]">{listing.projectDetails?.developer || 'Developer'}</span>
                </h6>
                <p className="list-text md:text-base text-sm text-wrap" style={{ marginTop: 12 }}>
                  <i className="fas fa-location" /> {listing.location?.address || `${listing.location?.area}, ${listing.location?.city}`}
                </p>
                <div className="flex gap-4 items-center mt-4">
                  <div className="list-meta d-flex align-items-center gap-2 text-[#0f8363] fsz12" style={{ display: 'flex', gap: 12 }}>
                    <div className="fsz12 px-2 flex flex-col">
                      <span style={{ fontSize: 12 }}>HANDOVER</span>
                      <strong style={{ fontSize: 16 }}>
                        {listing.projectDetails?.expectedCompletionDate
                          ? new Date(listing.projectDetails.expectedCompletionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                          : 'TBA'
                        }
                      </strong>
                    </div>
                    <div className="fsz12 px-2 flex flex-col">
                      <span style={{ fontSize: 12 }}>LAUNCH PRICE</span>
                      <strong style={{ fontSize: 16 }}>
                        {listing.pricing?.priceRange?.max && listing.pricing.priceRange.max > 0
                          ? `AED ${(listing.pricing.priceRange.max / 1000000).toFixed(1)}M`
                          : 'TBA'
                        }
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
                <div className="me-2">
                  <NotifyMeButton
                    projectId={listing._id}
                    onNotificationAdded={() => {
                      console.log('Notification added for project:', listing._id);
                    }}
                  />
                </div>

                <Link href={`/new-projects/${listing._id}`} className="py-2 px-6 rounded-lg bg-white border border-[#dedede] text-[#0e6a50] hover:bg-[#f5f5f5]" style={{ fontWeight: 600, textDecoration: 'none' }}>
                  View More Details
                </Link>
              </div>
            </div>
          </div>
          <hr className="mt-4 mb-4" />
        </div>
      ))}
    </>
  );
};

export default NewProjects;
