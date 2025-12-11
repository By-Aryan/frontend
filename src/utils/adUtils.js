/**
 * Utility functions for ad handling
 */

/**
 * Check if an ad is currently active based on its date range
 * @param {Object} ad - The ad object with start_date and end_date properties
 * @returns {boolean} - Whether the ad is currently active
 */
export const isAdActive = (ad) => {
  try {
    // Check if required properties exist
    if (!ad.start_date || !ad.end_date) {
      console.warn('Ad missing date properties:', ad._id);
      return false;
    }

    // Parse dates
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);
    const now = new Date();

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn('Invalid date format in ad:', ad._id);
      return false;
    }

    // Check if current date is within the ad's active range
    return startDate <= now && endDate >= now;
  } catch (error) {
    console.error('Error checking ad active status:', error);
    return false;
  }
};

/**
 * Check if an ad is active and in the correct placement
 * @param {Object} ad - The ad object
 * @param {string} placement - The placement to check for
 * @returns {boolean} - Whether the ad is active and in the correct placement
 */
export const isAdValid = (ad, placement) => {
  if (!ad || !ad.status || !ad.placement) return false;

  const isActive = ad.status.trim().toLowerCase() === "active";
  const isCorrectPlacement =
    ad.placement.trim().toLowerCase() === placement.trim().toLowerCase();

  return isActive && isCorrectPlacement;
};



/**
 * Filter ads by placement and active status
 * @param {Array} ads - Array of ad objects
 * @param {string} placement - The placement to filter by
 * @returns {Array} - Filtered array of valid ads
 */
export const filterActiveAds = (ads, placement) => {
  if (!Array.isArray(ads)) {
    console.warn('[adUtils] ads is not an array:', ads);
    return [];
  }

  console.log(`[adUtils] Filtering ${ads.length} ads for placement: ${placement}`);

  const validAds = ads.filter(ad => {
    const isValid = isAdValid(ad, placement);
    console.log(`[adUtils] Ad "${ad.title}" - Valid: ${isValid}`, {
      status: ad.status,
      placement: ad.placement,
      startDate: ad.start_date,
      endDate: ad.end_date,
      isActive: true
    });
    return isValid;
  });

  console.log(`[adUtils] Filtered result: ${validAds.length} valid ads`);
  return validAds;
};