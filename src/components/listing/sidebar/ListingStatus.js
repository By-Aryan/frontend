'use client'

import React from "react";

const ListingStatus = ({ filterFunctions, handleFilterChange }) => {
  const options = [
    { id: "flexRadioDefault4", label: "All", value: "all", defaultChecked: true },
    { id: "flexRadioDefault1", label: "Buy", value: "buy" },
    { id: "flexRadioDefault2", label: "Rent", value: "rent" },
    { id: "flexRadioDefault3", label: "Commercial", value: "commercial" },
  ];

  return (
    <>
      {options.map((option) => (
        <div
          className="form-check d-flex align-items-center mb10"
          key={option.id}
        >
          <input
            className="form-check-input"
            id={option.id}
            type="radio"
            checked={filterFunctions?.listingStatus === option.label}
            onChange={() => {
              console.log("🎯 ListingStatus onChange:", option.label);
              // Prioritize handleFilterChange for pending filter updates in dropdowns
              if (handleFilterChange) {
                console.log("🎯 Calling handleFilterChange with:", "listingStatus", option.label);
                handleFilterChange("listingStatus", option.label);
              } else if (filterFunctions?.handleListingStatus) {
                console.log("🎯 Calling filterFunctions.handleListingStatus with:", option.label);
                filterFunctions.handleListingStatus(option.label);
              }
            }}
          />
          <label className="form-check-label" htmlFor={option.id} style={{fontSize: "16px"}}>
            {option.label}
          </label>
        </div>
      ))}
    </>
  );
};

export default ListingStatus;