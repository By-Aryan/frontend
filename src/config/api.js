/**
 * Centralized API Configuration
 *
 * This file provides a single source of truth for all API-related configuration.
 * All components should import from this file instead of hardcoding URLs.
 */

export const API_CONFIG = {
  // Base API URL for all API calls
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1',

  // Backend URL for direct backend calls (without /api/v1)
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001',

  // Frontend base URL
  SITE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Get authentication headers with JWT token
 * @returns {Object} Headers object with Authorization and Content-Type
 */
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
    : null;

  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

/**
 * Get multipart form headers with JWT token
 * @returns {Object} Headers object with Authorization only (Content-Type auto-set by browser)
 */
export const getMultipartHeaders = () => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
    : null;

  return {
    'Authorization': token ? `Bearer ${token}` : '',
    // Don't set Content-Type for multipart/form-data - let browser set it with boundary
  };
};

/**
 * API Endpoints
 * Centralized endpoint paths for easy maintenance
 */
export const API_ENDPOINTS = {
  // Ads
  ADS: {
    LIST: '/ads',
    CREATE: '/ads/create',
    GET: (id) => `/ads/${id}`,
    UPDATE: (id) => `/ads/${id}`,
    DELETE: (id) => `/ads/${id}`,
    CLICK: (id) => `/ads/${id}/click`,
  },

  // Projects
  PROJECTS: {
    PUBLIC_LIST: '/projects/public',
    PUBLIC_GET: (id) => `/projects/public/${id}`,
    LIST: '/admin/projects',
    CREATE: '/admin/projects',
    GET: (id) => `/admin/projects/${id}`,
    UPDATE: (id) => `/admin/projects/${id}`,
    DELETE: (id) => `/admin/projects/${id}`,
    STATS: '/admin/projects/stats',
    TOGGLE_FEATURED: (id) => `/admin/projects/${id}/toggle-featured`,
    TOGGLE_PUBLISHED: (id) => `/admin/projects/${id}/toggle-published`,
    DELETE_IMAGE: (projectId, imageId) => `/admin/projects/${projectId}/images/${imageId}`,
    BULK_UPDATE: '/admin/projects/bulk-update',
  },

  // Project Notifications
  PROJECT_NOTIFICATIONS: {
    SUBSCRIBE: (projectId) => `/projects/${projectId}/notify`,
    UNSUBSCRIBE: (projectId) => `/projects/${projectId}/notify`,
    USER_LIST: '/projects/user/notifications',
    ADMIN_STATS: (projectId) => `/projects/admin/${projectId}/notifications/stats`,
    ADMIN_LIST: (projectId) => `/projects/admin/${projectId}/notifications`,
    ADMIN_ALL: '/projects/admin/notifications',
    ADMIN_SEND: (projectId) => `/projects/admin/${projectId}/notifications/send`,
  },

  // Properties
  PROPERTIES: {
    LIST: '/properties',
    CREATE: '/properties',
    GET: (id) => `/properties/${id}`,
    UPDATE: (id) => `/properties/${id}`,
    DELETE: (id) => `/properties/${id}`,
  },

  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
};

/**
 * Build full API URL from endpoint
 * @param {string} endpoint - The API endpoint path
 * @returns {string} Full URL
 */
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Build full backend URL (for images, direct backend calls)
 * @param {string} path - The path (e.g., "/uploads/ads/image.jpg")
 * @returns {string} Full URL
 */
export const buildBackendUrl = (path) => {
  // If path already includes http, return as-is
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // Ensure path starts with /
  const cleanPath = path && path.startsWith('/') ? path : `/${path}`;
  return `${API_CONFIG.BACKEND_URL}${cleanPath}`;
};

/**
 * Environment info for debugging
 */
export const ENV_INFO = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  apiBaseUrl: API_CONFIG.BASE_URL,
  backendUrl: API_CONFIG.BACKEND_URL,
  siteUrl: API_CONFIG.SITE_URL,
};

export default API_CONFIG;
