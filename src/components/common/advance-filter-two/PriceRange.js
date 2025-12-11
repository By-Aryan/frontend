"use client";
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PriceRange = ({ filterFunctions }) => {
  const defaultRange = [20, 70987]; // Default price range
  const priceRange = filterFunctions?.priceRange || defaultRange; // Fallback for undefined

  const [price, setPrice] = useState(priceRange);

  // Price range handler
  const handleOnChange = (value) => {
    setPrice(value);
    filterFunctions?.handlepriceRange?.(value);
  };

  return (
    <div className="range-wrapper">
      <Slider
        range
        max={100000}
        min={0}
        defaultValue={priceRange} // Use validated `priceRange`
        onChange={handleOnChange}
        id="slider"
      />
      <div className="d-flex align-items-center">
        <span id="slider-range-value1">${price[0]}</span>
        <i className="fa-sharp fa-solid fa-minus mx-2 dark-color icon" />
        <span id="slider-range-value2">${price[1]}</span>
      </div>
    </div>
  );
};

export default PriceRange;
