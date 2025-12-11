import { useAuth } from "@/hooks/useAuth";
import { getAuthState } from "@/utils/authUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, role }) => {
  const router = useRouter();
  const { isAuthenticated, auth, isInitialized } = useAuth();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const authState = getAuthState();

    // Check for property listing patterns - these should always be public
    const isPropertyListingPage = pathname.startsWith('/for-sale') || 
                                  pathname.startsWith('/for-rent') || 
                                  pathname.startsWith('/buy') || 
                                  pathname.startsWith('/rent') ||
                                  pathname.startsWith('/commercial') ||
                                  pathname.startsWith('/residential') ||
                                  pathname.startsWith('/property-details') ||
                                  pathname.includes('/property-details') ||
                                  pathname.startsWith('/single-v1') ||
                                  // Also check for dynamic routes like /buy/properties/location
                                  /^\/(buy|rent|for-sale|for-rent|commercial|residential)\//.test(pathname);
    
    // Early return for property pages - always allow public access
    if (isPropertyListingPage) {
      setIsLoading(false);
      return;
    }

    const publicRoutes = [
      "/",
      "/about",
      "/contactus",
      "/faq",
      "/login",
      "/register",
      "/buy/properties",
      "/rent/properties",
      "/commercial/properties",
      "/verification/verify-email",
      "/verification/verify-otp",
      "/create-new-password",
      '/free-listing',
      '/agent-listing',
      '/for-sale',
      '/for-rent',
      '/buy',
      '/rent',
      '/commercial',
      '/residential',
      '/single-v1/property-details',
      '/property-details' // Add property details as public route
    ];

    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + "/")
    );

    if (!isPublicRoute && !isAuthenticated) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname);
      }

      if (pathname !== '/login') {
        router.push("/login");
      }
      return;
    }

    if (isAuthenticated) {
      const restrictedRoutes = {
        admin: ["/dashboard/agent/add-property"],
        buyer: ["/dashboard/seller/my-properties", "/my-reviews", "/dashboard/agent/add-property", "/dashboard/home"],
        seller: ["/dashboard/agent/add-property", "/dashboard/my-favourites", "/dashboard/saved-search", "/my-plan"],
        agent: ["/dashboard-saved-search", "/my-favourites", "/my-plan"],
      };

      const userRole = role || auth.roles[0] || "guest";
      const isRestricted = restrictedRoutes[userRole]?.includes(pathname);

      if (isRestricted) {
        router.push("/dashboard/my-profile");
      }
    }

    setIsLoading(false);
  }, [pathname, role, router, isAuthenticated, auth.roles, auth.accessToken, isInitialized]);

  if (isLoading && !isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
