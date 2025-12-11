/**
 * SEO Utility Functions for Property Listings
 */

/**
 * Generate meta title for a property
 * @param {Object} property - Property object
 * @returns {string} - SEO-friendly meta title
 */
export const generatePropertyMetaTitle = (property) => {
  const propertyType = property.details?.property_type || "Property";
  const bedrooms = property.details?.bedrooms ? `${property.details.bedrooms} BR` : "";
  const location = typeof property.location === 'string' 
    ? property.location 
    : property.location?.city || property.location?.emirate || "Dubai";
  const price = property.price ? `AED ${property.price.toLocaleString()}` : "";
  const purpose = property.details?.purpose === "Rent" ? "For Rent" : "For Sale";
  
  // Create a concise, keyword-rich title
  const titleParts = [
    property.name || property.title || `${propertyType} ${bedrooms}`.trim(),
    location,
    price,
    purpose
  ].filter(Boolean);
  
  // Limit to ~60 characters for optimal SEO
  let title = titleParts.join(" | ");
  if (title.length > 60) {
    title = `${titleParts.slice(0, 3).join(" | ")} | ${purpose}`;
  }
  
  return title;
};

/**
 * Generate meta description for a property
 * @param {Object} property - Property object
 * @returns {string} - SEO-friendly meta description
 */
export const generatePropertyMetaDescription = (property) => {
  const propertyType = property.details?.property_type || "property";
  const bedrooms = property.details?.bedrooms || "several";
  const bathrooms = property.details?.bathrooms || "several";
  const size = property.details?.size?.value ? `${property.details.size.value} ${property.details.size.unit || "sqft"}` : "";
  const location = typeof property.location === 'string' 
    ? property.location 
    : property.location?.address || 
      `${property.location?.city || ''}, ${property.location?.emirate || ''}`.replace(/^, |, $/, '') || 
      "prime location";
  const price = property.price ? `priced at AED ${property.price.toLocaleString()}` : "attractive price";
  const purpose = property.details?.purpose === "Rent" ? "rent" : "sale";
  
  // Create a compelling description with keywords
  const description = `Discover this beautiful ${bedrooms}-bedroom ${propertyType} for ${purpose} in ${location}. Featuring ${bathrooms} bathrooms${size ? `, ${size} of living space` : ""}, this ${propertyType} is ${price}. Perfect for families or investors. View photos and details now!`;
  
  // Limit to ~160 characters for optimal SEO
  return description.length > 160 ? `${description.substring(0, 157)}...` : description;
};

/**
 * Generate keywords for a property
 * @param {Object} property - Property object
 * @returns {Array} - Array of SEO keywords
 */
export const generatePropertyKeywords = (property) => {
  const propertyType = property.details?.property_type || "property";
  const location = typeof property.location === 'string' 
    ? property.location 
    : property.location?.city || property.location?.emirate || "Dubai";
  const purpose = property.details?.purpose === "Rent" ? "rental" : "sale";
  const bedrooms = property.details?.bedrooms ? `${property.details.bedrooms} bedroom` : "";
  
  const keywords = [
    propertyType,
    `${propertyType} ${purpose}`,
    `${propertyType} in ${location}`,
    `${location} ${purpose}`,
    `${location} ${propertyType}`,
    `${bedrooms} ${propertyType}`,
    `AED ${property.price ? property.price.toLocaleString() : "price"}`,
    "real estate",
    "property listing",
    "Dubai property",
    location,
    purpose,
    bedrooms,
    property.details?.furnishing === "yes" ? "furnished" : "unfurnished",
    "vacant",
    property.details?.property_type?.toLowerCase().includes("villa") ? "villa" : "",
    property.details?.property_type?.toLowerCase().includes("apartment") ? "apartment" : "",
    property.details?.property_type?.toLowerCase().includes("office") ? "office space" : "",
    property.details?.property_type?.toLowerCase().includes("shop") ? "commercial property" : ""
  ].filter(Boolean);
  
  // Remove duplicates and limit to 15 keywords
  return [...new Set(keywords)].slice(0, 15);
};

/**
 * Generate Open Graph data for social sharing
 * @param {Object} property - Property object
 * @returns {Object} - Open Graph data
 */
export const generateOpenGraphData = (property) => {
  const imageUrl = property.developer_notes?.images?.[0]?.full_url || "/images/listings/propertiesAdsDemo.jpg";
  
  return {
    title: generatePropertyMetaTitle(property),
    description: generatePropertyMetaDescription(property),
    image: imageUrl,
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/single-v1/${property._id}`,
    type: "website",
    site_name: "ZeroBroker"
  };
};

/**
 * Generate structured data (JSON-LD) for property
 * @param {Object} property - Property object
 * @returns {Object} - Structured data object
 */
export const generateStructuredData = (property) => {
  const propertyType = property.details?.property_type || "Residential";
  const purpose = property.details?.purpose || "Sell";
  const price = property.price || 0;
  const currency = property.currency || "AED";
  const bedrooms = property.details?.bedrooms || 0;
  const bathrooms = property.details?.bathrooms || 0;
  const size = property.details?.size?.value || 0;
  const sizeUnit = property.details?.size?.unit || "sqft";
  
  const location = typeof property.location === 'string' 
    ? property.location 
    : property.location?.address || 
      `${property.location?.city || ''}, ${property.location?.emirate || ''}`.replace(/^, |, $/, '') || 
      'Location not available';

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.name || property.title || "Property",
    "description": property.description || generatePropertyMetaDescription(property),
    "image": property.developer_notes?.images?.[0]?.full_url || "/images/listings/propertiesAdsDemo.jpg",
    "offers": {
      "@type": "Offer",
      "price": price.toString(),
      "priceCurrency": currency,
      "availability": "https://schema.org/InStock"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Property Type",
        "value": propertyType
      },
      {
        "@type": "PropertyValue",
        "name": "Bedrooms",
        "value": bedrooms.toString()
      },
      {
        "@type": "PropertyValue",
        "name": "Bathrooms",
        "value": bathrooms.toString()
      },
      {
        "@type": "PropertyValue",
        "name": "Size",
        "value": `${size} ${sizeUnit}`
      },
      {
        "@type": "PropertyValue",
        "name": "Location",
        "value": location
      },
      {
        "@type": "PropertyValue",
        "name": "Purpose",
        "value": purpose
      }
    ]
  };
};

/**
 * Generate canonical URL for property
 * @param {Object} property - Property object
 * @returns {string} - Canonical URL
 */
export const generateCanonicalUrl = (property) => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/single-v1/${property._id}`;
  }
  return `/single-v1/${property._id}`;
};

export default {
  generatePropertyMetaTitle,
  generatePropertyMetaDescription,
  generatePropertyKeywords,
  generateOpenGraphData,
  generateStructuredData,
  generateCanonicalUrl
};