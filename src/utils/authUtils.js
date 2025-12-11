export const handlePostLoginRedirect = (router, role) => {
  const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");

  if (redirectAfterLogin) {
    sessionStorage.removeItem("redirectAfterLogin");
    router.replace(redirectAfterLogin);
    return;
  }

  switch (role) {
    case "seller":
      router.replace("/dashboard/seller/my-properties");
      break;
    case "buyer":
      router.replace("/dashboard/my-profile");
      break;
    case "agent":
      router.replace("/dashboard/agent/property-listed-by-me");
      break;
    case "admin":
      router.replace("/dashboard/admin/all-users");
      break;
    case "driver":
      router.replace("/dashboard/driver/assigned-properties");
      break;
    default:
      router.replace("/dashboard/my-profile");
  }
};

export const getAuthState = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const rolesStr = localStorage.getItem('roles');
    const userStr = localStorage.getItem('user');

    if (!accessToken || !refreshToken) {
      return null;
    }

    let roles = [];
    let user = {};

    try {
      if (rolesStr) roles = JSON.parse(rolesStr);
    } catch (e) {
      console.error('Error parsing roles:', e);
    }

    try {
      if (userStr) user = JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    return {
      accessToken,
      refreshToken,
      roles,
      user,
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error getting auth state:', error);
    return null;
  }
};

export const validateToken = (token) => {
  if (!token) {
    return { isValid: false, error: 'No token provided' };
  }

  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, error: 'Invalid token structure' };
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return { isValid: false, error: 'Token expired' };
      }
    }

    return { isValid: true, payload };
  } catch (error) {
    return { isValid: false, error: 'Invalid token format' };
  }
};