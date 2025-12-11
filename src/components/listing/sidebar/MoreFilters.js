"use client";
import React, { useEffect, useState } from "react";

const MoreFilters = ({ filterFunctions, handleFilterChange }) => {
  const [minFeet, setMinFeet] = useState("");
  const [maxFeet, setMaxFeet] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [keywords, setKeywords] = useState("");
  const [developer, setDeveloper] = useState("");
  const [initialized, setInitialized] = useState(false); // Prevent re-initializing

  // Run once on mount
  useEffect(() => {
    if (!initialized && filterFunctions) {
      if (filterFunctions?.squirefeet) {
        setMinFeet(
          filterFunctions.squirefeet[0] > 20
            ? filterFunctions.squirefeet[0].toString()
            : ""
        );
        setMaxFeet(
          filterFunctions.squirefeet[1] < 70987
            ? filterFunctions.squirefeet[1].toString()
            : ""
        );
      }

      if (filterFunctions?.yearBuild) {
        setMinYear(
          filterFunctions.yearBuild[0] > 1800
            ? filterFunctions.yearBuild[0].toString()
            : ""
        );
        setMaxYear(
          filterFunctions.yearBuild[1] < 2050
            ? filterFunctions.yearBuild[1].toString()
            : ""
        );
      }

      if (filterFunctions?.searchQuery) {
        setKeywords(filterFunctions.searchQuery);
      }

      if (filterFunctions?.developer) {
        setDeveloper(filterFunctions.developer);
      }

      setInitialized(true);
    }
  }, [filterFunctions, initialized]);

  // Input change handlers
  const handleOnChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "min_feet":
        setMinFeet(value);
        handleFilterChange?.("min_feet", value === "" ? null : Number(value));
        break;
      case "max_feet":
        setMaxFeet(value);
        handleFilterChange?.("max_feet", value === "" ? null : Number(value));
        break;
      case "min_year":
        setMinYear(value);
        handleFilterChange?.("min_year", value === "" ? null : Number(value));
        break;
      case "max_year":
        setMaxYear(value);
        handleFilterChange?.("max_year", value === "" ? null : Number(value));
        break;
      case "keywords":
        setKeywords(value);
        handleFilterChange?.("keywords", value || null);
        break;
      case "developer":
        setDeveloper(value);
        handleFilterChange?.("developer", value || null);
        break;
    }
  };

  return (
    <div className="">
      <div className="widget-wrapper">
        <h6 className="list-title">Square Feet</h6>
        <div className="space-area">
          <div className="d-flex align-items-center justify-content-between">
            <div className="form-style1">
              <input
                type="number"
                className="form-control filterInput"
                name="min_feet"
                value={minFeet}
                onChange={handleOnChange}
                placeholder="Min."
                id="minFeet3"
              />
            </div>
            <span className="dark-color">-</span>
            <div className="form-style1">
              <input
                type="number"
                className="form-control filterInput"
                name="max_feet"
                placeholder="Max"
                value={maxFeet}
                id="maxFeet3"
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Year Built</h6>
        <div className="space-area">
          <div className="d-flex align-items-center justify-content-between">
            <div className="form-style1">
              <input
                type="number"
                className="form-control filterInput"
                name="min_year"
                value={minYear}
                onChange={handleOnChange}
                placeholder="Min Year"
                id="minYear"
              />
            </div>
            <span className="dark-color">-</span>
            <div className="form-style1">
              <input
                type="number"
                className="form-control filterInput"
                name="max_year"
                placeholder="Max Year"
                value={maxYear}
                id="maxYear"
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="widget-wrapper">
          <h6 className="list-title">Keywords</h6>
          <div className="form-style2">
            <input
              type="text"
              className="form-control"
              placeholder="Add a relevant Keywords"
              name="keywords"
              value={keywords}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>

      <div className="">
        <div className="widget-wrapper">
          <h6 className="list-title">Developer</h6>
          <div className="form-style2">
            <input
              type="text"
              className="form-control"
              placeholder="Select a developer"
              name="developer"
              value={developer}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreFilters;
