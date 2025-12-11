"use client";
import MainMenu from "@/components/common/MainMenu";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SidebarPanel = () => {
  const { auth, logout } = useAuth();
  const [role, setRole] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userRole = auth.roles?.[0] || "";
    setRole(userRole);
  }, [auth.roles]);

  // Ensure Bootstrap offcanvas is properly initialized
  useEffect(() => {
    // Add error handling for Bootstrap initialization
    const initializeBootstrap = () => {
      try {
        if (typeof window !== 'undefined') {
          // Wait for Bootstrap to be available
          const checkBootstrap = () => {
            if (window.bootstrap || document.querySelector('[data-bs-toggle]')) {
              const offcanvasElement = document.getElementById('SidebarPanel');
              if (offcanvasElement) {
                // Element exists, Bootstrap will auto-initialize
                return true;
              }
            }
            return false;
          };

          // Try immediately, then with delays
          if (!checkBootstrap()) {
            setTimeout(checkBootstrap, 100);
            setTimeout(checkBootstrap, 500);
          }
        }
      } catch (error) {
        console.warn('Bootstrap initialization warning:', error);
        // Don't throw error, just log it
      }
    };

    initializeBootstrap();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    router.push("/login");
  };

  const menuItems = [
    {
      title: "NAVIGATION",
      items: [
        {
          href: "/",
          icon: "flaticon-home",
          text: "Home",
        },
        {
          href: "/properties",
          icon: "flaticon-search",
          text: "Properties",
        },
        {
          href: "/projects-by-country/uae",
          icon: "flaticon-house-1",
          text: "New Projects",
        },
        {
          href: "/about",
          icon: "flaticon-info",
          text: "About",
        },
        {
          href: "/contact",
          icon: "flaticon-phone-call",
          text: "Contact",
        },
      ],
    },
  ];

  const authenticatedMenuItems = [
    {
      title: "DASHBOARD",
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
      ],
    },
  ];

  return (
    <>
      <div className="offcanvas-header d-flex align-items-center justify-content-between">
        <h5 className="offcanvas-title" id="SidebarPanelLabel">
          <Link className="logo" href="/">
            <Image
              width={120}
              height={40}
              src="/images/logoBlack.png"
              alt="Header Logo"
            />
          </Link>
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
      
      <div className="offcanvas-body p-0">
        <div className="mobile-menu-content p-3">
          {/* Main Navigation */}
          <MainMenu />

          {/* Additional Menu Items */}
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-4">
              <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: "12px" }}>
                {section.title}
              </h6>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-2">
                  <Link
                    href={item.href}
                    className={`d-flex align-items-center text-decoration-none p-2 rounded ${
                      pathname === item.href ? "bg-primary text-white" : "text-dark"
                    }`}
                    data-bs-dismiss="offcanvas"
                  >
                    <i className={`${item.icon} me-3`} style={{ fontSize: "16px" }} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}

          {/* Authenticated User Menu */}
          {auth.accessToken && (
            <>
              {authenticatedMenuItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mt-4">
                  <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: "12px" }}>
                    {section.title}
                  </h6>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="mb-2">
                      <Link
                        href={item.href}
                        className={`d-flex align-items-center text-decoration-none p-2 rounded ${
                          pathname === item.href ? "bg-primary text-white" : "text-dark"
                        }`}
                        data-bs-dismiss="offcanvas"
                      >
                        <i className={`${item.icon} me-3`} style={{ fontSize: "16px" }} />
                        {item.text}
                      </Link>
                    </div>
                  ))}
                </div>
              ))}

              {/* Logout Button */}
              <div className="mt-4 pt-3 border-top">
                <button
                  onClick={handleLogout}
                  className="d-flex align-items-center text-decoration-none p-2 rounded text-danger bg-transparent border-0 w-100"
                  data-bs-dismiss="offcanvas"
                >
                  <i className="flaticon-logout me-3" style={{ fontSize: "16px" }} />
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Login/Register for non-authenticated users */}
          {!auth.accessToken && (
            <div className="mt-4 pt-3 border-top">
              <div className="mb-2">
                <Link
                  href="/login"
                  className="d-flex align-items-center text-decoration-none p-2 rounded text-primary"
                  data-bs-dismiss="offcanvas"
                >
                  <i className="flaticon-user me-3" style={{ fontSize: "16px" }} />
                  Login
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  href="/register"
                  className="d-flex align-items-center text-decoration-none p-2 rounded text-success"
                  data-bs-dismiss="offcanvas"
                >
                  <i className="flaticon-user-1 me-3" style={{ fontSize: "16px" }} />
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarPanel;