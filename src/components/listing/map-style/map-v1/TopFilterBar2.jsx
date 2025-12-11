// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { IoCloseOutline } from "react-icons/io5";
// import Bathroom from "../../sidebar/Bathroom";
// import Bedroom from "../../sidebar/Bedroom";
// import ListingStatus from "../../sidebar/ListingStatus";
// import MoreFilters from "../../sidebar/MoreFilters";
// import PriceRange from "../../sidebar/PriceRange";
// import PropertyType from "../../sidebar/PropertyType";

// const dummyLocations = [
//   "Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Umm Al Quwain", "Ajman",
//   "Dubai Marina", "Downtown Dubai", "Dubai Land Residence Complex", "Dubai South",
//   "Dubailand", "Dubai Hills Estate", "Business Bay", "Jumeirah Lake Towers", "Palm Jumeirah"
// ];

// const TopFilterBar2 = ({ filterFunctions, handleFilterChange }) => {
//   const [showDropdown, setShowDropdown] = useState(null);
//   const [pendingFilters, setPendingFilters] = useState({});
//   const router = useRouter();

//   // Location handling
//   const [query, setQuery] = useState("");
//   const [filtered, setFiltered] = useState([]);
//   const [showInputDropdown, setShowInputDropdown] = useState(false);
//   const [selectedTag, setSelectedTag] = useState(
//     filterFunctions.location && filterFunctions.location !== 'uae' ? filterFunctions.location : null
//   );

//   const inputRef = useRef(null);
//   const dropdownRefs = useRef({});

//   // Handle clicks outside dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isOutsideDropdowns = !Object.values(dropdownRefs.current).some(
//         (ref) => ref && ref.contains(event.target)
//       );

//       if (isOutsideDropdowns && showDropdown) {
//         setShowDropdown(null);
//       }

//       const isOutsideInputDropdown = inputRef.current &&
//         !inputRef.current.contains(event.target) &&
//         !event.target.closest('.location-dropdown-item');

//       if (isOutsideInputDropdown && showInputDropdown) {
//         setShowInputDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showDropdown, showInputDropdown]);

//   const toggleDropdown = (dropdownId) => {
//     setShowDropdown(prevDropdown => prevDropdown === dropdownId ? null : dropdownId);
//   };

//   // Handle filter changes with pending state
//   const handlePendingFilterChange = (filterType, value) => {
//     setPendingFilters(prev => ({
//       ...prev,
//       [filterType]: value
//     }));
//   };

//   const handleDoneClick = (dropdownId) => {
//     if (Object.keys(pendingFilters).length > 0) {
//       Object.entries(pendingFilters).forEach(([filterType, value]) => {
//         switch (filterType) {
//           case 'listingStatus':
//             filterFunctions?.handlelistingStatus?.(value);
//             break;
//           case 'propertyType':
//             filterFunctions?.handlepropertyTypes?.(value);
//             break;
//           case 'bedrooms':
//             filterFunctions?.handlebedrooms?.(value);
//             break;
//           case 'bathrooms':
//             filterFunctions?.handlebathrooms?.(value);
//             break;
//           case 'priceRange':
//             filterFunctions?.handlepriceRange?.(value);
//             break;
//           default:
//             break;
//         }

//         if (handleFilterChange) {
//           handleFilterChange(filterType, value);
//         }
//       });

//       setPendingFilters({});
//     }

//     setShowDropdown(null);
//   };

//   const handleCancelClick = () => {
//     setPendingFilters({});
//     setShowDropdown(null);
//   };

//   // Location handling functions
//   const handleInputChange = (e) => {
//     const input = e.target.value;
//     setQuery(input);
//     const matches = dummyLocations.filter((loc) =>
//       loc.toLowerCase().includes(input.toLowerCase())
//     );
//     setFiltered(matches);
//     setShowInputDropdown(true);
//   };

//   const handleSelect = (value) => {
//     setSelectedTag(value);
//     setQuery("");
//     setShowInputDropdown(false);

//     const formattedValue = value.toLowerCase().replace(/\s+/g, "-");

//     if (filterFunctions.handlelocation) {
//       filterFunctions.handlelocation(formattedValue);
//     }
//     if (handleFilterChange) {
//       handleFilterChange("location", formattedValue);
//     }

//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   };

//   const removeTag = () => {
//     setSelectedTag(null);
//     setQuery("");

//     if (filterFunctions.handlelocation) {
//       filterFunctions.handlelocation("uae");
//     }
//     if (handleFilterChange) {
//       handleFilterChange("location", "uae");
//     }
//   };

