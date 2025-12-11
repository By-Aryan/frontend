import MobileMenu from "@/components/common/mobile-menu";
import DefaultHeader from "@/components/common/DefaultHeader";
import React from "react";
import Footer from "@/components/common/default-footer";
import DashboardHeader from "@/components/common/DashboardHeader";

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
      {/* <DefaultHeader /> */}

      <DashboardHeader />

      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}
      <div className="pt-20">
        {children}
      </div>

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
}
