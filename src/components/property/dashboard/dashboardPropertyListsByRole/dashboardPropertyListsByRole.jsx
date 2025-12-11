"use client"
import { useEffect, useState } from 'react';

function DashboardPropertyListByRoleDataTable({ data: propData }) {
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    if (propData) {
      setRequestData(propData);
    }
  }, [propData]);

  function formatDate(dateString) {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatPrice(price, currency) {
    if (!price) return "Price not specified";
    const formattedPrice = new Intl.NumberFormat().format(price);
    return `${formattedPrice} ${currency || 'AED'}`;
  }

  function getPropertyName(property) {
    return property?.name || property?.title || "Unknown";
  }

  function getPropertyDescription(property) {
    return property?.description || "No description available";
  }

  function getPropertyAddress(property) {
    const location = property?.location;
    if (!location) return "No address available";
    
    const parts = [
      location.address,
      location.neighborhood,
      location.city,
      location.emirate,
      location.country
    ].filter(Boolean);
    
    return parts.join(", ") || "No address available";
  }

  function getPropertyArea(property) {
    if (property?.details?.size?.value) {
      const unit = property?.details?.size?.unit || "sqft";
      return `${property.details.size.value} ${unit}`;
    }
    return "Area not specified";
  }

  function getPropertySpecs(property) {
    const details = property?.details;
    if (!details) return "Not specified";
    
    const specs = [];
    if (details.bedrooms) specs.push(`${details.bedrooms} bed`);
    if (details.bathrooms) specs.push(`${details.bathrooms} bath`);
    if (details.property_type) specs.push(details.property_type);
    
    return specs.join(" • ") || "Not specified";
  }

  function getPropertyStatus(property) {
    return property?.approval_status?.status || "Approved";
  }

  function getPropertyPurpose(property) {
    return property?.details?.purpose || "Not specified";
  }

  function getFurnishingStatus(property) {
    return property?.details?.furnishing || "Not specified";
  }

  function getCompletionStatus(property) {
    return property?.details?.completion_status || "Not specified";
  }

  function getApproverInfo(property) {
    const approver = property?.approval_status?.approved_by;
    if (!approver) return "Admin";
    if (typeof approver === 'string') return approver;
    return approver.name || approver.email || "Admin";
  }

  function getSellerInfo(property) {
    // Try multiple possible paths for seller information
    const seller = property?.requested_id?.seller || property?.requested_by;
    if (!seller) return "Unknown";
    return seller.fullname || seller.email || "Unknown";
  }

  function getAgentInfo(property) {
    const agent = property?.agent_id;
    if (!agent) return "No Agent Assigned";
    return {
      name: agent.fullname || "Unknown Agent",
      email: agent.email || "No email",
      id: agent._id || "No ID"
    };
  }

  function getBuildingInfo(property) {
    const building = property?.building_information;
    if (!building) return null;
    
    return {
      name: building.name || "No building name",
      yearOfCompletion: building.year_of_completion || "Not specified",
      totalFloors: building.total_floors || "Not specified",
      totalArea: building.total_building_area?.value 
        ? `${building.total_building_area.value} ${building.total_building_area.unit || 'sqft'}`
        : "Not specified",
      offices: building.offices || 0
    };
  }

  function getAmenities(property) {
    const features = property?.features_amenities || [];
    const other = property?.other_amenities || [];
    const allAmenities = [...features, ...other];
    
    if (allAmenities.length === 0) return "No amenities listed";
    
    return allAmenities.slice(0, 3).join(", ") + 
           (allAmenities.length > 3 ? ` +${allAmenities.length - 3} more` : "");
  }

  function getLocationDetails(property) {
    const location = property?.location;
    if (!location) return {
      landmark: "No landmark",
      neighborhood: "No neighborhood", 
      city: "No city"
    };
    
    // Safely extract string values from potentially nested objects
    const safeExtract = (value, fallback) => {
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return value.name || value.city || value.area || value.landmark || fallback;
      }
      return fallback;
    };
    
    return {
      landmark: safeExtract(location.landmark, "No landmark"),
      neighborhood: safeExtract(location.neighborhood, "No neighborhood"),
      city: safeExtract(location.city, "No city")
    };
  }

  function getParkingInfo(property) {
    return property?.details?.parking_available ? "Available" : "Not Available";
  }

  function getMediaInfo(property) {
    const media = property?.developer_notes;
    if (!media) return "No media";
    
    const parts = [];
    if (media.image_count > 0) parts.push(`${media.image_count} images`);
    if (media.video_count > 0) parts.push(`${media.video_count} videos`);
    if (media.virtual_tour_available) parts.push("Virtual tour");
    
    return parts.join(", ") || "No media";
  }

  return (
    <table className="table-style3 table at-savesearch">
      <thead className="t-head">
        <tr>
          <th scope="col">Property Details</th>
          <th scope="col">Price & Building Info</th>
          <th scope="col">Location & Amenities</th>
          <th scope="col">Status & Dates</th>
          <th scope="col">Agent & Seller Info</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody className="t-body">
        {requestData?.length > 0 ? (
          requestData.map((property) => {
            const locationDetails = getLocationDetails(property);
            const agentInfo = getAgentInfo(property);
            const buildingInfo = getBuildingInfo(property);
            
            return (
              <tr key={property._id || property.id}>
                <td scope="row">
                  <div className="listing-style1 dashboard-style d-xxl-flex align-items-center mb-0">
                    <div className="list-content py-0 p-0 mt-2 mt-xxl-0 ps-xxl-4">
                      <div className="h6 list-title mb-1">{getPropertyName(property)}</div>
                      <p className="list-text mb-1 text-sm text-gray-600">
                        {getPropertyDescription(property).substring(0, 60)}...
                      </p>
                      <div className="list-price">
                        <span className="text-sm font-medium">{getPropertySpecs(property)}</span>
                      </div>
                      <div className="mt-1">
                        <span className="badge bg-light text-dark text-xs">{getPropertyArea(property)}</span>
                      </div>
                      {property?.reference_number && (
                        <div className="text-xs text-gray-400 mt-1">
                          <strong>Ref:</strong> {property.reference_number}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="vam">
                  <div className="price-building-info">
                    <div className="h6 text-primary mb-2">
                      {formatPrice(property?.price, property?.currency)}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Purpose:</strong> {getPropertyPurpose(property)}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Furnishing:</strong> {getFurnishingStatus(property)}
                    </div>
                    {buildingInfo && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <div className="text-xs font-weight-bold mb-1">Building Info:</div>
                        <div className="text-xs text-gray-600 mb-1">
                          <strong>Name:</strong> {buildingInfo.name}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          <strong>Floors:</strong> {buildingInfo.totalFloors} | <strong>Year:</strong> {buildingInfo.yearOfCompletion}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Total Area:</strong> {buildingInfo.totalArea}
                        </div>
                        {buildingInfo.offices > 0 && (
                          <div className="text-xs text-gray-600">
                            <strong>Offices:</strong> {buildingInfo.offices}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                <td className="vam">
                  <div className="location-amenities-info">
                    <div className="mb-2">
                      <div className="text-sm mb-1">
                        <strong>
                          {typeof locationDetails.city === 'string' 
                            ? locationDetails.city 
                            : locationDetails.city?.name || locationDetails.city?.city || 'No city'
                          }
                        </strong>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {typeof locationDetails.neighborhood === 'string' 
                          ? locationDetails.neighborhood 
                          : locationDetails.neighborhood?.name || locationDetails.neighborhood?.area || 'No neighborhood'
                        }
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        📍 {typeof locationDetails.landmark === 'string' 
                          ? locationDetails.landmark 
                          : locationDetails.landmark?.name || locationDetails.landmark?.landmark || 'No landmark'
                        }
                      </div>
                      {property?.location?.building_name && (
                        <div className="text-xs text-gray-500 mb-1">
                          🏢 {property.location.building_name}
                        </div>
                      )}
                      {property?.location?.floor && (
                        <div className="text-xs text-gray-500 mb-1">
                          Floor: {property.location.floor}
                        </div>
                      )}
                    </div>
                    
                    <div className="amenities-section">
                      <div className="text-xs font-weight-bold mb-1">Amenities:</div>
                      <div className="text-xs text-gray-600">
                        {getAmenities(property)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mt-1">
                      <strong>Parking:</strong> {getParkingInfo(property)}
                    </div>
                  </div>
                </td>

                <td className="vam">
                  <div className="status-info">
                    <div className="mb-2">
                      <span className="badge bg-success text-white text-xs">
                        {getPropertyStatus(property)}
                      </span>
                      <span className="badge bg-info text-white text-xs ms-1">
                        {getCompletionStatus(property)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <strong>Created:</strong> {formatDate(property?.created_at)}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <strong>Approved:</strong> {formatDate(property?.approval_status?.approved_on)}
                    </div>
                    {property?.featured?.isFeatured && (
                      <div className="text-xs text-warning">
                        ⭐ Featured Property
                      </div>
                    )}
                  </div>
                </td>

                <td className="vam">
                  <div className="agent-seller-info">
                    <div className="mb-2 p-2 bg-primary bg-opacity-10 rounded">
                      <div className="text-xs font-weight-bold mb-1 text-primary">Agent Details:</div>
                      <div className="text-xs text-gray-700 mb-1">
                        <strong>Name:</strong> {agentInfo.name}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Email:</strong> {agentInfo.email}
                      </div>
                    </div>
                    
                    <div className="mb-2 p-2 bg-secondary bg-opacity-10 rounded">
                      <div className="text-xs font-weight-bold mb-1 text-secondary">Seller Details:</div>
                      <div className="text-xs text-gray-700">
                        {getSellerInfo(property)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <strong>Media:</strong> {getMediaInfo(property)}
                    </div>
                    
                    {property?.developer_notes?.tags?.length > 0 && (
                      <div className="mt-1">
                        <div className="text-xs font-weight-bold">Tags:</div>
                        <div className="text-xs text-gray-600">
                          {property.developer_notes.tags.slice(0, 2).join(", ")}
                          {property.developer_notes.tags.length > 2 && " +more"}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="vam">
                  <div className="action-buttons d-flex flex-column gap-1">
                    {/* <button className="btn btn-sm btn-outline-primary">
                      View Details
                    </button> */}
                    {/* <button className="btn btn-sm btn-outline-secondary">
                      Edit
                    </button> */}
                    {property?.developer_notes?.images?.length > 0 && (
                      <button className="btn btn-sm btn-outline-info">
                        Images ({property.developer_notes.images.length})
                      </button>
                    )}
                    {property?.developer_notes?.videos?.length > 0 && (
                      <button className="btn btn-sm btn-outline-warning">
                        Videos ({property.developer_notes.videos.length})
                      </button>
                    )}
                    {/* {property?.developer_notes?.virtual_tour_available && (
                      <button className="btn btn-sm btn-outline-success">
                        Virtual Tour
                      </button>
                    )} */}
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4">
              No approved properties found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default DashboardPropertyListByRoleDataTable;