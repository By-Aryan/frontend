import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import PropertyFilteringList from "@/components/listing/list-view/list-v1/PropertyFilteringList";

import React from "react";

export const metadata = {
  title: "Property Listings in Dubai | ZeroBroker - Real Estate Properties",
  description: "Browse thousands of properties for sale and rent in Dubai. Find apartments, villas, offices and commercial spaces with detailed information, photos and verified listings.",
  keywords: "Dubai properties, real estate Dubai, property for sale, property for rent, apartments Dubai, villas Dubai, commercial properties, office spaces",
  openGraph: {
    title: "Property Listings in Dubai | ZeroBroker",
    description: "Browse thousands of properties for sale and rent in Dubai. Find apartments, villas, offices and commercial spaces with detailed information.",
    type: "website",
    siteName: "ZeroBroker"
  }
};

const ListV1 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Breadcumb Sections */}
      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Property Listings</h2>
                <div className="breadcumb-list">
                  <a href="/">Home</a>
                  <a href="#">Properties</a>
                </div>
                <a
                  className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                >
                  <span className="flaticon-settings" /> Filter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcumb Sections */}

      {/* Property Filtering */}
      <PropertyFilteringList/>
     
      {/* Property Filtering */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default ListV1;