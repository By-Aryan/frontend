// import listings from "@/data/listings";
// import { usePropertyStore } from "@/store/store";
// import React, { useState } from "react";

// const OverView = ({ property }) => {

//   const overviewData = [
//     {
//       icon: "flaticon-bed",
//       label: "Bedroom",
//       value: property?.details?.bedrooms,
//     },
//     {
//       icon: "flaticon-shower",
//       label: "Bath",
//       value: property?.details?.bathrooms,
//     },
//     {
//       icon: "flaticon-event",
//       label: "Year Built",
//       value: property?.building_information?.year_of_completion,
//     },
//     {
//       icon: "flaticon-expand",
//       label: "Sqft",
//       value: property?.details?.size?.value,
//       xs: true,
//     },
//     {
//       icon: "flaticon-home-1",
//       label: "Property Type",
//       value: property?.details?.property_type,
//     },
//   ];

//   return (
//     <>
//       {overviewData.map((item, index) => (
//         <div
//           key={index}
//           className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
//         >
//           <div className="overview-element d-flex align-items-center">
//             <span className={`icon ${item.icon}`} />
//             <div className="ml15">
//               <h6 className="mb-0">{item.label}</h6>
//               <p className="text mb-0 fz15">{item.value}</p>
//             </div>
//           </div>
//         </div>
//       ))}

//     </>
//   );
// };

// export default OverView;
import React from "react";

const OverView = ({ property }) => {
  const overviewData = [
    {
      icon: "flaticon-bed",
      iconClass: "text-primary",
      bgClass: "bg-primary bg-opacity-10",
      label: "Bedrooms",
      value: property?.details?.bedrooms || "N/A",
    },
    {
      icon: "flaticon-shower", 
      iconClass: "text-info",
      bgClass: "bg-info bg-opacity-10",
      label: "Bathrooms",
      value: property?.details?.bathrooms || "N/A",
    },
    {
      icon: "flaticon-event",
      iconClass: "text-warning",
      bgClass: "bg-warning bg-opacity-10", 
      label: "Year Built",
      value: property?.building_information?.year_of_completion || "N/A",
    },
    {
      icon: "flaticon-expand",
      iconClass: "text-success",
      bgClass: "bg-success bg-opacity-10",
      label: "Area",
      value: property?.details?.size?.value 
        ? `${property.details.size.value.toLocaleString()} sqft` 
        : "N/A",
    },
    {
      icon: "flaticon-home-1",
      iconClass: "text-danger", 
      bgClass: "bg-danger bg-opacity-10",
      label: "Property Type",
      value: property?.details?.property_type || "N/A",
    },
    {
      icon: "flaticon-car",
      iconClass: "text-secondary",
      bgClass: "bg-secondary bg-opacity-10",
      label: "Parking",
      value: property?.details?.parking_available ? "Available" : "Not Available",
    },
    {
      icon: "flaticon-sofa",
      iconClass: "text-purple",
      bgClass: "bg-purple bg-opacity-10", 
      label: "Furnishing",
      value: property?.details?.furnishing === "yes" ? "Furnished" : "Unfurnished",
    },
    {
      icon: "flaticon-check",
      iconClass: "text-success",
      bgClass: "bg-success bg-opacity-10",
      label: "Status", 
      value: property?.details?.completion_status === "completed" ? "Ready" : "Under Construction",
    }
  ];

  return (
    <div className="row g-4">
      {overviewData.map((item, index) => (
        <div key={index} className="col-sm-6 col-lg-3">
          <div className="overview-card h-100 p-4 bg-white rounded-3 shadow-sm border-0 hover-card">
            <div className="d-flex align-items-center">
              <div className={`icon-wrapper me-3 p-3 rounded-circle ${item.bgClass}`}>
                <i className={`${item.icon} ${item.iconClass} fs-4`}></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-1 fw-semibold text-dark">{item.label}</h6>
                <p className="mb-0 text-muted fw-medium">{item.value}</p>
              </div>
            </div>
            
            {/* Progress indicator for some items */}
            {(item.label === "Year Built" && property?.building_information?.year_of_completion) && (
              <div className="mt-3">
                <div className="progress" style={{height: "4px"}}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{
                      width: `${Math.min(100, ((new Date().getFullYear() - property.building_information.year_of_completion) / 50) * 100)}%`
                    }}
                  ></div>
                </div>
                <small className="text-muted">
                  {new Date().getFullYear() - property.building_information.year_of_completion} years old
                </small>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverView;