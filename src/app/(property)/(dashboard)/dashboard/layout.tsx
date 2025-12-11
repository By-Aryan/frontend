import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import "@/styles/dashboard-custom.css";
import "@/styles/layout-fixes.css";
import React from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {

  return (
    <>
      {/* dashboard_content_wrapper */}
      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr0-xl">
          <SidebarDashboard />
          {/* End .dashboard__sidebar */}
          {children}
        </div>
      </div>
    </>
  );
}
