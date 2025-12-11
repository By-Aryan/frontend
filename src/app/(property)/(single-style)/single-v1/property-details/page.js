// "use client";
//  import DefaultHeader from "@/components/common/DefaultHeader";
//  import Footer from "@/components/common/default-footer";
//  import MobileMenu from "@/components/common/mobile-menu";
//  import NearbySimilarProperty from "@/components/property/property-single-style/common/NearbySimilarProperty";
//  import OverView from "@/components/property/property-single-style/common/OverView";
//  import PropertyAddress from "@/components/property/property-single-style/common/PropertyAddress";
//  import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
//  import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
//  import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
//  import PropertyNearby from "@/components/property/property-single-style/common/PropertyNearby";
//  import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
//  import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
//  import ReviewBoxForm from "@/components/property/property-single-style/common/ReviewBoxForm";
//  import AllReviews from "@/components/property/property-single-style/common/reviews";
//  import ContactWithAgent from "@/components/property/property-single-style/sidebar/ContactWithAgent";
//  import PropertyGallery from "@/components/property/property-single-style/single-v1/PropertyGallery";
//  import React, { useEffect, useState } from "react";
//  import useAxiosFetch from "@/hooks/useAxiosFetch";
//  import useAxiosPost from "@/hooks/useAxiosPost";
//  import { useRouter } from "next/navigation";

//  function PropertyDetail({ params }) {
//    const router = useRouter();
//    const [property, setProperty] = useState({});
//    const [isPlanActive, setIsPlanActive] = useState(false);
//    const [showSellerPopup, setShowSellerPopup] = useState(false);
//    const [currentSeller, setCurrentSeller] = useState({
//      name: "",
//      phone: "",
//      email: "",
//    });
//    const [showNoCreditPopup, setShowNoCreditPopup] = useState(false);
//    const { data, isLoading, error, isError } = useAxiosFetch(
//      `/property/propertyById/${params.id}`
//    );
//    const contactViewMutation = useAxiosPost("/subscription/track-contact-view", {
//      onSuccess: (response) => {
//        if (response.data.status === 1) {
//          setCurrentSeller({
//            name: response.data.sellerDetails?.fullname,
//            phone: response.data.sellerDetails?.mobile,
//            email: response.data.sellerDetails?.email,
//          });
//          setShowSellerPopup(true);
//        } else if (response.data.status === 2) {
//          setShowNoCreditPopup(true);
//        }
//      },
//      onError: (error) => {
//        console.error("Error tracking contact view", error);
//      },
//    });
//    const handleViewNumberClick = (e, listing) => {
//      e?.stopPropagation();
//      contactViewMutation.mutate({
//        viewType: "true",
//        propertyId: params.id,
//      });
//    };

//    const closePopup = () => {
//      setShowSellerPopup(false);
//    };

//    useEffect(() => {
//      if (data?.data) {
//        setProperty(data?.data);

//         // Pre-populate seller information when data loads
//        if (
//          data.data.seller_name ||
//          data.data.seller_mobile ||
//          data.data.seller_email
//        ) {
//          setCurrentSeller({
//            name: data.data.seller_name || "Not Available",
//            phone: data.data.seller_mobile || "Not Available",
//            email: data.data.seller_email || "Not Available",
//          });
//        }
//      }

//       // Check if plan is active from localStorage on initial load
//      const planActive = localStorage.getItem("isPlanActive") === "true";
//      setIsPlanActive(planActive);
//    }, [data]);

//    return (
//      <>
//        {/* Main Header Nav */}
//        <DefaultHeader />
//        {/* End Main Header Nav */}

//        {/* Mobile Nav  */}
//        <MobileMenu />
//        {/* End Mobile Nav  */}

//        {/* Property All Single V1 */}
//        <section className="pt30 bgc-f7">
//          <div className="container">
//            <div className="row mb20">
//              {/* <PropertyGallery Images={property?.developer_notes?.images} property={property} /> */}
//              <PropertyGallery
//                property={property}
//              />
//            </div>
//            {/* End .row */}

//            <div className="row">
//              <PropertyHeader property={property} />
//            </div>
//            <div>
//              <p
//                className="text-white text-center lg:text-[16px] text-[12px] flex justify-center items-center md:gap-[5px] gap-[2px] cursor-pointer md:py-2 py-1 md:px-3 px-2 rounded-lg bg-[#2a9075] hover:bg-[#0f8363] duration-200 "
//                style={{
//                  fontWeight: 500,
//                }}
//                onClick={handleViewNumberClick}
//              >
//                <i className="fas fa-eye lg:text-[15px] text-[12px]"></i>
//                View Contact Info
//              </p>
//            </div>
//            {/* End .row */}
//            <div className="row wrap pt-10 ">
//              <div className="col-lg-12">
//                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                  <h4 className="title fz19 mb30">Overview</h4>
//                  <div className="row">
//                    <OverView property={property} />
//                  </div>
//                </div>
//                {/* End .ps-widget */}

//                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                  <h4 className="title fz19 mb30">Property Description</h4>
//                  <ProperytyDescriptions property={property} />
//                  {/* End property description */}

//                  <h4 className="title fz19 mb30 mt50">Property Details</h4>
//                  <div className="row">
//                    <PropertyDetails property={property} />
//                  </div>
//                </div>
//                {/* End .ps-widget */}

