"use client";
import React from "react";

/**
 * PropertyActions Component
 * Displays view count, view contact button and like/favorite button for property listings
 *
 * @param {number} viewCount - Number of views for the property
 * @param {boolean} isSaved - Whether the property is saved/liked
 * @param {function} onSaveClick - Callback function when like button is clicked
 * @param {boolean} hasViewedContact - Whether user has viewed contact details
 * @param {function} onViewContact - Callback function when view contact button is clicked
 */
const PropertyActions = ({
  viewCount = 0,
  isSaved = false,
  onSaveClick,
  hasViewedContact = false,
  onViewContact
}) => {
  return (
    <div className="flex justify-end gap-3 mb-4 mt-2">
      {/* View Count Display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          fontSize: "15px",
          color: "#495057",
          fontWeight: "500",
          border: "2px solid #e9ecef"
        }}
      >
        <i className="fas fa-eye" style={{ color: "#10b981" }}></i>
        <span>{viewCount} views</span>
      </div>

      {/* Viewed Contact Button */}
      <button
        onClick={onViewContact}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          backgroundColor: hasViewedContact ? "#d1fae5" : "#f8f9fa",
          border: `2px solid ${hasViewedContact ? "#10b981" : "#e9ecef"}`,
          borderRadius: "10px",
          color: hasViewedContact ? "#059669" : "#495057",
          fontSize: "15px",
          cursor: "pointer",
          fontWeight: "500",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          if (!hasViewedContact) {
            e.currentTarget.style.backgroundColor = "#e9ecef";
            e.currentTarget.style.borderColor = "#dee2e6";
          } else {
            e.currentTarget.style.backgroundColor = "#a7f3d0";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = hasViewedContact ? "#d1fae5" : "#f8f9fa";
          e.currentTarget.style.borderColor = hasViewedContact ? "#10b981" : "#e9ecef";
        }}
      >
        <i className="fas fa-phone-alt" style={{ fontSize: "14px" }}></i>
        <span>{hasViewedContact ? "Contact Viewed" : "View Contact"}</span>
      </button>

      {/* Like/Save Button */}
      <button
        onClick={onSaveClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          backgroundColor: isSaved ? "#fee2e2" : "#f8f9fa",
          border: `2px solid ${isSaved ? "#ef4444" : "#e9ecef"}`,
          borderRadius: "10px",
          color: isSaved ? "#dc2626" : "#495057",
          fontSize: "15px",
          cursor: "pointer",
          fontWeight: "500",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          if (!isSaved) {
            e.currentTarget.style.backgroundColor = "#e9ecef";
            e.currentTarget.style.borderColor = "#dee2e6";
          } else {
            e.currentTarget.style.backgroundColor = "#fecaca";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isSaved ? "#fee2e2" : "#f8f9fa";
          e.currentTarget.style.borderColor = isSaved ? "#ef4444" : "#e9ecef";
        }}
      >
        <i className={isSaved ? "fas fa-heart" : "far fa-heart"} style={{ fontSize: "16px" }}></i>
        <span>{isSaved ? "Liked" : "Like"}</span>
      </button>
    </div>
  );
};

export default PropertyActions;
