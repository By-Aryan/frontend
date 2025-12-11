"use client";
import RoleSwitch from "@/components/common/role-switch-buttons/RoleSwitch";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SidebarDashboard = () => {
  const { auth, logout } = useAuth();
  const [role, setRole] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get role from AuthContext instead of cookies
    const userRole = auth.roles[0] || "";
    setRole(userRole);
  }, [auth.roles]);

  // Handle logout function
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    router.push("/login");
  };

  const buyersidebarItems = [
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
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard/user/my-favourites",
          icon: "flaticon-like",
          text: "Liked",
        },
        {
          href: "/dashboard/user/payments",
          icon: "flaticon-credit-card",
          text: "Payments",
        },
        {
          href: "/dashboard/user/wallet",
          icon: "flaticon-wallet",
          text: "Wallet",
        },
        {
          href: "/dashboard/my-plan",
          icon: "flaticon-protection",
          text: "Number Views by me",
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

  const sellersidebarItems = [
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
          href: "/dashboard/seller/my-boosted-properties",
          icon: "flaticon-rocket",
          text: "Boosted Properties",
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

  const agentsidebarItems = [
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
          href: "/dashboard/agent/free-listing-requests",
          icon: "flaticon-user-1",
          text: "Free Listing Requests",
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
          href: "/dashboard/agent/assigned-drivers",
          icon: "flaticon-clock",
          text: "Assigned Drivers",
        },
        {
          href: "/dashboard/agent/create-driver",
          icon: "flaticon-user",
          text: "Create Driver",
        },
        {
          href: "/dashboard/agent/delist-notifications",
          icon: "flaticon-delete",
          text: "Delist Notifications",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard/user/my-favourites",
          icon: "flaticon-like",
          text: "Liked",
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
  const adminsidebarItems = [
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
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
        {
          href: "/dashboard/admin/projects",
          icon: "flaticon-house-1",
          text: "New Projects",
        },
        {
          href: "/dashboard/admin/agent-request",
          icon: "flaticon-chat-1",
          text: "Agent Requests",
        },
        {
          href: "/dashboard/admin/create-agent",
          icon: "flaticon-user-1",
          text: "Create",
        },
        {
          href: "/dashboard/admin/all-users",
          icon: "flaticon-network",
          text: "All Users",
        },
        {
          href: "/dashboard/total-properties",
          icon: "flaticon-home",
          text: "Total Properties",
        },
        {
          href: "/dashboard/approved-properties",
          icon: "flaticon-protection",
          text: "Approved Properties",
        },
        {
          href: "/dashboard/pending-request",
          icon: "flaticon-clock",
          text: "Pending Properties",
        },
        {
          href: "/dashboard/total-request",
          icon: "flaticon-search-chart",
          text: "Total Requests",
        },
        {
          href: "/dashboard/request-accepted",
          icon: "flaticon-secure-payment",
          text: "Requested Accepted",
        },
        {
          href: "/dashboard/admin/delist-requests",
          icon: "flaticon-bin",
          text: "Delist Requests",
        },
        {
          href: "/dashboard/admin/delisted-properties",
          icon: "flaticon-close",
          text: "Delisted Properties",
        },
        {
          href: "/dashboard/admin/ads",
          icon: "flaticon-megaphone",
          text: "Ads Management",
        },
      ],
    },
    {
      title: "MANAGE ACCOUNT",
      items: [
        {
          href: "/dashboard/user/my-favourites",
          icon: "flaticon-like",
          text: "Liked",
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
  const driversidebarItems = [
    {
      title: "MAIN",
      items: [
        {
          href: "/dashboard/my-profile",
          icon: "flaticon-user",
          text: "My Profile",
        },
      ],
    },
    {
      title: "MANAGE LISTINGS",
      items: [
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
          href: "/dashboard/user/my-favourites",
          icon: "flaticon-like",
          text: "Liked",
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

  return (
    <div className="dashboard__sidebar dashboard__sidebar--glass d-lg-block">
      <div className="dashboard_sidebar_list">
        {role === "seller" || role === "buyer" ? (
          <div className="mb-5 space-y-3">
            <label>Switch Account</label>
            <RoleSwitch role={role} />
          </div>
        ) : (
          ""
        )}
        {role === "seller" &&
          sellersidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"
                  }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center   ${pathname == item.href ? "-is-active" : ""
                      } `}
                    onClick={item.onClick}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        {role === "buyer" &&
          buyersidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"
                  }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center   ${pathname == item.href ? "-is-active" : ""
                      } `}
                    onClick={item.onClick}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        {role === "agent" &&
          agentsidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"
                  }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center   ${pathname == item.href ? "-is-active" : ""
                      } `}
                    onClick={item.onClick}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        {(role === "admin" || role === "sub-admin") &&
          adminsidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"
                  }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center   ${pathname == item.href ? "-is-active" : ""
                      } `}
                    onClick={item.onClick}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        {role === "driver" &&
          driversidebarItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <p
                className={`fz15 fw400 ff-heading ${sectionIndex === 0 ? "mt-0" : "mt30"
                  }`}
              >
                {section.title}
              </p>
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="sidebar_list_item">
                  <Link
                    href={item.href}
                    className={`items-center   ${pathname == item.href ? "-is-active" : ""
                      } `}
                    onClick={item.onClick}
                  >
                    <i className={`${item.icon} mr15`} />
                    {item.text}
                  </Link>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
