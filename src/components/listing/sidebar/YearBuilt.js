"use client";

import { useRef, useState, useEffect } from "react";

const YearBuilt = ({ filterFunctions }) => {
  const minYearRef = useRef(null);
  const maxYearRef = useRef(null);
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  // Update local state when filterFunctions changes
  useEffect(() => {
    if (filterFunctions?.yearBuild) {
      setMinYear(filterFunctions.yearBuild[0] || "");
      setMaxYear(filterFunctions.yearBuild[1] || "");
    }
  }, [filterFunctions?.yearBuild]);

  // Debounce year changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (minYear !== "" || maxYear !== "") {
        const range = [
          parseInt(minYear) || 1800,
          parseInt(maxYear) || 2050
        ];
        filterFunctions?.handleyearBuild?.(range);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [minYear, maxYear]);

  const handleMinChange = (e) => {
    setMinYear(e.target.value);
  };

  const handleMaxChange = (e) => {
    setMaxYear(e.target.value);
  };

  return (
    <div className="space-area">
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-style1">
          <input
            type="number"
            ref={minYearRef}
            value={minYear}
            onChange={handleMinChange}
            className="form-control filterInput"
            placeholder="2019"
            id="minYear"
            min="1800"
            max="2050"
          />
        </div>
        <span className="dark-color">-</span>
        <div className="form-style1">
          <input
            type="number"
            ref={maxYearRef}
            value={maxYear}
            onChange={handleMaxChange}
            className="form-control filterInput"
            placeholder="2022"
            id="maxYear"
            min="1800"
            max="2050"
          />
        </div>
      </div>
    </div>
  );
};

export default YearBuilt;