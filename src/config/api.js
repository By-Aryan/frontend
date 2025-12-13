/**
 * Centralized API Configuration - DUAL BACKEND SETUP
 *
 * This file provides a single source of truth for all API-related configuration.
 * All components should import from this file instead of hardcoding URLs.
 *
 * ARCHITECTURE:
 * - Server 1 (Port 5001): User & Property Management
 * - Server 2 (Port 5002): Payments, Admin & Media
 */

export const API_CONFIG = {
  // ============================================
  // DUAL BACKEND URLS
  // ============================================

  // Server 1 - User & Property Management
  SERVER1_URL: process.env.NEXT_PUBLIC_SERVER1_URL || 'http://localhost:5001',
  SERVER1_API_URL: process.env.NEXT_PUBLIC_API_SERVER1_URL || 'http://localhost:5001/api/v1',

  // Server 2 - Payments, Admin & Media
  SERVER2_URL: process.env.NEXT_PUBLIC_SERVER2_URL || 'http://localhost:5002',
  SERVER2_API_URL: process.env.NEXT_PUBLIC_API_SERVER2_URL || 'http://localhost:5002/api/v1',

  // Legacy URLs (for backward compatibility)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_SERVER1_URL || 'http://localhost:5001/api/v1',
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_SERVER1_URL || 'http://localhost:5001',

  // Frontend base URL
  SITE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * API ROUTING - Determines which backend server to use
 *
 * Server 2 handles:
 * - /api/banners, /api/offers, /api/ads
 * - /api/v1/documents
 * - /api/v1/plans, /api/v1/subscription, /api/v1/BuyersPlan
 * - /api/v1/payments, /api/v1/webhooks
 * - /api/v1/admin (property operations)
 * - /api/v1/projects, /api/v1/admin/projects
 * - /api/v1/enhanced-boost
 * - /api/v1/driver
 * - File uploads
 *
 * Server 1 handles everything else (User & Property Management)
 */
const SERVER2_ENDPOINTS = [
  '/api/banners',
  '/api/offers',
  '/api/ads',
  '/api/v1/documents',
  '/api/v1/plans',
  '/api/v1/plan',
  '/api/v1/subscription',
  '/api/v1/payments',
  '/api/v1/webhooks',
  '/api/v1/BuyersPlan',
  '/api/v1/admin/properties',
  '/api/v1/admin/property',
  '/api/v1/projects',
  '/api/v1/admin/projects',
  '/api/v1/enhanced-boost',
  '/api/v1/driver',
  '/api/v1/upload',
];

/**
 * Determine which backend server to use for a given endpoint
 * @param {string} endpoint - The API endpoint path
 * @returns {Object} Object with baseURL and fullURL
 */
export const getBackendForEndpoint = (endpoint) => {
  // Normalize endpoint
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Check if endpoint should go to Server 2
  const useServer2 = SERVER2_ENDPOINTS.some(server2Endpoint =>
    normalizedEndpoint.startsWith(server2Endpoint)
  );

  if (useServer2) {
    return {
      baseURL: API_CONFIG.SERVER2_API_URL,
      backendURL: API_CONFIG.SERVER2_URL,
      server: 'Server 2 (Payments, Admin & Media)'
    };
  }

  return {
    baseURL: API_CONFIG.SERVER1_API_URL,
    backendURL: API_CONFIG.SERVER1_URL,
    server: 'Server 1 (User & Property Management)'
  };
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
 * Build full API URL from endpoint (with automatic backend routing)
 * @param {string} endpoint - The API endpoint path
 * @returns {string} Full URL
 */
export const buildApiUrl = (endpoint) => {
  const backend = getBackendForEndpoint(endpoint);

  // If endpoint already includes /api/v1, use backendURL + endpoint
  if (endpoint.includes('/api/v1') || endpoint.includes('/api/banners') || endpoint.includes('/api/offers') || endpoint.includes('/api/ads')) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${backend.backendURL}${cleanEndpoint}`;
  }

  // Otherwise, use baseURL (which includes /api/v1) + endpoint
  return `${backend.baseURL}${endpoint}`;
};

/**
 * Build full backend URL (for images, direct backend calls)
 * @param {string} path - The path (e.g., "/uploads/ads/image.jpg")
 * @param {string} preferredServer - Optional: 'server1' or 'server2' to force a specific backend
 * @returns {string} Full URL
 */
export const buildBackendUrl = (path, preferredServer = null) => {
  // If path already includes http, return as-is
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }

  // Ensure path starts with /
  const cleanPath = path && path.startsWith('/') ? path : `/${path}`;

  // Determine backend based on path or preferred server
  let backendURL;
  if (preferredServer === 'server2') {
    backendURL = API_CONFIG.SERVER2_URL;
  } else if (preferredServer === 'server1') {
    backendURL = API_CONFIG.SERVER1_URL;
  } else {
    // Auto-detect based on path
    const backend = getBackendForEndpoint(cleanPath);
    backendURL = backend.backendURL;
  }

  return `${backendURL}${cleanPath}`;
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
