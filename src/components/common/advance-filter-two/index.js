// "use client";
// import dynamic from "next/dynamic";

// const Select = dynamic(() => import("react-select"), { ssr: false });

// import PriceRange from "./PriceRange";
// import Bedroom from "./Bedroom";
// import Bathroom from "./Bathroom";
// import Amenities from "./Amenities";
// import { useRef } from "react";

// const AdvanceFilterModal = ({ filterFunctions }) => {

//   const minFeetRef = useRef(null);
//   const maxFeetRef = useRef(null);

//   const handleMinChange = (e) => {
//     const minValue = e.target.value;
//     const maxValue = maxFeetRef.current?.value || 0;
//     filterFunctions?.handlesquirefeet([minValue, maxValue]);
//   };

//   const handleMaxChange = (e) => {
//     const maxValue = e.target.value;
//     const minValue = minFeetRef.current?.value || 0;
//     filterFunctions?.handlesquirefeet([minValue, maxValue]);
//   };

//   const catOptions = [
//     { value: "Houses", label: "Houses" },
//     { value: "Office", label: "Office" },
//     { value: "Apartments", label: "Apartments" },
//     { value: "Villa", label: "Villa" },
//   ];

//   const locationOptions = [
//     { value: "All Cities", label: "All Cities" },
//     { value: "California", label: "California" },
//     { value: "Los Angeles", label: "Los Angeles" },
//     { value: "New Jersey", label: "New Jersey" },
//     { value: "New York", label: "New York" },
//     { value: "San Diego", label: "San Diego" },
//     { value: "San Francisco", label: "San Francisco" },
//     { value: "Texas", label: "Texas" },
//   ];

//   const customStyles = {
//     option: (styles, { isFocused, isSelected, isHovered }) => {
//       return {
//         ...styles,
//         backgroundColor: isSelected
//           ? "#eb6753"
//           : isHovered
//           ? "#eb675312"
//           : isFocused
//           ? "#eb675312"
//           : undefined,
//       };
//     },
//   };

//   return (
//     <div className="modal-dialog modal-dialog-centered modal-lg">
//       <div className="modal-content">
//         <div className="modal-header pl30 pr30">
//           <h5 className="modal-title" id="exampleModalLabel">
//             More Filter
//           </h5>
//           <button
//             type="button"
//             className="btn-close"
//             data-bs-dismiss="modal"
//             aria-label="Close"
//           />
//         </div>
//         {/* End modal-header */}

//         <div className="modal-body pb-0">
//           <div className="row">
//             <div className="col-lg-12">
//               <div className="widget-wrapper">
//                 <h6 className="list-title mb20">Price Range</h6>
//                 <div className="range-slider-style modal-version">
//                   <PriceRange filterFunctions={filterFunctions} />
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* End .row */}

//           <div className="row">
//             <div className="col-sm-6">
//               <div className="widget-wrapper">
//                 <h6 className="list-title">Type</h6>
//                 <div className="form-style2 input-group">
//                   <Select
//                     key={Date.now()}
//                     defaultValue={[catOptions[1]]}
//                     name="colors"
//                     options={catOptions}
//                     styles={customStyles}
//                     onChange={(e) =>
//                       filterFunctions?.setPropertyTypes([e.value])
//                     }
//                     className="select-custom"
//                     classNamePrefix="select"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* End .col-6 */}

//             <div className="col-sm-6">
//               <div className="widget-wrapper">
//                 <h6 className="list-title">Property ID</h6>
//                 <div className="form-style2">
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="RT04949213"
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* End .col-6 */}
//           </div>
//           {/* End .row */}

//           <div className="row">
//             <div className="col-sm-6">
//               <div className="widget-wrapper">
//                 <h6 className="list-title">Bedrooms</h6>
//                 <div className="d-flex">
//                   <Bedroom filterFunctions={filterFunctions} />
//                 </div>
//               </div>
//             </div>
//             {/* End .col-md-6 */}

//             <div className="col-sm-6">
//               <div className="widget-wrapper">
//                 <h6 className="list-title">Bathrooms</h6>
//                 <div className="d-flex">
//                   <Bathroom filterFunctions={filterFunctions} />
//                 </div>
//               </div>
//             </div>
//             {/* End .col-md-6 */}
//           </div>
//           {/* End .row */}

//           <div className="row">
//             <div className="col-sm-6">
//               <div className="widget-wrapper">
//                 <h6 className="list-title">Location</h6>
//                 <div className="form-style2 input-group">
//                   <Select
//                     key={Date.now()}
//                     defaultValue={[locationOptions[0]]}
//                     name="colors"
//                     styles={customStyles}
//                     options={locationOptions}
//                     className="select-custom filterSelect"
//                     value={{
//                       value: filterFunctions?.location,
//                       label: filterFunctions?.location,
//                     }}
//                     classNamePrefix="select"
//                     onChange={(e) => filterFunctions?.handlelocation(e.value)}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* End .col-md-6 */}

//             <div className="col-sm-6">
//               <div className="widget-wrapper">
//                 <h6 className="list-title">Square Feet</h6>
//                 <div className="space-area">
//                   <div className="d-flex align-items-center justify-content-between">
//                     <div className="form-style1">
//                       <input
//                         type="number"
//                         className="form-control filterInput"
//                         ref={minFeetRef}
//                         // onChange={(e) =>
//                         //   filterFunctions?.handlesquirefeet([
//                         //     e.target.value,
//                         //     document.getElementById("maxFeet3").value / 1,
//                         //   ])
//                         // }
//                         onChange={handleMinChange}
//                         placeholder="Min."
//                         id="minFeet3"
//                       />
//                     </div>
//                     <span className="dark-color">-</span>
//                     <div className="form-style1">
//                       <input
//                         type="number"
//                         className="form-control filterInput"
//                         ref={maxFeetRef}
//                         placeholder="Max"
//                         id="maxFeet3"
//                         // onChange={(e) =>
//                         //   filterFunctions?.handlesquirefeet([
//                         //     document.getElementById("minFeet3").value / 1,
//                         //     e.target.value,
//                         //   ])
//                         // }
//                         onChange={handleMaxChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* End .col-md-6 */}
//           </div>
//           {/* End .row */}

//           <div className="row">
//             <div className="col-lg-12">
//               <div className="widget-wrapper mb0">
//                 <h6 className="list-title mb10">Amenities</h6>
//               </div>
//             </div>
//             <Amenities filterFunctions={filterFunctions} />
//           </div>
//         </div>
//         {/* End modal body */}

//         <div className="modal-footer justify-content-between">
//           <button
//             className="reset-button"
//             onClick={() => filterFunctions?.resetFilter()}
//           >
//             <span className="flaticon-turn-back" />
//             <u>Reset all filters</u>
//           </button>
//           <div className="btn-area">
//             <button type="submit" className="ud-btn btn-thm">
//               <span className="flaticon-search align-text-top pr10" />
//               Search
//             </button>
//           </div>
//         </div>
//         {/* End modal-footer */}
//       </div>
//     </div>
//   );
// };

// export default AdvanceFilterModal;
"use client";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useRef } from "react";

