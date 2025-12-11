"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
const Select = dynamic(() => import("react-select"), { ssr: false });

const dummyLocations = [
  "Dubai",
  "Dubai Marina",
  "Downtown Dubai",
  "Dubai Land Residence Complex",
  "Dubai South",
  "Dubailand",
  "Dubai Hills Estate",
  "Dubai Sports City",
  "Dubai Creek Harbour",
  "Dubai Silicon Oasis",
  "Dubai Investment Park",
  "Dubai Design District",
  "Dubai Festival City",
  "Abu Dhabi",
  "Al Ain",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

const HeroContent = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("for-sale");
  const [propertyCategory, setPropertyCategory] = useState("residential");
  const [propertyTypeOption, setPropertyTypeOption] = useState();
  const [propertyType, setPropertyType] = useState("properties");
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (propertyCategory) params.append('category', propertyCategory);
    if (bedrooms && bedrooms !== 'any') params.append('bedrooms', bedrooms);
    if (bathrooms && bathrooms !== 'any') params.append('bathrooms', bathrooms);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (propertyType && propertyType !== 'properties') params.append('property_type', propertyType);
    
    const queryString = params.toString();
    const searchPath = location && location !== 'uae' ? location.toLowerCase().replace(/\s+/g, '-') : 'uae';
    const finalUrl = `/${activeTab}/${propertyType}/${searchPath}${queryString ? '?' + queryString : ''}`;
    
    router.push(finalUrl);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: "for-sale", label: "Buy" },
    { id: "for-rent", label: "Rent" },
  ];

  // Updated property categories
  const categoryOptions = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
  ];

  // Updated property type options based on category
  const getPropertyTypeOptions = () => {
    if (propertyCategory === 'residential') {
      return [
        { value: "properties", label: "All Residential" },
        { value: "apartment", label: "Apartment" },
        { value: "villa", label: "Villa" },
        { value: "townhouse", label: "Townhouse" },
        { value: "penthouse", label: "Penthouse" },
        { value: "villa-compound", label: "Villa Compound" },
        { value: "hotel-apartment", label: "Hotel Apartment" },
      ];
    } else {
      return [
        { value: "properties", label: "All Commercial" },
        { value: "office", label: "Office" },
        { value: "retail", label: "Retail" },
        { value: "warehouse", label: "Warehouse" },
        { value: "land", label: "Land" },
        { value: "building", label: "Building" },
        { value: "floor", label: "Floor" },
      ];
    }
  };

  const bedroomsOptions = [
    { id: "bed-any", label: "Any", value: "any" },
    { id: "bed-studio", label: "Studio", value: "studio" },
    { id: "bed-1", label: "1", value: "1" },
    { id: "bed-2", label: "2", value: "2" },
    { id: "bed-3", label: "3", value: "3" },
    { id: "bed-4", label: "4", value: "4" },
    { id: "bed-5", label: "5", value: "5" },
    { id: "bed-6", label: "6", value: "6" },
    { id: "bed-7", label: "7", value: "7" },
    { id: "bed-8plus", label: "8+", value: "8+" },
  ];

  const bathroomsOptions = [
    { id: "bath-any", label: "Any", value: "any" },
    { id: "bath-1", label: "1", value: "1" },
    { id: "bath-2", label: "2", value: "2" },
    { id: "bath-3", label: "3", value: "3" },
    { id: "bath-4", label: "4", value: "4" },
    { id: "bath-5", label: "5", value: "5" },
    { id: "bath-6plus", label: "6+", value: "6+" },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "var(--color-primary)"
        : isHovered
          ? "var(--color-primary-50)"
          : isFocused
            ? "var(--color-primary-50)"
            : undefined,
    }),
  };

  const handleDoneClick = () => {
    setShowDropdown(null);
  };

  const handlePropertyTypeChange = (selectedOption) => {
    setPropertyTypeOption(selectedOption);
    setPropertyType(selectedOption.value);
  };

  const handleCategoryChange = (selectedOption) => {
    setPropertyCategory(selectedOption.value);
    // Reset property type when category changes
    setPropertyType("properties");
    setPropertyTypeOption(null);
  };

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [selectedTag, setSelectedTag] = useState(location || null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    setLocation(input);
    const matches = dummyLocations.filter((loc) =>
      loc.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(matches);
    setShowInputDropdown(matches.length > 0);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!showInputDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filtered.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filtered.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          selectLocation(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowInputDropdown(false);
        break;
    }
  };

  const selectLocation = (location) => {
    setQuery(location);
    setLocation(location);
    setSelectedTag(location);
    setShowInputDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <>
      <div className="advance-search-tab mt70 mx-auto animate-up-3 h-full">
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <div className="advance-search-style1 home-search">
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <div className="advance-search-field position-relative text-start">
                    <form className="form-search position-relative">
                      {/* Tab Buttons */}
                      <div className="box-search">
                        <div className="button-group">
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              className={`btn rounded-2xl ${
                                activeTab === tab.id
                                  ? "bg-[#0f8363] text-white"
                                  : "bg-transparent text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => handleTabClick(tab.id)}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Search Form */}
                      <div className="box-search mt-3">
                        <div className="row g-3 align-items-center">
                          {/* Location Input */}
                          <div className="col-md-4">
                            <div className="search-input position-relative">
                              <input
                                ref={inputRef}
                                type="text"
                                className="form-control border-1 rounded-xl h-12 px-4"
                                placeholder="Enter location"
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => {
                                  if (filtered.length > 0) {
                                    setShowInputDropdown(true);
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => setShowInputDropdown(false), 200);
                                }}
                              />
                              <i className="flaticon-location-pin position-absolute top-50 end-0 translate-middle-y me-3"></i>
                              
                              {/* Location Dropdown */}
                              {showInputDropdown && filtered.length > 0 && (
                                <div className="position-absolute top-100 start-0 w-100 bg-white border rounded shadow-lg z-3 mt-1">
                                  {filtered.map((item, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      className={`d-block w-100 text-start px-3 py-2 border-0 ${
                                        index === highlightedIndex ? "bg-gray-200" : "bg-white"
                                      } hover:bg-gray-100`}
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => selectLocation(item)}
                                    >
                                      {item}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Category Dropdown */}
                          <div className="col-md-2">
                            <Select
                              styles={customStyles}
                              className="category-select"
                              classNamePrefix="select"
                              value={categoryOptions.find(opt => opt.value === propertyCategory)}
                              onChange={handleCategoryChange}
                              options={categoryOptions}
                              placeholder="Category"
                            />
                          </div>

                          {/* Property Type Dropdown */}
                          <div className="col-md-2">
                            <Select
                              key={propertyCategory} // Force re-render when category changes
                              styles={customStyles}
                              className="property-select"
                              classNamePrefix="select"
                              value={propertyTypeOption}
                              onChange={handlePropertyTypeChange}
                              options={getPropertyTypeOptions()}
                              placeholder="Property Type"
                            />
                          </div>

                          {/* Beds & Baths Dropdown */}
                          <div className="col-md-2">
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn border rounded-xl h-12 w-100 text-start d-flex align-items-center justify-content-between"
                                data-bs-toggle="dropdown"
                                onClick={() => setShowDropdown(showDropdown === "bedsBaths" ? null : "bedsBaths")}
                              >
                                <span>
                                  {bedrooms !== "any" ? bedrooms : "Any"} Beds / {bathrooms !== "any" ? bathrooms : "Any"} Baths
                                </span>
                                <i className="fa fa-chevron-down"></i>
                              </button>
                              
                              <div className={`dropdown-menu p-3 ${showDropdown === "bedsBaths" ? "show" : ""}`}>
                                {/* Bedrooms */}
                                <div className="mb-3">
                                  <h6 className="fw-bold mb-2">Bedrooms</h6>
                                  <div className="d-flex flex-wrap gap-2">
                                    {bedroomsOptions.map((option) => (
                                      <div key={option.id} className="form-check">
                                        <input
                                          type="radio"
                                          className="form-check-input"
                                          id={option.id}
                                          name="bedrooms"
                                          checked={bedrooms === option.value}
                                          onChange={() => setBedrooms(option.value)}
                                        />
                                        <label className="form-check-label" htmlFor={option.id}>
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Bathrooms */}
                                <div className="mb-3">
                                  <h6 className="fw-bold mb-2">Bathrooms</h6>
                                  <div className="d-flex flex-wrap gap-2">
                                    {bathroomsOptions.map((option) => (
                                      <div key={option.id} className="form-check">
                                        <input
                                          type="radio"
                                          className="form-check-input"
                                          id={option.id}
                                          name="bathrooms"
                                          checked={bathrooms === option.value}
                                          onChange={() => setBathrooms(option.value)}
                                        />
                                        <label className="form-check-label" htmlFor={option.id}>
                                          {option.label}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="text-end">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={handleDoneClick}
                                  >
                                    Done
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Range Dropdown */}
                          <div className="col-md-2">
                            <div className="dropdown">
                              <button
                                type="button"
                                className="btn border rounded-xl h-12 w-100 text-start d-flex align-items-center justify-content-between"
                                data-bs-toggle="dropdown"
                                onClick={() => setShowDropdown(showDropdown === "price" ? null : "price")}
                              >
                                <span>Price (AED)</span>
                                <i className="fa fa-chevron-down"></i>
                              </button>
                              
                              <div className={`dropdown-menu p-3 ${showDropdown === "price" ? "show" : ""}`}>
                                <div className="row g-2">
                                  <div className="col-6">
                                    <label className="form-label">Minimum</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="0"
                                      value={minPrice}
                                      onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label className="form-label">Maximum</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Any"
                                      value={maxPrice}
                                      onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="text-end mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={handleDoneClick}
                                  >
                                    Done
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Search Button */}
                          <div className="col-md-12">
                            <button
                              className="btn btn-thm w-100 bg-[#0f8363] text-white rounded-2xl py-3 d-flex align-items-center justify-content-center gap-2"
                              onClick={handleSearch}
                              type="button"
                            >
                              <i className="flaticon-search"></i>
                              <span className="fw-bold">Search</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <h6 className="bg-[#297862db] py-2 px-3 rounded-b-xl text-white text-center">
            Buy / Sell Property Without Brokerage and Hassle Free
          </h6>
        </div>
      </div>
    </>
  );
};

export default HeroContent;
