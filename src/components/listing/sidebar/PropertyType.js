'use client'

import React from "react";

const PropertyType = ({ filterFunctions, handleFilterChange }) => {
  const options = [
    { id: "all-properties", label: "All Properties", value: "properties", defaultChecked: true },
    { id: "apartments", label: "Apartments", value: "apartment" },
    { id: "villas", label: "Villas", value: "villa" },
    { id: "townhouses", label: "Townhouses", value: "townhouse" },
    { id: "penthouses", label: "Penthouses", value: "penthouse" },
    { id: "compounds", label: "Compounds", value: "compound" },
    { id: "duplexes", label: "Duplexes", value: "duplex" },
    { id: "land", label: "Land", value: "land" },
    { id: "bungalows", label: "Bungalows", value: "bungalow" },
    { id: "hotel-apartments", label: "Hotel Apartments", value: "hotel_apartment" },
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
            checked={filterFunctions?.propertyTypes === option.value}
            onChange={() => {
              // Only update pending filters, don't apply immediately
              handleFilterChange?.("propertyType", option.value);
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

export default PropertyType;