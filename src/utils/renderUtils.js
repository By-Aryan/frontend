// Utility functions to safely render objects in React components

/**
 * Safely renders location data - handles both string and object formats
 * @param {string|object} location - Location data
 * @returns {string} - Formatted location string
 */
export const renderLocation = (location) => {
  if (!location) return '';
  
  if (typeof location === 'string') {
    return location;
  }
  
  if (typeof location === 'object') {
    // If it has an address field, use that
    if (location.address) {
      return location.address;
    }
    
    // Otherwise, construct from available fields
    const parts = [];
    if (location.area) parts.push(location.area);
    if (location.city) parts.push(location.city);
    if (location.emirate) parts.push(location.emirate);
    if (location.country) parts.push(location.country);
    
    return parts.filter(Boolean).join(', ');
  }
  
  return '';
};

/**
 * Safely renders any data that might be an object
 * @param {any} data - Data to render
 * @param {string} fallback - Fallback text if data is invalid
 * @returns {string} - Safe string representation
 */
export const safeRender = (data, fallback = '') => {
  if (data === null || data === undefined) {
    return fallback;
  }
  
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return String(data);
  }
  
  if (typeof data === 'object') {
    // If it's an array, join with commas
    if (Array.isArray(data)) {
      return data.map(item => safeRender(item)).filter(Boolean).join(', ');
    }
    
    // For objects, try to find a meaningful string representation
    if (data.name) return data.name;
    if (data.title) return data.title;
    if (data.label) return data.label;
    if (data.text) return data.text;
    if (data.value) return String(data.value);
    
    // For location objects
    if (data.address || data.city || data.emirate) {
      return renderLocation(data);
    }
    
    // Last resort - return JSON string (for debugging)
    return JSON.stringify(data);
  }
  
  return fallback;
};

/**
 * Safely renders price data
 * @param {string|number|object} price - Price data
 * @param {string} currency - Currency symbol
 * @returns {string} - Formatted price string
 */
export const renderPrice = (price, currency = 'AED') => {
  if (!price) return '';
  
  if (typeof price === 'object') {
    if (price.amount) return `${currency} ${price.amount.toLocaleString()}`;
    if (price.value) return `${currency} ${price.value.toLocaleString()}`;
    return '';
  }
  
  const numPrice = Number(price);
  if (isNaN(numPrice)) return String(price);
  
  return `${currency} ${numPrice.toLocaleString()}`;
};

/**
 * Safely renders contact information
 * @param {string|object} contact - Contact data
 * @returns {string} - Formatted contact string
 */
export const renderContact = (contact) => {
  if (!contact) return '';
  
  if (typeof contact === 'string') {
    return contact;
  }
  
  if (typeof contact === 'object') {
    if (contact.phone) return contact.phone;
    if (contact.email) return contact.email;
    if (contact.name) return contact.name;
    return '';
  }
  
  return '';
};