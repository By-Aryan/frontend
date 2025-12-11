import MobileMenu from "@/components/common/mobile-menu";
import DefaultHeader from "@/components/common/DefaultHeader";
import React from "react";
import Footer from "@/components/common/default-footer";

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
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}
      {children}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
}
