"use client";
import React, { useState, useEffect } from "react";

const PriceRange = ({ filterFunctions, handleFilterChange }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && filterFunctions?.priceRange) {
      const [min, max] = filterFunctions.priceRange;
      setMinPrice(min > 0 ? min.toString() : "");
      setMaxPrice(max < 1000000000 ? max.toString() : "");
      setInitialized(true);
    }
  }, [filterFunctions?.priceRange, initialized]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    if (name === "min_price") {
      setMinPrice(value);
      handleFilterChange?.("min_price", value === "" ? null : Number(value));
    } else if (name === "max_price") {
      setMaxPrice(value);
      handleFilterChange?.("max_price", value === "" ? null : Number(value));
    }
  };

  return (
    <div className="range-wrapper">
      <div className="d-flex align-items-center justify-content-between gap-1">
        <div className="form-style1">
          <input
            type="number"
            className="form-control filterInput"
            name="min_price"
            onChange={handleOnChange}
            placeholder="Min."
            min={0}
            id="minPrice"
            value={minPrice}
          />
        </div>
        <span className="dark-color">-</span>
        <div className="form-style1">
          <input
            type="number"
            className="form-control filterInput"
            placeholder="Max"
            name="max_price"
            id="maxPrice"
            max={1000000}
            onChange={handleOnChange}
            value={maxPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRange;