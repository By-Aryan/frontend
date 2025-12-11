// "use client";

// import { usePropertyStore } from "@/store/store";
// import React from "react";

// const PropertyHeader = ({property}) => {

//   return (
//     <>
//       <div className="col-lg-8 ">
//         <div className="single-property-content mb30-md">
//           <h2 className="sp-lg-title">{property?.name}</h2>
//           <div className="pd-meta mb15 d-md-flex align-items-center">
//             <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">
//               {property?.location?.address}
//             </p>
//             <a
//               className="ff-heading text-thm fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm"
//               href="#"
//             >
//               <i className="fas fa-circle fz10 pe-2" />
//               For {property?.details?.purpose == "Sell" ? "Sale" : "Rent"}
//             </a>
//             <a
//               className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
//               href="#"
//               style={{color : "#0f8363"}}
//             >
//               <i className="far fa-clock pe-2" />
//               {Number(new Date().getFullYear()) -
//                 Number(property?.building_information?.year_of_completion)}{" "}
//               years ago
//             </a>
//           </div>
//           <h1 className="mb-0">{property?.currency} {property?.price}</h1>
//             {/* <p className="text space fz15">
//               $
//               {(
//                 Number(property?.price?.split("$")[1].split(",").join("")) / property?.details?.size?.value
//               ).toFixed(2)}
//               /sq ft
//             </p> */}
//           {/* <div className="property-meta d-flex align-items-center">
//             <a className="text fz15" href="#">
//               <i className="flaticon-bed pe-2 align-text-top" />
//               {property?.details?.bedrooms} bed
//             </a>
//             <a className="text ml20 fz15" href="#">
//               <i className="flaticon-shower pe-2 align-text-top" />
//               {property?.details?.bathrooms} bath
//             </a>
//             <a className="text ml20 fz15" href="#">
//               <i className="flaticon-expand pe-2 align-text-top" />
//               {property?.details?.size?.value} sqft
//             </a>
//           </div> */}
//         </div>
//       </div>
//       {/* End .col-lg--8 */}

//       <div className="col-lg-4">
//         <div className="single-property-content">
//           <div className="property-action text-lg-end">
//             <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
//               <a className="icon mr10" href="#" style={{color : "#0f8363"}}>
//                 <span className="flaticon-like" />
//               </a>
//               <a className="icon mr10" href="#" style={{color : "#0f8363"}}>
//                 <span className="flaticon-new-tab" />
//               </a>
//               <a className="icon mr10" href="#" style={{color : "#0f8363"}}>
//                 <span className="flaticon-share-1" />
//               </a>
//               <a className="icon" href="#" style={{color : "#0f8363"}}>
//                 <span className="flaticon-printer" />
//               </a>
//             </div>

//           </div>
//         </div>
//       </div>
//       {/* End .col-lg--4 */}
//     </>
//   );
// };

// export default PropertyHeader;
"use client";

import { usePropertyStore } from "@/store/store";
import React, { useState } from "react";

const PropertyHeader = ({ property }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const getPropertyAge = () => {
    if (!property?.building_information?.year_of_completion) return "New";
    const currentYear = new Date().getFullYear();
    const yearBuilt = Number(property.building_information.year_of_completion);
    const age = currentYear - yearBuilt;

    if (age === 0) return "New Construction";
    if (age === 1) return "1 year old";
    return `${age} years old`;
  };

  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    const numPrice = Number(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M`;
    } else if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(0)}K`;
    }
    return numPrice.toLocaleString();
  };

  return (
    <div className="row align-items-center">
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          {/* Property Badge */}
          <div className="d-flex align-items-center mb-3">
            <span
              className={`badge px-3 py-2 me-3 ${
                property?.details?.purpose === "Sell"
                  ? "bg-success text-white"
                  : "bg-primary text-white"
              }`}
            >
              For {property?.details?.purpose === "Sell" ? "Sale" : "Rent"}
            </span>
            {property?.featured && (
              <span className="badge bg-warning text-dark px-3 py-2 me-3">
                <i className="fas fa-star me-1"></i>
                Featured
              </span>
            )}
            <span className="badge bg-light text-dark px-3 py-2">
              {property?.details?.property_type}
            </span>
          </div>

          {/* Property Title */}
          <h1 className="sp-lg-title mb-2 fw-bold text-dark">
            {property?.name || property?.title}
          </h1>

          {/* Location & Details Meta */}
          <div className="pd-meta mb-3 d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-map-marker-alt me-2 text-danger"></i>
              <span className="fz15">
                {property?.location?.address}, {property?.location?.city}
              </span>
            </div>

            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-calendar-alt me-2 text-info"></i>
              <span className="fz15">{getPropertyAge()}</span>
            </div>

            {property?.approval_status?.status && (
              <div className="d-flex align-items-center">
                <i className="fas fa-check-circle me-2 text-success"></i>
                <span className="fz15 text-success fw-medium">
                  {property.approval_status.status}
                </span>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="price-section mb-3">
            <div className="d-flex align-items-baseline gap-3">
              <h2 className="mb-0 fw-bold text-primary">
                {property?.currency} {formatPrice(property?.price)}
              </h2>
              {property?.details?.size?.value && (
                <span className="text-muted fz15">
                  ({property.currency}{" "}
                  {(
                    Number(property?.price) / property?.details?.size?.value
                  ).toFixed(0)}
                  /sqft)
                </span>
              )}
            </div>
          </div>
          {/* Property Stats */}
          <div className="property-stats d-flex flex-wrap gap-4 mt-3"></div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            {/* Action Buttons */}
            <div className="d-flex mb-4 gap-2 justify-content-lg-end flex-wrap">
              <button
                className="btn btn-outline-primary btn-sm px-3 py-2"
                title="Share Property"
              >
                <i className="fas fa-share-alt"></i>
              </button>

              <button
                className="btn btn-outline-primary btn-sm px-3 py-2"
                title="Print Details"
              >
                <i className="fas fa-print"></i>
              </button>

              <button
                className="btn btn-outline-primary btn-sm px-3 py-2"
                title="Full Screen"
              >
                <i className="fas fa-expand"></i>
              </button>
            </div>

            {/* Property ID & Views */}
            <div className="property-meta-info text-lg-end">
              <div>
                <small className="text-muted">Listed: </small>
                <span className="fw-medium">
                  {new Date(property?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHeader;
