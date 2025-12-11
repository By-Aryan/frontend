// import axios from "axios";
// const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

// const api = axios.create({
//   baseURL: api_url,
//   credentials: "include",
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// })

// const getCookieValue = (name) => {
//   if (typeof window === 'undefined') return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// };

// let isRefreshing = false;
// let pendingRequests = [];

// const refreshAuthToken = async () => {
//   if (typeof window === 'undefined') return null;

//   const refreshToken = localStorage.getItem('refreshToken');
//   if (!refreshToken) {
//     return null;
//   }

//   try {
//     console.log('🔄 Attempting to refresh access token using refresh token...');

//     const response = await axios.post(`${api_url}/auth/refresh-token`, {
//       refreshToken
//     }, {
//       withCredentials: true
//     });

//     if (response.data?.accessToken) {

//       localStorage.setItem('accessToken', response.data.accessToken);
//       if (response.data.refreshToken) {
//         localStorage.setItem('refreshToken', response.data.refreshToken);
//       }

//       return response.data.accessToken;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return null;
//   }
// };

// api.interceptors.request.use((config) => {
//   const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   if (config.data instanceof FormData) {
//     config.headers['Content-Type'] = 'multipart/form-data';
//   }

//   return config
// },
//   (error) => {
//     return Promise.reject(error);
//   })

// api.interceptors.response.use(
//   (response) => {
//     if (response.config.url?.includes('/auth/login') || response.config.url?.includes('/login')) {
//       const responseData = response.data;
//       let accessToken = responseData?.data?.accessToken || responseData?.data?.access_token || responseData?.accessToken || responseData?.access_token;
//       let refreshToken = responseData?.data?.refreshToken || responseData?.data?.refresh_token || responseData?.refreshToken || responseData?.refresh_token;

//       if (!accessToken || !refreshToken) {
//         accessToken = accessToken || getCookieValue('accessToken');
//         refreshToken = refreshToken || getCookieValue('refreshToken');
//       }

//       if (accessToken && refreshToken && typeof window !== 'undefined') {
//         localStorage.setItem('accessToken', accessToken);
//         localStorage.setItem('refreshToken', refreshToken);

//         if (!localStorage.getItem('loginSuccessfull')) {
//           localStorage.setItem('loginSuccessfull', 'true');
//         }
//       }
//     }

//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           pendingRequests.push({
//             resolve,
//             reject,
//             config: originalRequest
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const newAccessToken = await refreshAuthToken();

//         if (newAccessToken) {
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//           pendingRequests.forEach(request => {
//             request.config.headers.Authorization = `Bearer ${newAccessToken}`;
//             request.resolve(api(request.config));
//           });

//           pendingRequests = [];

//           return api(originalRequest);
//         } else {
//           pendingRequests.forEach(request => {
//             request.reject(error);
//           });

//           pendingRequests = [];

//           return Promise.reject(error);
//         }
//       } catch (refreshError) {
//         return Promise.reject(error);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api
import axios from "axios";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: api_url,
  credentials: "include",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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
  
  // Check if we're on a public page that doesn't require authentication
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
  
  // Clear any session storage items
  sessionStorage.removeItem('redirectAfterLogin');
  sessionStorage.removeItem('e');
  sessionStorage.removeItem('ot');
  
  // Clear cookies if any
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Dispatch custom event for other components to listen
  window.dispatchEvent(new CustomEvent('forceLogout'));
  
  // Only redirect to login if not on a public page
  if (!isPublicPage) {
    console.log('🔐 Redirecting to login page...');
    window.location.href = '/login';
  } else {
    console.log('🔓 On public page, not redirecting to login');
  }
};

let isRefreshing = false;
let pendingRequests = [];