//   // Update selectedTag when filterFunctions.location changes
//   useEffect(() => {
//     if (filterFunctions.location && filterFunctions.location !== 'uae') {
//       const displayLocation = filterFunctions.location
//         .split('-')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//       setSelectedTag(displayLocation);
//     } else {
//       setSelectedTag(null);
//     }
//   }, [filterFunctions.location]);

//   // Common button styles with improved spacing
//   const getButtonClass = (isActive) => `
//     inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 whitespace-nowrap
//     ${isActive
//       ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm'
//       : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
//     }
//   `;

//   const getDisplayValue = (type) => {
//     switch (type) {
//       case 'purpose':
//         return pendingFilters.listingStatus || filterFunctions?.listingStatus || "Buy";
//       case 'propertyType':
//         return pendingFilters.propertyType || filterFunctions?.propertyTypes || "Properties";
//       case 'bedrooms':
//         const beds = pendingFilters.bedrooms !== undefined ? pendingFilters.bedrooms : filterFunctions?.bedrooms;
//         return beds > 0 ? `${beds} Bed${beds > 1 ? 's' : ''}` : 'Beds';
//       case 'bathrooms':
//         const baths = pendingFilters.bathrooms !== undefined ? pendingFilters.bathrooms : filterFunctions?.bathrooms;
//         return baths > 0 ? `${baths} Bath${baths > 1 ? 's' : ''}` : 'Baths';
//       default:
//         return '';
//     }
//   };

//   return (
//     <div className="w-100">
//       {/* Compact filter bar with better spacing */}
//       <div className="d-flex align-items-center gap-2 flex-wrap">

//         {/* Location Search - Improved design */}
//         <div className="position-relative" style={{ minWidth: '300px', flex: '1 1 auto', maxWidth: '400px' }}>
//           <div
//             className="d-flex align-items-center w-100 position-relative"
//             style={{
//               backgroundColor: '#ffffff',
//               border: '1px solid #e5e7eb',
//               borderRadius: '8px',
//               padding: '0 12px',
//               height: '40px',
//               transition: 'all 0.2s ease',
//               boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
//             }}
//           >
//             <i className="flaticon-maps me-2" style={{ fontSize: '16px', color: '#6b7280' }} />

//             <div className="d-flex align-items-center flex-grow-1 position-relative">
//               {selectedTag && (
//                 <span
//                   className="d-inline-flex align-items-center gap-1 px-2 py-1 me-2"
//                   style={{
//                     backgroundColor: '#ecfdf5',
//                     color: '#059669',
//                     fontSize: '12px',
//                     borderRadius: '6px',
//                     border: '1px solid #d1fae5',
//                     fontWeight: '500',
//                   }}
//                 >
//                   {selectedTag}
//                   <IoCloseOutline
//                     className="cursor-pointer"
//                     style={{ fontSize: '14px' }}
//                     onClick={removeTag}
//                   />
//                 </span>
//               )}

//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder={selectedTag ? "" : "City, Location"}
//                 value={query}
//                 onChange={handleInputChange}
//                 onFocus={() => {
//                   setFiltered(dummyLocations);
//                   setShowInputDropdown(true);
//                 }}
//                 style={{
//                   border: 'none',
//                   outline: 'none',
//                   background: 'transparent',
//                   fontSize: '14px',
//                   flex: '1',
//                   height: '100%',
//                   minWidth: selectedTag ? '60px' : 'auto',
//                 }}
//               />
//             </div>

//             {showInputDropdown && (
//               <div
//                 className="position-absolute bg-white border rounded-lg shadow-lg"
//                 style={{
//                   top: 'calc(100% + 4px)',
//                   left: '0',
//                   right: '0',
//                   zIndex: 1000,
//                   maxHeight: '240px',
//                   overflowY: 'auto',
//                   border: '1px solid #e5e7eb',
//                 }}
//               >
//                 {filtered.map((item, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleSelect(item)}
//                     className="w-100 text-start px-3 py-2 border-0 bg-white hover:bg-light location-dropdown-item"
//                     style={{
//                       fontSize: '14px',
//                       borderBottom: index < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
//                     }}
//                   >
//                     {item}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Purpose Filter */}
//         <div className="position-relative" ref={el => dropdownRefs.current.purpose = el}>
//           <button
//             onClick={() => toggleDropdown('purpose')}
//             className={getButtonClass(filterFunctions?.listingStatus && filterFunctions.listingStatus !== 'Buy')}
//           >
//             {getDisplayValue('purpose')}
//             <i className="fa fa-angle-down" style={{ fontSize: '12px' }} />
//           </button>

//           {showDropdown === 'purpose' && (
//             <div
//               className="position-absolute bg-white border rounded-lg shadow-lg"
//               style={{ top: 'calc(100% + 4px)', left: '0', zIndex: 1000, minWidth: '160px' }}
//             >
//               <div className="p-3">
//                 <h6 className="mb-2 fw-semibold" style={{ fontSize: '14px', color: '#374151' }}>
//                   Listing Status
//                 </h6>
//                 <ListingStatus
//                   filterFunctions={{
//                     ...filterFunctions,
//                     listingStatus: pendingFilters.listingStatus || filterFunctions?.listingStatus
//                   }}
//                   handleFilterChange={handlePendingFilterChange}
//                 />
//                 <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
//                   <button
//                     onClick={handleCancelClick}
//                     className="btn btn-sm"
//                     style={{ color: '#6b7280', fontSize: '13px' }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleDoneClick('purpose')}
//                     className="btn btn-sm"
//                     style={{
//                       backgroundColor: '#0d9488',
//                       color: 'white',
//                       fontSize: '13px',
//                       borderRadius: '6px',
//                       padding: '4px 12px'
//                     }}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Property Type Filter */}
//         <div className="position-relative" ref={el => dropdownRefs.current.propertyType = el}>
//           <button
//             onClick={() => toggleDropdown('propertyType')}
//             className={getButtonClass(filterFunctions?.propertyTypes && filterFunctions.propertyTypes !== 'properties')}
//           >
//             {getDisplayValue('propertyType')}
//             <i className="fa fa-angle-down" style={{ fontSize: '12px' }} />
//           </button>

//           {showDropdown === 'propertyType' && (
//             <div
//               className="position-absolute bg-white border rounded-lg shadow-lg"
//               style={{ top: 'calc(100% + 4px)', left: '0', zIndex: 1000, minWidth: '180px' }}
//             >
//               <div className="p-3">
//                 <h6 className="mb-2 fw-semibold" style={{ fontSize: '14px', color: '#374151' }}>
//                   Property Type
//                 </h6>
//                 <PropertyType
//                   filterFunctions={{
//                     ...filterFunctions,
//                     propertyTypes: pendingFilters.propertyType || filterFunctions?.propertyTypes
//                   }}
//                   handleFilterChange={handlePendingFilterChange}
//                 />
//                 <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
//                   <button
//                     onClick={handleCancelClick}
//                     className="btn btn-sm"
//                     style={{ color: '#6b7280', fontSize: '13px' }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleDoneClick('propertyType')}
//                     className="btn btn-sm"
//                     style={{
//                       backgroundColor: '#0d9488',
//                       color: 'white',
//                       fontSize: '13px',
//                       borderRadius: '6px',
//                       padding: '4px 12px'
//                     }}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Price Range Filter */}
//         <div className="position-relative" ref={el => dropdownRefs.current.price = el}>
//           <button
//             onClick={() => toggleDropdown('price')}
//             className={getButtonClass(filterFunctions?.priceRange && (filterFunctions.priceRange[0] > 0 || filterFunctions.priceRange[1] < 1000000000))}
//           >
//             Price (AED)
//             <i className="fa fa-angle-down" style={{ fontSize: '12px' }} />
//           </button>

//           {showDropdown === 'price' && (
//             <div
//               className="position-absolute bg-white border rounded-lg shadow-lg"
//               style={{ top: 'calc(100% + 4px)', left: '0', zIndex: 1000, minWidth: '300px' }}
//             >
//               <div className="p-3">
//                 <h6 className="mb-3 fw-semibold" style={{ fontSize: '14px', color: '#374151' }}>
//                   Price Range (AED)
//                 </h6>
//                 <PriceRange
//                   filterFunctions={{
//                     ...filterFunctions,
//                     priceRange: [
//                       pendingFilters.min_price ? parseInt(pendingFilters.min_price) : (filterFunctions?.priceRange?.[0] || 0),
//                       pendingFilters.max_price ? parseInt(pendingFilters.max_price) : (filterFunctions?.priceRange?.[1] || 1000000000)
//                     ]
//                   }}
//                   handleFilterChange={handlePendingFilterChange}
//                 />
//                 <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
//                   <button
//                     onClick={handleCancelClick}
//                     className="btn btn-sm"
//                     style={{ color: '#6b7280', fontSize: '13px' }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleDoneClick('price')}
//                     className="btn btn-sm"
//                     style={{
//                       backgroundColor: '#0d9488',
//                       color: 'white',
//                       fontSize: '13px',
//                       borderRadius: '6px',
//                       padding: '4px 12px'
//                     }}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Beds & Baths Combined Filter */}
//         <div className="position-relative" ref={el => dropdownRefs.current.bedsBaths = el}>
//           <button
//             onClick={() => toggleDropdown('bedsBaths')}
//             className={getButtonClass((filterFunctions?.bedrooms && filterFunctions.bedrooms > 0) || (filterFunctions?.bathrooms && filterFunctions.bathrooms > 0))}
//           >
//             {getDisplayValue('bedrooms')} / {getDisplayValue('bathrooms')}
//             <i className="fa fa-angle-down" style={{ fontSize: '12px' }} />
//           </button>

