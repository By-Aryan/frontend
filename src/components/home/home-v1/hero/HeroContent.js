"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import PropertyTypeModal from "../../../common/PropertyTypeModal";
import BedsAndBathsModal from "../../../common/BedsAndBathsModal";
import PriceModal from "../../../common/PriceModal";
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
  // Remove unused dropdown state
  // const [showDropdown, setShowDropdown] = useState(null);
  const router = useRouter();
  // Remove unused refs
  // const bedsButtonRef = useRef(null);
  // const priceButtonRef = useRef(null);
  // const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [activeTab, setActiveTab] = useState("for-sale");
  const [propertyCategory, setPropertyCategory] = useState("residential");
  const [propertyTypeOption, setPropertyTypeOption] = useState();
  const [propertyType, setPropertyType] = useState("properties");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(false);
  const [showBedsAndBathsModal, setShowBedsAndBathsModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  
  // Pending filter states for cancel functionality (not needed with modals)
  // const [pendingBedrooms, setPendingBedrooms] = useState(0);
  // const [pendingBathrooms, setPendingBathrooms] = useState(0);
  // const [pendingMinPrice, setPendingMinPrice] = useState("");
  // const [pendingMaxPrice, setPendingMaxPrice] = useState("");

  // Modal handlers
  const handleBedsAndBathsSelection = (selectedBedrooms, selectedBathrooms) => {
    setBedrooms(selectedBedrooms);
    setBathrooms(selectedBathrooms);
  };

  const handlePriceSelection = (selectedMinPrice, selectedMaxPrice) => {
    setMinPrice(selectedMinPrice);
    setMaxPrice(selectedMaxPrice);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Map activeTab to proper purpose for URL and API
    const purposeMapping = {
      'for-sale': 'buy',
      'for-rent': 'rent',
      'buy': 'buy',
      'rent': 'rent'
    };
    
    const mappedPurpose = purposeMapping[activeTab] || 'buy';
    
    // Build query parameters - using consistent naming with listing page
    const params = new URLSearchParams();
    
    if (propertyCategory) params.append('category', propertyCategory);
    if (selectedPropertyTypes.length > 0) params.append('property_type', selectedPropertyTypes[0]);
    if (bedrooms > 0) params.append('bedrooms', bedrooms);
    if (bathrooms > 0) params.append('bathrooms', bathrooms);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    
    // Add purpose parameter to ensure proper filter connection
    params.append('purpose', mappedPurpose);
    
    const queryString = params.toString();
    const searchPath = location && location !== 'uae' ? location.toLowerCase().replace(/\s+/g, '-') : 'uae';
    
    // Use proper URL structure: /{purpose}/{propertyType}/{location}
    const urlPropertyType = propertyType && propertyType !== 'properties' ? propertyType : 'properties';
    const finalUrl = `/${activeTab}/${urlPropertyType}/${searchPath}${queryString ? '?' + queryString : ''}`;
    
    // Debug log to show the connection
    console.log("🏠 Home Page Search - Connecting to Listing Page:", {
      activeTab: activeTab,
      mappedPurpose: mappedPurpose,
      activeFilters: {
        category: propertyCategory,
        property_type: selectedPropertyTypes[0],
        purpose: mappedPurpose,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        min_price: minPrice,
        max_price: maxPrice
      },
      generatedURL: finalUrl,
      queryParams: queryString
    });
    
    router.push(finalUrl);
  };

  const handlePropertyTypeSelection = (types, category) => {
    setSelectedPropertyTypes(types);
    if (category) {
      setPropertyCategory(category);
    }
  };

  const getSelectedPropertyTypesLabel = () => {
    if (selectedPropertyTypes.length === 0) {
      return "Types of Properties";
    } else if (selectedPropertyTypes.length === 1) {
      return selectedPropertyTypes[0];
    } else if (selectedPropertyTypes.length === 2) {
      return `${selectedPropertyTypes[0]}, ${selectedPropertyTypes[1]}`;
    } else {
      return `${selectedPropertyTypes.length} Types Selected`;
    }
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
    { id: "bed-any", label: "Any", value: 0 },
    { id: "bed-studio", label: "Studio", value: 0 },
    { id: "bed-1", label: "1+", value: 1 },
    { id: "bed-2", label: "2+", value: 2 },
    { id: "bed-3", label: "3+", value: 3 },
    { id: "bed-4", label: "4+", value: 4 },
    { id: "bed-5", label: "5+", value: 5 },
  ];

  const bathroomsOptions = [
    { id: "bath-any", label: "Any", value: 0 },
    { id: "bath-1", label: "1+", value: 1 },
    { id: "bath-2", label: "2+", value: 2 },
    { id: "bath-3", label: "3+", value: 3 },
    { id: "bath-4", label: "4+", value: 4 },
    { id: "bath-5", label: "5+", value: 5 },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#0f8363"
        : isHovered
          ? "#ebfff9"
          : isFocused
            ? "#ebfff9"
            : undefined,
    }),
  };

  const handlePropertyTypeChange = (selectedOption) => {
    setPropertyTypeOption(selectedOption);
    setPropertyType(selectedOption.value);
  };

  const handleCategoryChange = (selectedOption) => {
    setPropertyCategory(selectedOption.value);
    // Reset property type selection when category changes
    setSelectedPropertyTypes([]);
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
      <div className="advance-search-tab mt70 mx-auto animate-up-3">
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <div className="advance-search-style1 home-search">
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <div className="advance-search-field position-relative text-start">
                    <form className="form-search position-relative">
                      
                      {/* Search Container */}
                      <div className="bg-white shadow-lg border border-light" style={{
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        borderWidth: '2px',
                        borderColor: '#0f8363',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        padding: '0' // Remove any default padding
                      }}>
                        
                        {/* Search Content with padding */}
                        <div className="p-4 d-flex flex-column gap-4">
                        
                        {/* Top Row: Buy/Rent tabs, Location input, Search button */}
                        <div className="d-flex align-items-center gap-3">
                        
                        {/* Buy/Rent Tabs */}
                        <div className="nav nav-pills bg-light rounded-pill p-1 border border-secondary-subtle" role="tablist" style={{
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              className={`nav-link px-4 py-2 rounded-pill fw-semibold transition-all ${
                                activeTab === tab.id
                                  ? "active bg-success text-white border"
                                  : "text-dark border border-transparent hover:bg-white hover:border-secondary-subtle"
                              }`}
                              style={{
                                transition: 'all 0.3s ease',
                                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(15, 131, 99, 0.3)' : 'none',
                                borderColor: activeTab === tab.id ? '#0f8363' : 'transparent'
                              }}
                              onClick={() => handleTabClick(tab.id)}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Location Input */}
                        <div className="flex-fill position-relative">
                          <div className="search-input position-relative">
                            <i className="flaticon-location-pin position-absolute top-50 start-0 translate-middle-y ms-3" style={{
                              fontSize: '16px',
                              color: '#0f8363'
                            }}></i>
                            <input
                              ref={inputRef}
                              type="text"
                              className="form-control ps-5 py-3 bg-light rounded-xl fw-normal border border-secondary-subtle"
                              placeholder={`Enter an address, neighborhood, city, or ZIP code for ${activeTab === "for-sale" ? "Buy" : "Rent"}`}
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
                              style={{ 
                                fontSize: '14px', 
                                color: '#6c757d',
                                transition: 'all 0.3s ease',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#0f8363';
                                e.target.style.boxShadow = '0 0 0 0.2rem rgba(15, 131, 99, 0.25)';
                                if (filtered.length > 0) {
                                  setShowInputDropdown(true);
                                }
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#dee2e6';
                                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)';
                                setTimeout(() => setShowInputDropdown(false), 200);
                              }}
                            />
                            
                            {/* Location Dropdown */}
                            {showInputDropdown && filtered.length > 0 && (
                              <div className="position-absolute top-100 start-0 w-100 bg-white border rounded shadow-lg z-3 mt-1">
                                {filtered.map((item, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`d-block w-100 text-start px-3 py-2 border-0 ${
                                      index === highlightedIndex ? "bg-light" : "bg-white"
                                    } hover:bg-light`}
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

                        {/* Search Button */}
                        <button
                          className="btn btn-success rounded-xl px-5 py-3 fw-bold border bg-gradient-primary"
                          onClick={handleSearch}
                          type="button"
                          style={{ 
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(15, 131, 99, 0.3)',
                            minWidth: '120px',
                            borderColor: '#0f8363'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(15, 131, 99, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(15, 131, 99, 0.3)';
                          }}
                        >
                          Search
                        </button>

                        </div>

                        {/* Bottom Row: Filter dropdowns */}
                        <div className="d-flex align-items-center gap-3">

                        {/* Property Type Selection */}
                        <div className="dropdown">
                          <button
                            type="button"
                            className={`btn rounded-xl px-4 py-3 d-flex align-items-center gap-2 border transition-all duration-200 ${
                              selectedPropertyTypes.length > 0
                                ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm'
                                : 'bg-light border-secondary-subtle text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => setShowPropertyTypeModal(true)}
                            style={{ 
                              fontSize: '14px', 
                              minWidth: '160px',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                              if (selectedPropertyTypes.length === 0) {
                                e.target.style.backgroundColor = '#ffffff';
                                e.target.style.borderColor = '#0f8363';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedPropertyTypes.length === 0) {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#dee2e6';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                              }
                            }}
                          >
                            <span>{getSelectedPropertyTypesLabel()}</span>
                            <i className="fa fa-chevron-down small" style={{color: '#0f8363'}}></i>
                          </button>
                        </div>

                        {/* Beds & Baths Filter */}
                        <div className="dropdown">
                          <button
                            type="button"
                            className={`btn rounded-xl px-4 py-3 d-flex align-items-center gap-2 border transition-all duration-200 ${
                              bedrooms > 0 || bathrooms > 0
                                ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm'
                                : 'bg-light border-secondary-subtle text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => setShowBedsAndBathsModal(true)}
                            style={{ 
                              fontSize: '14px', 
                              minWidth: '160px',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                              if (bedrooms === 0 && bathrooms === 0) {
                                e.target.style.backgroundColor = '#ffffff';
                                e.target.style.borderColor = '#0f8363';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (bedrooms === 0 && bathrooms === 0) {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#dee2e6';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                              }
                            }}
                          >
                            <span>
                              {bedrooms > 0 || bathrooms > 0 
                                ? `${bedrooms > 0 ? `${bedrooms} Bed${bedrooms > 1 ? 's' : ''}` : 'Any Beds'} & ${bathrooms > 0 ? `${bathrooms} Bath${bathrooms > 1 ? 's' : ''}` : 'Any Baths'}`
                                : 'Beds & Baths'
                              }
                            </span>
                            <i className="fa fa-chevron-down small" style={{color: '#0f8363'}}></i>
                          </button>
                        </div>

                        {/* Price Filter */}
                        <div className="dropdown">
                          <button
                            type="button"
                            className={`btn rounded-xl px-4 py-3 d-flex align-items-center gap-2 border transition-all duration-200 ${
                              minPrice || maxPrice
                                ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm'
                                : 'bg-light border-secondary-subtle text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => setShowPriceModal(true)}
                            style={{ 
                              fontSize: '14px', 
                              minWidth: '160px',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                              if (!minPrice && !maxPrice) {
                                e.target.style.backgroundColor = '#ffffff';
                                e.target.style.borderColor = '#0f8363';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!minPrice && !maxPrice) {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#dee2e6';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                              }
                            }}
                          >
                            <span>
                              {minPrice || maxPrice 
                                ? `Price: ${minPrice ? 'AED ' + parseInt(minPrice).toLocaleString() : 'Any'} - ${maxPrice ? 'AED ' + parseInt(maxPrice).toLocaleString() : 'Any'}`
                                : 'Price (AED)'
                              }
                            </span>
                            <i className="fa fa-chevron-down small" style={{color: '#0f8363'}}></i>
                          </button>
                        </div>

                        </div>
                        
                        </div> {/* Close search content div */}
                      
                      {/* Buy/Sell Property Banner - Integrated into container */}
                      <div className="text-center py-3" style={{ 
                        backgroundColor: '#0f8363',
                        width: '100%',
                        margin: '0',
                        borderRadius: '0 0 20px 20px',
                        position: 'relative',
                        left: '0',
                        right: '0',
                        zIndex: 1
                      }}>
                        <h6 className="text-white mb-0 fw-semibold" style={{ fontSize: '14px' }}>
                          Buy / Sell Property Without Brokerage and Hassle Free
                        </h6>
                      </div>
                      
                      </div> {/* Close main container div */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Type Modal */}
      <PropertyTypeModal
        isOpen={showPropertyTypeModal}
        onClose={() => setShowPropertyTypeModal(false)}
        category={propertyCategory}
        selectedTypes={selectedPropertyTypes}
        onSelectionChange={handlePropertyTypeSelection}
      />

      {/* Beds & Baths Modal */}
      <BedsAndBathsModal
        isOpen={showBedsAndBathsModal}
        onClose={() => setShowBedsAndBathsModal(false)}
        selectedBedrooms={bedrooms}
        selectedBathrooms={bathrooms}
        onSelectionChange={handleBedsAndBathsSelection}
      />

      {/* Price Modal */}
      <PriceModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        selectedMinPrice={minPrice}
        selectedMaxPrice={maxPrice}
        onSelectionChange={handlePriceSelection}
      />
    </>
  );
};

export default HeroContent;
