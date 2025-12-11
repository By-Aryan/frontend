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
        ? "#0f8363"
        : isHovered
          ? "#ebfff9"
          : isFocused
            ? "#ebfff9"
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
                                <div 
                                  className="position-absolute top-100 start-0 w-100 bg-white border rounded shadow-lg mt-1"
                                  style={{ zIndex: 9999, maxHeight: '200px', overflowY: 'auto' }}
                                >
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
                            <div className="dropdown position-relative">
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
                              
                              <div 
                                className={`dropdown-menu p-3 ${showDropdown === "bedsBaths" ? "show" : ""}`}
                                style={{ zIndex: 9998, position: 'absolute', top: '100%', left: 0, minWidth: '300px' }}
                              >
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
                            <div className="dropdown position-relative">
                              <button
                                type="button"
                                className="btn border rounded-xl h-12 w-100 text-start d-flex align-items-center justify-content-between"
                                data-bs-toggle="dropdown"
                                onClick={() => setShowDropdown(showDropdown === "price" ? null : "price")}
                              >
                                <span>Price (AED)</span>
                                <i className="fa fa-chevron-down"></i>
                              </button>
                              
                              <div 
                                className={`dropdown-menu p-3 ${showDropdown === "price" ? "show" : ""}`}
                                style={{ zIndex: 9998, position: 'absolute', top: '100%', left: 0, minWidth: '250px' }}
                              >
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
//           router.push(
//             `/${activeTab}/${bedrooms}-bedrooms-${propertyType}/${Location}?bathrooms=${bathrooms}`
//           );
//           return;
//         }
//         router.push(
//           `/${activeTab}/${bedrooms}-bedrooms-${propertyType}/${location}`
//         );
//         return;
//       }
//       if (bathrooms) {
//         if (bedrooms) {
//           router.push(
//             `/${activeTab}/${bedrooms}-bedrooms-${propertyType}/${Location}?bathrooms=${bathrooms}`
//           );
//           return;
//         }
//         router.push(
//           `/${activeTab}/${propertyType}/${location}?bathrooms=${bathrooms}`
//         );
//         return;
//       }
//       router.push(`/${activeTab}/${propertyType}/${Location}`);
//     }

//     if (bedrooms !== 0) {
//       if (bathrooms !== 0) {
//         router.push(
//           `/${activeTab}/${propertyType}/${Location}?bathrooms=${bathrooms}`
//         );
//         return;
//       }
//       router.push(
//         `/${activeTab}/${bedrooms}-bedrooms-${propertyType}/${Location}`
//       );
//       return;
//     }

//     if (bathrooms !== 0) {
//       if (bedrooms !== 0) {
//         router.push(
//           `/${activeTab}/${propertyType}/${Location}?bathrooms=${bathrooms}`
//         );
//         return;
//       }
//       router.push(
//         `/${activeTab}/${bedrooms}-bedrooms-${propertyType}/${Location}`
//       );
//       return;
//     }
//     router.push(`/${activeTab}/${propertyType}/${Location}`);
//     return;
//   };

//   const handlePropertyTypeChange = (selectedOption) => {
//     setPropertyTypeOption(selectedOption);
//     setPropertyType(selectedOption.value);
//   };

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   const tabs = [
//     { id: "for-sale", label: "Buy" },
//     { id: "for-rent", label: "Rent" },
//   ];

//   const propertyTypeOptions = [
//     { value: "Properties", label: "All Properties" },
//     { value: "Apartments", label: "Apartments" },
//     { value: "Bungalow", label: "Bungalow" },
//     { value: "Houses", label: "Houses" },
//     { value: "Office", label: "Office" },
//     { value: "Villa", label: "Villa" },
//   ];

//   const bathroomsOptions = [
//     { id: "bathany", label: "any", defaultChecked: true, value: 0 },
//     { id: "bathoneplus", label: "1+", value: 1 },
//     { id: "bathtwoplus", label: "2+", value: 2 },
//     { id: "baththreeplus", label: "3+", value: 3 },
//     { id: "bathfourplus", label: "4+", value: 4 },
//     { id: "bathfiveplus", label: "5+", value: 5 },
//   ];

//   const bedroomsOptions = [
//     { id: "any", label: "any", value: 0, defaultChecked: true },
//     { id: "oneplus", label: "1+", value: 1 },
//     { id: "twoplus", label: "2+", value: 2 },
//     { id: "threeplus", label: "3+", value: 3 },
//     { id: "fourplus", label: "4+", value: 4 },
//     { id: "fiveplus", label: "5+", value: 5 },
//   ];

//   const customStyles = {
//     option: (styles, { isFocused, isSelected, isHovered }) => ({
//       ...styles,
//       backgroundColor: isSelected
//         ? "#0f8363"
//         : isHovered
//           ? "#ebfff9"
//           : isFocused
//             ? "#ebfff9"
//             : undefined,
//     }),
//   };
//   const handleDoneClick = () => {
//     setShowDropdown(null);
//   };

//   const handlebedrooms = (elm) => {
//     setBedrooms(elm);
//   };
//   const handlebathrooms = (elm) => {
//     setBathrooms(elm);
//   };
//   const handleProperty = (elm) => {
//     setPropertyType(elm);
//   };
//   const handleLocation = (elm) => {
//     setLocation(elm);
//   };

//   const filterFunctions = {
//     handleProperty,
//     handlebedrooms,
//     handleLocation,
//     handlebathrooms,
//     location,
//     bedrooms,
//     bathrooms,
//   };

//   const [query, setQuery] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [showInputDropdown, setShowInputDropdown] = useState(false);
//   const [selectedTag, setSelectedTag] = useState(
//     filterFunctions.location || null
//   );
//   const [highlightedIndex, setHighlightedIndex] = useState(0);

//   const inputRef = useRef(null);

//   const handleInputChange = (e) => {
//     const input = e.target.value;
//     setQuery(input);
//     const matches = dummyLocations.filter((loc) =>
//       loc.toLowerCase().includes(input.toLowerCase())
//     );
//     setFiltered(matches);
//     setShowInputDropdown(true);
//     setHighlightedIndex(0);
//   };

//   const handleSelect = (value) => {
//     setSelectedTag(value);
//     setQuery(value);
//     setLocation(value)
//     setShowInputDropdown(false);
//     filterFunctions.handleLocation(value);
//   };

//   const handleKeyDown = (e) => {
//     if (!showDropdown) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev + 1) % filtered.length);
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlightedIndex((prev) =>
//         prev === 0 ? filtered.length - 1 : prev - 1
//       );
//     }

//     if (e.key === "Enter") {
//       e.preventDefault();
//       const selectedValue = filtered[highlightedIndex];
//       handleSelect(selectedValue);

//       // Optional: Clear input DOM directly too
//       if (inputRef.current) {
//         inputRef.current.value = "";
//       }
//     }
//   };

//   return (
//     <>
//       <div className="advance-search-tab mt70 mt30-md mx-auto animate-up-3 w-full">
//         <ul className="nav nav-tabs p-0 m-0 w-full flex bg-[#0f8363]">
//           {tabs.map((tab) => (
//             <li className="nav-item p-0 flex-1" key={tab.id}>
//               <button
//                 className={`w-full font-medium md:py-2 py-1 ${activeTab === tab.id
//                   ? "bg-[#0f8363] text-white"
//                   : "bg-white text-gray-500"
//                   }`}
//                 onClick={() => handleTabClick(tab.id)}
//               >
//                 {tab.label}
//               </button>
//             </li>
//           ))}
//         </ul>

//         <div className="tab-content space-y-2">
//           {tabs.map((tab) => (
//             <div
//               className={`${activeTab === tab.id ? "active" : ""} tab-pane`}
//               key={tab.id}
//             >
//               <div className="advance-content-style1">
//                 <div className="row">
//                   <div className="col-md-8 col-lg-9">
//                     <div className="advance-search-field text-start w-full">
//                       <div className="box-search bg-gray-100 bdrs12 relative w-full">
//                         <i className="icon flaticon-maps" />
//                         <input
//                           ref={inputRef}
//                           className="py-3 bgc-71 bg-transparent w-full"
//                           type="text"
//                           name="search"
//                           autoComplete="off"
//                           value={query}
//                           onClick={(e) => {
//                             e.preventDefault();
//                             setShowDropdown(true);
//                             const matches = dummyLocations.filter((loc) =>
//                               loc.toLowerCase().includes(query.toLowerCase())
//                             );
//                             setFiltered(matches);
//                           }}
//                           onKeyDown={handleKeyDown}
//                           onChange={handleInputChange}
//                           placeholder={`Enter an address, neighborhood, city, or ZIP code for ${tab.label}`}
//                         />
//                         {showInputDropdown &&
//                           query &&
//                           filtered.length > 0 && (
//                             <div className="absolute top-full left-0 w-full border border-gray-200 rounded bg-white shadow-md z-10 max-h-60 overflow-y-auto mt-1">
//                               {filtered.map((item, index) => (
//                                 <button
//                                   key={index}
//                                   onClick={() => handleSelect(item)}
//                                   className={`w-full text-left px-4 py-2 border-b border-gray-100 cursor-pointer 
//                     ${index === highlightedIndex ? "bg-gray-200" : "bg-white"} 
//                     hover:bg-gray-100 focus:outline-none`}
//                                   onMouseDown={(e) => e.preventDefault()} // avoid blur
//                                 >
//                                   {item}
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                       </div>
//                     </div>
//                   </div>
//                   {/* End .col-md-8 */}

//                   <div className="col-md-4 col-lg-3">
//                     <div className="d-flex align-items-center justify-content-start mt-3 mt-md-0">
//                       <button
//                         className="md:w-full w-[40%] bg-[#0f8363] bdrs12 text-white rounded-2xl md:py-[13px] py-[5px] px-0 flex items-center justify-center gap-2"
//                         onClick={handleSearch}
//                         type="button"
//                       >
//                         <span className="flaticon-search font-semibold mb-[-5px]" />
//                         <span className="font-semibold md:text-lg text-sm">Search</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div className="grid md:grid-cols-2 grid-cols-1 justify-start text-left">
//             <div className="text-left">
//               <li className="list-inline-item position-relative">
//                 <button
//                   type="button"
//                   className="open-btn mb15 dropdown-toggle border-1 py-[7px] lg:min-w-52 min-w-38 px-5 rounded-xl border-[#0f8363]"
//                   style={{ borderRadius: "5px" }}
//                   data-bs-toggle="dropdown"
//                   data-bs-auto-close="outside"
//                   id="bedsBathsDropdown"
//                   onClick={() => {
//                     setShowDropdown("bedsBathsDropdown");
//                   }}
//                 >
//                   {bedrooms !== 0 ? bedrooms : ""} Beds /{" "}
//                   {bathrooms !== 0 ? bathrooms : ""} Baths
//                 </button>
//                 <div
//                   className={`dropdown-menu dd4 pb20 ${showDropdown === "bedsBathsDropdown" ? "show" : ""
//                     }`}
//                 >
//                   <div className="widget-wrapper pl20 pr20">
//                     <h6 className="list-title">Bedrooms</h6>
//                     <div className="d-flex">
//                       {/* {Bedrooms} */}
//                       {bedroomsOptions.map((option) => (
//                         <div className="selection" key={option.id}>
//                           <input
//                             id={option.id}
//                             type="radio"
//                             onChange={(e) => {
//                               filterFunctions?.handlebedrooms(option.value);
//                             }}
//                             checked={filterFunctions?.bedrooms == option.value}
//                           />
//                           <label htmlFor={option.id}>{option.label}</label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="widget-wrapper bdrb1 pb25 mb0 pl20 pr20">
//                     <h6 className="list-title">Bathrooms</h6>
//                     <div className="d-flex">
//                       {/* {Bathrooms} */}
//                       {bathroomsOptions.map((option) => (
//                         <div className="selection" key={option.id}>
//                           <input
//                             id={option.id}
//                             type="radio"
//                             checked={bathrooms == option.value}
//                             onChange={() => {
//                               filterFunctions?.handlebathrooms(option.value);
//                             }}
//                           />
//                           <label htmlFor={option.id}>{option.label}</label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="text-end mt10 pr10">
//                     <button
//                       type="button"
//                       className="done-btn ud-btn btn-thm drop_btn4"
//                       onClick={() => handleDoneClick("bedsBathsDropdown")}
//                     >
//                       Done
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             </div>
//             <div className="text-left">
//               <div className="">
//                 <div className="selection">
//                   <Select
//                     key={Date.now()}
//                     styles={customStyles}
//                     className="home-select-custom h-10 lg:min-w-52 min-w-38"
//                     classNamePrefix="select"
//                     required
//                     defaultValue={propertyTypeOptions[0]}
//                     value={propertyTypeOption}
//                     name="structureType"
//                     onChange={handlePropertyTypeChange}
//                     options={propertyTypeOptions}
//                   />
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//         <div>
//           <h6 className="bg-[#297862db] py-2 px-3 rounded-b-xl text-white">
//             Buy / Sell Property Without Brokerage and Hassle Free
//           </h6>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HeroContent;