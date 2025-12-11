// import { usePropertyStore } from "@/store/store";
// import React from "react";

// const PropertyFeaturesAminites = ({property}) => {

//   const transformAmenities = (amenities, itemsPerRow = 4) => {
//     return amenities?.reduce((rows, amenity, index) => {
//       if (index % itemsPerRow === 0) rows?.push([]); // Create a new row every `itemsPerRow` items
//       rows[rows?.length - 1]?.push(amenity);
//       return rows;
//     }, []);
//   };
//   const featuresAmenitiesData = transformAmenities(property?.features_amenities, 4);

//   // const featuresAmenitiesData = [
//   //   ["Air Conditioning", "Barbeque", "Dryer", "Gym"],
//   //   ["Lawn", "Microwave", "Outdoor Shower", "Refrigerator"],
//   //   ["Swimming Pool", "TV Cable", "Washer", "WiFi6"],
//   // ];

//   return (
//     <>
//       {featuresAmenitiesData?.map((row, rowIndex) => (
//         <div key={rowIndex} className="col-sm-6 col-md-4">
//           <div className="pd-list">
//             {row.map((item, index) => (
//               <p key={index} className="text mb10">
//                 <i className="fas fa-circle fz6 align-middle pe-2" />
//                 {item}
//               </p>
//             ))}
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default PropertyFeaturesAminites;

import React from "react";

const PropertyFeaturesAmenities = ({ property }) => {
  const transformAmenities = (amenities, itemsPerRow = 4) => {
    return amenities?.reduce((rows, amenity, index) => {
      if (index % itemsPerRow === 0) rows.push([]);
      rows[rows.length - 1].push(amenity);
      return rows;
    }, []);
  };

  const featuresAmenitiesData = transformAmenities(property?.features_amenities || [
    "Air Conditioning", "Barbeque", "Dryer", "Gym",
    "Microwave", "Refrigerator", "TV Cable", "Washer",
    "WiFi", "Swimming Pool", "Lawn", "Sauna"
  ]);

  if (!featuresAmenitiesData?.length) {
    return <p className="text-muted">No amenities listed for this property.</p>;
  }

  return (
    <section className="property-amenities py-4">
      <h4 className="mb-3 fw-semibold">Property Features & Amenities</h4>
      <div className="row">
        {featuresAmenitiesData.map((row, rowIndex) => (
          <div key={rowIndex} className="col-sm-6 col-md-4 col-lg-3 mb-3">
            <ul className="list-unstyled">
              {row.map((item, index) => (
                <li key={index} className="d-flex align-items-center mb-2">
                  <i className="fas fa-check-circle text-success me-2" />
                  <span className="text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyFeaturesAmenities;