const AdvanceFilterModal = ({ filterFunctions }) => {
  const minFeetRef = useRef(null);
  const maxFeetRef = useRef(null);

  const handleMinChange = (e) => {
    const minValue = e.target.value;
    const maxValue = maxFeetRef.current?.value || 0;
    filterFunctions?.handlesquirefeet([minValue, maxValue]);
  };

  const handleMaxChange = (e) => {
    const maxValue = e.target.value;
    const minValue = minFeetRef.current?.value || 0;
    filterFunctions?.handlesquirefeet([minValue, maxValue]);
  };

  // Updated category options for Residential/Commercial
  const categoryOptions = [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
  ];

  // Property type options - dynamically based on category
  const getPropertyTypeOptions = (category) => {
    if (category === 'residential') {
      return [
        { value: "All", label: "All Residential" },
        { value: "Apartment", label: "Apartment" },
        { value: "Villa", label: "Villa" },
        { value: "Townhouse", label: "Townhouse" },
        { value: "Penthouse", label: "Penthouse" },
        { value: "Villa-Compound", label: "Villa Compound" },
        { value: "Hotel-Apartment", label: "Hotel Apartment" },
      ];
    } else {
      return [
        { value: "All", label: "All Commercial" },
        { value: "Office", label: "Office" },
        { value: "Retail", label: "Retail" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Land", label: "Land" },
        { value: "Building", label: "Building" },
        { value: "Floor", label: "Floor" },
      ];
    }
  };

  // Updated property types to match your data structure
  const catOptions = getPropertyTypeOptions(filterFunctions?.propertyCategory || 'residential');

  // Updated location options to match UAE locations
  const locationOptions = [
    { value: "uae", label: "All Cities" },
    { value: "dubai", label: "Dubai" },
    { value: "abu-dhabi", label: "Abu Dhabi" },
    { value: "sharjah", label: "Sharjah" },
    { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
    { value: "umm-al-quwain", label: "Umm Al Quwain" },
    { value: "ajman", label: "Ajman" },
    { value: "dubai-marina", label: "Dubai Marina" },
    { value: "downtown-dubai", label: "Downtown Dubai" },
    { value: "business-bay", label: "Business Bay" },
    { value: "jumeirah-lake-towers", label: "Jumeirah Lake Towers" },
    { value: "palm-jumeirah", label: "Palm Jumeirah" },
  ];

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => {
      return {
        ...styles,
        backgroundColor: isSelected
          ? "#eb6753"
          : isHovered
          ? "#eb675312"
          : isFocused
          ? "#eb675312"
          : undefined,
      };
    },
  };

  // Get current selected values for the selects
  const getCurrentPropertyType = () => {
    const currentType = filterFunctions?.propertyTypes;
    if (!currentType || currentType === "properties" || currentType === "All") {
      return catOptions[0]; // All Properties
    }
    return (
      catOptions.find(
        (option) => option.value.toLowerCase() === currentType.toLowerCase()
      ) || catOptions[0]
    );
  };

  const getCurrentLocation = () => {
    const currentLocation = filterFunctions?.location;
    if (!currentLocation || currentLocation === "uae") {
      return locationOptions[0]; // All Cities
    }
    return (
      locationOptions.find((option) => option.value === currentLocation) ||
      locationOptions[0]
    );
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title" id="exampleModalLabel">
            More Filter
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        {/* End modal-header */}

        <div className="modal-body pb-0">
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Price Range</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}

          {/* Category Selection */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Property Category</h6>
                <div className="form-style2 input-group">
                  <Select
                    key={`category-${filterFunctions?.propertyCategory}`}
                    value={categoryOptions.find(opt => opt.value === filterFunctions?.propertyCategory)}
                    onChange={(selectedOption) => filterFunctions?.handlePropertyCategory(selectedOption.value)}
                    options={categoryOptions}
                    styles={customStyles}
                    className="select-custom"
                    classNamePrefix="select"
                    placeholder="Select Category"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Type</h6>
                <div className="form-style2 input-group">
                  <Select
                    key={`property-type-${filterFunctions?.propertyCategory}-${
                      filterFunctions?.propertyTypes || "default"
                    }`}
                    value={getCurrentPropertyType()}
                    name="propertyType"
                    options={catOptions}
                    styles={customStyles}
                    onChange={(selectedOption) => {
                      if (filterFunctions?.setPropertyTypes) {
                        filterFunctions.setPropertyTypes(selectedOption.value);
                      }
                      if (filterFunctions?.handlePropertyType) {
                        filterFunctions.handlePropertyType(
                          selectedOption.value
                        );
                      }
                    }}
                    className="select-custom"
                    classNamePrefix="select"
                    placeholder="Select Property Type"
                  />
                </div>
              </div>
            </div>
            {/* End .col-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Property ID</h6>
                <div className="form-style2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="RT04949213"
                    onChange={(e) => {
                      if (filterFunctions?.handlePropertyId) {
                        filterFunctions.handlePropertyId(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {/* End .col-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bedrooms</h6>
                <div className="d-flex">
                  <Bedroom filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bathrooms</h6>
                <div className="d-flex">
                  <Bathroom filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  <Select
                    key={`location-${filterFunctions?.location || "default"}`}
                    value={getCurrentLocation()}
                    name="location"
                    styles={customStyles}
                    options={locationOptions}
                    className="select-custom filterSelect"
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      if (filterFunctions?.handlelocation) {
                        filterFunctions.handlelocation(selectedOption.value);
                      }
                    }}
                    placeholder="Select Location"
                  />
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Square Feet</h6>
                <div className="space-area">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-style1">
                      <input
                        type="number"
                        className="form-control filterInput"
                        ref={minFeetRef}
                        onChange={handleMinChange}
                        placeholder="Min."
                        id="minFeet3"
                        defaultValue={filterFunctions?.squirefeet?.[0] || ""}
                      />
                    </div>
                    <span className="dark-color">-</span>
                    <div className="form-style1">
                      <input
                        type="number"
                        className="form-control filterInput"
                        ref={maxFeetRef}
                        placeholder="Max"
                        id="maxFeet3"
                        onChange={handleMaxChange}
                        defaultValue={filterFunctions?.squirefeet?.[1] || ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End .col-md-6 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper mb0">
                <h6 className="list-title mb10">Amenities</h6>
              </div>
            </div>
            <Amenities filterFunctions={filterFunctions} />
          </div>
        </div>
        {/* End modal body */}

        <div className="modal-footer justify-content-between">
          <button
            className="reset-button"
            onClick={() => {
              if (filterFunctions?.resetFilter) {
                filterFunctions.resetFilter();
              }
              // Clear the input fields
              if (minFeetRef.current) minFeetRef.current.value = "";
              if (maxFeetRef.current) maxFeetRef.current.value = "";
            }}
          >
            <span className="flaticon-turn-back" />
            <u>Reset all filters</u>
          </button>
          <div className="btn-area">
            <button
              type="submit"
              className="ud-btn btn-thm"
              data-bs-dismiss="modal"
            >
              <span className="flaticon-search align-text-top pr10" />
              Search
            </button>
          </div>
        </div>
        {/* End modal-footer */}
      </div>
    </div>
  );
};

export default AdvanceFilterModal;
