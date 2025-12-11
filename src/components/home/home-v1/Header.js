"use client";
import MainMenu from "@/components/common/MainMenu";
import LoginSignupModal from "@/components/common/login-signup-modal";
import HomeMobileNavigation from "./HomeMobileNavigation";
import { useAuth } from "@/hooks/useAuth";
import { pageRoutes } from "@/utilis/common";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/glass-nav.css";
import "@/styles/mobile-dashboard-nav.css";
import "@/styles/home-mobile-nav.css";

const Header = () => {
  const router = useRouter();

  const [navbar, setNavbar] = useState(false);
  const { isAuthenticated } = useAuth();

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

  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation */}
      <HomeMobileNavigation />
      
      <header
        className={`header-nav nav-homepage-style main-menu !text-black ${
          navbar ? "sticky" : ""
        } z-50 px-4`}
        style={{
          background: "rgba(220, 220, 220, 0.47)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5.3px)",
          WebkitBackdropFilter: "blur(5.3px)",
          border: "1px solid rgba(220, 220, 220, 0.24)",
          margin: "10px 20px",
          width: "calc(100% - 40px)"
        }}
      >
        <nav className="posr">
          <div className="container posr menu_bdrt1">
            <div className="flex items-center justify-between w-100">
              <div className="col-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="logos mr40">
                    <Link className="header-logo logo1" href={pageRoutes.home}>
                      <Image
                        src="/images/logoWhite.png"
                        alt="Header Logo"
                        className="h-18 w-auto object-contain"
                        width={138}
                        height={44}
                        priority
                      />
                    </Link>
                    <Link className="header-logo logo2" href={pageRoutes.home}>
                      <Image
                        src="/images/logoBlack.png"
                        alt="Header Logo"
                        className="h-18 w-auto object-contain"
                        width={138}
                        height={44}
                        style={{ width: "auto" }}
                      />
                    </Link>
                  </div>
                  {/* End Logo */}

                  <MainMenu navbar={navbar} />
                  {/* End Main Menu */}
                </div>
              </div>
              {/* End .col-auto */}
              {/* 
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <a
                    href="#"
                    className="login-info d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#loginSignupModal"
                    role="button"
                  >
                    <i className="far fa-user-circle fz16 me-2" />{" "}
                    <span className="d-none d-xl-block">Login</span>
                  </a> */}
              {/* <Link
                    className="ud-btn add-property menu-btn bdrs60 mx-2 mx-xl-4"
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
                      src="/images/icon/nav-icon-white.svg"
                      alt="humberger menu"
                    />

                    <Image
                      width={25}
                      height={9}
                      className="img-2"
                      src="/images/icon/nav-icon-dark.svg"
                      alt="humberger menu"
                    />
                  </a> */}
              {/* </div>
              </div> */}
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <span
                    className="font-semibold"
                    style={{
                      color: "white",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    Hii, {localStorage.getItem("name")}
                  </span>
                  &nbsp; &nbsp;
                  {isAuthenticated ? (
                    <a
                      href="/dashboard/my-profile"
                      className="login-info d-flex align-items-center glass-icon-btn"
                      role="button"
                      style={{ 
                        color: "white",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                        padding: "8px 12px",
                        textDecoration: "none"
                      }}
                    >
                      <i
                        className="far fa-user-circle fz16 me-1"
                        style={{ 
                          color: "white",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
                        }}
                      />
                      <span style={{ 
                        color: "white",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
                      }}>Profile</span>
                    </a>
                  ) : (
                    <a
                      href="#"
                      className="login-info d-flex align-items-center glass-icon-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#loginSignupModal"
                      role="button"
                      style={{ 
                        color: "white",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                        padding: "8px 12px",
                        textDecoration: "none"
                      }}
                    >
                      <i
                        className="far fa-user-circle fz16 me-2"
                        style={{ 
                          color: "white",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
                        }}
                      />
                      <span
                        className="d-none d-xl-block"
                        style={{ 
                          color: "white",
                          textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
                        }}
                      >
                        Login
                      </span>
                    </a>
                  )}
                  &nbsp; &nbsp;
                  {/* Free Listing Button */}
                  <button
                    className="glass-btn"
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                      textShadow: "none",
                      border: "none",
                    }}
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push(
                          "/dashboard/seller/request-to-add-new-property"
                        );
                      } else {
                        router.push("/free-listing");
                      }
                    }}
                  >
                    Free Listing
                  </button>
                </div>
              </div>

              {/* End .col-auto */}
            </div>
            {/* End .row */}
          </div>
        </nav>
      </header>
      {/* End Header */}

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
  );
};

export default Header;