//                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                  <h4 className="title fz19 mb30 mt30">Address</h4>
//                  <div className="row">
//                    <PropertyAddress property={property} />
//                  </div>
//                </div>
//                {/* End .ps-widget */}

//                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
//                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                    <h4 className="title fz17 mb30">Features &amp; Amenities</h4>
//                    <div className="row">
//                      <PropertyFeaturesAminites property={property} />
//                    </div>
//                  </div>
//                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                    <h4 className="title fz17 mb30">What&apos;s Nearby?</h4>
//                    <div className="row">
//                      <PropertyNearby property={property} />
//                    </div>
//                  </div>
//                </div>

//                {/* <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                  <div className="row">
//                    <AllReviews property={property} />
//                  </div>
//                </div> */}
//                {/* End .ps-widget */}

//                <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
//                  <h4 className="title fz17 mb30">Leave A Review</h4>
//                  <div className="row">
//                    <ReviewBoxForm property={property} />
//                  </div>
//                </div>
//                {/* End .ps-widget */}
//              </div>
//              {/* End .col-8 */}
//            </div>
//            {/* End .row */}

//            <div className="row mt30 align-items-center justify-content-between">
//              <div className="col-auto">
//                <div className="main-title">
//                  <h2 className="title">Discover Our Featured Listings</h2>
//                  <p className="paragraph">
//                    Aliquam lacinia diam quis lacus euismod
//                  </p>
//                </div>
//              </div>
//              {/* End header */}

//              <div className="col-auto mb30">
//                <div className="row align-items-center justify-content-center">
//                  <div className="col-auto">
//                    <button className="featured-prev__active swiper_button">
//                      <i className="far fa-arrow-left-long" />
//                    </button>
//                  </div>
//                  {/* End prev */}

//                  <div className="col-auto">
//                    <div className="pagination swiper--pagination featured-pagination__active" />
//                  </div>
//                  {/* End pagination */}

//                  <div className="col-auto">
//                    <button className="featured-next__active swiper_button">
//                      <i className="far fa-arrow-right-long" />
//                    </button>
//                  </div>
//                  {/* End Next */}
//                </div>
//                {/* End .col for navigation and pagination */}
//              </div>
//              {/* End .col for navigation and pagination */}
//            </div>
//            {/* End .row */}

//            <div className="row">
//              <div className="col-lg-12">
//                <div className="property-city-slider">
//                  <NearbySimilarProperty />
//                </div>
//              </div>
//            </div>
//            {/* End .row */}
//          </div>
//          {/* End .container */}

//          {/* Seller Popup */}
//          {showSellerPopup && (
//            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//              <div className="bg-white p-6 rounded-lg max-w-md w-full">
//                <div className="flex justify-between items-center mb-4">
//                  <h3 className="text-xl font-semibold">Contact Information</h3>
//                  <button
//                    onClick={closePopup}
//                    className="text-gray-500 hover:text-gray-700"
//                  >
//                    <i className="fas fa-times"></i>
//                  </button>
//                </div>
//                <div className="space-y-3">
//                  <p>
//                    <strong>Name:</strong> {currentSeller.name}
//                  </p>
//                  <p>
//                    <strong>Phone:</strong> {currentSeller.phone}
//                  </p>
//                  <p>
//                    <strong>Email:</strong> {currentSeller.email}
//                  </p>
//                </div>
//                <button
//                  onClick={closePopup}
//                  className="mt-6 w-full py-2 bg-[#2a9075] hover:bg-[#0f8363] text-white rounded-md"
//                >
//                  Close
//                </button>
//              </div>
//            </div>
//          )}
//          {showNoCreditPopup && (
//            <div
//              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
//              onClick={() => setShowNoCreditPopup(false)}
//            >
//              <div
//                className="bg-white rounded-lg p-6 w-full max-w-md"
//                onClick={(e) => e.stopPropagation()}
//              >
//                <div className="flex justify-between items-center mb-4">
//                  <h3 className="text-xl font-bold text-[#0f8363]">
//                    No Credits Available
//                  </h3>
//                  <button
//                    onClick={() => setShowNoCreditPopup(false)}
//                    className="text-gray-500 hover:text-gray-700"
//                  >
//                    <i className="fas fa-times"></i>
//                  </button>
//                </div>
//                <div className="mb-4">
//                  <p className="mb-3">
//                    <p className="mb-3">
//                      {contactViewMutation.data?.data?.message}
//                    </p>
//                  </p>
//                </div>
//                <div className="flex justify-end gap-2">
//                  <button
//                    onClick={() => setShowNoCreditPopup(false)}
//                    className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 duration-200"
//                  >
//                    Cancel
//                  </button>
//                  <button
//                    onClick={() => {
//                      setShowNoCreditPopup(false);
//                      router.push("/pricing");
//                    }}
//                    className="text-white py-2 px-4 rounded-lg bg-[#0f8363] hover:bg-[#0a6e53] duration-200"
//                  >
//                    View Plans
//                  </button>
//                </div>
//              </div>
//            </div>
//          )}
//        </section>
//        {/* End Property All Single V1  */}

//        {/* Start Our Footer */}
//        <section className="footer-style1 pt60 pb-0">
//          <Footer />
//        </section>
//        {/* End Our Footer */}
//      </>
//    );
//  }

import React from "react";
import CompletePropertyListing from "./new-propertyDetails";
const Page = ({ params }) => {
  return (
    <div>
      <CompletePropertyListing params={params} />
    </div>
  );
};

export default Page;
