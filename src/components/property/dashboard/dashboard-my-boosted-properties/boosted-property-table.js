"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useRouter } from "next/navigation";

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
      return "pending-style style1";
  }
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
  } catch {
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
  //   if (!property?.developer_notes?.images?.length)
  //     return "/images/placeholder.jpg";
  //   const image = property.developer_notes.images[0];
  //   return image.startsWith("https")
  //     ? image
  //     : backendBaseUrl
  //     ? `${backendBaseUrl}${image}`
  //     : image;
};

const isFeaturedActive = (featured) => {
  if (!featured?.isFeatured) return false;
  if (!featured.expiresAt) return true;
  return new Date() < new Date(featured.expiresAt);
};

const useUserId = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const id = localStorage.getItem("id");
      setUserId(id);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userId, isLoading };
};

const BoostedPropertyDataTable = () => {
  const { userId, isLoading: userIdLoading } = useUserId();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const endpoint = "/property/boosted-properties";
  const {
    data,
    isLoading: dataLoading,
    error,
    refetch,
  } = useAxiosFetch(endpoint);

  const propertyData = Array.isArray(data?.data) ? data.data : [];
  const totalPages = Math.ceil(propertyData.length / itemsPerPage);
  const paginatedProperties = propertyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewAnalytics = (id) =>
    router.push(`/dashboard/seller/property-analytics/${id}`);

  if (userIdLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Initializing...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2" />
          No user found. Please{" "}
          <Link href="/login" className="alert-link">
            log in
          </Link>{" "}
          again.
        </div>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle me-2" />
          Error: {error.message || "Failed to load properties"}
        </div>
        <button className="btn btn-outline-primary mt-3" onClick={refetch}>
          <i className="fas fa-sync-alt me-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <table className="table-style3 table at-savesearch">
        <thead className="t-head">
          <tr>
            <th>Listing title</th>
            <th>Created At</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="t-body">
          {propertyData.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <div className="py-4">
                  <i className="fas fa-home fa-3x text-muted mb-3" />
                  <h5>No properties found</h5>
                  <p className="text-muted">
                    You haven't added any properties yet.
                  </p>
                  <Link
                    href="/dashboard/seller/request-to-add-new-property"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
                  >
                    <i className="fas fa-plus me-2" />
                    Add Property
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
                        src={getPropertyImage(property)}
                        alt={property.title || "Property"}
                        unoptimized
                      />
                      {isFeaturedActive(property.featured) && (
                        <span className="badge bg-warning position-absolute top-0 start-0 m-1">
                          <i className="fas fa-star me-1" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title">
                        <Link href={`/single-v1/${property._id}`}>
                          {property.title || "Untitled Property"}
                        </Link>
                      </div>
                      <p className="list-text mb-0">
                        {getFormattedLocation(property.location)}
                      </p>
                      <div className="list-price">
                        <span>
                          {formatPrice(property.price, property.currency)}
                        </span>
                      </div>
                      {isFeaturedActive(property.featured) &&
                        property.featured.expiresAt && (
                          <div className="text-muted small">
                            <i className="fas fa-clock me-1" />
                            Featured until:{" "}
                            {new Date(
                              property.featured.expiresAt
                            ).toLocaleDateString("en-GB")}
                          </div>
                        )}
                    </div>
                  </div>
                </th>
                <td className="vam">{formatDate(property.created_at)}</td>

                <td className="vam">
                  {formatPrice(property.price, property.currency)}
                </td>
                <td className="vam">
                  <button
                    onClick={() => handleViewAnalytics(property._id)}
                    title="View Analytics"
                    style={{ cursor: "pointer", color: "green" }}
                  >
                    View Analytics
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mbp_pagination text-center mt-4 px-auto">
          <ul className="page_navigation d-flex justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
              >
                <span className="fas fa-angle-left" />
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((page) => (
                <li
                  key={page}
                  className={`page-item${
                    page === currentPage ? " active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
              >
                <span className="fas fa-angle-right" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default BoostedPropertyDataTable;