//           {showDropdown === 'bedsBaths' && (
//             <div
//               className="position-absolute bg-white border rounded-lg shadow-lg"
//               style={{ top: 'calc(100% + 4px)', left: '0', zIndex: 1000, minWidth: '240px' }}
//             >
//               <div className="p-3">
//                 <div className="mb-3">
//                   <h6 className="mb-2 fw-semibold" style={{ fontSize: '14px', color: '#374151' }}>
//                     Bedrooms
//                   </h6>
//                   <Bedroom
//                     filterFunctions={{
//                       ...filterFunctions,
//                       bedrooms: pendingFilters.bedrooms !== undefined ? pendingFilters.bedrooms : filterFunctions?.bedrooms
//                     }}
//                     handleFilterChange={handlePendingFilterChange}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <h6 className="mb-2 fw-semibold" style={{ fontSize: '14px', color: '#374151' }}>
//                     Bathrooms
//                   </h6>
//                   <Bathroom
//                     filterFunctions={{
//                       ...filterFunctions,
//                       bathrooms: pendingFilters.bathrooms !== undefined ? pendingFilters.bathrooms : filterFunctions?.bathrooms
//                     }}
//                     handleFilterChange={handlePendingFilterChange}
//                   />
//                 </div>

//                 <div className="d-flex justify-content-between pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
//                   <button
//                     onClick={handleCancelClick}
//                     className="btn btn-sm"
//                     style={{ color: '#6b7280', fontSize: '13px' }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleDoneClick('bedsBaths')}
//                     className="btn btn-sm"
//                     style={{
//                       backgroundColor: '#0d9488',
//                       color: 'white',
//                       fontSize: '13px',
//                       borderRadius: '6px',
//                       padding: '4px 12px'
//                     }}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* More Filters */}
//         <div className="position-relative" ref={el => dropdownRefs.current.moreFilters = el}>
//           <button
//             onClick={() => toggleDropdown('moreFilters')}
//             className={getButtonClass(false)}
//           >
//             <i className="flaticon-settings me-1" style={{ fontSize: '14px' }} />
//             More Filters
//           </button>

//           {showDropdown === 'moreFilters' && (
//             <div
//               className="position-absolute bg-white border rounded-lg shadow-lg"
//               style={{ top: 'calc(100% + 4px)', left: '0', zIndex: 1000, minWidth: '320px' }}
//             >
//               <div className="p-3">
//                 <MoreFilters
//                   filterFunctions={{
//                     ...filterFunctions,
//                     squirefeet: [
//                       pendingFilters.min_feet ? parseInt(pendingFilters.min_feet) : (filterFunctions?.squirefeet?.[0] || 20),
//                       pendingFilters.max_feet ? parseInt(pendingFilters.max_feet) : (filterFunctions?.squirefeet?.[1] || 70987)
//                     ],
//                     yearBuild: [
//                       pendingFilters.min_year ? parseInt(pendingFilters.min_year) : (filterFunctions?.yearBuild?.[0] || 1800),
//                       pendingFilters.max_year ? parseInt(pendingFilters.max_year) : (filterFunctions?.yearBuild?.[1] || 2050)
//                     ],
//                     searchQuery: pendingFilters.searchQuery || filterFunctions?.searchQuery || ""
//                   }}
//                   handleFilterChange={handlePendingFilterChange}
//                 />
//                 <div className="d-flex justify-content-between mt-3 pt-2" style={{ borderTop: '1px solid #f3f4f6' }}>
//                   <button
//                     onClick={handleCancelClick}
//                     className="btn btn-sm"
//                     style={{ color: '#6b7280', fontSize: '13px' }}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleDoneClick('moreFilters')}
//                     className="btn btn-sm"
//                     style={{
//                       backgroundColor: '#0d9488',
//                       color: 'white',
//                       fontSize: '13px',
//                       borderRadius: '6px',
//                       padding: '4px 12px'
//                     }}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Action Buttons - Moved to end */}
//         <div className="d-flex align-items-center gap-2 ms-auto">
//           {/* Clear Search Button */}
//           {(selectedTag || Object.keys(pendingFilters).length > 0) && (
//             <button
//               onClick={() => {
//                 filterFunctions?.resetFilter?.();
//                 setPendingFilters({});
//                 setSelectedTag(null);
//                 setQuery("");
//               }}
//               className="d-flex align-items-center gap-1 px-3 py-2 text-decoration-none"
//               style={{
//                 color: '#6b7280',
//                 fontSize: '13px',
//                 border: 'none',
//                 background: 'none',
//                 borderRadius: '6px',
//                 transition: 'all 0.2s ease',
//               }}
//               onMouseOver={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f3f4f6';
//                 e.currentTarget.style.color = '#374151';
//               }}
//               onMouseOut={(e) => {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = '#6b7280';
//               }}
//             >
//               <i className="fa fa-times-circle" style={{ fontSize: '14px' }} />
//               Clear
//             </button>
//           )}

