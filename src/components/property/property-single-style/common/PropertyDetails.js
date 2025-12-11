// import { usePropertyStore } from "@/store/store";
// import React from "react";

// const PropertyDetails = ({property}) => {

//   const columns = [
//     [
//       // {
//       //   label: "Property ID",
//       //   value: "RT48",
//       // },
//       {
//         label: "Price",
//         value: `${property?.currency} ${property?.price}`,
//       },
//       {
//         label: "Property Size",
//         value: `${property?.details?.size?.value}`,
//       },
//       {
//         label: "Bathrooms",
//         value: `${property?.details?.bathrooms}`,
//       },
//       {
//         label: "Bedrooms",
//         value: `${property?.details?.bedrooms}`,
//       },
//     ],
//     [
//       // {
//       //   label: "Garage",
//       //   value: "2",
//       // },
//       // {
//       //   label: "Garage Size",
//       //   value: "200 SqFt",
//       // },
//       {
//         label: "Year Built",
//         value: `${property?.building_information?.year_of_completion}`,
//       },
//       {
//         label: "Property Type",
//         value: `${property?.details?.property_type}`,
//       },
//       {
//         label: "Property Status",
//         value: `For ${property?.details?.purpose}`,
//       },
//     ],
//   ];

//   return (
//     <div className="row">
//       {columns.map((column, columnIndex) => (
//         <div
//           key={columnIndex}
//           className={`col-md-6 col-xl-4${
//             columnIndex === 1 ? " offset-xl-2" : ""
//           }`}
//         >
//           {column.map((detail, index) => (
//             <div key={index} className="d-flex justify-content-between">
//               <div className="pd-list">
//                 <p className="fw600 mb10 ff-heading dark-color">
//                   {detail.label}
//                 </p>
//               </div>
//               <div className="pd-list">
//                 <p className="text mb10">{detail.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PropertyDetails;
import React from "react";

const PropertyDetails = ({ property }) => {
  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    return Number(price).toLocaleString();
  };

  const detailsData = [
    {
      category: "Pricing & Size",
      items: [
        {
          icon: "fas fa-dollar-sign",
          label: "Price",
          value: `${property?.currency || "AED"} ${formatPrice(
            property?.price
          )}`,
        },
        {
          icon: "fas fa-ruler-combined",
          label: "Property Size",
          value: property?.details?.size?.value
            ? `${property.details.size.value.toLocaleString()} sqft`
            : "Not specified",
        },
        {
          icon: "fas fa-calculator",
          label: "Price per sqft",
          value:
            property?.price && property?.details?.size?.value
              ? `${property.currency} ${(
                  Number(property.price) / property.details.size.value
                ).toFixed(0)}`
              : "Not calculated",
        },
      ],
    },
    {
      category: "Property Features",
      items: [
        {
          icon: "fas fa-bed",
          label: "Bedrooms",
          value: property?.details?.bedrooms || "Not specified",
        },
        {
          icon: "fas fa-bath",
          label: "Bathrooms",
          value: property?.details?.bathrooms || "Not specified",
        },
        {
          icon: "fas fa-home",
          label: "Property Type",
          value: property?.details?.property_type || "Not specified",
        },
      ],
    },
    {
      category: "Building Information",
      items: [
        {
          icon: "fas fa-calendar-alt",
          label: "Year Built",
          value:
            property?.building_information?.year_of_completion ||
            "Not specified",
        },
        {
          icon: "fas fa-tools",
          label: "Completion Status",
          value:
            property?.details?.completion_status === "completed"
              ? "Ready to Move"
              : "Under Construction",
        },
        {
          icon: "fas fa-key",
          label: "Purpose",
          value: `For ${property?.details?.purpose || "Sale"}`,
        },
      ],
    },
    {
      category: "Additional Details",
      items: [
        {
          icon: "fas fa-couch",
          label: "Furnishing",
          value:
            property?.details?.furnishing === "yes"
              ? "Furnished"
              : "Unfurnished",
        },
        {
          icon: "fas fa-car",
          label: "Parking",
          value: property?.details?.parking_available
            ? "Available"
            : "Not Available",
        },
        {
          icon: "fas fa-user-tie",
          label: "Ownership",
          value: property?.details?.ownership || "Not specified",
        },
      ],
    },
  ];

  return (
    <div className="property-details-enhanced bg-white text-dark p-4 rounded">
      {detailsData.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-5">
          <h5 className="category-title mb-4 pb-2 border-bottom border-success  d-inline-block text-success">
            {category.category}
          </h5>

          <div className="row g-3">
            {category.items.map((detail, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="detail-card p-3 rounded-3 border border-light bg-white h-100">
                  <div className="d-flex align-items-start">
                    <div className="icon-wrapper me-3 p-2 rounded-circle bg-light text-success">
                      <i className={`${detail.icon} fs-6`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold text-dark">
                        {detail.label}
                      </h6>
                      <p className="mb-0 text-muted">{detail.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Property Status Indicator */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="status-indicator p-4 rounded-3 bg-white border border-light">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h6 className="mb-2 fw-semibold text-success">
                  Property Status
                </h6>
                <div className="d-flex align-items-center gap-3">
                  <span
                    className={`badge px-3 py-2 ${
                      property?.approval_status?.status === "Approved"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {property?.approval_status?.status || "Pending"}
                  </span>
                  {property?.approval_status?.approved_on && (
                    <small className="text-muted">
                      Approved on{" "}
                      {new Date(
                        property.approval_status.approved_on
                      ).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="views-section">
                  <h6 className="mb-1 fw-semibold text-success">
                    Property Views
                  </h6>
                  <span className="badge bg-success bg-opacity-25 text-success px-3 py-2">
                    <i className="fas fa-eye me-1"></i>
                    {property?.analytics?.views || 0} views
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
