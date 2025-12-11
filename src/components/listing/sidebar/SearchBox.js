'use client'

import React, { useState, useEffect } from "react";

const SearchBox = ({ filterFunctions }) => {
  const [searchQuery, setSearchQuery] = useState(filterFunctions?.searchQuery || "");

  // Update local state when filterFunctions changes
  useEffect(() => {
    setSearchQuery(filterFunctions?.searchQuery || "");
  }, [filterFunctions?.searchQuery]);

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      filterFunctions?.setSearchQuery?.(searchQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="search_area">
      <input
        type="text"
        className="form-control"
        placeholder="What are you looking for?"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <label>
        <span className="flaticon-search" />
      </label>
    </div>
  );
};

export default SearchBox;