//           {/* Save Search Button */}
//           <button
//             className="d-flex align-items-center gap-1 px-3 py-2 text-decoration-none"
//             style={{
//               color: '#0d9488',
//               fontSize: '13px',
//               fontWeight: '500',
//               border: 'none',
//               background: 'none',
//               borderRadius: '6px',
//               transition: 'all 0.2s ease',
//             }}
//             onMouseOver={(e) => {
//               e.currentTarget.style.backgroundColor = '#ecfdf5';
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.backgroundColor = 'transparent';
//             }}
//           >
//             <i className="fa fa-bookmark-o" style={{ fontSize: '14px' }} />
//             Save Search
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopFilterBar2;

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import Bathroom from "../../sidebar/Bathroom";
import Bedroom from "../../sidebar/Bedroom";
import ListingStatus from "../../sidebar/ListingStatus";
import MoreFilters from "../../sidebar/MoreFilters";
import PriceRange from "../../sidebar/PriceRange";
import PropertyType from "../../sidebar/PropertyType";

const dummyLocations = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "Ajman",
  "Dubai Marina",
  "Downtown Dubai",
  "Dubai Land Residence Complex",
  "Dubai South",
  "Dubailand",
  "Dubai Hills Estate",
  "Business Bay",
  "Jumeirah Lake Towers",
  "Palm Jumeirah",
];

