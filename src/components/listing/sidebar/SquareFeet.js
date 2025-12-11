"use client";

import { useRef, useState, useEffect } from "react";

const SquareFeet = ({ filterFunctions }) => {
  const minFeetRef = useRef(null);
  const maxFeetRef = useRef(null);
  const [minFeet, setMinFeet] = useState("");
  const [maxFeet, setMaxFeet] = useState("");

  // Update local state when filterFunctions changes
  useEffect(() => {
    if (filterFunctions?.squirefeet) {
      setMinFeet(filterFunctions.squirefeet[0] || "");
      setMaxFeet(filterFunctions.squirefeet[1] || "");
    }
  }, [filterFunctions?.squirefeet]);

  // Debounce min feet
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (minFeet !== "" || maxFeet !== "") {
        const range = [
          parseInt(minFeet) || 0,
          parseInt(maxFeet) || 0
        ];
        filterFunctions?.handlesquirefeet?.(range);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [minFeet, maxFeet]);

  const handleMinChange = (e) => {
    setMinFeet(e.target.value);
  };

  const handleMaxChange = (e) => {
    setMaxFeet(e.target.value);
  };

  return (
    <div className="space-area">
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-style1">
          <input
            type="number"
            ref={minFeetRef}
            value={minFeet}
            onChange={handleMinChange}
            className="form-control filterInput"
            placeholder="Min."
            id="minFeet"
          />
        </div>
        <span className="dark-color">-</span>
        <div className="form-style1">
          <input
            type="number"
            id="maxFeet"
            ref={maxFeetRef}
            value={maxFeet}
            onChange={handleMaxChange}
            className="form-control filterInput"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};

export default SquareFeet;