// import { usePropertyStore } from "@/store/store";
// import React from "react";

// const PropertyAddress = ({property}) => {


//   return (
//     <>
//         <div
//           className={`col-md-12`}
//         >
//           <div className="d-flex justify-content-between">
//             <div className="pd-list">
//               <p className="fw600 mb10 ff-heading dark-color">Address</p>
//               <p className="fw600 mb10 ff-heading dark-color">City</p>
//               <p className="fw600 mb-0 ff-heading dark-color">State/county</p>
//             </div>
//             <div className="pd-list">
//               <p className="text mb10">{property?.location?.address}</p>
//               <p className="text mb10">{property?.location?.city}</p>
//               <p className="text mb-0">{property?.location?.emirate}</p>
//             </div>
//           </div>
//         </div>
//       {/* End col */}

//       <div className="col-md-12">
//         <iframe
//           className="position-relative bdrs12 mt30 h250"
//           loading="lazy"
//           src={`https://maps.google.com/maps?q=${property?.location?.address}&t=m&z=14&output=embed&iwloc=near`}
//           title={property?.location?.address}
//           aria-label={property?.location?.address}
//         />
//       </div>
//       {/* End col */}
//     </>
//   );
// };

// export default PropertyAddress;
import { useState } from "react";

const PropertyAddress = ({ property }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const addressData = [
    {
      icon: "fas fa-map-marker-alt",
      label: "Full Address",
      value: property?.location?.address || "Not provided",
      color: "text-danger"
    },
    {
      icon: "fas fa-city", 
      label: "City",
      value: property?.location?.city || "Not provided",
      color: "text-primary"
    },
    {
      icon: "fas fa-flag",
      label: "Emirate/State", 
      value: property?.location?.emirate || "Not provided",
      color: "text-success"
    },
    {
      icon: "fas fa-globe",
      label: "Country",
      value: property?.location?.country || "UAE", 
      color: "text-info"
    },
    {
      icon: "fas fa-road",
      label: "Street",
      value: property?.location?.street || "Not provided",
      color: "text-warning"
    },
    {
      icon: "fas fa-building",
      label: "Building", 
      value: property?.location?.building_name || "Not provided",
      color: "text-secondary"
    }
  ];

  const getMapUrl = () => {
    const address = property?.location?.address || 
                   `${typeof property?.location?.city === 'string' ? property.location.city : property?.location?.city?.name || ''}, ${typeof property?.location?.emirate === 'string' ? property.location.emirate : property?.location?.emirate?.name || ''}, ${typeof property?.location?.country === 'string' ? property.location.country : property?.location?.country?.name || ''}`;
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=14&output=embed&iwloc=near`;
  };

  const getDirectionsUrl = () => {
    const address = property?.location?.address || 
                   `${typeof property?.location?.city === 'string' ? property.location.city : property?.location?.city?.name || ''}, ${typeof property?.location?.emirate === 'string' ? property.location.emirate : property?.location?.emirate?.name || ''}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  };

  return (
    <div className="property-address-enhanced">
      <div className="row">
        {/* Address Information */}
        <div className="col-lg-6 mb-4">
          <div className="address-info">
            <h5 className="mb-4 fw-semibold">
              <i className="fas fa-map-marker-alt text-danger me-2"></i>
              Location Details
            </h5>
            
            <div className="address-grid">
              {addressData.map((item, index) => (
                <div key={index} className="address-item mb-3 p-3 rounded-3 bg-light border">
                  <div className="d-flex align-items-start">
                    <div className={`icon-wrapper me-3 p-2 rounded-circle bg-white ${item.color}`}>
                      <i className={`${item.icon} fs-6`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold text-dark">{item.label}</h6>
                      <p className="mb-0 text-muted">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Location Info */}
            {(property?.location?.landmark || property?.location?.neighborhood) && (
              <div className="additional-info mt-4 p-3 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                <h6 className="mb-2 fw-semibold text-primary">
                  <i className="fas fa-info-circle me-2"></i>
                  Additional Information
                </h6>
                {property?.location?.landmark && (
                  <p className="mb-1 small">
                    <strong>Landmark:</strong> {property.location.landmark}
                  </p>
                )}
                {property?.location?.neighborhood && (
                  <p className="mb-0 small">
                    <strong>Neighborhood:</strong> {property.location.neighborhood}
                  </p>
                )}
              </div>
            )}

            {/* Coordinates if available */}
            {(property?.location?.latitude && property?.location?.longitude) && (
              <div className="coordinates-info mt-3 p-3 rounded-3 bg-info bg-opacity-10 border border-info border-opacity-25">
                <h6 className="mb-2 fw-semibold text-info">
                  <i className="fas fa-crosshairs me-2"></i>
                  Coordinates
                </h6>
                <p className="mb-0 small font-monospace">
                  Lat: {property.location.latitude}, Lng: {property.location.longitude}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="col-lg-6 mb-4">
          <div className="map-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-semibold">
                <i className="fas fa-map text-success me-2"></i>
                Location Map
              </h5>
              <div className="map-actions">
                <a 
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm me-2"
                >
                  <i className="fas fa-directions me-1"></i>
                  Directions
                </a>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setMapLoaded(!mapLoaded)}
                >
                  <i className={`fas ${mapLoaded ? 'fa-eye-slash' : 'fa-eye'} me-1`}></i>
                  {mapLoaded ? 'Hide' : 'Show'} Map
                </button>
              </div>
            </div>

            <div className="map-container position-relative">
              {!mapLoaded ? (
                <div 
                  className="map-placeholder d-flex align-items-center justify-content-center bg-light rounded-3 border"
                  style={{ height: "350px" }}
                  onClick={() => setMapLoaded(true)}
                  role="button"
                >
                  <div className="text-center">
                    <i className="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                    <p className="text-muted mb-2">Click to load interactive map</p>
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-play me-1"></i>
                      Load Map
                    </button>
                  </div>
                </div>
              ) : (
                <div className="map-wrapper position-relative">
                  <iframe
                    className="w-100 rounded-3 border shadow-sm"
                    style={{ height: "350px" }}
                    loading="lazy"
                    src={getMapUrl()}
                    title={`Map showing ${property?.location?.address}`}
                    aria-label={`Interactive map for ${property?.location?.address}`}
                    allowFullScreen
                  />
                  <div className="map-overlay position-absolute top-0 end-0 m-2">
                    <button 
                      className="btn btn-light btn-sm shadow"
                      onClick={() => setMapLoaded(false)}
                      title="Hide map"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="map-legend mt-3 p-2 bg-light rounded-2 border">
              <div className="row text-center">
                <div className="col-4">
                  <small className="text-muted">
                    <i className="fas fa-home text-primary me-1"></i>
                    Property
                  </small>
                </div>
                <div className="col-4">
                  <small className="text-muted">
                    <i className="fas fa-road text-warning me-1"></i>
                    Roads
                  </small>
                </div>
                <div className="col-4">
                  <small className="text-muted">
                    <i className="fas fa-tree text-success me-1"></i>
                    Parks
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Address Summary */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="quick-address p-4 rounded-3 bg-gradient" style={{background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}>
            <div className="text-white">
              <h5 className="mb-2 fw-semibold">
                <i className="fas fa-location-arrow me-2"></i>
                Quick Address
              </h5>
              <p className="mb-0 fs-5" style={{color:"black"}}>
                {property?.location?.address && property?.location?.city 
                  ? `${typeof property.location.address === 'string' ? property.location.address : property.location.address?.address || ''}, ${typeof property.location.city === 'string' ? property.location.city : property.location.city?.name || ''}, ${typeof property.location.emirate === 'string' ? property.location.emirate : property.location.emirate?.name || typeof property.location.country === 'string' ? property.location.country : property.location.country?.name || ''}`
                  : "Complete address not available"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyAddress;