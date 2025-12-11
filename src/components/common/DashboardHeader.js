"use client";

import "@/styles/dropdownMenu.css";
import "@/styles/user-dropdown.css";
import MainMenu from "@/components/common/MainMenu";
import SidebarPanel from "@/components/common/sidebar-panel";
import { useAuth } from "@/hooks/useAuth";
import { fixDropdownPosition, initDropdownFixes } from "@/utils/dropdownUtils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosFetch from "@/hooks/useAxiosFetch";
const DashboardHeader = () => {
  const { auth, logout } = useAuth();
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Minimal scrollable dropdown styles with overflow fixes
  const dropdownStyles = `
    .user-dropdown-menu {
      background: rgba(255, 255, 255, 0.9) !important;
      backdropFilter: blur(20px) !important;
      WebkitBackdropFilter: blur(20px) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      border-radius: 16px !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1) !important;
      padding: 0 !important;
      overflow: hidden !important;
      min-width: 280px !important;
      max-width: 320px !important;
      z-index: 9999 !important;
      position: absolute !important;
      right: 0 !important;
      top: 100% !important;
      margin-top: 8px !important;
      transform-origin: top right !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      height: auto !important;
      max-height: 450px !important;
    }

    .user-dropdown-menu.show {
      display: block !important;
      animation: dropdownSlideIn 0.2s ease-out forwards !important;
    }

    @keyframes dropdownSlideIn {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .user_setting_content {
      max-height: 450px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    }

    .user-header {
      padding: 16px 20px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
      margin-bottom: 0 !important;
      background: rgba(255, 255, 255, 0.1) !important;
      backdropFilter: blur(10px) !important;
      WebkitBackdropFilter: blur(10px) !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 10 !important;
    }

    .user-avatar {
      color: #6c757d !important;
      margin-right: 12px !important;
    }

    .user-name {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 16px !important;
      font-weight: 600 !important;
      color: #1a1a1a !important;
      margin: 0 0 2px 0 !important;
      letter-spacing: -0.02em !important;
    }

    .user-role {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 13px !important;
      color: #6c757d !important;
      text-transform: capitalize !important;
      font-weight: 500 !important;
      letter-spacing: -0.01em !important;
    }

    .menu-section-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      color: #9ca3af !important;
      text-transform: uppercase !important;
      letter-spacing: 0.8px !important;
      margin: 16px 20px 8px 20px !important;
      padding: 0 !important;
      background: transparent !important;
    }

    .menu-section-title:first-child {
      margin-top: 8px !important;
    }

    .menu-items-container {
      padding: 0 8px 16px 8px !important;
    }

    .dropdown-item {
      display: flex !important;
      align-items: center !important;
      padding: 12px 16px !important;
      margin: 2px 8px !important;
      border-radius: 12px !important;
      border: none !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-weight: 500 !important;
      font-size: 14px !important;
      color: #374151 !important;
      text-decoration: none !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      cursor: pointer !important;
      background: transparent !important;
      letter-spacing: -0.01em !important;
    }

    .dropdown-item:hover {
      background-color: rgba(255, 255, 255, 0.4) !important;
      backdropFilter: blur(10px) !important;
      WebkitBackdropFilter: blur(10px) !important;
      color: #1f2937 !important;
      text-decoration: none !important;
    }

    .dropdown-item.active {
      background-color: rgba(255, 255, 255, 0.5) !important;
      backdropFilter: blur(15px) !important;
      WebkitBackdropFilter: blur(15px) !important;
      color: #1f2937 !important;
      font-weight: 600 !important;
    }

    .dropdown-item.logout:hover {
      background-color: #fef2f2 !important;
      color: #dc2626 !important;
    }

    .dropdown-item i {
      width: 16px !important;
      margin-right: 12px !important;
      font-size: 14px !important;
      color: #6b7280 !important;
      flex-shrink: 0 !important;
    }

    .dropdown-item:hover i {
      color: #374151 !important;
    }

    .dropdown-item.active i {
      color: #1f2937 !important;
    }

    .dropdown-item.logout:hover i {
      color: #dc2626 !important;
    }

    /* Custom scrollbar styling */
    .user_setting_content::-webkit-scrollbar {
      width: 6px !important;
    }

    .user_setting_content::-webkit-scrollbar-track {
      background: #f1f3f4 !important;
      border-radius: 3px !important;
    }

    .user_setting_content::-webkit-scrollbar-thumb {
      background: #d1d5db !important;
      border-radius: 3px !important;
    }

    .user_setting_content::-webkit-scrollbar-thumb:hover {
      background: #9ca3af !important;
    }

    /* Mobile Responsive Styles */
    @media (max-width: 768px) {
      .user-dropdown-menu {
        position: fixed !important;
        top: 70px !important;
        right: 8px !important;
        left: 8px !important;
        min-width: auto !important;
        max-width: none !important;
        width: auto !important;
        margin-top: 0 !important;
        max-height: calc(100vh - 80px) !important;
        border-radius: 16px !important;
      }

      .user_setting_content {
        max-height: calc(100vh - 80px) !important;
      }

      .user-header {
        padding: 20px !important;
      }

      .dropdown-item {
        padding: 12px 16px !important;
        font-size: 15px !important;
      }

      .dropdown-item i {
        width: 18px !important;
        margin-right: 14px !important;
        font-size: 15px !important;
      }

      .menu-section-title {
        margin: 20px 20px 12px 20px !important;
        font-size: 11px !important;
      }

      .menu-items-container {
        padding: 0 12px 20px 12px !important;
      }
    }

    @media (max-width: 480px) {
      .user-dropdown-menu {
        right: 4px !important;
        left: 4px !important;
      }
    }

    /* Positioning fix for better alignment */
    .dropdown.show .dropdown-menu {
      transform: translate3d(0, 0, 0) !important;
    }

    /* Ensure proper background for all states */
    a.dropdown-item,
    .dropdown-item a {
      background: transparent !important;
    }

    a.dropdown-item:hover,
    .dropdown-item a:hover {
      background-color: #f3f4f6 !important;
      color: #1f2937 !important;
      text-decoration: none !important;
    }

    a.dropdown-item.active,
    .dropdown-item a.active {
      background-color: #e5e7eb !important;
      color: #1f2937 !important;
    }

    a.dropdown-item.logout:hover,
    .dropdown-item a.logout:hover {
      background-color: #fef2f2 !important;
      color: #dc2626 !important;
    }
  `;
  
  // Only fetch buyer contacts for authenticated buyers
  const shouldFetchContacts = auth.accessToken && auth.roles && auth.roles.length > 0 && auth.roles[0] === 'buyer';
  
  const {
    data: remaningContactsData,
    isLoading,
    refetch, // <- get refetch
  } = useAxiosFetch(
    shouldFetchContacts ? "/profile/get-buyer-remaning-contacts" : null
  );

  const handleRefresh = () => {
    refetch(); // this will manually refetch the query
  };
  useEffect(() => {
    const userRole = auth.roles[0] || "";
    setRole(userRole);
  }, [auth.roles]);

  // Handle screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user_setting")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    router.push("/login");
  };

  const buyermenuItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard/message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard/user/my-favourites",
          icon: "flaticon-like",
          text: "My Favorites",
        },
        {
          href: "/saved-search",
          icon: "flaticon-search-2",
          text: "Saved Search",
        },
        {
          href: "/dashboard/user/payments",
          icon: "flaticon-review",
          text: "Payments",
        },
        {
          href: "/dashboard/user/wallet",
          icon: "flaticon-review",
          text: "Wallet",
        },
        {
          href: "/my-plan",
          icon: "flaticon-protection",
          text: "My Plan",
        },
        {
          href: "#",
          icon: "flaticon-logout",
          text: "Logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const sellermenuItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/dashboard/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard/seller/my-properties",
          icon: "flaticon-home",
          text: "My Listed Properties",
        },
        {
          href: "/dashboard/seller/request-to-add-new-property",
          icon: "flaticon-upload",
          text: "Request to add new Property",
        },
        {
          href: "/dashboard/seller/my-requests",
          icon: "flaticon-protection",
          text: "Requests accepted by Agents",
        },
        
        // {
        //   href: "/dashboard/seller/my-requests",
        //   icon: "flaticon-protection",
        //   text: "My Requests",
        // },
        // {
        //   href: "/dashboard-reviews",
        //   icon: "flaticon-review",
        //   text: "Reviews",
        // },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "#",
          icon: "flaticon-logout",
          text: "Logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const agentmenuItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/dashboard/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard-message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard/agent/property-listed-by-me",
          icon: "flaticon-home",
          text: "Listed by Me",
        },
        {
          href: "/dashboard/agent/delist-management",
          icon: "flaticon-minus",
          text: "Delist Management",
        },
        {
          href: "/dashboard/agent/seller-account-requests",
          icon: "flaticon-user-1",
          text: "Seller Account",
        },
        {
          href: "/dashboard/agent/requests",
          icon: "flaticon-clock",
          text: "Seller's Requests",
        },
        {
          href: "/dashboard/agent/drivers-requests",
          icon: "flaticon-clock",
          text: "Driver's Requests",
        },
        {
          href: "/dashboard/agent/create-driver",
          icon: "flaticon-user",
          text: "Create Driver",
        },
        // {
        //   href: "my-reviews",
        //   icon: "flaticon-review",
        //   text: "Reviews",
        // },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "#",
          icon: "flaticon-logout",
          text: "Logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const adminmenuItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard/message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard/admin/agent-request",
          icon: "flaticon-new-tab",
          text: "Agent Requests",
        },
        {
          href: "/dashboard/admin/create-agent",
          icon: "flaticon-new-tab",
          text: "Create Agent",
        },
        {
          href: "/dashboard/admin/properties",
          icon: "flaticon-home",
          text: "Properties",
        },
        {
          href: "/admin/properties",
          icon: "flaticon-home",
          text: "Admin Properties",
        },
        {
          href: "/dashboard/admin/ads",
          icon: "flaticon-megaphone",
          text: "Ads Management",
        },
        {
          href: "/admin/banners",
          icon: "flaticon-picture",
          text: "Banner Management",
        },
        {
          href: "/dashboard/admin/all-users",
          icon: "flaticon-user",
          text: "All Users",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "#",
          icon: "flaticon-logout",
          text: "Logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const drivermenuItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard/message",
          icon: "flaticon-chat-1",
          text: "Message",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        // {
        //   href: "/dashboard/driver/add-media",
        //   icon: "flaticon-new-tab",
        //   text: "Add Media",
        // },
        {
          href: "/dashboard/driver/uploaded-media",
          icon: "flaticon-clock",
          text: "Uploaded Media",
        },
        {
          href: "/dashboard/driver/uploaded-media",
          icon: "flaticon-home",
          text: "Assigned Properties",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "#",
          icon: "flaticon-logout",
          text: "Logout",
          onClick: handleLogout,
        },
      ],
    },
  ];

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });
    
    setIsDropdownOpen(!isDropdownOpen);
    
    if (!isDropdownOpen) {
      setTimeout(() => {
        fixDropdownPosition();
      }, 10);
    }
  };

  // Close dropdown when clicking outside and initialize dropdown fixes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    const cleanup = initDropdownFixes();
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      cleanup();
    };
  }, []);

  return (
    <>
      <style jsx>{dropdownStyles}</style>
      <>
        <header 
          className="header-nav nav-homepage-style light-header position-fixed menu-home4 main-menu w-100 glass-nav"
          style={{
            zIndex: 1000
          }}
        >
          <nav className="posr w-100">
            <div className="container-fluid posr menu_bdrt1 px-3 px-xl-4">
              <div className="row align-items-center justify-content-between w-100">
                {/* Left: Logo + Menu */}
                <div className="col-auto d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "220px" }}
                  >
                    <Link className="logo" href="/">
                      <Image
                        width={160}
                        height={60}
                        src="/images/logoBlack.png"
                        alt="Header Logo"
                        style={{
                          filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"
                        }}
                      />
                    </Link>
                  </div>
                  <div className="d-none d-lg-block ms-4">
                    <MainMenu />
                  </div>
                </div>

                {/* Right: User Controls */}
                <div className="col-auto">
                  <ul className="d-flex align-items-center gap-2 mb-0 list-unstyled">
                    {/* New Projects Link - Visible on smaller screens */}
                    <li className="d-lg-none">
                      <Link 
                        className="text-center me-2 d-flex align-items-center justify-content-center glass-btn" 
                        href="/projects-by-country/uae"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          background: "rgba(15, 131, 99, 0.9)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          textDecoration: "none",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          whiteSpace: "nowrap",
                          letterSpacing: "-0.01em",
                          boxShadow: "0 4px 12px rgba(15, 131, 99, 0.3)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(10, 110, 82, 0.95)";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 8px 20px rgba(15, 131, 99, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(15, 131, 99, 0.9)";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(15, 131, 99, 0.3)";
                        }}
                      >
                        New Projects
                      </Link>
                    </li>

                    {/* Also add for medium screens that can see the main menu */}
                    <li className="d-none d-lg-block d-xl-none">
                      <Link 
                        className="text-center me-2 d-flex align-items-center justify-content-center glass-btn" 
                        href="/projects-by-country/uae"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "12px",
                          background: "rgba(15, 131, 99, 0.9)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "600",
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          textDecoration: "none",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          whiteSpace: "nowrap",
                          letterSpacing: "-0.01em",
                          boxShadow: "0 4px 12px rgba(15, 131, 99, 0.3)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(10, 110, 82, 0.95)";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 8px 20px rgba(15, 131, 99, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(15, 131, 99, 0.9)";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(15, 131, 99, 0.3)";
                        }}
                      >
                        New Projects
                      </Link>
                    </li>

                    {/* Offcanvas button for mobile */}
                    <li className="d-lg-none">
                      <button
                        className="sidemenu-btn d-flex align-items-center justify-content-center glass-icon-btn border-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#SidebarPanel"
                        aria-controls="SidebarPanel"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "rgba(248, 249, 250, 0.8)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        <Image
                          width={20}
                          height={8}
                          src="/images/zero-broker/icon/menu.svg"
                          alt="menu"
                        />
                      </button>
                    </li>

                    {/* ⭐ Remaining Contacts Chip */}
                    {role === "buyer" && (
                      <li className="d-none d-lg-flex align-items-center">
                        <div
                          className="d-flex align-items-center glass-chip"
                          style={{
                            background: "rgba(230, 244, 234, 0.8)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#1c7c54",
                            borderRadius: "24px",
                            padding: "10px 18px",
                            fontSize: "13px",
                            fontWeight: "600",
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            gap: "8px",
                            whiteSpace: "nowrap",
                            letterSpacing: "-0.01em",
                            boxShadow: "0 4px 12px rgba(28, 124, 84, 0.15)"
                          }}
                        >
                          <span className="d-none d-xl-inline">
                            Buy Contacts:{" "}
                            {remaningContactsData?.data?.buy_property_contacts}{" "}
                            | Rent Contacts:{" "}
                            {remaningContactsData?.data?.rent_property_contacts}
                          </span>
                          <span className="d-xl-none">
                            B: {remaningContactsData?.data?.buy_property_contacts}{" "}
                            | R: {remaningContactsData?.data?.rent_property_contacts}
                          </span>
                          <button
                            className="btn p-0 border-0 bg-transparent d-flex align-items-center justify-content-center"
                            title="Refresh"
                            onClick={handleRefresh}
                            style={{ width: "16px", height: "16px" }}
                          >
                            <i className="fas fa-sync-alt" style={{ fontSize: "11px" }} />
                          </button>
                        </div>
                      </li>
                    )}

                    {/* Email Icon */}
                    <li className="d-none d-lg-block">
                      <Link 
                        className="text-center me-2 me-xl-3 d-flex align-items-center justify-content-center glass-icon-btn" 
                        href="/login"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "rgba(248, 249, 250, 0.8)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(233, 236, 239, 0.9)";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(248, 249, 250, 0.8)";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <span className="flaticon-email" style={{ fontSize: "16px", color: "#6c757d" }} />
                      </Link>
                    </li>
                    {/* Notification Icon */}
                    <li className="d-none d-lg-block">
                      <a 
                        className="text-center me-2 me-xl-3 d-flex align-items-center justify-content-center glass-icon-btn" 
                        href="#"
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "rgba(248, 249, 250, 0.8)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(233, 236, 239, 0.9)";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(248, 249, 250, 0.8)";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <span className="flaticon-bell" style={{ fontSize: "16px", color: "#6c757d" }} />
                      </a>
                    </li>

                    {/* Avatar Dropdown */}
                    <li className="user_setting position-relative">
                      <div className="dropdown">
                        <a 
                          className="btn p-0 border-0 glass-icon-btn" 
                          href="#" 
                          onClick={toggleDropdown}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "rgba(248, 249, 250, 0.8)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "2px solid rgba(255, 255, 255, 0.3)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "rgba(233, 236, 239, 0.9)";
                            e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "rgba(248, 249, 250, 0.8)";
                            e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                          }}
                        >
                          <span
                            className="fas fa-user text-muted"
                            style={{ fontSize: "18px" }}
                          />
                        </a>
                        <div
                          className={`dropdown-menu dropdown-menu-end user-dropdown-menu ${
                            isDropdownOpen ? "show" : ""
                          }`}
                        >
                          <div className="user_setting_content p-0">
                            {/* User info header */}
                            {/* <div className="user-info-header px-4 py-4">
                              <div className="d-flex align-items-center gap-3">
                                <div 
                                  className="d-flex align-items-center justify-content-center rounded-circle position-relative"
                                  style={{ 
                                    width: "50px", 
                                    height: "50px",
                                    background: "rgba(255, 255, 255, 0.2)",
                                    backdropFilter: "blur(10px)",
                                    border: "2px solid rgba(255, 255, 255, 0.3)"
                                  }}
                                >
                                  <span className="fas fa-user text-white" style={{ fontSize: "20px" }} />
                                  <div 
                                    className="position-absolute"
                                    style={{
                                      bottom: "-2px",
                                      right: "-2px",
                                      width: "16px",
                                      height: "16px",
                                      background: "#4ade80",
                                      borderRadius: "50%",
                                      border: "2px solid white"
                                    }}
                                  ></div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-bold text-white mb-1" style={{ fontSize: "16px" }}>
                                    {auth.user?.name || "User"}
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <span 
                                      className="badge text-white px-3 py-1 rounded-pill" 
                                      style={{ 
                                        background: "rgba(255, 255, 255, 0.25)",
                                        backdropFilter: "blur(10px)",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                      }}
                                    >
                                      {role}
                                    </span>
                                    <span 
                                      className="text-white-50" 
                                      style={{ fontSize: "12px" }}
                                    >
                                      • Online
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div> */}
                            
                            {/* User header */}
                            <div className="user-header">
                              <div className="d-flex align-items-center">
                                <div className="user-avatar">
                                  <span className="fas fa-user-circle" style={{ fontSize: "40px" }} />
                                </div>
                                <div className="flex-grow-1">
                                  <h6 className="user-name">{auth?.user?.full_name || "User"}</h6>
                                  <div className="user-role">{role?.charAt(0)?.toUpperCase() + role?.slice(1) || "User"}</div>
                                </div>
                              </div>
                            </div>

                            {/* Menu items */}
                            <div className="menu-items-container">
                              {(role === "seller" ? sellermenuItems :
                                role === "buyer" ? buyermenuItems :
                                role === "agent" ? agentmenuItems :
                                role === "admin" ? adminmenuItems :
                                role === "driver" ? drivermenuItems : [])
                                .map((section, sectionIndex) => (
                                  <div key={sectionIndex}>
                                    <div className="menu-section-title">
                                      {section.title}
                                    </div>
                                    {section.items.map((item, itemIndex) => (
                                      item.onClick ? (
                                        <a
                                          key={itemIndex}
                                          className={`dropdown-item ${item.text === "Logout" ? "logout" : ""}`}
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setIsDropdownOpen(false);
                                            item.onClick(e);
                                          }}
                                        >
                                          <i className={item.icon} />
                                          {item.text}
                                        </a>
                                      ) : (
                                        <Link
                                          key={itemIndex}
                                          className={`dropdown-item ${pathname === item.href ? "active" : ""}`}
                                          href={item.href}
                                          onClick={() => setIsDropdownOpen(false)}
                                        >
                                          <i className={item.icon} />
                                          {item.text}
                                        </Link>
                                      )
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>

      </>
      {/* End Header */}

      {/* Mobile Sidebar Panel */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
        data-bs-backdrop="true"
        data-bs-keyboard="true"
      >
        <SidebarPanel />
      </div>
      {/* Sidebar Panel End */}
    </>
  );
};

export default DashboardHeader;