const TopFilterBar2 = ({
  filterFunctions,
  handleFilterChange,
  showClearSearch,
  handleSaveSearchClick,
  handleClearSearch,
}) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [pendingFilters, setPendingFilters] = useState({});
  const router = useRouter();

  // Debug pendingFilters changes
  useEffect(() => {
    console.log("📊 pendingFilters changed:", pendingFilters);
  }, [pendingFilters]);

  // Location handling
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showInputDropdown, setShowInputDropdown] = useState(false);
  const [selectedTag, setSelectedTag] = useState(
    filterFunctions?.location && filterFunctions.location !== "uae"
      ? filterFunctions.location
      : null
  );

  const inputRef = useRef(null);
  const dropdownRefs = useRef({});

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdowns = !Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );

      if (isOutsideDropdowns && showDropdown) {
        setShowDropdown(null);
      }

      const isOutsideInputDropdown =
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !event.target.closest(".location-dropdown-item");

      if (isOutsideInputDropdown && showInputDropdown) {
        setShowInputDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showInputDropdown]);

  const toggleDropdown = (dropdownId) => {
    setShowDropdown((prevDropdown) =>
      prevDropdown === dropdownId ? null : dropdownId
    );
  };

  // Handle filter changes with pending state
  const handlePendingFilterChange = (filterType, value) => {
    console.log("🔄 handlePendingFilterChange called:", { filterType, value });
    setPendingFilters((prev) => {
      const newFilters = {
        ...prev,
        [filterType]: value,
      };
      console.log("🔄 Updated pendingFilters:", newFilters);
      return newFilters;
    });
  };

  const handleDoneClick = (dropdownId) => {
    if (Object.keys(pendingFilters).length > 0) {
      Object.entries(pendingFilters).forEach(([filterType, value]) => {
        switch (filterType) {
          case "listingStatus":
            filterFunctions?.handlelistingStatus?.(value);
            break;
          case "propertyType":
            filterFunctions?.handlepropertyTypes?.(value);
            break;
          case "bedrooms":
            filterFunctions?.handlebedrooms?.(value);
            break;
          case "bathrooms":
            filterFunctions?.handlebathrooms?.(value);
            break;
          case "priceRange":
            filterFunctions?.handlepriceRange?.(value);
            break;
          default:
            break;
        }

        if (handleFilterChange) {
          handleFilterChange(filterType, value);
        }
      });

      setPendingFilters({});
    }

    setShowDropdown(null);
  };

  const handleCancelClick = () => {
    setPendingFilters({});
    setShowDropdown(null);
  };

  // Location handling functions
  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    const matches = dummyLocations.filter((loc) =>
      loc.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(matches);
    setShowInputDropdown(true);
  };

  const handleSelect = (value) => {
    setSelectedTag(value);
    setQuery("");
    setShowInputDropdown(false);

    const formattedValue = value.toLowerCase().replace(/\s+/g, "-");

    if (filterFunctions?.handlelocation) {
      filterFunctions.handlelocation(formattedValue);
    }
    if (handleFilterChange) {
      handleFilterChange("location", formattedValue);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeTag = () => {
    setSelectedTag(null);
    setQuery("");

    if (filterFunctions?.handlelocation) {
      filterFunctions.handlelocation("uae");
    }
    if (handleFilterChange) {
      handleFilterChange("location", "uae");
    }
  };

  // Update selectedTag when filterFunctions.location changes
  useEffect(() => {
    if (filterFunctions?.location && filterFunctions.location !== "uae") {
      const displayLocation = filterFunctions.location
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setSelectedTag(displayLocation);
    } else {
      setSelectedTag(null);
    }
  }, [filterFunctions?.location]);

  // Common button styles with improved spacing
  const getButtonClass = (isActive) => `
    inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 whitespace-nowrap
    ${
      isActive
        ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm"
        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
    }
  `;

  const getDisplayValue = (type) => {
    switch (type) {
      case "purpose":
        const displayValue = pendingFilters.listingStatus ||
          filterFunctions?.listingStatus ||
          "Buy";
        console.log("🎯 getDisplayValue for purpose:", {
          pendingFilters: pendingFilters.listingStatus,
          filterFunctions: filterFunctions?.listingStatus,
          displayValue
        });
        return displayValue;
      case "propertyType":
        return (
          pendingFilters.propertyType ||
          filterFunctions?.propertyTypes ||
          "Properties"
        );
      case "bedrooms":
        const beds =
          pendingFilters.bedrooms !== undefined
            ? pendingFilters.bedrooms
            : filterFunctions?.bedrooms;
        return beds > 0 ? `${beds} Bed${beds > 1 ? "s" : ""}` : "Beds";
      case "bathrooms":
        const baths =
          pendingFilters.bathrooms !== undefined
            ? pendingFilters.bathrooms
            : filterFunctions?.bathrooms;
        return baths > 0 ? `${baths} Bath${baths > 1 ? "s" : ""}` : "Baths";
      default:
        return "";
    }
  };

  return (
    <div className="w-100">
      {/* Compact filter bar with better spacing */}
      <div className="d-flex align-items-center gap-2 flex-nowrap">
        {/* Location Search - Improved design */}
        <div
          className="position-relative"
          style={{ minWidth: "300px", flex: "1 1 auto", maxWidth: "400px" }}
        >
          <div
            className="d-flex align-items-center w-100 position-relative"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "0 12px",
              height: "40px",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <i
              className="flaticon-maps me-2"
              style={{ fontSize: "16px", color: "#6b7280" }}
            />

            <div className="d-flex align-items-center flex-grow-1 position-relative">
              {selectedTag && (
                <span
                  className="d-inline-flex align-items-center gap-1 px-2 py-1 me-2"
                  style={{
                    backgroundColor: "#ecfdf5",
                    color: "#059669",
                    fontSize: "12px",
                    borderRadius: "6px",
                    border: "1px solid #d1fae5",
                    fontWeight: "500",
                  }}
                >
                  {selectedTag}
                  <IoCloseOutline
                    className="cursor-pointer"
                    style={{ fontSize: "14px" }}
                    onClick={removeTag}
                  />
                </span>
              )}

              <input
                ref={inputRef}
                type="text"
                placeholder={selectedTag ? "" : "City, Location"}
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                  setFiltered(dummyLocations);
                  setShowInputDropdown(true);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "14px",
                  flex: "1",
                  height: "100%",
                  minWidth: selectedTag ? "60px" : "auto",
                }}
              />
            </div>

            {showInputDropdown && (
              <div
                className="position-absolute bg-white border rounded-lg shadow-lg"
                style={{
                  top: "calc(100% + 4px)",
                  left: "0",
                  right: "0",
                  zIndex: 1000,
                  maxHeight: "240px",
                  overflowY: "auto",
                  border: "1px solid #e5e7eb",
                }}
              >
                {filtered.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="w-100 text-start px-3 py-2 border-0 bg-white hover:bg-light location-dropdown-item"
                    style={{
                      fontSize: "14px",
                      borderBottom:
                        index < filtered.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Purpose Filter */}
        <div
          className="position-relative"
          ref={(el) => (dropdownRefs.current.purpose = el)}
        >
          <button
            key={`purpose-${pendingFilters.listingStatus || filterFunctions?.listingStatus || 'default'}`}
            onClick={() => toggleDropdown("purpose")}
            className={getButtonClass(
              (pendingFilters.listingStatus && pendingFilters.listingStatus !== "Buy") ||
              (filterFunctions?.listingStatus && filterFunctions.listingStatus !== "Buy")
            )}
          >
            {getDisplayValue("purpose")}
            <i className="fa fa-angle-down" style={{ fontSize: "12px" }} />
          </button>

          {showDropdown === "purpose" && (
            <div
              className="position-absolute bg-white border rounded-lg shadow-lg"
              style={{
                top: "calc(100% + 4px)",
                left: "0",
                zIndex: 1000,
                minWidth: "160px",
              }}
            >
              <div className="p-3">
                <h6
                  className="mb-2 fw-semibold"
                  style={{ fontSize: "14px", color: "#374151" }}
                >
                  Listing Status
                </h6>
                <ListingStatus
                  filterFunctions={{
                    ...filterFunctions,
                    listingStatus:
                      pendingFilters.listingStatus ||
                      filterFunctions?.listingStatus,
                  }}
                  handleFilterChange={handlePendingFilterChange}
                />
                <div
                  className="d-flex justify-content-between mt-3 pt-2"
                  style={{ borderTop: "1px solid #f3f4f6" }}
                >
                  <button
                    onClick={handleCancelClick}
                    className="btn btn-sm"
                    style={{ color: "#6b7280", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDoneClick("purpose")}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#0d9488",
                      color: "white",
                      fontSize: "13px",
                      borderRadius: "6px",
                      padding: "4px 12px",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Property Type Filter */}
        <div
          className="position-relative"
          ref={(el) => (dropdownRefs.current.propertyType = el)}
        >
          <button
            onClick={() => toggleDropdown("propertyType")}
            className={getButtonClass(
              filterFunctions?.propertyTypes &&
                filterFunctions.propertyTypes !== "properties"
            )}
          >
            {getDisplayValue("propertyType")}
            <i className="fa fa-angle-down" style={{ fontSize: "12px" }} />
          </button>

          {showDropdown === "propertyType" && (
            <div
              className="position-absolute bg-white border rounded-lg shadow-lg"
              style={{
                top: "calc(100% + 4px)",
                left: "0",
                zIndex: 1000,
                minWidth: "180px",
              }}
            >
              <div className="p-3">
                <h6
                  className="mb-2 fw-semibold"
                  style={{ fontSize: "14px", color: "#374151" }}
                >
                  Property Type
                </h6>
                <PropertyType
                  filterFunctions={{
                    ...filterFunctions,
                    propertyTypes:
                      pendingFilters.propertyType ||
                      filterFunctions?.propertyTypes,
                  }}
                  handleFilterChange={handlePendingFilterChange}
                />
                <div
                  className="d-flex justify-content-between mt-3 pt-2"
                  style={{ borderTop: "1px solid #f3f4f6" }}
                >
                  <button
                    onClick={handleCancelClick}
                    className="btn btn-sm"
                    style={{ color: "#6b7280", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDoneClick("propertyType")}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#0d9488",
                      color: "white",
                      fontSize: "13px",
                      borderRadius: "6px",
                      padding: "4px 12px",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div
          className="position-relative"
          ref={(el) => (dropdownRefs.current.price = el)}
        >
          <button
            onClick={() => toggleDropdown("price")}
            className={getButtonClass(
              filterFunctions?.priceRange &&
                (filterFunctions.priceRange[0] > 0 ||
                  filterFunctions.priceRange[1] < 1000000000)
            )}
          >
            Price (AED)
            <i className="fa fa-angle-down" style={{ fontSize: "12px" }} />
          </button>

          {showDropdown === "price" && (
            <div
              className="position-absolute bg-white border rounded-lg shadow-lg"
              style={{
                top: "calc(100% + 4px)",
                left: "0",
                zIndex: 1000,
                minWidth: "300px",
              }}
            >
              <div className="p-3">
                <h6
                  className="mb-3 fw-semibold"
                  style={{ fontSize: "14px", color: "#374151" }}
                >
                  Price Range (AED)
                </h6>
                <PriceRange
                  filterFunctions={{
                    ...filterFunctions,
                    priceRange: [
                      pendingFilters.min_price
                        ? parseInt(pendingFilters.min_price)
                        : filterFunctions?.priceRange?.[0] || 0,
                      pendingFilters.max_price
                        ? parseInt(pendingFilters.max_price)
                        : filterFunctions?.priceRange?.[1] || 1000000000,
                    ],
                  }}
                  handleFilterChange={handlePendingFilterChange}
                />
                <div
                  className="d-flex justify-content-between mt-3 pt-2"
                  style={{ borderTop: "1px solid #f3f4f6" }}
                >
                  <button
                    onClick={handleCancelClick}
                    className="btn btn-sm"
                    style={{ color: "#6b7280", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDoneClick("price")}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#0d9488",
                      color: "white",
                      fontSize: "13px",
                      borderRadius: "6px",
                      padding: "4px 12px",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Beds & Baths Combined Filter */}
        <div
          className="position-relative"
          ref={(el) => (dropdownRefs.current.bedsBaths = el)}
        >
          <button
            onClick={() => toggleDropdown("bedsBaths")}
            className={getButtonClass(
              (filterFunctions?.bedrooms && filterFunctions.bedrooms > 0) ||
                (filterFunctions?.bathrooms && filterFunctions.bathrooms > 0)
            )}
          >
            {getDisplayValue("bedrooms")} / {getDisplayValue("bathrooms")}
            <i className="fa fa-angle-down" style={{ fontSize: "12px" }} />
          </button>

          {showDropdown === "bedsBaths" && (
            <div
              className="position-absolute bg-white border rounded-lg shadow-lg"
              style={{
                top: "calc(100% + 4px)",
                left: "0",
                zIndex: 1000,
                minWidth: "240px",
              }}
            >
              <div className="p-3">
                <div className="mb-3">
                  <h6
                    className="mb-2 fw-semibold"
                    style={{ fontSize: "14px", color: "#374151" }}
                  >
                    Bedrooms
                  </h6>
                  <Bedroom
                    filterFunctions={{
                      ...filterFunctions,
                      bedrooms:
                        pendingFilters.bedrooms !== undefined
                          ? pendingFilters.bedrooms
                          : filterFunctions?.bedrooms,
                    }}
                    handleFilterChange={handlePendingFilterChange}
                  />
                </div>

                <div className="mb-3">
                  <h6
                    className="mb-2 fw-semibold"
                    style={{ fontSize: "14px", color: "#374151" }}
                  >
                    Bathrooms
                  </h6>
                  <Bathroom
                    filterFunctions={{
                      ...filterFunctions,
                      bathrooms:
                        pendingFilters.bathrooms !== undefined
                          ? pendingFilters.bathrooms
                          : filterFunctions?.bathrooms,
                    }}
                    handleFilterChange={handlePendingFilterChange}
                  />
                </div>

                <div
                  className="d-flex justify-content-between pt-2"
                  style={{ borderTop: "1px solid #f3f4f6" }}
                >
                  <button
                    onClick={handleCancelClick}
                    className="btn btn-sm"
                    style={{ color: "#6b7280", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDoneClick("bedsBaths")}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#0d9488",
                      color: "white",
                      fontSize: "13px",
                      borderRadius: "6px",
                      padding: "4px 12px",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Section - Moved from Commercial component */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* Save Search Button */}
          <button
            className="d-flex align-items-center gap-2"
            onClick={handleSaveSearchClick}
            style={{
              color: "#0a644a",
              fontWeight: "500",
              fontSize: "14px",
              border: "none",
              background: "none",
              // padding: "3px 8px",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#f0f0f0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <i className="fa fa-bookmark-o" style={{ fontSize: "10px" }}></i>
            Save
          </button>

          {/* Clear Search Button */}
          {showClearSearch && (
            <button
              className="d-flex align-items-center gap-2"
              onClick={handleClearSearch}
              style={{
                color: "#0a644a",
                fontWeight: "500",
                fontSize: "14px",
                border: "none",
                background: "none",
                padding: "3px 8px",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <i
                className="fa fa-times-circle"
                style={{ fontSize: "16px" }}
              ></i>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopFilterBar2;
