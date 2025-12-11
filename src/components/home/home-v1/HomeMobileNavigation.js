"use client";
import { useAuth } from "@/hooks/useAuth";
import { pageRoutes } from "@/utilis/common";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HomeMobileNavigation = () => {
  const { isAuthenticated, auth, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle logout function
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    closeMenu();
    router.push("/login");
  };

  // Close menu when clicking outside or on escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.home-mobile-nav')) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const homeMenuItems = [
    {
      title: "NAVIGATION",
      items: [
        {
          href: pageRoutes.home,
          icon: "flaticon-home",
          text: "Home",
        },
        {
          href: "/buy/properties",
          icon: "flaticon-search",
          text: "Buy Properties",
        },
        {
          href: "/rent/properties",
          icon: "flaticon-rent",
          text: "Rent Properties",
        },
        {
          href: "/new-projects",
          icon: "flaticon-building",
          text: "New Projects",
        },
        {
          href: "/about",
          icon: "flaticon-info",
          text: "About Us",
        },
        {
          href: "/contactus",
          icon: "flaticon-phone-call",
          text: "Contact",
        },
      ],
    },
    {
      title: "POPULAR CITIES",
      items: [
        {
          href: "/for-sale/properties/mumbai",
          icon: "flaticon-location",
          text: "Mumbai Properties",
        },
        {
          href: "/for-sale/properties/delhi",
          icon: "flaticon-location",
          text: "Delhi Properties",
        },
        {
          href: "/for-sale/properties/bangalore",
          icon: "flaticon-location",
          text: "Bangalore Properties",
        },
        {
          href: "/for-sale/properties/pune",
          icon: "flaticon-location",
          text: "Pune Properties",
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: isAuthenticated ? [
        {
          href: "/dashboard/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
        {
          href: "/dashboard/home",
          icon: "flaticon-discovery",
          text: "Dashboard",
        },
        {
          href: "/dashboard/seller/request-to-add-new-property",
          icon: "flaticon-upload",
          text: "Add Property",
        },
        {
          href: "/dashboard/user/my-favourites",
          icon: "flaticon-like",
          text: "My Favorites",
        },
        {
          href: "#",
          icon: "flaticon-logout",
          text: "Logout",
          onClick: handleLogout,
        },
      ] : [
        {
          href: "#",
          icon: "flaticon-user",
          text: "Login / Register",
          onClick: (e) => {
            e.preventDefault();
            closeMenu();
            // Trigger login modal
            const loginModal = document.getElementById('loginSignupModal');
            if (loginModal) {
              const modal = new bootstrap.Modal(loginModal);
              modal.show();
            }
          },
        },
        {
          href: "/free-listing",
          icon: "flaticon-upload",
          text: "Free Listing",
        },
        {
          href: "/agent-listing",
          icon: "flaticon-user-1",
          text: "Agent Listing",
        },
      ],
    },
  ];

  return (
    <div className="home-mobile-nav d-lg-none">
      <div className="mobile-dashboard-header">
        <div className="mobile-header-content">
          {/* Logo */}
          <div className="mobile-logo">
            <Link href={pageRoutes.home}>
              <Image
                src="/images/logoBlack.png"
                alt="Zero Brokerage Logo"
                className="logo-img"
                width={180}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <div className="mobile-user-info">
              <div className="user-avatar">
                <i className="flaticon-user"></i>
              </div>
              <div className="user-details">
                <div className="user-greeting">
                  Hi, {auth.name || localStorage.getItem("name") || "User"}
                </div>
                <div className="user-role">
                  {auth.roles?.[0] || "Guest"}
                </div>
              </div>
            </div>
          )}

          {/* Hamburger Menu Button */}
          <div className="dropdown">
            <button
              className="dropbtn"
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <div className="hamburger-menu">
                <div className="hamburger-lines">
                  <span className="line line1"></span>
                  <span className="line line2"></span>
                  <span className="line line3"></span>
                </div>
              </div>
            </button>

            {/* Mobile Menu Dropdown */}
            <div className={`dropdown-menu mobile-nav-menu ${isMenuOpen ? 'show' : ''}`}>
              {/* Quick Search */}
              <div className="px-3 py-2">
                <div className="mobile-search-box">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="form-control form-control-sm"
                    style={{
                      border: '1px solid rgba(15, 131, 99, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '14px'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const searchTerm = e.target.value;
                        if (searchTerm.trim()) {
                          closeMenu();
                          router.push(`/buy/properties?search=${encodeURIComponent(searchTerm)}`);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="dropdown-divider"></div>

              {homeMenuItems.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h6 className="dropdown-header">{section.title}</h6>
                  {section.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className={`dropdown-item ${pathname === item.href ? 'active' : ''}`}
                      onClick={(e) => {
                        if (item.onClick) {
                          item.onClick(e);
                        } else {
                          closeMenu();
                        }
                      }}
                    >
                      <i className={item.icon}></i>
                      {item.text}
                    </Link>
                  ))}
                  {sectionIndex < homeMenuItems.length - 1 && (
                    <div className="dropdown-divider"></div>
                  )}
                </div>
              ))}

              {/* Footer Info */}
              <div className="dropdown-divider"></div>
              <div className="px-3 py-2">
                <div className="text-center">
                  <small className="text-muted">
                    Zero Brokerage, Maximum Savings!
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMobileNavigation;