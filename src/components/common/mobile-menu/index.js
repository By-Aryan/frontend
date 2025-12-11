"use client";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContactInfo from "./ContactInfo";
import ProSidebarContent from "./ProSidebarContent";
import Social from "./Social";

const MobileMenu = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    setUser(localStorage.getItem("name") || "");
  }, []);

  return (
    <div className="mobilie_header_nav stylehome1">
      <div className="mobile-menu">
        <div className="header innerpage-style">
          <div className="menu_and_widgets">
            <div className="mobile_menu_bar d-flex justify-content-between align-items-center">
              <a
                className="menubar"
                href="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileMenu"
                aria-controls="mobileMenu"
              >
                <Image
                  width={25}
                  height={9}
                  src="/images/zero-broker/icon/menu.svg"
                  alt="mobile icon"
                />
              </a>
              <Link className="mobile_logo" href="/">
                <Image
                  width={138}
                  height={44}
                  src="/images/logoBlack.png"
                  alt="logo"
                />
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <p className="sm:mt-2 mt-3 sm:text-base text-sm w-[80px] truncate">Hii, {user}</p>
                  <Link href="/dashboard/my-profile">
                    <span className="icon fz18 far fa-user-circle" />
                  </Link>
                </div>
              ) : (
                <a
                  href="#"
                  className="login-info d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#loginSignupModal"
                  role="button"
                  style={{ textShadow: "none" }}
                >
                  <span className="icon fz18 far fa-user-circle" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /.mobile-menu meta */}

      <div
        className="offcanvas offcanvas-start mobile_menu-canvas"
        // tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
        data-bs-scroll="true"
      >
        <div className="rightside-hidden-bar">
          <div className="hsidebar-header">
            <div
              className="sidebar-close-icon"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <span className="far fa-times"></span>
            </div>
            <p className="sm:text-lg text-sm">Welcome to Zero broker</p>
          </div>
          {/* End header */}

          <div className="hsidebar-content ">
            <div className="hiddenbar_navbar_content">
              <ProSidebarContent />
              {/* End .hiddenbar_navbar_menu */}
              <div className="px-3">
                {isAuthenticated && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      router.push("/login");
                    }} 
                    className="btn btn-danger w-full flex justify-center items-center"
                  >
                    Logout
                  </button>
                )}
              </div>
              <div className="hiddenbar_footer position-relative">
                <div className="row pt45 pb20 pl30">
                  <ContactInfo />
                </div>
                <div className="row">
                  <div className="col-auto">
                    <div className="social-style-sidebar d-flex align-items-center pl30">
                      <h6 className="me-4 mb-0">Follow us</h6>
                      <Social />
                    </div>
                  </div>
                </div>
              </div>
              {/* hiddenbar_footer */}
            </div>
          </div>
          {/* End hsidebar-content */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
