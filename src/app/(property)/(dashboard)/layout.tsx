import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import "@/styles/dashboard-custom.css";
import React from "react";

export default async function AgentsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {

  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {children}
    </>
  );
}
