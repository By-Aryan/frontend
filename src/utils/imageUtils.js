/**
 * Utility functions for handling property images
 */

// Default property image to use when no image is available or there's an error
export const DEFAULT_PROPERTY_IMAGE = "/images/listings/property.jpg";

/**
 * Check if an image URL is valid for Next.js Image component
 * @param {string} url - The image URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  // Check if the URL is relative (starts with /)
  if (url.startsWith('/')) return true;

  try {
    const urlObj = new URL(url);
    // List of allowed domains from next.config.js
    const allowedDomains = [
      'localhost:8000',
      'localhost:5001',
      '51.79.81.34:3500',
      'zero-brokerage-backend.onrender.com'
    ];

    return allowedDomains.includes(urlObj.host);
  } catch (e) {
    return false;
  }
};

/**
 * Get the appropriate image URL for a property, or use a default
 * @param {Object} property - The property object
 * @returns {string} - The image URL to use
 */
export const getPropertyImageUrl = (property) => {
  try {
    // Check if property object exists
    if (!property) {
      console.log("🚫 No property object provided");
      return null;
    }

    // Check for images in developer_notes
    if (!property?.developer_notes?.images?.length) {
      console.log("🚫 No images found for property:", property?.name);
      return null;
    }

    const firstImage = property.developer_notes.images[0];
    console.log("🖼️ First image data:", firstImage);

    // Handle both object format (with file_path/full_url) and direct string URL
    let imageUrl;
    if (typeof firstImage === 'object' && firstImage !== null) {
      // Try full_url first (if backend adds it), then file_path, then filename
      imageUrl = firstImage.full_url || firstImage.file_path || firstImage.filename;
      console.log("🔗 Constructed imageUrl:", imageUrl);

      // Clean up duplicate /uploads/ in the URL (fix backend double path issue)
      if (imageUrl && typeof imageUrl === 'string') {
        // Fix patterns like: /uploads//uploads/ or http://domain/uploads//uploads/
        imageUrl = imageUrl.replace(/\/uploads\/+\/uploads\//g, '/uploads/');
        // Also fix double slashes: //uploads/
        imageUrl = imageUrl.replace(/\/\/uploads\//g, '/uploads/');
        console.log("🧹 Cleaned URL:", imageUrl);
      }

      // If we have a file_path and no full_url, construct the full URL
      if (!firstImage.full_url && firstImage.file_path && !firstImage.file_path.startsWith('http')) {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
        imageUrl = `${BACKEND_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        console.log("🌐 Full URL:", imageUrl);
      }
    } else if (typeof firstImage === 'string') {
      // If it's already a string, use it directly
      imageUrl = firstImage;
      console.log("📝 String URL:", imageUrl);
    }

    // If we don't have a valid imageUrl at this point, return null
    if (!imageUrl) {
      console.log("❌ No valid image URL could be constructed");
      return null;
    }

    // If the image URL is valid for Next.js, use it
    if (isValidImageUrl(imageUrl)) {
      console.log("✅ Valid image URL:", imageUrl);
      return imageUrl;
    }

    console.log("❌ Invalid image URL:", imageUrl);
    // Otherwise, return null
    return null;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
};

/**
 * Get the style for the property image
 * @param {string} imageUrl - The image URL
 * @returns {Object} - The style object for the image
 */
export const getPropertyImageStyle = (imageUrl) => {
  return {
    objectFit: 'cover',
    width: 'auto',
    height: 'auto',
    ...(imageUrl === DEFAULT_PROPERTY_IMAGE ? { opacity: 0.6 } : {})
  };
};

/**
 * Handle image loading errors
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
  // Hide the broken image element
  e.target.style.display = 'none';
  console.error("Failed to load image:", e.target.src);
}; 