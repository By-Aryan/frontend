"use client";

import LoginSignupModal from "@/components/common/login-signup-modal";
import MainMenu from "@/components/common/MainMenu";
import { useAuth } from "@/hooks/useAuth";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { pageRoutes } from "@/utilis/common";
import { fixDropdownPosition, initDropdownFixes } from "@/utils/dropdownUtils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DefaultHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, auth } = useAuth();

  // const {data, isLoading, error, isError} = useAxiosFetch("/profile/me")

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  useEffect(() => {
    setShow(true);
    
    // Handle responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false); // Close mobile menu on desktop
      }
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [role, setRole] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    const userRole = auth.roles[0] || "";
    setRole(userRole);
  }, [auth.roles]);

  const buyermenuItems = [
    {
      title: `MAIN`,
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
          href: "/dashboard/user/wallet",
          icon: "flaticon-review",
          text: "Wallet",
        },
        {
          href: "/my-reviews",
          icon: "flaticon-review",
          text: "Reviews",
        },
        {
          href: "/dashboard/user/subcription",
          icon: "flaticon-review",
          text: "Subcription",
        },
        {
          href: "/dashboard/user/payments",
          icon: "flaticon-review",
          text: "History",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard-my-package",
          icon: "flaticon-protection",
          text: "My Plan",
        },
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "Logout",
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
          text: "My Requests",
        },
        {
          href: "/dashboard-reviews",
          icon: "flaticon-review",
          text: "Reviews",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "Logout",
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
        {
          href: "my-reviews",
          icon: "flaticon-review",
          text: "Reviews",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "Logout",
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
        {
          href: "/dashboard/admin/agent-request",
          icon: "flaticon-new-tab",
          text: "Agent Requests",
        },
        {
          href: "/dashboard/admin/create-agent",
          icon: "flaticon-user-1",
          text: "Create",
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
          href: "/login",
          icon: "flaticon-logout",
          text: "Logout",
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
        {
          href: "/dashboard/driver/add-media/1",
          icon: "flaticon-new-tab",
          text: "Add Media",
        },
        {
          href: "/dashboard/driver/uploaded-media",
          icon: "flaticon-clock",
          text: "Uploaded Media",
        },
        {
          href: "/dashboard/driver/assigned-properties",
          icon: "flaticon-home",
          text: "Assigned Properties",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/login",
          icon: "flaticon-logout",
          text: "Logout",
        },
      ],
    },
  ];

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the event from bubbling
    const dropdownMenu = e.currentTarget.nextElementSibling;
    
    // Close other open dropdowns first
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      if (menu !== dropdownMenu) {
        menu.classList.remove('show');
      }
    });
    
    dropdownMenu.classList.toggle("show");
    
    // Apply positioning fixes
    if (dropdownMenu.classList.contains('show')) {
      setTimeout(() => {
        fixDropdownPosition();
      }, 10);
    }
  };

  // Close dropdown when clicking outside and initialize dropdown fixes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    const cleanup = initDropdownFixes();
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      cleanup();
    };
  }, []);
  // const { data: remaningContactsData, isLoading: isLoading} = useAxiosFetch(
  //   "/profile/get-buyer-remaning-contacts"
  // );
  
  // Only fetch buyer contacts for authenticated buyers
  const shouldFetchContacts = isAuthenticated && auth.accessToken && auth.roles.length > 0 && auth.roles[0] === 'buyer';
  
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

  return (
    <>
      {show && (
        <>
          <header
            className={`header-nav nav-homepage-style light-header menu-home4 main-menu ${
              navbar ? "sticky slideInDown animated" : ""
            }`}
            style={{
              zIndex: 1000,
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
            }}
          >
            <nav className="posr">
              <div className="container posr menu_bdrt1">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="logos mr40">
                        <Link
                          className="header-logo logo1"
                          href={pageRoutes.home}
                        >
                          <Image
                            className="h-18 w-auto"
                            src="/images/logoBlack.png"
                            alt="Header Logo"
                            width={100}
                            height={100}
                            style={{
                              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                              width: "auto"
                            }}
                          />
                        </Link>
                        <Link
                          className="header-logo logo2"
                          href={pageRoutes.home}
                        >
                          <Image
                            className="h-18 w-auto"
                            src="/images/logoBlack.png"
                            alt="Header Logo"
                            width={100}
                            height={100}
                            style={{
                              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                              width: "auto"
                            }}
                          />
                        </Link>
                      </div>
                      {/* End Logo */}

                      {/* Desktop Menu - Hidden on mobile */}
                      <div className="d-none d-lg-block">
                        <MainMenu />
                      </div>
                      {/* End Main Menu */}
                    </div>
                  </div>
                  {/* End .col-auto */}

                  <div className="col-auto">
                    <div className="d-flex align-items-center">
                      {/* Mobile Menu Button - Only visible on mobile */}
                      <button
                        className="d-lg-none btn btn-link p-2 me-3"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                          minWidth: '44px',
                          minHeight: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        aria-label="Toggle mobile menu"
                      >
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          {mobileMenuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                          ) : (
                            <>
                              <line x1="3" y1="6" x2="21" y2="6" />
                              <line x1="3" y1="12" x2="21" y2="12" />
                              <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                          )}
                        </svg>
                      </button>
                      
                      {isAuthenticated ? (
                        <div className="col-6 col-lg-auto">
                          <div className="text-center text-lg-end header_right_widgets">
                            <ul className="mb0 d-flex items-center justify-content-center justify-content-sm-end p-0">
                              {/* ⭐ Remaining Contacts Chip */}
                              {role === "buyer" && (
                                <li className="d-none d-xl-flex align-items-center me-3">
                                  <div
                                    className="d-flex align-items-center glass-chip"
                                    style={{
                                      color: "#1c7c54",
                                      padding: "8px 16px",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      gap: "8px",
                                    }}
                                  >
                                    <span>
                                      Buy Contacts:{" "}
                                      {
                                        remaningContactsData?.data
                                          ?.buy_property_contacts
                                      }{" "}
                                      | Rent Contacts:{" "}
                                      {
                                        remaningContactsData?.data
                                          ?.rent_property_contacts
                                      }
                                    </span>
                                    <button
                                      className="btn p-0 border-0 bg-transparent"
                                      title="Refresh"
                                      onClick={handleRefresh}
                                    >
                                      <i className="fas fa-sync-alt" />
                                    </button>
                                  </div>
                                </li>
                              )}
                              <li className="d-none d-xl-block">
                                <Link 
                                  href={"/"} 
                                  className="text-center mr15 d-flex align-items-center justify-content-center glass-icon-btn"
                                  style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "50%"
                                  }}
                                >
                                  <span className="flaticon-email" style={{ fontSize: "16px", color: "#6c757d" }} />
                                </Link>
                              </li>
                              {/* End email box */}

                              <li className="d-none d-xl-block">
                                <a 
                                  className="text-center mr20 notif d-flex align-items-center justify-content-center glass-icon-btn" 
                                  href="#"
                                  style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "50%"
                                  }}
                                >
                                  <span className="flaticon-bell" style={{ fontSize: "16px", color: "#6c757d" }} />
                                </a>
                              </li>
                              {/* End notification icon */}

                              <li className="user_setting">
                                <div className="dropdown">
                                  <a
                                    className="btn p-0 border-0 glass-icon-btn"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={toggleDropdown}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "48px",
                                      height: "48px",
                                      borderRadius: "50%"
                                    }}
                                  >
                                    <span
                                      className="fas fa-user"
                                      style={{ fontSize: "18px", color: "#6c757d" }}
                                    />
                                  </a>
                                  <div className="dropdown-menu user-dropdown-menu">
                                    <div className="user_setting_content">
                                      {role === "seller" &&
                                        sellermenuItems.map(
                                          (section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                              <p
                                                className={`fz15 fw400 ff-heading ${
                                                  sectionIndex === 0
                                                    ? "mb20"
                                                    : "mt30"
                                                }`}
                                              >
                                                {section.title}
                                              </p>
                                              {section.items.map(
                                                (item, itemIndex) => (
                                                  <Link
                                                    key={itemIndex}
                                                    className={`dropdown-item ${
                                                      pathname == item.href
                                                        ? "-is-active"
                                                        : ""
                                                    } `}
                                                    href={item.href}
                                                  >
                                                    <i
                                                      className={`${item.icon} mr10`}
                                                    />
                                                    {item.text}
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          )
                                        )}
                                      {role === "buyer" &&
                                        buyermenuItems.map(
                                          (section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                              <p
                                                className={`fz15 fw400 ff-heading ${
                                                  sectionIndex === 0
                                                    ? "mb20"
                                                    : "mt30"
                                                }`}
                                              >
                                                {section.title}
                                              </p>
                                              {section.items.map(
                                                (item, itemIndex) => (
                                                  <Link
                                                    key={itemIndex}
                                                    className={`dropdown-item ${
                                                      pathname == item.href
                                                        ? "-is-active"
                                                        : ""
                                                    } `}
                                                    href={item.href}
                                                  >
                                                    <i
                                                      className={`${item.icon} mr10`}
                                                    />
                                                    {item.text}
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          )
                                        )}
                                      {role === "agent" &&
                                        agentmenuItems.map(
                                          (section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                              <p
                                                className={`fz15 fw400 ff-heading ${
                                                  sectionIndex === 0
                                                    ? "mb20"
                                                    : "mt30"
                                                }`}
                                              >
                                                {section.title}
                                              </p>
                                              {section.items.map(
                                                (item, itemIndex) => (
                                                  <Link
                                                    key={itemIndex}
                                                    className={`dropdown-item ${
                                                      pathname == item.href
                                                        ? "-is-active"
                                                        : ""
                                                    } `}
                                                    href={item.href}
                                                  >
                                                    <i
                                                      className={`${item.icon} mr10`}
                                                    />
                                                    {item.text}
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          )
                                        )}
                                      {role === "admin" &&
                                        adminmenuItems.map(
                                          (section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                              <p
                                                className={`fz15 fw400 ff-heading ${
                                                  sectionIndex === 0
                                                    ? "mb20"
                                                    : "mt30"
                                                }`}
                                              >
                                                {section.title}
                                              </p>
                                              {section.items.map(
                                                (item, itemIndex) => (
                                                  <Link
                                                    key={itemIndex}
                                                    className={`dropdown-item ${
                                                      pathname == item.href
                                                        ? "-is-active"
                                                        : ""
                                                    } `}
                                                    href={item.href}
                                                  >
                                                    <i
                                                      className={`${item.icon} mr10`}
                                                    />
                                                    {item.text}
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          )
                                        )}
                                      {role === "driver" &&
                                        drivermenuItems.map(
                                          (section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                              <p
                                                className={`fz15 fw400 ff-heading ${
                                                  sectionIndex === 0
                                                    ? "mb20"
                                                    : "mt30"
                                                }`}
                                              >
                                                {section.title}
                                              </p>
                                              {section.items.map(
                                                (item, itemIndex) => (
                                                  <Link
                                                    key={itemIndex}
                                                    className={`dropdown-item ${
                                                      pathname == item.href
                                                        ? "-is-active"
                                                        : ""
                                                    } `}
                                                    href={item.href}
                                                  >
                                                    <i
                                                      className={`${item.icon} mr10`}
                                                    />
                                                    {item.text}
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          )
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                              {/* End avatar dropdown */}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <a
                          href="#"
                          className="login-info d-flex align-items-cente"
                          data-bs-toggle="modal"
                          data-bs-target="#loginSignupModal"
                          role="button"
                        >
                          <i className="far fa-user-circle fz16 me-2" />{" "}
                          <span className="d-none d-xl-block">Login</span>
                        </a>
                      )}

                      {/* <Link
                    className="ud-btn btn-white add-property bdrs60 mx-2 mx-xl-4"
                    href="/dashboard-add-property"
                  >
                    Add Property
                    <i className="fal fa-arrow-right-long" />
                  </Link> */}
                      {/* <a
                    className="sidemenu-btn filter-btn-right"
                    href="#"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#SidebarPanel"
                    aria-controls="SidebarPanelLabel"
                  >
                    <Image
                      width={25}
                      height={9}
                      className="img-1"
                      src="/images/zero-broker/icon/menu.svg"
                      alt="humberger menu"
                    />
                    <Image
                      width={25}
                      height={9}
                      className="img-2"
                      src="/images/zero-broker/icon/menu.svg"
                      alt="humberger menu"
                    />
                  </a> */}
                    </div>
                  </div>
                  {/* End .col-auto */}
                </div>
                {/* End .row */}
              </div>
            </nav>
          </header>
          {/* End Header */}

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div 
              className="d-lg-none position-fixed w-100 h-100"
              style={{
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div 
                className="position-absolute bg-white w-100 shadow-lg"
                style={{
                  top: navbar ? '70px' : '80px',
                  maxHeight: 'calc(100vh - 80px)',
                  overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">
                  {/* Mobile Navigation Menu */}
                  <div className="mb-4">
                    <MainMenu isMobile={true} onItemClick={() => setMobileMenuOpen(false)} />
                  </div>
                  
                  {/* Mobile Auth Section */}
                  {!isAuthenticated && (
                    <div className="border-top pt-4">
                      <button
                        className="btn btn-primary w-100"
                        data-bs-toggle="modal"
                        data-bs-target="#loginSignupModal"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ minHeight: '44px' }}
                      >
                        Login / Sign Up
                      </button>
                    </div>
                  )}
                  
                  {/* Mobile User Menu for Authenticated Users */}
                  {isAuthenticated && (
                    <div className="border-top pt-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                             style={{ width: '40px', height: '40px' }}>
                          <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <div className="fw-bold">{auth.user?.name || 'User'}</div>
                          <div className="text-muted small text-capitalize">{role}</div>
                        </div>
                      </div>
                      
                      {/* Mobile Contact Info for Buyers */}
                      {role === "buyer" && remaningContactsData?.data && (
                        <div className="bg-light rounded p-3 mb-3">
                          <div className="small text-muted mb-1">Available Contacts</div>
                          <div className="d-flex justify-content-between">
                            <span>Buy: {remaningContactsData.data.buy_property_contacts}</span>
                            <span>Rent: {remaningContactsData.data.rent_property_contacts}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Signup Modal */}
          <div className="signup-modal">
            <div
              className="modal fade"
              id="loginSignupModal"
              tabIndex={-1}
              aria-labelledby="loginSignupModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog  modal-dialog-scrollable modal-dialog-centered">
                <LoginSignupModal />
              </div>
            </div>
          </div>
          {/* End Signup Modal */}

          {/* DesktopSidebarMenu */}
          {/* <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="SidebarPanel"
        aria-labelledby="SidebarPanelLabel"
      >
        <SidebarPanel />
      </div> */}
          {/* Sidebar Panel End */}
        </>
      )}
    </>
  );
};

export default DefaultHeader;
