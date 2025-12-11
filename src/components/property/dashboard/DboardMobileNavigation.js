"use client";
import { useAuth } from "@/hooks/useAuth";
import RoleSwitch from "@/components/common/role-switch-buttons/RoleSwitch";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DboardMobileNavigation = () => {
  const { auth, logout } = useAuth();
  const [role, setRole] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userRole = auth.roles?.[0] || "";
    setRole(userRole);
  }, [auth.roles]);

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.dropdown')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Handle logout function
  const handleLogout = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    logout();
    router.push("/login");
    setIsMenuOpen(false);
  };

  // Handle menu item click
  const handleMenuItemClick = (onClick, event) => {
    setIsMenuOpen(false);
    if (onClick) {
      onClick(event);
    }
  };

  const getNavigationItems = () => {
    switch (role) {
      case "buyer":
        return [
          {
            title: "MAIN",
            items: [
              { href: "/dashboard/home", text: "Dashboard", icon: "flaticon-discovery" },
              { href: "/dashboard/my-profile", text: "My Profile", icon: "flaticon-user" },
            ],
          },
          {
            title: "MANAGE ACCOUNT",
            items: [
              { href: "/dashboard/user/my-favourites", text: "My Favorites", icon: "flaticon-like" },
              { href: "/dashboard/user/payments", text: "Payments", icon: "flaticon-credit-card" },
              { href: "/dashboard/user/wallet", text: "Wallet", icon: "flaticon-wallet" },
              { href: "/dashboard/my-plan", text: "Number Views by me", icon: "flaticon-protection" },
              { href: "#", text: "Logout", icon: "flaticon-logout", onClick: handleLogout },
            ],
          },
        ];
      case "seller":
        return [
          {
            title: "MAIN",
            items: [
              { href: "/dashboard/home", text: "Dashboard", icon: "flaticon-discovery" },
              { href: "/dashboard/my-profile", text: "My Profile", icon: "flaticon-user" },
            ],
          },
          {
            title: "MANAGE LISTINGS",
            items: [
              { href: "/dashboard/seller/my-properties", text: "My Listed Properties", icon: "flaticon-home" },
              { href: "/dashboard/seller/my-boosted-properties", text: "Boosted Properties", icon: "flaticon-rocket" },
              { href: "/dashboard/seller/request-to-add-new-property", text: "Request to add new Property", icon: "flaticon-upload" },
              { href: "/dashboard/seller/my-requests", text: "Requests accepted by Agents", icon: "flaticon-protection" },
            ],
          },
          {
            title: "MANAGE ACCOUNT",
            items: [
              { href: "#", text: "Logout", icon: "flaticon-logout", onClick: handleLogout },
            ],
          },
        ];
      case "agent":
        return [
          {
            title: "MAIN",
            items: [
              { href: "/dashboard/home", text: "Dashboard", icon: "flaticon-discovery" },
              { href: "/dashboard/my-profile", text: "My Profile", icon: "flaticon-user" },
            ],
          },
          {
            title: "MANAGE LISTINGS",
            items: [
              { href: "/dashboard/agent/property-listed-by-me", text: "Listed by Me", icon: "flaticon-home" },
              { href: "/dashboard/agent/delist-management", text: "Delist Management", icon: "flaticon-minus" },
              { href: "/dashboard/agent/seller-account-requests", text: "Seller Account", icon: "flaticon-user-1" },
              { href: "/dashboard/agent/free-listing-requests", text: "Free Listing Requests", icon: "flaticon-user-1" },
              { href: "/dashboard/agent/requests", text: "Seller's Requests", icon: "flaticon-clock" },
              { href: "/dashboard/agent/drivers-requests", text: "Driver's Requests", icon: "flaticon-clock" },
              { href: "/dashboard/agent/assigned-drivers", text: "Assigned Drivers", icon: "flaticon-clock" },
              { href: "/dashboard/agent/create-driver", text: "Create Driver", icon: "flaticon-user" },
              { href: "/dashboard/agent/delist-notifications", text: "Delist Notifications", icon: "flaticon-delete" },
            ],
          },
          {
            title: "MANAGE ACCOUNT",
            items: [
              { href: "/dashboard/user/my-favourites", text: "My Favorites", icon: "flaticon-like" },
              { href: "#", text: "Logout", icon: "flaticon-logout", onClick: handleLogout },
            ],
          },
        ];
      case "admin":
      case "sub-admin":
        return [
          {
            title: "MAIN",
            items: [
              { href: "/dashboard/home", text: "Dashboard", icon: "flaticon-discovery" },
              { href: "/dashboard/my-profile", text: "My Profile", icon: "flaticon-user" },
            ],
          },
          {
            title: "MANAGE LISTINGS",
            items: [
              { href: "/dashboard/admin/projects", text: "New Projects", icon: "flaticon-house-1" },
              { href: "/dashboard/admin/agent-request", text: "Agent Requests", icon: "flaticon-chat-1" },
              { href: "/dashboard/admin/create-agent", text: "Create", icon: "flaticon-user-1" },
              { href: "/dashboard/admin/all-users", text: "All Users", icon: "flaticon-network" },
              { href: "/dashboard/total-properties", text: "Total Properties", icon: "flaticon-home" },
              { href: "/dashboard/approved-properties", text: "Approved Properties", icon: "flaticon-protection" },
              { href: "/dashboard/pending-request", text: "Pending Properties", icon: "flaticon-clock" },
              { href: "/dashboard/total-request", text: "Total Requests", icon: "flaticon-search-chart" },
              { href: "/dashboard/request-accepted", text: "Requested Accepted", icon: "flaticon-secure-payment" },
              { href: "/dashboard/admin/delist-requests", text: "Delist Requests", icon: "flaticon-bin" },
              { href: "/dashboard/admin/delisted-properties", text: "Delisted Properties", icon: "flaticon-close" },
              { href: "/dashboard/admin/ads", text: "Ads Management", icon: "flaticon-megaphone" },
            ],
          },
          {
            title: "MANAGE ACCOUNT",
            items: [
              { href: "/dashboard/user/my-favourites", text: "My Favorites", icon: "flaticon-like" },
              { href: "#", text: "Logout", icon: "flaticon-logout", onClick: handleLogout },
            ],
          },
        ];
      case "driver":
        return [
          {
            title: "MAIN",
            items: [
              { href: "/dashboard/my-profile", text: "My Profile", icon: "flaticon-user" },
            ],
          },
          {
            title: "MANAGE LISTINGS",
            items: [
              { href: "/dashboard/driver/uploaded-media", text: "Uploaded Media", icon: "flaticon-clock" },
              { href: "/dashboard/driver/assigned-properties", text: "Assigned Properties", icon: "flaticon-home" },
            ],
          },
          {
            title: "MANAGE ACCOUNT",
            items: [
              { href: "/dashboard/user/my-favourites", text: "My Favorites", icon: "flaticon-like" },
              { href: "#", text: "Logout", icon: "flaticon-logout", onClick: handleLogout },
            ],
          },
        ];
      default:
        return [
          {
            title: "MAIN",
            items: [
              { href: "/dashboard/home", text: "Dashboard", icon: "flaticon-discovery" },
              { href: "/dashboard/my-profile", text: "My Profile", icon: "flaticon-user" },
            ],
          },
        ];
    }
  };

  const navigationSections = getNavigationItems();

  return (
    <div className="dashboard_navigationbar d-block d-lg-none">
      {/* Mobile Header */}
      <div className="mobile-dashboard-header">
        <div className="mobile-header-content">
          {/* Left: Hamburger Menu */}
          <div className="dropdown">
            <button
              className="dropbtn fn-400 hamburger-menu"
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <div className="hamburger-lines">
                <span className="line line1"></span>
                <span className="line line2"></span>
                <span className="line line3"></span>
              </div>
            </button>
            
            <ul className={`dropdown-menu mobile-nav-menu ${isMenuOpen ? 'show' : ''}`}>
          {/* Role Switch for seller/buyer */}
          {(role === "seller" || role === "buyer") && (
            <>
              <li className="dropdown-header">
                <span className="fw-bold text-muted small">SWITCH ACCOUNT</span>
              </li>
              <li className="px-3 py-2">
                <RoleSwitch role={role} />
              </li>
              <li><hr className="dropdown-divider" /></li>
            </>
          )}
          
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <li className="dropdown-header">
                <span className="fw-bold text-muted small">{section.title}</span>
              </li>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    className={`dropdown-item ${pathname === item.href ? "active" : ""}`}
                    href={item.href}
                    onClick={(e) => handleMenuItemClick(item.onClick, e)}
                  >
                    <i className={`${item.icon} me-2`} />
                    {item.text}
                  </Link>
                </li>
              ))}
              {sectionIndex < navigationSections.length - 1 && (
                <li><hr className="dropdown-divider" /></li>
              )}
            </div>
          ))}
            </ul>
          </div>

          {/* Center: Company Logo */}
          <div className="mobile-logo">
            <Link href="/">
              <img
                src="/images/logoBlack.png"
                alt="ZeroBrokerage"
                className="logo-img"
              />
            </Link>
          </div>

          {/* Right: User Info */}
          <div className="mobile-user-info">
            <div className="user-avatar">
              <i className="flaticon-user"></i>
            </div>
            <div className="user-details">
              <span className="user-greeting">Hi, {auth.user?.fullname || auth.user?.full_name || "User"}!</span>
              <span className="user-role">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DboardMobileNavigation;