"use client";
import React, { useState, useEffect } from "react";
import Slider, { Range } from "rc-slider";

const PriceRange = ({ filterFunctions }) => {
  const [price, setPrice] = useState([0, 100000]);

  // price range handler
  const handleOnChange = (value) => {
    setPrice(value);
    // Update the filter functions with min and max price
    if (filterFunctions?.setMinPrice) {
      filterFunctions.setMinPrice(value[0]);
    }
    if (filterFunctions?.setMaxPrice) {
      filterFunctions.setMaxPrice(value[1]);
    }
  };

  // Initialize price range from filter functions if available
  useEffect(() => {
    if (filterFunctions?.minPrice !== undefined && filterFunctions?.maxPrice !== undefined) {
      setPrice([filterFunctions.minPrice || 0, filterFunctions.maxPrice || 100000]);
    }
  }, [filterFunctions?.minPrice, filterFunctions?.maxPrice]);

  return (
    <>
      <div className="range-wrapper">
        <Slider
          range
          max={100000}
          min={0}
          value={price}
          onChange={(value) => handleOnChange(value)}
          id="slider"
        />
        <div className="d-flex align-items-center">
          <span id="slider-range-value1">${price[0].toLocaleString()}</span>
          <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
          <span id="slider-range-value2">${price[1].toLocaleString()}</span>
        </div>
      </div>
    </>
  );
};

export default PriceRange;
