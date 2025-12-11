"use client";
import CallToActions from "@/components/common/CallToActions";
import SellerPricing from "@/components/pages/seller-pricing/sellersPricing";
import useAxiosFetch from "@/hooks/useAxiosFetch";
import { useEffect, useState } from "react";

const SellerPricingPlan = () => {
  const [sellersPlans, setSellersPlans] = useState([]);
  console.log("🚀 ~ SellerPricingPlan ~ sellersPlans:", sellersPlans);

  const { data, error, isError, isLoading } = useAxiosFetch("/plans");
  useEffect(() => {
    console.log(data);
    const sellerPlans = data?.plans?.filter(
      (plan) => plan.category === "boost"
    );
    setSellersPlans(sellerPlans);
  }, [data]);

  return (
    <>
      {/* Breadcrumb Sections */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">Plans</h2>
                <div className="breadcumb-list">
                  <a href="/">Home</a>
                  <a href="#">Plans</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcrumb Sections */}

      {/* Buyers Pricing Section Area */}
      <section className="our-pricing pb90 pt-0">
        <div className="container">
          <div className="row" data-aos="fade-up" data-aos-delay="100">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center mb30">
                <h2>Seller Plans</h2>
                <p>
                  Purchase a plan to feature your properties and get more
                  visibility.
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}
          <SellerPricing sellerPlans={sellersPlans} />
        </div>
        {/* End .container */}
      </section>

      {/* End Pricing Section Area */}

      {/* Our CTA */}
      <CallToActions />
      {/* Our CTA */}
    </>
  );
};

export default SellerPricingPlan;