const refreshAuthToken = async () => {
  if (typeof window === 'undefined') return null;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || refreshToken === 'null') {
    console.log('❌ No refresh token found');
    
    // Check if we're making a request for a public endpoint
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
    
    // Only force logout if not on a public page
    if (!isPublicPage) {
      forceLogout();
    }
    return null;
  }

  try {
    console.log('🔄 Attempting to refresh access token using refresh token...');

    const response = await axios.post(`${api_url}/auth/refresh-token`, {
      refreshToken
    }, {
      withCredentials: true,
      timeout: 10000, // 10 second timeout
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
    console.log('❌ Token refresh failed:', error.response?.status, error.response?.data?.message);
    
    // If refresh token is invalid or expired, force logout
    if (error.response?.status === 401 || error.response?.status === 403) {
      forceLogout();
    }
    
    return null;
  }
};

api.interceptors.request.use((config) => {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;

  // If token is invalid, clear it
  if (accessToken === 'null' || accessToken === null) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // List of endpoints that don't require authentication
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
    '/property-filter/filter',
    '/property-filter/filter-options',
    '/property-filter/property-stats',
    '/property-filter/search',
    '/property-filter/similar/',
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

  // Check if the current request is to a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  // Only add Authorization header if:
  // 1. We have an access token AND
  // 2. This is NOT a public endpoint OR the request explicitly requires auth
  if (accessToken && accessToken !== 'null' && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Add cache control headers for dynamic endpoints to prevent 304 responses
  if (config.url?.includes('/subscription/') || 
      config.url?.includes('/property/boosted-properties') ||
      config.url?.includes('/property/analytics/') ||
      config.url?.includes('/property/getProperties') ||
      config.url?.includes('/enhanced-boost/') ||
      config.url?.includes('/profile/get-buyer-remaning-contacts') ||
      config.url?.includes('/profile/contact-credits')) {
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
  }

  if (config.data instanceof FormData) {
    // Don't set Content-Type for FormData - let browser set it with boundary
    delete config.headers['Content-Type'];
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    // Handle login response
    if (response.config.url?.includes('/auth/login') || response.config.url?.includes('/login')) {
      const responseData = response.data;
      let accessToken = responseData?.data?.accessToken || responseData?.data?.access_token || responseData?.accessToken || responseData?.access_token;
      let refreshToken = responseData?.data?.refreshToken || responseData?.data?.refresh_token || responseData?.refreshToken || responseData?.refresh_token;

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

    // List of endpoints that don't require authentication (same as in request interceptor)
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
      '/property/filter',
      '/filter-options',
      '/property/filter-options',
      '/property-stats',
      '/search',
      '/similar/',
      '/ads',
      '/ads/',
      '/auth/login',
      '/auth/signup',
      '/auth/verify-otp',
      '/auth/generate-otp',
      '/auth/reset-password',
      '/auth/google-auth',
      '/auth/free-listing'
    ];

    // Check if the current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      // If this is a public endpoint, don't try to refresh token, just retry without auth
      if (isPublicEndpoint) {
        console.log('🔓 Public endpoint received 401, retrying without authorization header');
        delete originalRequest.headers.Authorization;
        originalRequest._retry = true;
        return api(originalRequest);
      }

      // Avoid infinite loops
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.log('❌ Refresh token endpoint failed, forcing logout');
        forceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve,
            reject,
            config: originalRequest
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAuthToken();

        if (newAccessToken) {
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry all pending requests with new token
          pendingRequests.forEach(request => {
            request.config.headers.Authorization = `Bearer ${newAccessToken}`;
            request.resolve(api(request.config));
          });

          pendingRequests = [];
          isRefreshing = false;

          // Retry the original request
          return api(originalRequest);
        } else {
          // Refresh failed, reject all pending requests
          pendingRequests.forEach(request => {
            request.reject(error);
          });

          pendingRequests = [];
          isRefreshing = false;
          
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.log('❌ Error during token refresh process:', refreshError);
        
        pendingRequests.forEach(request => {
          request.reject(refreshError);
        });

        pendingRequests = [];
        isRefreshing = false;
        
        return Promise.reject(error);
      }
    }

    // Handle other authentication errors
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      console.log('❌ Forbidden access, may need to force logout');
      // You can decide whether to force logout on 403 or not
      // forceLogout();
    }

    return Promise.reject(error);
  }
);

export default api;