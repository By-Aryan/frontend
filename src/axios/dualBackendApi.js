/**
 * Dual Backend API Client
 *
 * This module creates separate axios instances for each backend server
 * and provides a smart routing wrapper that automatically directs requests
 * to the correct backend based on the endpoint.
 *
 * Architecture:
 * - Server 1 (5001): User & Property Management
 * - Server 2 (5002): Payments, Admin & Media
 */

import axios from "axios";
import { getBackendForEndpoint } from "../config/api";

// ============================================
// AXIOS INSTANCES FOR EACH SERVER
// ============================================

const server1_url = process.env.NEXT_PUBLIC_API_SERVER1_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';
const server2_url = process.env.NEXT_PUBLIC_API_SERVER2_URL || 'http://localhost:5002/api/v1';

// Server 1 Instance - User & Property Management
const apiServer1 = axios.create({
  baseURL: server1_url,
  credentials: "include",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Server 2 Instance - Payments, Admin & Media
const apiServer2 = axios.create({
  baseURL: server2_url,
  credentials: "include",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ============================================
// SHARED HELPER FUNCTIONS
// ============================================

const getCookieValue = (name) => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Force logout function
const forceLogout = () => {
  if (typeof window === 'undefined') return;

  console.log('🚪 Forcing logout due to authentication failure...');

  // Check if we're on a public page
  const currentPath = window.location.pathname;
  const isPublicPage = currentPath.startsWith('/for-sale') ||
                       currentPath.startsWith('/for-rent') ||
                       currentPath.startsWith('/buy') ||
                       currentPath.startsWith('/rent') ||
                       currentPath.startsWith('/commercial') ||
                       currentPath.startsWith('/residential') ||
                       currentPath.startsWith('/single-v1') ||
                       currentPath.startsWith('/property-details') ||
                       currentPath === '/' ||
                       currentPath.startsWith('/about') ||
                       currentPath.startsWith('/contact') ||
                       currentPath.startsWith('/faq');

  // Clear all authentication data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('loginSuccessfull');
  localStorage.removeItem('name');
  localStorage.removeItem('id');
  localStorage.removeItem('isPlanActive');
  localStorage.removeItem('remainingContacts');

  sessionStorage.removeItem('redirectAfterLogin');
  sessionStorage.removeItem('e');
  sessionStorage.removeItem('ot');

  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.dispatchEvent(new CustomEvent('forceLogout'));

  if (!isPublicPage) {
    window.location.href = '/login';
  }
};

let isRefreshing = false;
let pendingRequests = [];

const refreshAuthToken = async () => {
  if (typeof window === 'undefined') return null;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || refreshToken === 'null') {
    console.log('❌ No refresh token found');
    const currentPath = window.location.pathname;
    const isPublicPage = currentPath.startsWith('/for-sale') ||
                         currentPath.startsWith('/for-rent') ||
                         currentPath.startsWith('/buy') ||
                         currentPath.startsWith('/rent') ||
                         currentPath === '/';

    if (!isPublicPage) {
      forceLogout();
    }
    return null;
  }

  try {
    console.log('🔄 Attempting to refresh access token...');

    const response = await axios.post(`${server1_url}/auth/refresh-token`, {
      refreshToken
    }, {
      withCredentials: true,
      timeout: 10000,
    });

    if (response.data?.accessToken || response.data?.data?.accessToken) {
      const accessToken = response.data?.data?.accessToken || response.data?.accessToken;
      const newRefreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      console.log('✅ Token refresh successful');
      return accessToken;
    } else {
      console.log('❌ Token refresh failed - no tokens in response');
      forceLogout();
      return null;
    }
  } catch (error) {
    console.log('❌ Token refresh failed:', error.response?.status);

    if (error.response?.status === 401 || error.response?.status === 403) {
      forceLogout();
    }

    return null;
  }
};

// ============================================
// SHARED INTERCEPTORS SETUP
// ============================================

const publicEndpoints = [
  '/property/approved',
  '/property/approvedbyId',
  '/property/propertyById/',
  '/property/property-location-count',
  '/property/property-types-count',
  '/property/featured',
  '/property/filter',
  '/property/filter-options',
  '/property/property-stats',
  '/property/search',
  '/property/similar/',
  '/ads',
  '/ads/',
  '/auth/login',
  '/auth/signup',
  '/auth/verify-otp',
  '/auth/generate-otp',
  '/auth/reset-password',
  '/auth/google-auth',
  '/auth/free-listing',
  '/projects/public'
];

const setupRequestInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

    if (accessToken === 'null' || accessToken === null) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (accessToken && accessToken !== 'null' && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Cache control for dynamic endpoints
    if (config.url?.includes('/subscription/') ||
        config.url?.includes('/property/boosted-properties') ||
        config.url?.includes('/enhanced-boost/')) {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  }, (error) => {
    return Promise.reject(error);
  });
};

const setupResponseInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      // Handle login response
      if (response.config.url?.includes('/auth/login') || response.config.url?.includes('/login')) {
        const responseData = response.data;
        let accessToken = responseData?.data?.accessToken || responseData?.accessToken;
        let refreshToken = responseData?.data?.refreshToken || responseData?.refreshToken;

        if (!accessToken || !refreshToken) {
          accessToken = accessToken || getCookieValue('accessToken');
          refreshToken = refreshToken || getCookieValue('refreshToken');
        }

        if (accessToken && refreshToken && typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('loginSuccessfull', 'true');
        }
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      const isPublicEndpoint = publicEndpoints.some(endpoint =>
        originalRequest.url?.includes(endpoint)
      );

      if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
        if (isPublicEndpoint) {
          console.log('🔓 Public endpoint received 401, retrying without auth');
          delete originalRequest.headers.Authorization;
          originalRequest._retry = true;
          return axiosInstance(originalRequest);
        }

        if (originalRequest.url?.includes('/auth/refresh-token')) {
          console.log('❌ Refresh token endpoint failed');
          forceLogout();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingRequests.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAuthToken();

          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            pendingRequests.forEach(request => {
              request.config.headers.Authorization = `Bearer ${newAccessToken}`;
              request.resolve(axiosInstance(request.config));
            });

            pendingRequests = [];
            isRefreshing = false;

            return axiosInstance(originalRequest);
          } else {
            pendingRequests.forEach(request => request.reject(error));
            pendingRequests = [];
            isRefreshing = false;
            return Promise.reject(error);
          }
        } catch (refreshError) {
          pendingRequests.forEach(request => request.reject(refreshError));
          pendingRequests = [];
          isRefreshing = false;
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Setup interceptors for both instances
setupRequestInterceptor(apiServer1);
setupRequestInterceptor(apiServer2);
setupResponseInterceptor(apiServer1);
setupResponseInterceptor(apiServer2);

// ============================================
// SMART ROUTING WRAPPER
// ============================================

/**
 * Smart API client that routes requests to the correct backend
 */
const createSmartApi = () => {
  const selectBackend = (url) => {
    const backend = getBackendForEndpoint(url);

    // Log which server is being used (for debugging)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔀 Routing to ${backend.server}: ${url}`);
    }

    return backend.server.includes('Server 2') ? apiServer2 : apiServer1;
  };

  return {
    get: (url, config) => selectBackend(url).get(url, config),
    post: (url, data, config) => selectBackend(url).post(url, data, config),
    put: (url, data, config) => selectBackend(url).put(url, data, config),
    patch: (url, data, config) => selectBackend(url).patch(url, data, config),
    delete: (url, config) => selectBackend(url).delete(url, config),

    // Direct access to individual servers (if needed)
    server1: apiServer1,
    server2: apiServer2,
  };
};

const smartApi = createSmartApi();

export default smartApi;
export { apiServer1, apiServer2 };
