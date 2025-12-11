"use client";
import ScrollToTop from "@/components/common/ScrollTop";
import Aos from "aos";
// import "../../node_modules/react-modal-video/scss/modal-video.scss";
// import "aos/dist/aos.css";
import "@/app/globals.css";
import "@/styles/hmr-fix.css";
import "@/styles/responsive.css";
import "@/styles/mobile-dashboard-nav.css";
import "@/styles/sidebar-glass.css";
import "@/styles/home-mobile-nav.css";
import "@/styles/dropdownMenu.css";
import "@/styles/user-dropdown.css";
import "rc-slider/assets/index.css";
import "../../public/css/property-details.css";
import "../../public/css/dropdown-fixes.css";
import "../../public/css/flaticon.css";
import "../../public/css/fontawesome.css";
import "../../public/scss/main.scss";
// import { DM_Sans } from "next/font/google";

import ProtectedRoute from "@/components/hoc/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { usePropertyStore } from "@/store/store";
import api from "@/axios/axios.interceptor";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Providers from "./Provider";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
if (typeof window !== "undefined") {
  require("bootstrap/dist/css/bootstrap.min.css");
  require("bootstrap/dist/js/bootstrap.bundle.min");
}
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

// if (typeof window !== "undefined") {
//   import("bootstrap");
// }
// DM_Sans font
// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
//   variable: "--body-font-family",
// });

// Metadata moved to separate metadata.js file since this is a client component

function LayoutContent({ children }) {
  const { isAuthenticated, auth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const publicRoutes = ["/", "/about", "/contactus", "/faq", "/login", "/register", "/buy/properties", "/rent/properties", "/commercial/properties", "/verification/verify-email", "/verification/verify-otp", "/create-new-password",'/free-listing','/agent-listing'];

  // Check if current page is a property listing page (should be public)
  const isPropertyListingPage = pathname.startsWith('/for-sale') || 
                                pathname.startsWith('/for-rent') || 
                                pathname.startsWith('/buy') || 
                                pathname.startsWith('/rent') ||
                                pathname.startsWith('/commercial') ||
                                pathname.startsWith('/residential') ||
                                pathname.startsWith('/property-details') ||
                                pathname.includes('/property-details') ||
                                pathname.startsWith('/single-v1') ||
                                publicRoutes.includes(pathname);

  useEffect(() => {
    // Initialize AOS animations
    Aos.init({
      duration: 1200,
      once: true,
    });

    const firstVisit = localStorage.getItem("firstVisit");

    // Don't show modal on property listing pages or if user is authenticated
    if (!isAuthenticated && !firstVisit && !auth.roles.length && !isPropertyListingPage) {
      setTimeout(() => {
        setShowModal(true);
      }, 3000);
    } else {
      setShowModal(false);
    }

  }, [pathname, isAuthenticated, auth.roles, isPropertyListingPage]);

  const { setProperties } = usePropertyStore()
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const resposne = await api.get(`/property/approved`)
        setProperties(resposne.data.data);
      } catch (error) {
        console.log('Error fetching properties in layout:', error);
        // Don't block the app if property fetch fails
      }
    }
    fetchProperty();
  }, [])

  return (
    <ProtectedRoute role={auth.roles[0] || "guest"}>
      <div className="wrapper ovh" style={{ overflow: "visible", minHeight: "100vh", height: "auto" }}>{children}</div>
    </ProtectedRoute>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f8363" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`body `} cz-shortcut-listen="false">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}